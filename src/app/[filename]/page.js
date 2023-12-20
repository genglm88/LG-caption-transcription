"use client"

import ResultVideo from "@/components/ResultVideo"
import Sparkles from "@/components/Sparkles"
import Spinner from "@/components/Spinner"
import TranscriptionItems from "@/components/TranscriptionItems"
import { cleanTranscript } from "@/libs/cleanTranscript"
import axios from "axios"
import { useEffect, useState } from "react"

const FilePage = ({ params }) => {
  const [transcriptItems, setTranscriptItems] = useState([])

  const [isInProgress, setIsInProgress] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const filename = params.filename

  useEffect(() => {
    getTranscriptionFile()
  }, [filename])

 

  const getTranscriptionFile = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get("/api/transcribe?filename=" + filename)
      setIsLoading(false)

      const { status, transcription } = data
      //console.log(transcription)
      if (status === "IN_PROGRESS") {
        setIsInProgress(true)
        setTimeout(getTranscriptionFile, 3000)
      } else {
        setIsInProgress(false)

        //const transcriptionItems = transcription.results.items

        setTranscriptItems(cleanTranscript(transcription.results.items))
      }
    } catch (err) {
      console.error("Error fetching transcription file. ", err)
    }
  }

  return (
    <div>
      {isInProgress ? (
        <span>Transcribing in progress...</span>
      ) : (
        <div>
          <div className="mb-2">Transcribing completed.</div>
          {isLoading ? (
            <div className="">
              <Spinner />{" "}
            </div>
          ) : (
            <div className="grid sm:grid-cols-5 gap-4">
              <div className='col-span-3'>
                <div
                  className=" sticky top-0 py-1 flex bg-bgGradientFrom gap-2 justify-around text-lg text-indigo-100 font-bold mt-4 mb-2 w-96"
                  style={{ textShadow: "1px 1px rgba(200, 200, 0, 0.3)" }}
                >
                  <div className="w-12">Start</div>
                  <div className="w-12">End</div>
                  <div className="w-64 sm:w-54">Content</div>
                </div>

                {transcriptItems.length > 0 && 
                <div className="h-64 sm:h-auto overflow-y-scroll sm:overflow-auto"> 
                  {   transcriptItems.map((item, index) => {
                    return (
                      <div key={index} className=''> 
                        <div className="flex gap-2 ">
                          <TranscriptionItems
                            index={index}
                            transcriptItems={transcriptItems}
                            setTranscriptItems={setTranscriptItems}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
               }
              </div>
              <div className="col-span-2">
                <div className="sticky top-0">
                  <div
                    className=" flex bg-bgGradientFrom gap-2  py-1 text-lg text-indigo-100 font-bold mt-4 mb-2 w-96"
                    style={{ textShadow: "1px 1px rgba(200, 200, 0, 0.3)" }}
                  >
                    <h2>Results</h2>
                  </div>
                  <ResultVideo
                    videoUrl={`https://lg-epic-captions.s3.amazonaws.com/${filename}`}
                    transcriptItems ={transcriptItems}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FilePage
