import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Calendar, User, Plus } from "lucide-react"
import Link from "next/link"

export default function MyProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "汽车装配线设计",
      description: "基于AI智能体的汽车装配线完整设计方案",
      lastModified: "2024-01-15",
      status: "进行中",
      collaborators: 3,
    },
    {
      id: 2,
      name: "电子产品生产线",
      description: "电子产品智能化生产线设计与优化",
      lastModified: "2024-01-12",
      status: "已完成",
      collaborators: 2,
    },
    {
      id: 3,
      name: "机械加工工位",
      description: "精密机械加工工位的智能化改造方案",
      lastModified: "2024-01-10",
      status: "草稿",
      collaborators: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-25">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 py-12">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-semibold text-gray-900">我的项目</h1>
              <Link href="/workspace">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  创建新项目
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-100 rounded-xl"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          project.status === "已完成"
                            ? "bg-green-50 text-green-700"
                            : project.status === "进行中"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                    <CardDescription className="text-gray-500">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.lastModified}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {project.collaborators}
                      </div>
                    </div>
                    <Link href="/workspace">
                      <Button variant="outline" className="w-full bg-white hover:bg-gray-50 rounded-lg">
                        打开项目
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
