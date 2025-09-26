"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message as AIMessage,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionAddAttachments,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "@/components/ai-elements/sources";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  Calculator,
  Database,
  SendIcon,
  FileText,
  EyeIcon,
  Box,
  Settings,
  FileCheck,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Code,
  Sheet,
  Presentation,
  Paperclip,
  X as XIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { MarkdownPreviewSidebar } from "./markdown-preview-sidebar";
import { SourcesSidebar } from "./sources-sidebar";
import { ThreeDDesignArea } from "./three-d-design-area";

// Keep props compatible
interface ChatAreaProps {
  selectedAgent: string;
  onRunClick: () => void;
  showProcessSidebar: boolean;
  onConversationHistoryChange?: (
    history: Record<string, UIMessageItem[]>
  ) => void;
  selectedConversation?: string;
  onConversationChange?: (conversationId: string) => void;
  initialMessage?: string;
}

type Role = "user" | "assistant";

// 文件名截断工具函数
const getDisplayName = (name: string, maxLength: number = 20) => {
  if (name.length <= maxLength) return name;

  // 分离文件名和扩展名
  const lastDotIndex = name.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // 没有扩展名，直接截断开头
    return name.substring(0, maxLength - 3) + "...";
  }

  const baseName = name.substring(0, lastDotIndex);
  const extension = name.substring(lastDotIndex);

  // 如果扩展名太长，直接截断开头
  if (extension.length >= maxLength - 3) {
    return name.substring(0, maxLength - 3) + "...";
  }

  // 计算可用于基础文件名的字符数
  const availableLength = maxLength - extension.length - 3; // 3 是 '...' 的长度

  if (availableLength <= 0) {
    return name.substring(0, maxLength - 3) + "...";
  }

  return baseName.substring(0, availableLength) + "..." + extension;
};

// 文件类型图标映射
const getFileIcon = (fileName: string | undefined | null) => {
  if (!fileName || typeof fileName !== "string") {
    return File;
  }
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "pdf":
      return FileText;
    case "doc":
    case "docx":
      return FileText;
    case "xls":
    case "xlsx":
      return Sheet;
    case "ppt":
    case "pptx":
      return Presentation;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      return FileImage;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return FileVideo;
    case "mp3":
    case "wav":
    case "aac":
    case "flac":
      return FileAudio;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
      return Archive;
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "html":
    case "css":
    case "py":
    case "java":
    case "cpp":
    case "c":
      return Code;
    case "txt":
    case "md":
      return FileText;
    default:
      return File;
  }
};

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface MarkdownAttachment {
  id: string;
  title: string;
  filename: string;
  content?: string;
}

interface SourceDocument {
  id: string;
  title: string;
  content: string;
  fileType: "pdf" | "doc" | "txt" | "md" | "image" | "video" | "other";
  url?: string;
  preview?: string;
  metadata?: {
    size?: string;
    lastModified?: string;
    author?: string;
  };
}

interface UploadedDocument {
  id: string;
  name: string;
  format: string;
  size: string;
}

interface UIMessageItem {
  id: string;
  role: Role;
  content: string;
  sourcesCount?: number;
  sources?: SourceDocument[];
  attachments?: MarkdownAttachment[];
  uploadedDocuments?: UploadedDocument[];
  uploadedFiles?: UploadedFile[]; // 新增：用户上传的文件
  cot?: {
    steps: { label: string; status: "complete" | "active" | "pending" }[];
  };
  // 新增：后端流式思考文本
  cotText?: string;
  // 新增：深度思考是否完成
  cotCompleted?: boolean;
  // 组件智能选型的可交互选项
  componentOptions?: {
    message?: string; // 提示文本
    options?: Array<{
      id: string;
      label: string;
      icon: string;
      type: "url" | "markdown";
      content: string; // URL或markdown内容
    }>;
  };
}

