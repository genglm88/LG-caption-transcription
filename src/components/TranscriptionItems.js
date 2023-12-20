import React, { useState } from "react"

const TranscriptionItems = ({
  index,
  transcriptItems,
  setTranscriptItems,
}) => {


  const handleChange = (e) => {
    const { name, value } = e.target
   
    //update the transcription array

    setTranscriptItems((prev) => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], [name]: value }
      return newItems
    })
  }

  const combineWithPrevious = () => {
    //console.log("clicked", index)
    setTranscriptItems((prev) => {
      const newItems = [...prev]
      newItems[index] = {
        ...newItems[index],
        start_time: newItems[index - 1].start_time,
        content: newItems[index - 1].content + " " + newItems[index].content,
      }
      return newItems
    })
    setTranscriptItems(prev=>{
      const newItems = [...prev]
      newItems.splice(index-1,1)
      return newItems
    })
  }

  return (
    <div className=" flex gap-1 justify-around ">
      <input
        className="bg-indigo-600 py-1 text-center rounded-lg border-2 w-12 mb-1 border-indigo-900 text-xs"
        type="text"
        name="start_time"
        value={transcriptItems[index].start_time}
        onChange={handleChange}
      />
      <input
        className="bg-indigo-600 text-center rounded-lg border-2 w-12 mb-1 border-indigo-900 text-xs"
        type="text"
        name="end_time"
        value={transcriptItems[index].end_time}
        onChange={handleChange}
      />
      <input
        className="bg-indigo-600 px-2 text-center rounded-lg border-2 w-64 sm:w-56 mb-1 border-indigo-900 text-xs"
        type="text"
        name="content"
        value={transcriptItems[index].content}
        onChange={handleChange}
      />
      {index > 0 && (
        <button
          className=" text-indigo-50 text-sm font-bold  rounded-lg border-0 w-8 mb-1 border-indigo-900"
          onClick={combineWithPrevious}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
export default TranscriptionItems
