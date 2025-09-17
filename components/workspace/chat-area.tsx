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
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
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
import { Calculator, Database, SendIcon, FileText, EyeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MarkdownPreviewSidebar } from "./markdown-preview-sidebar";
import { SourcesSidebar } from "./sources-sidebar";

// Keep props compatible
interface ChatAreaProps {
  selectedAgent: string;
  onRunClick: () => void;
  showProcessSidebar: boolean;
  onConversationHistoryChange?: (history: Record<string, UIMessageItem[]>) => void;
}

type Role = "user" | "assistant";

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
  fileType: 'pdf' | 'doc' | 'txt' | 'md' | 'image' | 'video' | 'other';
  url?: string;
  preview?: string;
  metadata?: {
    size?: string;
    lastModified?: string;
    author?: string;
  };
}

interface UIMessageItem {
  id: string;
  role: Role;
  content: string;
  sourcesCount?: number;
  sources?: SourceDocument[];
  attachments?: MarkdownAttachment[];
  cot?: {
    steps: { label: string; status: "complete" | "active" | "pending" }[];
  };
}

export function ChatArea({ selectedAgent, onRunClick, onConversationHistoryChange }: ChatAreaProps) {
  // 为每个智能体维护独立的对话历史
  const [conversationHistory, setConversationHistory] = useState<Record<string, UIMessageItem[]>>({});
  const [status, setStatus] = useState<
    "idle" | "submitted" | "streaming" | "error"
  >("idle");
  const abortRef = useRef<AbortController | null>(null);

  // 侧栏预览状态
  const [showPreviewSidebar, setShowPreviewSidebar] = useState(false);
  const [previewAttachments, setPreviewAttachments] = useState<MarkdownAttachment[]>([]);
  const [currentAttachmentId, setCurrentAttachmentId] = useState<string>();

  // 来源文档侧栏状态
  const [showSourcesSidebar, setShowSourcesSidebar] = useState(false);
  const [currentSources, setCurrentSources] = useState<SourceDocument[]>([]);

  // 获取当前智能体的消息
  const messages = conversationHistory[selectedAgent] || [];

  // 当智能体切换时，重置状态
  useEffect(() => {
    setStatus("idle");
    abortRef.current?.abort();
  }, [selectedAgent]);

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
    if (!prompt) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    onRunClick?.();

    const userMessage: UIMessageItem = {
      id: nanoid(),
      role: "user",
      content: prompt,
    };
    const assistantId = nanoid();
    const assistantMessage: UIMessageItem = {
      id: assistantId,
      role: "assistant",
      content: "",
    };
    // 更新当前智能体的对话历史
    setConversationHistory((prev) => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), userMessage, assistantMessage]
    }));
    setStatus("submitted");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, files, selectedAgent }),
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
          [selectedAgent]: (prev[selectedAgent] || []).map((m) =>
            m.id === assistantId ? { ...m, ...update } : m
          )
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
                  [selectedAgent]: (prev[selectedAgent] || []).map((m) =>
                    m.id === assistantId
                      ? {
                        ...m,
                        content: (m.content || "") + (evt.content || ""),
                      }
                      : m
                  )
                }));
              } else if (
                evt.type === "sources" &&
                typeof evt.count === "number"
              ) {
                commit({
                  sourcesCount: evt.count,
                  sources: evt.sources || []
                });
              } else if (evt.type === "cot" && Array.isArray(evt.steps)) {
                commit({ cot: { steps: evt.steps } });
              } else if (evt.type === "attachments" && Array.isArray(evt.attachments)) {
                commit({ attachments: evt.attachments });
              } else if (evt.type === "done") {
                // 处理完整的附件内容
                if (evt.attachments && Array.isArray(evt.attachments)) {
                  commit({ attachments: evt.attachments });
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

  const agentInfo = {
    "process-analysis": {
      name: "工艺需求分析",
      description: "我是工艺需求分析智能体，专门负责分析工艺需求，制定明确的技术规范。",
      icon: "📋"
    },
    "component-selection": {
      name: "组件智能选型",
      description: "我是组件智能选型智能体，可以根据您的需求智能推荐和选择最合适的组件。",
      icon: "🔧"
    },
    "3d-design": {
      name: "整线3D设计",
      description: "我是整线3D设计智能体，专注于整体生产线的3D建模和设计工作。",
      icon: "🏭"
    },
    "cost-calculation": {
      name: "部件成本核算",
      description: "我是部件成本核算智能体，可以为您计算和分析各种部件的成本。",
      icon: "💰"
    },
  }

  const getAgentButton = () => {
    switch (selectedAgent) {
      case "process-analysis":
        return (
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50" onClick={() => window.open("http://search.thupx.cn/manage/", "_blank")}>
            <Database className="w-4 h-4 mr-2" />
            工艺知识库管理
          </Button>
        )
      case "cost-calculation":
        return (
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50" onClick={() => window.open("http://quote.thupx.cn/", "_blank")}>
            <Calculator className="w-4 h-4 mr-2" />
            零部件批量报价
          </Button>
        )
      default:
        return null
    }
  }

  const currentAgent = agentInfo[selectedAgent as keyof typeof agentInfo] || agentInfo["process-analysis"];

  // 处理附件预览
  const handleAttachmentPreview = (attachments: MarkdownAttachment[], attachmentId?: string) => {
    setPreviewAttachments(attachments);
    setCurrentAttachmentId(attachmentId || attachments[0]?.id);
    setShowPreviewSidebar(true);
  };

  // 处理来源文档点击
  const handleSourcesClick = (sources: SourceDocument[]) => {
    setCurrentSources(sources);
    setShowSourcesSidebar(true);
  };

  const Empty = useMemo(
    () => <ConversationEmptyState title="" description="" />,
    []
  );

  return (
    <div className="flex-1 flex">
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
              {messages.map((m) => (
                <AIMessage key={m.id} from={m.role}>
                  <MessageContent>
                    {m.role === "assistant" ? (
                      <div className="space-y-2">
                        {typeof m.sourcesCount === "number" && (
                          <Sources>
                            <SourcesTrigger
                              count={m.sourcesCount}
                              onSourcesClick={() => handleSourcesClick(m.sources || [])}
                            />
                            {/* <SourcesContent>
                              <Source href="#" title="相关文档示例" />
                            </SourcesContent> */}
                          </Sources>
                        )}
                        {m.cot && (
                          <ChainOfThought defaultOpen={true}>
                            <ChainOfThoughtHeader>
                              深度思考
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              {m.cot.steps.map((s, i) => (
                                <ChainOfThoughtStep
                                  key={i}
                                  label={s.label}
                                  status={s.status}
                                />
                              ))}
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        )}
                        <Response>{m.content}</Response>
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">附件 ({m.attachments.length})</h4>
                            <div className="grid gap-2">
                              {m.attachments.map((attachment) => (
                                <button
                                  key={attachment.id}
                                  onClick={() => handleAttachmentPreview(m.attachments!, attachment.id)}
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
                      </div>
                    ) : (
                      <Response>{m.content}</Response>
                    )}
                  </MessageContent>
                </AIMessage>
              ))}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>

        <div className="w-2/3 mx-auto">
          <PromptInput className="divide-y-0 border-none shadow-none"
            onSubmit={({ text, files }) => handleSubmit({ text, files })}
          >
            <PromptInputBody>
              <PromptInputAttachments>
                {(file) => <PromptInputAttachment data={file} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                placeholder="请输入您的设计需求或问题..."
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-1">
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger aria-label="更多操作" />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
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
                  style={{ width: "90px" , margin: "6px" }}
                >
                  {<SendIcon className="size-4" />}
                  运行
                </PromptInputSubmit>
              </div>
            </PromptInputBody>
          </PromptInput>
        </div>
      </div>

      {/* Markdown预览侧栏 */}
      <MarkdownPreviewSidebar
        isOpen={showPreviewSidebar}
        onClose={() => setShowPreviewSidebar(false)}
        attachments={previewAttachments}
        currentAttachmentId={currentAttachmentId}
        onAttachmentChange={setCurrentAttachmentId}
      />

      {/* 来源文档侧栏 */}
      <SourcesSidebar
        isOpen={showSourcesSidebar}
        onClose={() => setShowSourcesSidebar(false)}
        sources={currentSources}
      />
    </div>
  );
}
