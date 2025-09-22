import jsPreviewDoc from '@js-preview/docx'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'

export default function WordViewer({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const myDocPreviewer = jsPreviewDoc.init(containerRef.current as HTMLDivElement)
    myDocPreviewer?.preview(fileUrl).finally(() => {
      setLoading(false)
    })
    return () => {
      myDocPreviewer?.destroy()
    }
  }, [fileUrl])
  return (
    <div className="relative h-[calc(100vh-170px)]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <Loader className="text-muted-foreground" size={20} />
        </div>
      )}
      <div ref={containerRef} className="h-full overflow-auto" />
    </div>
  )
}
