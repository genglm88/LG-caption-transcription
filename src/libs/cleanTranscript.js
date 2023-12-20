export const cleanTranscript = (transcriptionItems) => {
  //radd -. or -;  to the previous transcription for those without start_time % end_time
  transcriptionItems.forEach((item, index, arr) => {
    if (!item.start_time && index>1) {
      arr[index - 1].alternatives[0].content += item.alternatives[0].content
    }
  })

  // remove those wo start_time

  return transcriptionItems
    .filter((item) => item.end_time)
    .map((item) => {
      const { start_time, end_time } = item
      const content = item.alternatives[0].content
      return { start_time, end_time, content }
    })
}
export const pad2Num = (number, padNum) => {
  return String(number).padStart(padNum, "0")
}

export const timeConvertDate = (time) => {
  const formatedTime = new Date(Number(time) * 1000).toISOString()
  return formatedTime.slice(-13, -1).replace(".", ",")
}

export const timeConvert = (time) => {
  const timeSplit = time.split(".")

  const totalSec = Number(timeSplit[0])

  const hours = Math.trunc(totalSec / 3600)
  const minutes = Math.trunc((totalSec - hours * 3600) / 60)
  const seconds = Math.trunc(totalSec - hours * 3600 - minutes * 60)
  const mSecs = Math.trunc(Number(timeSplit[1]))
  return (
    pad2Num(hours, 2) +
    ":" +
    pad2Num(minutes, 2) +
    ":" +
    pad2Num(seconds, 2) +
    "," +
    pad2Num(mSecs, 3)
  )
}

export const transcriptionItemsToSrt = (transcriptionItems) => {
 
  let srt = ""
  transcriptionItems.forEach((item, index) => {
    const { start_time, end_time, content } = item
    srt +=
      (index + 1).toString() +
      "\n" +
      timeConvertDate(start_time) +
      " --> " +
      timeConvertDate(end_time) +
      "\n" +
      content +
      "\n\n"
  })
  return srt
}
