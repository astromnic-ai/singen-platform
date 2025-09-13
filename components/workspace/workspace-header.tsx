"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface WorkspaceHeaderProps {
  projectName: string
  onProjectNameChange: (name: string) => void
}

export function WorkspaceHeader({ projectName, onProjectNameChange }: WorkspaceHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(projectName)

  const handleSave = () => {
    onProjectNameChange(tempName)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempName(projectName)
    setIsEditing(false)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主页
          </Button>
        </Link>
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-600">工作台</span>
      </div>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-64"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleSave}>
              保存
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              取消
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-gray-900">{projectName}</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      <div className="w-32"></div> {/* 占位符保持布局平衡 */}
    </header>
  )
}
