"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink } from "lucide-react"

interface DocumentReferenceSidebarProps {
  onClose: () => void
}

export function DocumentReferenceSidebar({ onClose }: DocumentReferenceSidebarProps) {
  const references = [
    {
      id: 1,
      title: "员工考勤管理制度 HXHR-01-01.pdf",
      content:
        "5.4.4 员工在生产正常运行的情况下进行加班事宜的，可视为调休。5.4.5 员工因公出差或外出的均需使用打卡打卡。5.4.6 每天上班前半个小时，下班后半个小时为有效打卡时间，员工需按公司要求每天上班打卡一次，下班打卡一次，不得重复打卡或不打卡，员工未打卡视为未出勤，如实际正出勤的需...",
      type: "PDF",
      link: "#",
    },
    {
      id: 2,
      title: "员工考勤管理制度 HXHR-01-01.pdf",
      content:
        "5.4.4 员工在生产正常运行的情况下进行加班事宜的，可视为调休。因公出差或外出的上下班均需使用打卡打卡，打卡位置非工作地点或考勤卡的，视为无效考勤。5.4.6 每天上班前半个小时，下班后半个小时为有效打卡时间，员工需按公司要求每天上班打卡一次，下班打卡一次，...",
      type: "PDF",
      link: "#",
    },
    {
      id: 3,
      title: "HXHR-01-01员工考勤管理制度.pdf",
      content:
        "5.4.4 员工在生产正常运行的情况下进行加班事宜的，可视为调休。5.4.5 员工到公司出勤，因公出差或外出的上下班均需使用打卡打卡，打卡位置非工作地点或考勤卡的，视为无效考勤。5.4.6 每天上班前半个小时，下班后半个小时为有效打卡时间，员工需按公司要求每天上班打卡一次，下班打卡一次，...",
      type: "PDF",
      link: "#",
    },
  ]

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">相关文档引用</h3>
          <p className="text-sm text-gray-500">共 6 段相关文档</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {references.map((ref) => (
          <Card key={ref.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-900 leading-tight">
                    {ref.id}. {ref.title}
                  </h4>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{ref.content}</p>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {ref.type}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    查看原文
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  )
}
