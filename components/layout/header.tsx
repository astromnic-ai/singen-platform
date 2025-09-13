import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HelpCircle, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Header() {
  return (
    <header className="h-14 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">S</span>
          </div>
          <span className="text-lg font-medium text-gray-900">SINGEN星匠</span>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索 (⌘ + K)"
            className="pl-10 w-72 h-9 bg-gray-50/50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded-lg"
          />
        </div>

        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 h-9 w-9 p-0">
          <HelpCircle className="w-4 h-4" />
        </Button>

        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
