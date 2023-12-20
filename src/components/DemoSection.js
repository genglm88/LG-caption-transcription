import React from "react"
import Sparkles from "./Sparkles"

const DemoSection = () => {
  return (
    <section className="flex gap-6 justify-around mt-16 items-center">
      <div className="hidden sm:block bg-indigo-300/50 w-[400px]  rounded-xl overflow-hidden">
      <video src={"https://lg-epic-captions.s3.amazonaws.com/2delq1q3xpn.mp4"} controls autoPlay></video>
        
      </div>
      <Sparkles className="hidden sm:block h-6 "/>
      <div className="bg-indigo-900/50 w-[400px] rounded-xl overflow-hidden flex items-center">
      <video src={"https://lg-epic-captions.s3.amazonaws.com/2dwlqde8ni1.mp4"} controls autoPlay ></video>
      </div>
    </section>
  )
}

export default DemoSection
