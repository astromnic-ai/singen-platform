"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, ChevronDown, Move3D, Grid3X3, Download, Zap, Wrench } from "lucide-react"
import { CustomImportDialog } from "./custom-import-dialog"

export function ThreeDToolbar() {
  const [showCustomImportDialog, setShowCustomImportDialog] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        {/* 导入组件 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white hover:bg-gray-50">
              <Upload className="w-4 h-4 mr-2" />
              导入组件
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Zap className="w-4 h-4 mr-2" />
              智能导入
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCustomImportDialog(true)}>
              <Wrench className="w-4 h-4 mr-2" />
              自定义导入
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 局部调整 */}
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          <Move3D className="w-4 h-4 mr-2" />
          局部调整
        </Button>

        {/* 智能排布 */}
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          <Grid3X3 className="w-4 h-4 mr-2" />
          智能排布
        </Button>

        {/* 导出方案 */}
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          导出方案
        </Button>
      </div>

      <CustomImportDialog open={showCustomImportDialog} onOpenChange={setShowCustomImportDialog} />
    </div>
  )
}
