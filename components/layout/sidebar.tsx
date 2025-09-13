"use client"

import { Button } from "@/components/ui/button"
import { Home, FolderOpen, FileText, Package, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "主页" },
    { href: "/my-projects", icon: FolderOpen, label: "我的项目" },
    { href: "/solutions", icon: FileText, label: "方案库" },
    { href: "/models", icon: Package, label: "模型库" },
    { href: "/knowledge", icon: BookOpen, label: "知识库" },
  ]

  return (
    <aside className="w-56 bg-white/50 backdrop-blur-sm h-[calc(100vh-56px)] overflow-y-auto border-r border-gray-50">
      <nav className="p-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-10 px-3 font-normal text-sm rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
