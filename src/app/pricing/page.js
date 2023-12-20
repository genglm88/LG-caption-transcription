import PageHeaders from "@/components/PageHeaders"
import React from "react"

const PricingPage = () => {
  return (
    <div>
      <PageHeaders
        captionText={"Checkout our pricing"}
        smallText={"Our pricing is very competative"}
      />
      <div className="bg-indigo-100 max-w-xs mx-auto p-4 mt-12  rounded-lg text-center  text-indigo-900/80 ">
        <h3 className="font-bold text-3xl">Free</h3>
        <h4 className="text-md mt-1">Free forver</h4>
      </div>
    </div>
  )
}

export default PricingPage
