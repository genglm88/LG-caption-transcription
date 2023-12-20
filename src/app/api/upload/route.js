import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import uniqid from "uniqid"

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get("file")
  const { name, type } = file
  const data = await file.arrayBuffer()

  const s3client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const id = uniqid()
  const ext = name.split(".").slice(-1)[0] //last one

  const newFilename = id + "." + ext

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: newFilename,
    Body: data,
    ACL: "public-read",
    ContentType: type,
  })

  try {
    await s3client.send(uploadCommand)
    return Response.json({ name, ext, newFilename, id })
  } catch (error) {
    console.error("Error uploading to S3:", error)
    return Response.json({ error: "Failed to upload to S3" })
  }
}
