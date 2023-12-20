"use client"
import React, { useState } from "react"
import UploadIcon from "./UploadIcon"
import axios from "axios"
import Spinner from "./Spinner"
import { useRouter } from "next/navigation"

const UploadForm = () => {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const upload = async (e) => {
    e.preventDefault()
   
    //console.log(e)
    const files = e.target?.files
    if (files.length > 0) {
      const file = files[0]
      
      try {
        setIsUploading(true)
        const {data } = await axios.postForm("/api/upload", { file })
       
        setIsUploading(false)

        const {newFilename} = data
        router.push('/'+ newFilename)
      } catch (err) {
        console.error("Error upload the file.", err)
      }
    }
  }
  return isUploading ? (
    <div className="bg-indigo-900/70 fixed  inset-0 flex items-center justify-center">
      <Spinner />{" "}
    </div>
  ) : (
    <label className="bg-indigo-600 py-2 px-6 rounded-full flex gap-2 border-2 border-indigo-300/50 cursor-pointer">
      <UploadIcon />
      <span>Choose file</span>
      <input onChange={upload} type="file" className="hidden" />
    </label>
  )
}

export default UploadForm
