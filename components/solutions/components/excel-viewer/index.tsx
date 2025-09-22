import jsPreviewExcel from '@js-preview/excel'
import '@js-preview/excel/lib/index.css'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@/components/ai-elements/loader'
import { useToast } from '@/hooks/use-toast'

export default function ExcelViewer({ fileUrl }: { fileUrl: string }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<ReturnType<typeof jsPreviewExcel.init> | null>(null)
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

    // js-preview/excel 对 .xls 兼容性较差，优先仅允许 xlsx/xlsm
    const supported = ['xlsx', 'xlsm'].includes(ext)
    if (!supported) {
      setLoading(false)
      setError(`该 Excel 格式（.${ext}）暂不支持在线预览`)
      toast({ title: '暂不支持展示', description: `当前文件格式 .${ext} 暂不支持在线预览，请下载查看` })
      return
    }

    // 等待容器挂载，避免因 null 容器导致第三方库报错
    rafRef.current = window.requestAnimationFrame(async () => {
      if (!containerRef.current) {
        setLoading(false)
        setError('预览容器未就绪')
        return
      }
      try {
        // 如已有实例，先销毁
        instanceRef.current?.destroy?.()
        instanceRef.current = jsPreviewExcel.init(containerRef.current as HTMLDivElement)
        // 有些情况下预览可能同步抛错，这里 try/catch 保护
        await instanceRef.current?.preview(fileUrl)
      } catch (e) {
        console.error('Excel preview error:', e)
        setError('加载 Excel 文件失败')
        toast({ title: '预览失败', description: 'Excel 文件加载失败，请下载查看' })
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
