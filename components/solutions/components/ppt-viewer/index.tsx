import { init } from 'pptx-preview'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 自定义样式
const customStyles = `
  .pptx-preview-wrapper {
    background-color: #f8f9fa !important;
  }
`

export default function PPTViewer({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const previewerRef = useRef<{ destroy?: () => void; preview: (data: ArrayBuffer) => Promise<unknown> } | null>(null)

  useEffect(() => {
    if (!fileUrl || !containerRef.current) return

    // 添加自定义样式
    const styleElement = document.createElement('style')
    styleElement.setAttribute('data-ppt-custom', 'true')
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)

    const initPPTViewer = async () => {
      try {
        setLoading(true)
        setError('')

        // 初始化预览器
        const pptxPreviewer = init(containerRef.current!, {
          width: containerRef.current!.clientWidth || 960,
          height: containerRef.current!.clientHeight || 540
        })

        previewerRef.current = pptxPreviewer

        // 获取文件数据
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()

        // 预览PPT
        await pptxPreviewer.preview(arrayBuffer)

      } catch (err) {
        console.error('PPT预览失败:', err)
        setError(err instanceof Error ? err.message : 'PPT预览失败')
      } finally {
        setLoading(false)
      }
    }

    initPPTViewer()

    // 清理函数
    return () => {
      if (previewerRef.current && typeof previewerRef.current.destroy === 'function') {
        previewerRef.current.destroy()
      }
      previewerRef.current = null

      // 清理样式
      const existingStyle = document.head.querySelector('style[data-ppt-custom]')
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [fileUrl])

  if (error) {
    return (
      <div className="h-[calc(100vh-170px)] flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>PPT预览失败</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-170px)]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <Loader className="text-muted-foreground" size={20} />
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        style={{ width: '100%' }}
      />
    </div>
  )
}