// 直接上传按钮组件
function DirectUploadButton() {
  const attachments = usePromptInputAttachments();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        // 确保文件输入框处于干净状态
        if (attachments.fileInputRef.current) {
          attachments.fileInputRef.current.value = "";
        }
        attachments.openFileDialog();
      }}
      className="text-muted-foreground hover:text-foreground"
    >
      <Paperclip className="w-4 h-4" />
    </Button>
  );
}

// 自定义文件附件组件
function CustomFileAttachment({ data }: { data: any }) {
  const attachments = usePromptInputAttachments();
  const FileIcon = getFileIcon(data.filename || data.name || "");

  // 截取文件名，保留开头和后缀，省略中间部分
  const fileName = data.filename || data.name || "未知文件";
  const displayName = getDisplayName(fileName);

  return (
    <div className="group relative inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors">
      {/* 文件图标 */}
      <div className="flex-shrink-0">
        {data.mediaType?.startsWith("image/") && data.url ? (
          <img
            alt={data.filename || "attachment"}
            className="w-4 h-4 rounded object-cover"
            src={data.url}
          />
        ) : (
          <FileIcon className="w-4 h-4 text-blue-600" />
        )}
      </div>

      {/* 文件信息 */}
      <div className="text-xs">
        <p className="font-medium text-gray-900 whitespace-nowrap">
          {displayName}
        </p>
        {data.size && (
          <p className="text-gray-500 whitespace-nowrap">
            {data.size < 1024 * 1024
              ? `${(data.size / 1024).toFixed(1)} KB`
              : `${(data.size / (1024 * 1024)).toFixed(1)} MB`}
          </p>
        )}
      </div>

      {/* 删除按钮 */}
      <Button
        aria-label="Remove attachment"
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-5 w-5 p-0"
        onClick={() => {
          attachments.remove(data.id);
          // 重置文件输入框以允许重新选择相同文件
          if (attachments.fileInputRef.current) {
            attachments.fileInputRef.current.value = "";
          }
        }}
        type="button"
        variant="ghost"
      >
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}

// 自定义文件附件容器组件
function CustomFileAttachments({
  children,
}: {
  children: (file: any) => React.ReactNode;
}) {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) return null;

  return (
    <div className="p-2 pb-0">
      <div className="flex flex-wrap gap-2">
        {attachments.files.map((file) => (
          <div key={file.id}>{children(file)}</div>
        ))}
      </div>
    </div>
  );
}

