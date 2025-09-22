export interface Document {
  id: string
  name: string
  type: 'pdf' | 'pptx' | 'excel' | 'docx'
  url: string
  icon?: string
}

// 文件树节点类型定义（用于分层文件夹展示）
export type SupportedDocumentType = 'pdf' | 'pptx' | 'excel' | 'docx'

export interface FileNode {
  id: string
  name: string
  kind: 'file'
  // 允许任意文件类型字符串，受支持类型参见 SupportedDocumentType
  fileType: string
  // 仅当可预览（受支持类型）时提供
  url?: string
}

export interface FolderNode {
  id: string
  name: string
  kind: 'folder'
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

export interface Solution {
  id: string
  name: string
  description?: string
  documents: Document[]
  // 可选的分层文件树（存在则用于渲染分层结构，优先于 documents）
  tree?: TreeNode[]
  createdAt?: string
  updatedAt?: string
}

export interface SolutionsResponse {
  success: boolean
  data: Solution[]
  message?: string
}
