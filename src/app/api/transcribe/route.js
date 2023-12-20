import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe"

const getClient = () => {
  return new TranscribeClient({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
}

const createTranscriptionCommand = (filename) => {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: filename,
    OutputBucketName: process.env.BUCKET_NAME,
    OutputKey: filename + ".transcription",
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: "s3://" + process.env.BUCKET_NAME + "/" + filename,
    },
  })
}

const createTranscriptionJob = async (filename) => {
  const transcribeClient = getClient()
  const transcriptionCommand = createTranscriptionCommand(filename)
  return transcribeClient.send(transcriptionCommand)
}

const getJob = async (filename) => {
  const transcribeClient = getClient()
  let jobStatusResult = null
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: filename,
    })
    jobStatusResult = await transcribeClient.send(transcriptionJobStatusCommand)
  } catch (err) {
    console.error("Error finding transcribing job status")
  }
  return jobStatusResult
}

const streamToString = (stream) => {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    stream.on("error", reject)
  })
}

const getTranscriptionFile = async (filename) => {
  const transcriptionFileName = filename + ".transcription"

  const s3client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: transcriptionFileName,
  })

  let transcriptionFileResponse = null
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand)
  } catch (err) {
    console.error("Error locating the transcription file.", err)
  }
  if (transcriptionFileResponse) {
    // console.log(transcriptionFileResponse.Body) // string of data
    return JSON.parse(await streamToString(transcriptionFileResponse.Body))
  }
  return null
}

export const GET = async (req) => {
  const url = new URL(req.url) // the whole url
  const searchParams = new URLSearchParams(url.searchParams)
  const filename = searchParams.get("filename")

  //check ready trancription
  const transcription =  await getTranscriptionFile(filename)
  if (transcription) {
    return Response.json({
    status:'COMPLETED',
    transcription,
  })}
  // check if the job is in transcribing
  const existingJobFound = await getJob(filename)

  if (existingJobFound) {
    return Response.json({
      status: existingJobFound.TranscriptionJob.TranscriptionJobStatus,
    })
  }

  if (!existingJobFound) {
    const newJob = await createTranscriptionJob(filename)
    return Response.json({
      status: newJob.TranscriptionJob.TranscriptionJobStatus,
    })
  }

  return Response.json("ok")
}