export function ChatArea({
  selectedAgent,
  onRunClick,
  onConversationHistoryChange,
  selectedConversation,
  onConversationChange,
  initialMessage,
}: ChatAreaProps) {
  // 为每个智能体维护独立的对话历史
  const [conversationHistory, setConversationHistory] = useState<
    Record<string, UIMessageItem[]>
  >({});
  // 当前对话ID状态
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  // 历史对话消息（从服务器加载的）
  const [historicalMessages, setHistoricalMessages] = useState<UIMessageItem[]>(
    []
  );
  const [status, setStatus] = useState<
    "idle" | "submitted" | "streaming" | "error"
  >("idle");
  const abortRef = useRef<AbortController | null>(null);

  // 侧栏预览状态
  const [showPreviewSidebar, setShowPreviewSidebar] = useState(false);
  const [previewAttachments, setPreviewAttachments] = useState<
    MarkdownAttachment[]
  >([]);
  const [currentAttachmentId, setCurrentAttachmentId] = useState<string>();

  // 来源文档侧栏状态
  const [showSourcesSidebar, setShowSourcesSidebar] = useState(false);
  const [currentSources, setCurrentSources] = useState<SourceDocument[]>([]);

  // 3D设计区域所需的状态
  const [message, setMessage] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Record<string, UploadedDocument[]>
  >({});
  const isRunning = status === "submitted" || status === "streaming";

  // 加载历史对话
  useEffect(() => {
    const loadHistoricalConversation = async (conversationId: string) => {
      try {
        const response = await fetch(`/api/chat?agent=${selectedAgent}`);
        if (response.ok) {
          const data = await response.json();
          const conversation = data.history.find(
            (conv: any) => conv.id === conversationId
          );
          if (conversation) {
            // 将历史消息转换为UIMessageItem格式，包含完整信息
            const historicalMessages: UIMessageItem[] =
              conversation.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                // 保留助手消息的完整信息
                ...(msg.role === "assistant" && {
                  sourcesCount: msg.sourcesCount,
                  sources: msg.sources,
                  attachments: msg.attachments,
                  cotText: msg.cotText,
                  cot: msg.cot,
                  componentOptions: msg.componentOptions,
                }),
              }));
            setHistoricalMessages(historicalMessages);
          }
        }
      } catch (error) {
        console.error("Failed to load historical conversation:", error);
      }
    };

    if (selectedConversation) {
      setCurrentConversationId(selectedConversation);
      loadHistoricalConversation(selectedConversation);
    } else {
      setCurrentConversationId(null);
      setHistoricalMessages([]);
    }
  }, [selectedConversation, selectedAgent]);

  // 切换聊天时自动关闭所有侧边栏并清理状态
  useEffect(() => {
    setShowPreviewSidebar(false);
    setShowSourcesSidebar(false);
    // 清理相关状态
    setPreviewAttachments([]);
    setCurrentAttachmentId(undefined);
    setCurrentSources([]);
  }, [selectedAgent, selectedConversation]);

  // 获取当前显示的消息
  const messages = useMemo(() => {
    if (selectedConversation) {
      // 如果选中了历史对话，合并历史消息和当前对话的新消息
      const currentMessages =
        conversationHistory[`${selectedAgent}_${selectedConversation}`] || [];
      return [...historicalMessages, ...currentMessages];
    } else {
      // 新对话或未选中历史对话
      return conversationHistory[selectedAgent] || [];
    }
  }, [
    selectedConversation,
    historicalMessages,
    conversationHistory,
    selectedAgent,
  ]);

  // 将UIMessageItem转换为ThreeDDesignArea期望的ChatMessage格式
  const convertToChatMessages = (uiMessages: UIMessageItem[]) => {
    return uiMessages.map((msg) => ({
      type: msg.role === "assistant" ? ("agent" as const) : ("user" as const),
      content: msg.content,
    }));
  };

  // 创建当前聊天状态对象，用于3D设计区域
  const currentChatState = {
    messages: convertToChatMessages(messages),
    uploadedDocuments: uploadedDocuments[selectedAgent] || [],
  };

  // 当智能体切换时，重置状态
  useEffect(() => {
    setStatus("idle");
    abortRef.current?.abort();
    setMessage(""); // 清空消息输入
  }, [selectedAgent]);

  // 首次加载时如果有 initialMessage 则自动发送（仅发送一次）
  const hasAutoSentRef = useRef(false);
  useEffect(() => {
    if (!hasAutoSentRef.current && initialMessage && initialMessage.trim()) {
      hasAutoSentRef.current = true;
      handleSubmit({ text: initialMessage });
    }
  }, [initialMessage]);

  // 当对话历史更新时，通知父组件
  useEffect(() => {
    onConversationHistoryChange?.(conversationHistory);
  }, [conversationHistory, onConversationHistoryChange]);

  async function handleSubmit({
    text,
    files,
  }: {
    text?: string;
    files?: any[];
  }) {
    const prompt = (text || "").trim();
    if (!prompt && (!files || files.length === 0)) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    onRunClick?.();

    // 处理上传的文件 - files 是 FileUIPart[] 类型
    const uploadedFiles: UploadedFile[] = files
      ? await Promise.all(
          files.map(async (file: any) => {
            // 尝试从 blob URL 获取文件大小
            let fileSize = 0;
            if (file.url) {
              try {
                const response = await fetch(file.url);
                const blob = await response.blob();
                fileSize = blob.size;
              } catch (error) {
                console.warn("无法获取文件大小:", error);
              }
            }

            return {
              id: nanoid(),
              name: file.filename || file.name || "未知文件",
              size: fileSize,
              type: file.mediaType || file.type || "application/octet-stream",
            };
          })
        )
      : [];

    const userMessage: UIMessageItem = {
      id: nanoid(),
      role: "user",
      content: prompt || "上传了文件",
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };
    const assistantId = nanoid();
    const assistantMessage: UIMessageItem = {
      id: assistantId,
      role: "assistant",
      content: "",
    };
    // 更新对话历史 - 如果是历史对话则使用特殊的key
    const conversationKey = selectedConversation
      ? `${selectedAgent}_${selectedConversation}`
      : selectedAgent;

    setConversationHistory((prev) => ({
      ...prev,
      [conversationKey]: [
        ...(prev[conversationKey] || []),
        userMessage,
        assistantMessage,
      ],
    }));
    setStatus("submitted");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          files,
          selectedAgent,
          conversationId: selectedConversation || currentConversationId,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("failed");
      setStatus("streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const commit = (update: Partial<UIMessageItem>) => {
        setConversationHistory((prev) => ({
          ...prev,
          [conversationKey]: (prev[conversationKey] || []).map((m) =>
            m.id === assistantId ? { ...m, ...update } : m
          ),
        }));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";
        for (const chunk of chunks) {
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const json = line.replace(/^data: /, "");
            try {
              const evt = JSON.parse(json);
              if (evt.type === "text") {
                setConversationHistory((prev) => ({
                  ...prev,
                  [conversationKey]: (prev[conversationKey] || []).map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: (m.content || "") + (evt.content || ""),
                        }
                      : m
                  ),
                }));
              } else if (
                evt.type === "sources" &&
                typeof evt.count === "number"
              ) {
                commit({
                  sourcesCount: evt.count,
                  sources: evt.sources || [],
                });
              } else if (evt.type === "cot" && Array.isArray(evt.steps)) {
                commit({ cot: { steps: evt.steps } });
              } else if (
                evt.type === "cot_text" &&
                typeof evt.content === "string"
              ) {
                // 流式拼接思考文本
                setConversationHistory((prev) => ({
                  ...prev,
                  [conversationKey]: (prev[conversationKey] || []).map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          cotText: (m.cotText || "") + evt.content,
                        }
                      : m
                  ),
                }));
              } else if (evt.type === "cot_text_done") {
                // 标记深度思考完成
                setConversationHistory((prev) => ({
                  ...prev,
                  [conversationKey]: (prev[conversationKey] || []).map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          cotCompleted: true,
                        }
                      : m
                  ),
                }));
              } else if (
                evt.type === "attachments" &&
                Array.isArray(evt.attachments)
              ) {
                commit({ attachments: evt.attachments });
              } else if (evt.type === "componentOptions" && evt.options) {
                commit({ componentOptions: evt.options });
              } else if (evt.type === "done") {
                // 处理完整的附件内容
                if (evt.attachments && Array.isArray(evt.attachments)) {
                  commit({ attachments: evt.attachments });
                }
                // 处理组件选项
                if (evt.componentOptions) {
                  commit({ componentOptions: evt.componentOptions });
                }
                // 持久化最终思考文本（防止刷新后消失）
                if (evt.cotText) {
                  commit({ cotText: evt.cotText });
                }
                // 处理新的conversationId
                if (
                  evt.conversationId &&
                  !currentConversationId &&
                  !selectedConversation
                ) {
                  setCurrentConversationId(evt.conversationId);
                  onConversationChange?.(evt.conversationId);
                }
              }
            } catch {
              // ignore
            }
          }
        }
      }

      setStatus("idle");
    } catch (e) {
      setStatus("error");
    }
  }

  // 处理3D设计区域的运行按钮点击
  const handleRun = () => {
    if (!message.trim()) return;
    handleSubmit({ text: message });
    setMessage("");
  };

  // 处理文档上传
  const handleDocumentUpload = (files: File[]) => {
    const newDocs = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      format: file.name.split(".").pop()?.toUpperCase() || "FILE",
      size: (file.size / (1024 * 1024)).toFixed(1) + "MB",
    }));

    setUploadedDocuments((prev) => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), ...newDocs],
    }));
  };

  // 移除上传的文档
  const removeUploadedDocument = (id: string) => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [selectedAgent]: (prev[selectedAgent] || []).filter(
        (doc) => doc.id !== id
      ),
    }));
  };

  const agentInfo = {
    "process-analysis": {
      name: "工艺需求分析",
      description:
        "我是工艺需求分析智能体，专门负责分析工艺需求，制定明确的技术规范。",
      icon: "📋",
    },
    "component-selection": {
      name: "组件智能选型",
      description:
        "我是组件智能选型智能体，可以根据您的需求智能推荐和选择最合适的组件。",
      icon: "🔧",
    },
    "3d-design": {
      name: "整线3D设计",
      description: "我是整线3D设计智能体，专注于整体生产线的3D建模和设计工作。",
      icon: "🏭",
    },
    "cost-calculation": {
      name: "部件成本核算",
      description: "我是部件成本核算智能体，可以为您计算和分析各种部件的成本。",
      icon: "💰",
    },
  };

  const getAgentButton = () => {
    switch (selectedAgent) {
      case "process-analysis":
        return (
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50"
            onClick={() =>
              window.open("http://search.thupx.cn/manage/", "_blank")
            }
          >
            <Database className="w-4 h-4 mr-2" />
            工艺知识库管理
          </Button>
        );
      case "cost-calculation":
        return (
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50"
            onClick={() => window.open("http://quote.thupx.cn/", "_blank")}
          >
            <Calculator className="w-4 h-4 mr-2" />
            零部件批量报价
          </Button>
        );
      default:
        return null;
    }
  };

  const currentAgent =
    agentInfo[selectedAgent as keyof typeof agentInfo] ||
    agentInfo["process-analysis"];

  // 处理附件预览
  const handleAttachmentPreview = (
    attachments: MarkdownAttachment[],
    attachmentId?: string
  ) => {
    setPreviewAttachments(attachments);
    setCurrentAttachmentId(attachmentId || attachments[0]?.id);
    // 关闭来源文档侧边栏，显示附件预览侧边栏
    setShowSourcesSidebar(false);
    setShowPreviewSidebar(true);
  };

  // 处理来源文档点击
  const handleSourcesClick = (sources: SourceDocument[]) => {
    setCurrentSources(sources);
    // 关闭附件预览侧边栏，显示来源文档侧边栏
    setShowPreviewSidebar(false);
    setShowSourcesSidebar(true);
  };

  // 处理组件选项点击
  const handleComponentOptionClick = (option: {
    id: string;
    label: string;
    type: "url" | "markdown";
    content: string;
  }) => {
    if (option.type === "url") {
      // 跳转到外部页面
      window.open(option.content, "_blank");
    } else if (option.type === "markdown") {
      // 创建临时附件来显示markdown内容
      const attachment: MarkdownAttachment = {
        id: `${option.id}_${Date.now()}`,
        title: option.label,
        filename: `${option.id}.md`,
        content: option.content,
      };
      handleAttachmentPreview([attachment]);
    }
  };

  // 处理markdown内容保存
  const handleContentSave = (attachmentId: string, newContent: string) => {
    // 更新预览附件的内容
    setPreviewAttachments((prev) =>
      prev.map((att) =>
        att.id === attachmentId ? { ...att, content: newContent } : att
      )
    );

    // 更新对话历史中对应消息的附件内容
    setConversationHistory((prev) => {
      const newHistory = { ...prev };
      const currentKey = selectedConversation
        ? `${selectedAgent}_${selectedConversation}`
        : selectedAgent;

      if (newHistory[currentKey]) {
        newHistory[currentKey] = newHistory[currentKey].map((msg) => {
          if (msg.attachments) {
            return {
              ...msg,
              attachments: msg.attachments.map((att) =>
                att.id === attachmentId ? { ...att, content: newContent } : att
              ),
            };
          }
          return msg;
        });
      }

      return newHistory;
    });

    // 通知父组件对话历史已更新
    onConversationHistoryChange?.(conversationHistory);
  };

  const Empty = useMemo(
    () => <ConversationEmptyState title="" description="" />,
    []
  );

  return (
    <div className="flex-1 flex">
      {selectedAgent === "3d-design" ? (
        <ThreeDDesignArea
          messages={currentChatState.messages}
          onSendMessage={handleRun}
          message={message}
          setMessage={setMessage}
          isRunning={isRunning}
          uploadedDocuments={currentChatState.uploadedDocuments}
          onUploadDocuments={handleDocumentUpload}
          onRemoveDocument={removeUploadedDocument}
          showUploadDialog={showUploadDialog}
          setShowUploadDialog={setShowUploadDialog}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* 智能体简介固定显示区域 */}
          <div className="w-full border-b border-gray-100 backdrop-blur-sm sticky top-0 z-10">
            <div className="p-4 h-16 flex items-center bg-[#eff6ff] justify-between">
              <p className="text-[#1e40af]">{currentAgent.description}</p>
              {getAgentButton()}
            </div>
          </div>

          <Conversation className="w-2/3 mx-auto">
            {messages.length === 0 ? (
              Empty
            ) : (
              <ConversationContent>
                {messages.map((m, i) => (
                  <AIMessage key={m.id} from={m.role}>
                    <MessageContent>
                      {m.role === "assistant" ? (
                        <div className="space-y-2">
                          {typeof m.sourcesCount === "number" && (
                            <Sources>
                              <SourcesTrigger
                                count={m.sourcesCount}
                                onSourcesClick={() =>
                                  handleSourcesClick(m.sources || [])
                                }
                              />
                              {/* <SourcesContent>
                              <Source href="#" title="相关文档示例" />
                            </SourcesContent> */}
                            </Sources>
                          )}
                          {(m.cotText || m.cot) && (
                            <ChainOfThought
                              defaultOpen={true}
                              isCompleted={m.cotCompleted}
                            >
                              <ChainOfThoughtHeader>
                                深度思考
                              </ChainOfThoughtHeader>
                              <ChainOfThoughtContent>
                                {m.cotText ? (
                                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {m.cotText}
                                  </div>
                                ) : (
                                  m.cot?.steps.map((s, i) => (
                                    <ChainOfThoughtStep
                                      key={i}
                                      label={s.label}
                                      status={s.status}
                                    />
                                  ))
                                )}
                              </ChainOfThoughtContent>
                            </ChainOfThought>
                          )}
                          {!m.content &&
                          status === "submitted" &&
                          i === messages.length - 1 ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader size={16} />
                            </div>
                          ) : (
                            <Response>{m.content}</Response>
                          )}
                          {m.attachments && m.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                附件 ({m.attachments.length})
                              </h4>
                              <div className="grid gap-2">
                                {m.attachments.map((attachment) => (
                                  <button
                                    key={attachment.id}
                                    onClick={() =>
                                      handleAttachmentPreview(
                                        m.attachments!,
                                        attachment.id
                                      )
                                    }
                                    className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
                                  >
                                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.title}
                                      </p>
                                      <p className="text-xs text-gray-500 truncate">
                                        {attachment.filename}
                                      </p>
                                    </div>
                                    <EyeIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* 组件智能选型的可交互选项 */}
                          {selectedAgent === "component-selection" &&
                            m.componentOptions &&
                            m.componentOptions.options && (
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm">🤖</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {m.componentOptions.message ||
                                      "已为您找到匹配的方案。需要为您展示详情吗？"}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {m.componentOptions.options.map((option) => {
                                    // 动态获取图标组件
                                    const getIconComponent = (
                                      iconName: string
                                    ) => {
                                      switch (iconName) {
                                        case "Box":
                                          return <Box className="w-4 h-4" />;
                                        case "Settings":
                                          return (
                                            <Settings className="w-4 h-4" />
                                          );
                                        case "FileCheck":
                                          return (
                                            <FileCheck className="w-4 h-4" />
                                          );
                                        default:
                                          return (
                                            <FileText className="w-4 h-4" />
                                          );
                                      }
                                    };

                                    return (
                                      <Button
                                        key={option.id}
                                        size="sm"
                                        onClick={() =>
                                          handleComponentOptionClick(option)
                                        }
                                        className="flex items-center gap-2 justify-start h-10 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                                      >
                                        {getIconComponent(option.icon)}
                                        {option.label}
                                      </Button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Response>{m.content}</Response>
                          {/* 显示用户上传的文件 */}
                          {m.uploadedFiles && m.uploadedFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <div className="grid gap-2">
                                {m.uploadedFiles.map((file) => {
                                  const FileIcon = getFileIcon(file.name || "");
                                  const fileSizeText =
                                    file.size < 1024 * 1024
                                      ? `${(file.size / 1024).toFixed(1)} KB`
                                      : `${(file.size / (1024 * 1024)).toFixed(
                                          1
                                        )} MB`;

                                  return (
                                    <div
                                      key={file.id}
                                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                    >
                                      <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {getDisplayName(
                                            file.name || "未知文件"
                                          )}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {fileSizeText}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </MessageContent>
                  </AIMessage>
                ))}
              </ConversationContent>
            )}
            <ConversationScrollButton />
          </Conversation>

          <div className="w-2/3 mx-auto">
            <PromptInput
              className="divide-y-0 border-none shadow-none"
              onSubmit={({ text, files }) => handleSubmit({ text, files })}
            >
              <PromptInputBody>
                <CustomFileAttachments>
                  {(file) => <CustomFileAttachment data={file} />}
                </CustomFileAttachments>
                <PromptInputTextarea
                  placeholder={
                    selectedConversation
                      ? "继续这个对话..."
                      : "请输入您的设计需求或问题..."
                  }
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-1">
                    <DirectUploadButton />
                    <PromptInputActionMenu>
                      {/* <PromptInputActionMenuTrigger aria-label="更多操作" /> */}
                      <PromptInputActionMenuContent>
                        <PromptInputActionAddAttachments label="添加文件" />
                      </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                  </div>
                  <PromptInputSubmit
                    status={
                      status === "submitted"
                        ? "submitted"
                        : status === "streaming"
                        ? "streaming"
                        : status === "error"
                        ? "error"
                        : undefined
                    }
                    style={{ width: "90px", margin: "6px" }}
                  >
                    {<SendIcon className="size-4" />}
                    运行
                  </PromptInputSubmit>
                </div>
              </PromptInputBody>
            </PromptInput>
          </div>
        </div>
      )}

      {/* Markdown预览侧栏 */}
      <MarkdownPreviewSidebar
        isOpen={showPreviewSidebar}
        onClose={() => {
          setShowPreviewSidebar(false);
          // 清理预览状态
          setPreviewAttachments([]);
          setCurrentAttachmentId(undefined);
        }}
        attachments={previewAttachments}
        currentAttachmentId={currentAttachmentId}
        onAttachmentChange={setCurrentAttachmentId}
        onContentSave={handleContentSave}
      />

      {/* 来源文档侧栏 */}
      <SourcesSidebar
        isOpen={showSourcesSidebar}
        onClose={() => {
          setShowSourcesSidebar(false);
          // 清理来源文档状态
          setCurrentSources([]);
        }}
        sources={currentSources}
      />
    </div>
  );
}
