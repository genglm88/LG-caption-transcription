import React, { useEffect, useRef, useState } from "react"
import Sparkles from "./Sparkles"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import { transcriptionItemsToSrt } from "@/libs/cleanTranscript"
import roboto from "./../fonts/Roboto-Regular.ttf"
import robotoBold from "./../fonts/Roboto-Bold.ttf"
import Spinner from "./Spinner"

const ResultVideo = ({ videoUrl, transcriptItems }) => {
  const [loaded, setLoaded] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef(null)
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF")
  const [outlineColor, setOutlineColor] = useState("#000000")
  const [marginV, setMarginV] = useState(100)
  const [fontSize, setFontSize] = useState(20)
  const [fastSpeed, setFastSpeed] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    videoRef.current.src = videoUrl
    load()
  }, [])

  let filename = videoUrl.split("/").slice(-1)[0]

  const toFFmpegColor = (rgb) => {
    //rgb #7d3131
    return "&H" + rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3) + "&"
  }

  const totalTimePassed = (regexRst, duration) => {
    if (regexRst && regexRst?.[1]) {
      const timePassed = regexRst?.[1]
      const [hours, minutes, seconds] = timePassed.split(":")
      const totalTimePassed =
        Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)

      return (totalTimePassed / duration).toLocaleString("en", {
        style: "percent",
      })
    }
  }
  const load = async () => {
    const ffmpeg = ffmpegRef.current
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd"

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    })
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto))
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold))
  }

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current

    const srtItems = transcriptionItemsToSrt(transcriptItems)
    setLoaded(true)
    try {
      await ffmpeg.writeFile(filename, await fetchFile(videoUrl))
    } catch (err) {
      console.error("herher", err)
    }

    //write the srt file
    try {
      await ffmpeg.writeFile("subTitles.srt", srtItems)
    } catch (err) {
      console.error("srtsrt", err)
    }

    videoRef.current.src = videoUrl
    await new Promise((resolve, reject) => {
      videoRef.current.onloadedmetadata = resolve
    })
    const duration = videoRef.current.duration
    ffmpeg.on("log", ({ message }) => {
      //messageRef.current.innerHTML = message;

      const regexRst = /time=([0-9.:]+)/.exec(message)
      setProgress(totalTimePassed(regexRst, duration))
    })

    // '-to', '00:00:05',
    //        "-preset",
    // "ultrafast",

    await ffmpeg
      .exec([
        "-i",
        filename,
        "-preset",
        `${fastSpeed ? "ultrafast" : ""}`,
        "-vf",
        `subtitles=subTitles.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=${fontSize},MarginV=${marginV},PrimaryColour=${toFFmpegColor(
          primaryColor
        )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
        "output.mp4",
      ])
      .catch((error) => console.error(error))
    setLoaded(false)
    const data = await ffmpeg.readFile("output.mp4")
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    )
  }

  return (
    <div>
      {loaded ? (
        <div className="flex gap-2 items-center mb-4 ">
          <Spinner />
          <span className="hidden sm:inline-block">{progress} completed.</span>
        </div>
      ) : (
        <div>
          <button
            className="mt-2 mb-4 bg-indigo-600 py-1 px-4 rounded-full flex gap-2 border-2 border-indigo-200/50 cursor-pointer"
            onClick={transcode}
          >
            <Sparkles className="" />
            <span
              className="text-lg whitespace-nowrap text-indigo-50"
              style={{ textShadow: "1px 1px rgba(200, 200, 0, 0.3)" }}
            >
              Add captions
            </span>
          </button>
          <div className="w-full grid grid-cols-5  gap-4 mb-4">
            <label className="col-span-1 flex flex-col text-xs font-bold">
              Primary color:
              <input
                type="color"
                value={primaryColor}
                className="bg-transparent"
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </label>
            <label className="col-span-1 flex flex-col text-xs font-bold ">
              Outline color:
              <input
                type="color"
                value={outlineColor}
                className="bg-transparent"
                onChange={(e) => setOutlineColor(e.target.value)}
              />
            </label>
            <label className="col-span-1 flex flex-col text-xs font-bold">
              Margin bttom:
              <input
                type="text"
                value={marginV}
                className="w-[40px] h-[18px] mt-1 rounded-sm text-sm px-1  text-indigo-800 bg-indigo-200 p-0"
                onChange={(e) => setMarginV(e.target.value)}
              />
            </label>
            <label className="col-span-1 flex flex-col text-xs font-bold">
             <span className="tracking-widest">Font size:</span>
              <input
                type="text"
                value={fontSize}
                className="w-[40px] h-[18px] mt-1 rounded-sm text-sm px-1  text-indigo-800 bg-indigo-200 p-0"
                onChange={(e) => setFontSize(e.target.value)}
              />
            </label>
            <label className="col-span-1 flex flex-col text-xs font-bold">
              Video quality
              <button
                className="whitespace-nowrap text-indigo-50 bg-indigo-900 w-full rounded-lg h-[20px] mt-1 p-2 flex items-center justify-center"
                style={{ textShadow: "1px 1px rgba(200, 200, 0, 0.3)" }}
                onClick={() => setFastSpeed((prev) => !prev)}
              >
                <span className="text-[10px]">
                  {fastSpeed ? "Fast" : "High"}
                </span>
              </button>
            </label>
          </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden w-78 sm:w-64  relative">
        {loaded && (
          <div className="absolute inset-0 bg-indigo-700/80 flex items-center justify-center">
            <div className="w-full text-center">
             
              <div className="bg-indigo-600 mx-8 h-8 rounded-full border-2 border-indigo-100/50 overflow-hidden relative ">
                <div className="bg-indigo-900  h-8" style={{width:progress}}>
                <h3 className="text-lg font-bold text-center absolute inset-0" style={{ textShadow: "1px 1px rgba(200, 200, 0, 0.3)" }}>{progress}</h3>
                   </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center ">
          <video ref={videoRef} controls></video>
        </div>
      </div>
    </div>
  )
}

export default ResultVideo
