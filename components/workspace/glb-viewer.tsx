import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Button } from '@/components/ui/button'
import { Loader2, ZoomIn, ZoomOut, RotateCcw, Maximize, Grid3X3, Eye, Move3D } from 'lucide-react'

interface GlbViewerProps {
  glbUrl: string
  title?: string
  height?: number | string
  hideControls?: boolean
}

interface ProgressEvent {
  loaded: number
  total: number
}

const GlbViewer: React.FC<GlbViewerProps> = ({ glbUrl, title, height = 500, hideControls = false }) => {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("perspective")
  const [showGrid, setShowGrid] = useState(false)
  const [showAxis, setShowAxis] = useState(false)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 0 })
  const [zoom, setZoom] = useState(100)
  const [componentCount, setComponentCount] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const gridHelperRef = useRef<THREE.GridHelper | null>(null)
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null)
  const isSpacePressedRef = useRef(false)
  const originalMouseButtonsRef = useRef<{ LEFT: THREE.MOUSE; MIDDLE: THREE.MOUSE; RIGHT: THREE.MOUSE } | null>(null)
  const originalAutoRotateRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 确保容器有正确的尺寸
    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width || containerRef.current.clientWidth || 800
    const height = containerRect.height || containerRef.current.clientHeight || 500

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 2000)
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = false
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2
    
    // 确保 canvas 元素填充整个容器
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight2.position.set(-5, 5, -5)
    scene.add(directionalLight2)

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x888888)
    gridHelper.visible = showGrid
    scene.add(gridHelper)
    gridHelperRef.current = gridHelper

    // 添加坐标轴辅助线
    const axesHelper = new THREE.AxesHelper(5)
    axesHelper.visible = showAxis
    scene.add(axesHelper)
    axesHelperRef.current = axesHelper

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.screenSpacePanning = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.0
    controls.minDistance = 0.01
    controls.maxDistance = 100
    // 明确默认鼠标按钮映射
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    }
    originalMouseButtonsRef.current = {
      LEFT: (controls.mouseButtons as any).LEFT ?? THREE.MOUSE.ROTATE,
      MIDDLE: (controls.mouseButtons as any).MIDDLE ?? THREE.MOUSE.DOLLY,
      RIGHT: (controls.mouseButtons as any).RIGHT ?? THREE.MOUSE.PAN,
    }
    originalAutoRotateRef.current = controls.autoRotate
    controlsRef.current = controls

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      
      // 更新相机位置状态
      if (cameraRef.current) {
        const pos = cameraRef.current.position
        setCameraPosition({
          x: Math.round(pos.x * 100) / 100,
          y: Math.round(pos.y * 100) / 100,
          z: Math.round(pos.z * 100) / 100
        })
        
        // 更新缩放状态 (基于相机距离)
        const distance = pos.length()
        const normalizedZoom = Math.round((5 / distance) * 100)
        setZoom(Math.max(1, Math.min(1000, normalizedZoom)))
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // 按下空格时将左键拖拽改为平移；松开恢复旋转
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      // 避免输入框内触发
      const target = e.target as HTMLElement | null
      if (target && (/^(input|textarea|select)$/i).test(target.tagName)) return
      e.preventDefault()
      if (!controlsRef.current || isSpacePressedRef.current) return
      isSpacePressedRef.current = true
      // 暂停自动旋转，切换左键为平移
      controlsRef.current.autoRotate = false
      controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.PAN
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      if (!controlsRef.current || !isSpacePressedRef.current) return
      isSpacePressedRef.current = false
      // 恢复左键为旋转及自动旋转状态
      if (originalMouseButtonsRef.current) {
        controlsRef.current.mouseButtons.LEFT = originalMouseButtonsRef.current.LEFT
      } else {
        controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.ROTATE
      }
      if (originalAutoRotateRef.current !== null) {
        controlsRef.current.autoRotate = originalAutoRotateRef.current
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      // 获取容器的实际尺寸
      const containerRect = containerRef.current.getBoundingClientRect()
      const width = containerRect.width || containerRef.current.clientWidth
      const height = containerRect.height || containerRef.current.clientHeight
      
      if (width > 0 && height > 0) {
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(width, height)
        
        // 确保 canvas 样式保持正确
        rendererRef.current.domElement.style.width = '100%'
        rendererRef.current.domElement.style.height = '100%'
      }
    }
    window.addEventListener('resize', handleResize)
    
    // 使用 ResizeObserver 监听容器尺寸变化
    let resizeObserver: ResizeObserver | null = null
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(containerRef.current)
    }

    loadModel(glbUrl)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {
          // 忽略移除错误
        }
      }
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      rendererRef.current?.dispose()
      controlsRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (glbUrl && sceneRef.current) {
      loadModel(glbUrl)
    }
  }, [glbUrl])

  // 网格显示控制
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid
    }
  }, [showGrid])

  // 轴线显示控制
  useEffect(() => {
    if (axesHelperRef.current) {
      axesHelperRef.current.visible = showAxis
    }
  }, [showAxis])

  const loadModel = (url: string) => {
    if (!sceneRef.current || !cameraRef.current) return
    setLoading(true)

    sceneRef.current.children.forEach((child) => {
      if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
        if ((child as any).userData.isModel) {
          sceneRef.current?.remove(child)
        }
      }
    })

    const loader = new GLTFLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      url,
      (gltf: GLTF) => {
        const model = gltf.scene
        ;(model as any).userData.isModel = true
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = false
            node.receiveShadow = false
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach((mat) => {
                  if ((mat as any).map) (mat as any).map.anisotropy = 16
                  ;(mat as any).needsUpdate = true
                })
              } else {
                if ((node.material as any).map) (node.material as any).map.anisotropy = 16
                ;(node.material as any).needsUpdate = true
              }
            }
          }
        })

        const box = new THREE.Box3().setFromObject(model)
        if (box.isEmpty() || !isFinite(box.min.x) || !isFinite(box.max.x)) {
          model.position.set(0, 0, 0)
          if (cameraRef.current) {
            cameraRef.current.position.z = 5
            cameraRef.current.near = 0.01
            cameraRef.current.far = 1000
            cameraRef.current.updateProjectionMatrix()
          }
        } else {
          const center = new THREE.Vector3()
          box.getCenter(center)
          const size = new THREE.Vector3()
          box.getSize(size)
          const maxDim = Math.max(size.x, size.y, size.z)
          if (cameraRef.current && maxDim > 0) {
            const fov = 45
            let cameraZ = maxDim / (2 * Math.tan((fov * Math.PI) / 360))
            cameraZ *= 1.5
            cameraRef.current.position.set(0, 0, cameraZ)
            cameraRef.current.near = cameraZ / 100
            cameraRef.current.far = cameraZ * 100
            cameraRef.current.updateProjectionMatrix()
            model.position.set(-center.x, -center.y, -center.z)
          }
        }

        sceneRef.current?.add(model)
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0)
          controlsRef.current.update()
        }
        
        // 计算组件数量
        let count = 0
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            count++
          }
        })
        setComponentCount(count)
        
        setLoading(false)
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error: unknown) => {
        console.error('Error loading model:', error)
        setLoading(false)
      }
    )
  }

  const zoomIn = () => {
    if (controlsRef.current && cameraRef.current) {
      const currentPosition = cameraRef.current.position.clone()
      const direction = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), currentPosition).normalize()
      cameraRef.current.position.addScaledVector(direction, currentPosition.length() * 0.4)
      controlsRef.current.update()
    }
  }

  const zoomOut = () => {
    if (controlsRef.current && cameraRef.current) {
      const currentPosition = cameraRef.current.position.clone()
      const direction = new THREE.Vector3().subVectors(currentPosition, new THREE.Vector3(0, 0, 0)).normalize()
      cameraRef.current.position.addScaledVector(direction, currentPosition.length() * 0.4)
      controlsRef.current.update()
    }
  }

  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }

  const changeViewMode = (mode: string) => {
    if (!cameraRef.current || !controlsRef.current) return
    
    switch (mode) {
      case "perspective":
        cameraRef.current.position.set(5, 5, 5)
        break
      case "top":
        cameraRef.current.position.set(0, 10, 0)
        break
      case "side":
        cameraRef.current.position.set(10, 0, 0)
        break
      case "front":
        cameraRef.current.position.set(0, 0, 10)
        break
    }
    
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
    setViewMode(mode)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {title && (
        <div className="border-b p-4">
          <div className="text-lg font-semibold">{title}</div>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* 3D视图控制器 */}
      {!hideControls && (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm" onClick={resetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 视图模式切换 */}
      {!hideControls && (
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <Button
            variant={viewMode === "perspective" ? "default" : "outline"}
            size="sm"
            className={viewMode === "perspective" ? "backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}
            onClick={() => changeViewMode("perspective")}
          >
            透视图
          </Button>
          <Button
            variant={viewMode === "top" ? "default" : "outline"}
            size="sm"
            className={viewMode === "top" ? "backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}
            onClick={() => changeViewMode("top")}
          >
            俯视图
          </Button>
          <Button
            variant={viewMode === "side" ? "default" : "outline"}
            size="sm"
            className={viewMode === "side" ? "backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}
            onClick={() => changeViewMode("side")}
          >
            侧视图
          </Button>
        </div>
      )}

      {/* 网格显示控制 */}
      {!hideControls && (
        <div className="absolute bottom-4 left-4 z-10 flex space-x-2">
          <Button 
            variant={showGrid ? "default" : "outline"} 
            size="sm" 
            className={showGrid ? "backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            显示网格
          </Button>
          <Button 
            variant={showAxis ? "default" : "outline"} 
            size="sm" 
            className={showAxis ? "backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}
            onClick={() => setShowAxis(!showAxis)}
          >
            <Eye className="w-4 h-4 mr-2" />
            显示轴线
          </Button>
        </div>
      )}

      {/* 状态栏 */}
      {!hideControls && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600">
            坐标: ({cameraPosition.x}, {cameraPosition.y}, {cameraPosition.z}) | 缩放: {zoom}% | 组件: {componentCount}
          </div>
        </div>
      )}

      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

export default GlbViewer
