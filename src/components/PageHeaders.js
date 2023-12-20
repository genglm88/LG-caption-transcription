import React from "react"

const PageHeaders = ({ captionText='', smallText='' }) => {
  return (
    <section className="text-center mt-12 sm:mt-24 mb-4 sm:mb-8">
      <h1
        className="text-xl sm:text-3xl"
        style={{ textShadow: "1px 1px rgba(9, 9, 0, 0.2)" }}
      >
        {captionText}
      </h1>
      <h2 className="text-indigo-50/75 text-sm sm:text-base">{smallText}</h2>
    </section>
  )
}

export default PageHeaders
