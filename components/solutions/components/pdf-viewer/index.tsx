import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Info
} from 'lucide-react'

// 配置 PDF.js 的 worker 文件
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFPreviewModalProps {
  fileUrl: string | null
}

const PDFViewer: React.FC<PDFPreviewModalProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(100)
  const [rotation, setRotation] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [startY, setStartY] = useState<number>(0)
  const [scrollLeft, setScrollLeft] = useState<number>(0)
  const [scrollTop, setScrollTop] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [jumpToPage, setJumpToPage] = useState<number>(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInputRef = useRef<boolean>(false)

  // 使用 useMemo 缓存 PDF.js 选项，避免不必要的重新渲染
  const options = useMemo(() => ({
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
    cMapPacked: true,
    enableXfa: true,
    useSystemFonts: true
  }), [])

  const resetState = () => {
    setNumPages(null)
    setLoading(true)
    setError(false)
    setZoom(100)
    setRotation(0)
    setIsDragging(false)
    setCurrentPage(1)
    // 重置跳转页码，但不触发防抖
    isUserInputRef.current = false
    setJumpToPage(1)

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
  }

  useEffect(() => {
    // 只有在用户主动输入时才触发防抖跳转
    if (!isUserInputRef.current) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (numPages && jumpToPage >= 1 && jumpToPage <= numPages && jumpToPage !== currentPage) {
        handleJumpToPage()
      }
      // 跳转完成后重置标志
      isUserInputRef.current = false
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [jumpToPage, numPages, currentPage])

  useEffect(() => {
    // 每次 fileUrl 改变时重置状态
    resetState()

    if (fileUrl) {
      fetch(fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          setBlobUrl(url)
        })
        .catch((error) => {
          console.error('Error fetching PDF:', error)
          setError(true)
          setLoading(false)
        })
    }

    // 组件卸载或 fileUrl 改变时的清理函数
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [fileUrl])

  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 40 // 减去左右padding
        setContainerWidth(width)
        // 移除自动重置缩放比例，保持用户设置的缩放状态
      }
    }

    // 使用 ResizeObserver 监听容器宽度变化
    const resizeObserver = new ResizeObserver(() => {
      updateWidth()
    })

    resizeObserver.observe(containerRef.current)

    // 延迟初始化宽度，确保容器完全渲染
    const timer = setTimeout(() => {
      updateWidth()
    }, 100)

    return () => {
      resizeObserver.disconnect()
      clearTimeout(timer)
    }
  }, [])

  // 当 blobUrl 变化时，重新计算容器宽度
  useEffect(() => {
    if (blobUrl && containerRef.current) {
      const updateWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth - 40
          setContainerWidth(width)
        }
      }

      // 延迟更新宽度，确保PDF容器完全渲染
      const timer = setTimeout(updateWidth, 50)
      return () => clearTimeout(timer)
    }
  }, [blobUrl])

  // 当 PDF 加载成功时，设置页面数量
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false) // 加载成功后，隐藏 loading
    // 重置跳转页码，但不触发防抖
    isUserInputRef.current = false
    setJumpToPage(1)

    // PDF加载成功后，重新计算容器宽度
    if (containerRef.current) {
      const width = containerRef.current.clientWidth - 40
      setContainerWidth(width)
    }
  }

  // 加载失败时，设置错误状态
  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error)
    setLoading(false)
    setError(true) // 出错时显示错误提示
  }

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 25, 50))
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (contentRef.current?.offsetLeft || 0))
    setStartY(e.pageY - (contentRef.current?.offsetTop || 0))
    setScrollLeft(contentRef.current?.scrollLeft || 0)
    setScrollTop(contentRef.current?.scrollTop || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (contentRef.current?.offsetLeft || 0)
    const y = e.pageY - (contentRef.current?.offsetTop || 0)
    const walkX = (x - startX) * 2
    const walkY = (y - startY) * 2
    if (contentRef.current) {
      contentRef.current.scrollLeft = scrollLeft - walkX
      contentRef.current.scrollTop = scrollTop - walkY
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY
      if (delta < 0) {
        // 向上滚动，放大
        setZoom((prevZoom) => Math.min(prevZoom + 10, 200))
      } else {
        // 向下滚动，缩小
        setZoom((prevZoom) => Math.max(prevZoom - 10, 50))
      }
    }
  }

  // 跳转到指定页面
  const handleJumpToPage = () => {
    if (numPages && jumpToPage >= 1 && jumpToPage <= numPages) {
      setCurrentPage(jumpToPage)
      // 滚动到对应页面
      const targetPage = pageRefs.current[jumpToPage - 1]
      if (targetPage && contentRef.current) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // 监听滚动事件，更新当前页码
  const handleScroll = () => {
    if (!contentRef.current || !numPages) return

    const containerHeight = contentRef.current.clientHeight

    // 计算当前可见的页面
    let currentVisiblePage = 1
    for (let i = 0; i < pageRefs.current.length; i++) {
      const pageElement = pageRefs.current[i]
      if (pageElement) {
        const rect = pageElement.getBoundingClientRect()
        const containerRect = contentRef.current.getBoundingClientRect()

        // 如果页面顶部在容器中间位置附近，认为是当前页面
        if (rect.top <= containerRect.top + containerHeight / 2) {
          currentVisiblePage = i + 1
        }
      }
    }

    setCurrentPage(currentVisiblePage)
  }

  // 跳转到上一页
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      // 更新跳转页码，但不触发防抖
      isUserInputRef.current = false
      setJumpToPage(newPage)
      const targetPage = pageRefs.current[newPage - 1]
      if (targetPage && contentRef.current) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // 跳转到下一页
  const handleNextPage = () => {
    if (numPages && currentPage < numPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      // 更新跳转页码，但不触发防抖
      isUserInputRef.current = false
      setJumpToPage(newPage)
      const targetPage = pageRefs.current[newPage - 1]
      if (targetPage && contentRef.current) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // 如果没有 fileUrl，显示提示信息
  if (!fileUrl) {
    return (
      <div className="p-5 text-center">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>未提供 PDF 文件</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex flex-col"
    >
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>加载 PDF 文件失败</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* 固定工具栏 */}
          <div className="sticky top-0 left-0 right-0 bg-white/95 px-4 py-3 border-b border-border flex items-center justify-between gap-3 z-[1000] backdrop-blur-sm shadow-sm">
            {/* 缩放控制 */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* 旋转控制 */}
              <Button variant="ghost" size="sm" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* 下载按钮 */}
              <Button variant="ghost" size="sm" onClick={() => fileUrl && window.open(fileUrl, '_blank')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* 页面跳转控制 */}
            {numPages && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm">
                  第 <strong>{currentPage} / {numPages}</strong> 页
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  <span className="text-sm">跳转到:</span>
                  <Input
                    type="number"
                    min={1}
                    max={numPages}
                    value={jumpToPage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      isUserInputRef.current = true
                      setJumpToPage(Math.min(value, numPages))
                    }}
                    className="w-16 h-8"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PDF内容区域 */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className={`absolute inset-0 flex justify-center items-center bg-white transition-opacity duration-300 z-10 ${
                loading ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            {blobUrl && (
              <div
                className={`relative h-full transition-opacity duration-300 ${
                  loading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div
                  className={`flex flex-col w-full h-full relative overflow-auto ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  ref={contentRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onWheel={handleWheel}
                  onScroll={handleScroll}
                >
                  <div className="flex flex-col items-center p-5 w-max min-h-full mx-auto">
                    <Document
                      file={blobUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      options={options}
                      loading={
                        <div className="flex flex-col items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      }
                      error={
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>加载 PDF 文件失败</AlertDescription>
                        </Alert>
                      }
                    >
                      {Array.from(new Array(numPages), (_, index) => (
                        <div
                          key={`page_${index + 1}`}
                          ref={(el) => { pageRefs.current[index] = el }}
                          className="mb-5 flex justify-center relative"
                        >
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth * (zoom / 100)}
                            rotate={rotation}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={<Skeleton className="h-4 w-4 rounded-full" />}
                            error={
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>加载页面失败</AlertDescription>
                              </Alert>
                            }
                          />
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PDFViewer
