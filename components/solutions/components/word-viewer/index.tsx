import jsPreviewDoc from '@js-preview/docx'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'
import { useToast } from '@/hooks/use-toast'

export default function WordViewer({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<ReturnType<typeof jsPreviewDoc.init> | null>(null)
  const rafRef = useRef<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    setError(null)

    const ext = (() => {
      try {
        const clean = fileUrl.split('?')[0].split('#')[0]
        return clean.substring(clean.lastIndexOf('.') + 1).toLowerCase()
      } catch {
        return ''
      }
    })()

    // 当前库主要支持 .docx，其他（如 .doc/.rtf）容易导致渲染异常
    if (ext !== 'docx') {
      setLoading(false)
      setError(`该 Word 格式（.${ext}）暂不支持在线预览`)
      toast({ title: '暂不支持展示', description: `当前文件格式 .${ext} 暂不支持在线预览，请下载查看` })
      return
    }

    rafRef.current = window.requestAnimationFrame(async () => {
      if (!containerRef.current) {
        setLoading(false)
        setError('预览容器未就绪')
        return
      }
      try {
        instanceRef.current?.destroy?.()
        instanceRef.current = jsPreviewDoc.init(containerRef.current as HTMLDivElement)
        await instanceRef.current?.preview(fileUrl)
      } catch (e) {
        console.error('Word preview error:', e)
        setError('加载 Word 文件失败')
        toast({ title: '预览失败', description: 'Word 文件加载失败，请下载查看' })
      } finally {
        setLoading(false)
      }
    })

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      instanceRef.current?.destroy?.()
      instanceRef.current = null
    }
  }, [fileUrl])

  return (
    <div className="relative h-[calc(100vh-170px)]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <Loader className="text-muted-foreground" size={20} />
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 text-sm text-muted-foreground">
          {error}
        </div>
      )}
      <div ref={containerRef} className="h-full overflow-auto" />
    </div>
  )
}
