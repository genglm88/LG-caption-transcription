import DemoSection from "@/components/DemoSection"
import PageHeaders from "@/components/PageHeaders"
import UploadForm from "@/components/UploadForm"

export default function Home() {
  return (
    <>
      <PageHeaders
        captionText="Add epic captions to your video"
        smallText="Just upload your video and we will do the rest"
      />
      <div className="flex justify-center mt-8">
        <UploadForm />
      </div>
      <DemoSection />
    </>
  )
}
