import { NextRequest } from "next/server";

export const runtime = "edge";

// 扩展消息模型以支持完整内容
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  // 助手消息的额外信息
  sourcesCount?: number;
  sources?: Array<{
    id: string;
    title: string;
    content: string;
    fileType: string;
    url?: string;
    preview?: string;
    metadata?: any;
  }>;
  attachments?: Array<{
    id: string;
    title: string;
    filename: string;
    content?: string;
  }>;
  cot?: {
    steps: Array<{
      label: string;
      status: 'complete' | 'active' | 'pending';
    }>;
  };
}

// 模拟数据库存储 - 在实际项目中应该使用真实的数据库
let chatHistory: Record<string, Array<{
  id: string;
  title: string;
  messages: Array<ChatMessage>;
  createdAt: string;
  updatedAt: string;
}>> = {
  'process-analysis': [
    {
      id: 'conv_demo_1',
      title: 'XXX工艺需求分析分析',
      messages: [
        { 
          id: 'msg_1', 
          role: 'user', 
          content: '请帮我分析这个工艺需求', 
          timestamp: new Date(Date.now() - 3600000).toISOString() 
        },
        { 
          id: 'msg_2', 
          role: 'assistant', 
          content: '您好，我是工艺需求分析智能体。我已收到您的消息："请帮我分析这个工艺需求"。\n\n基于您的需求，我将为您提供以下分析：\n\n1. 工艺流程分析和优化建议\n2. 技术规范和质量标准制定\n3. 关键控制点识别和监控方案\n\n我已经为您完成了《工艺需求分析文档》以及《待确认问题清单》的编写。请查阅附件', 
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          sourcesCount: 3,
          sources: [
            {
              id: "doc-1",
              title: "工艺流程设计规范 GB/T 19001-2016",
              content: "本标准规定了工艺流程设计的基本要求、设计原则和技术规范...",
              fileType: "pdf",
              url: "https://example.com/docs/gb19001-2016.pdf",
              preview: "本标准规定了工艺流程设计的基本要求、设计原则和技术规范。适用于各类制造业的工艺流程设计工作，包括但不限于机械加工、化工生产、食品加工等行业。"
            }
          ],
          attachments: [
            {
              id: "attachment-1",
              title: "工艺需求分析报告",
              filename: "process_analysis_report.md",
              content: `# 工艺需求分析报告\n\n## 项目概述\n本报告基于您提供的需求，对工艺流程进行了详细分析。\n\n## 关键技术要求\n1. **温度控制**：±2°C精度\n2. **压力范围**：0.1-1.0 MPa\n3. **流量控制**：精度±1%`
            }
          ],
          cot: {
            steps: [
              { label: "正在分析上传的工艺文档，提取关键技术要求和规范标准...", status: "complete" },
              { label: "识别工艺流程中的关键控制点和质量要求...", status: "complete" },
              { label: "生成标准化的工艺需求分析文档和问题清单...", status: "complete" }
            ]
          }
        }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: 'conv_demo_2', 
      title: 'XXX工艺需求分析分析',
      messages: [
        { id: 'msg_3', role: 'user', content: '这个生产线的关键控制点在哪里？', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 'msg_4', role: 'assistant', content: '根据您的工艺流程，关键控制点主要包括...', timestamp: new Date(Date.now() - 7100000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7100000).toISOString()
    }
  ],
  'component-selection': [
    {
      id: 'conv_demo_3',
      title: 'XXX工艺需求分析分析',
      messages: [
        { id: 'msg_5', role: 'user', content: '推荐一些适合的PLC控制器', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: 'msg_6', role: 'assistant', content: '基于您的需求，我推荐以下PLC控制器...', timestamp: new Date(Date.now() - 1700000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1700000).toISOString()
    }
  ],
  'cost-calculation': [
    {
      id: 'conv_demo_4',
      title: 'XXX工艺需求分析分析',
      messages: [
        { id: 'msg_7', role: 'user', content: '计算整套设备的成本', timestamp: new Date(Date.now() - 5400000).toISOString() },
        { id: 'msg_8', role: 'assistant', content: '根据您提供的设备清单，总成本约为...', timestamp: new Date(Date.now() - 5300000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      updatedAt: new Date(Date.now() - 5300000).toISOString()
    }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get('agent');
  
  if (!agent) {
    return Response.json({ error: 'Agent parameter is required' }, { status: 400 });
  }
  
  const history = chatHistory[agent] || [];
  return Response.json({ history });
}

export async function POST(req: NextRequest) {
  const { message, selectedAgent, conversationId } = await req.json().catch(() => ({ message: "", selectedAgent: "", conversationId: null }));
  
  // 生成对话标题（取用户消息的前20个字符）
  const conversationTitle = message ? message.substring(0, 20) + (message.length > 20 ? '...' : '') : '新对话';
  
  // 如果没有提供conversationId，创建新对话
  let currentConversationId = conversationId;
  if (!currentConversationId) {
    currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建新的对话记录
    if (!chatHistory[selectedAgent]) {
      chatHistory[selectedAgent] = [];
    }
    
    chatHistory[selectedAgent].push({
      id: currentConversationId,
      title: conversationTitle,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // 收集完整的消息信息用于保存
      let assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      // Helper to send SSE data chunks
      const send = async (data: unknown) => {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        controller.enqueue(encoder.encode(`data: ${text}\n\n`));
        // small delay to emulate streaming
        await new Promise((r) => setTimeout(r, Math.random() * 1000));
      };

      // Optional: initial role/metadata with agent info
      await send({ type: "meta", role: "assistant", agent: selectedAgent });

      // Example: include chain-of-thought like structured steps for UI presentation
      await send({
        type: "cot",
        steps: [{ label: "解析用户意图", status: "active" }],
      });

      // 根据不同智能体定制步骤
      const agentSteps = {
        "process-analysis": [
          "正在分析上传的工艺文档，提取关键技术要求和规范标准...",
          "识别工艺流程中的关键控制点和质量要求...",
          "生成标准化的工艺需求分析文档和问题清单...",
        ],
        "component-selection": [
          "正在分析组件需求和技术规格...",
          "匹配合适的组件供应商和产品型号...",
          "生成组件选型建议和对比分析...",
        ],
        "3d-design": [
          "正在构建3D模型基础框架...",
          "优化设备布局和空间配置...",
          "生成完整的3D设计方案...",
        ],
        "cost-calculation": [
          "正在收集组件价格和成本数据...",
          "计算制造和安装成本...",
          "生成详细的成本分析报告...",
        ]
      };
      
      const steps = agentSteps[selectedAgent as keyof typeof agentSteps] || agentSteps["process-analysis"];

      await send({
        type: "cot",
        steps: [
          { label: steps[0], status: "active" },
        ]
      });

      await send({
        type: "cot",
        steps: [
          { label: steps[0], status: "complete" },
          { label: steps[1], status: "active" },
        ],
      });

      await send({
        type: "cot",
        steps: [
          { label: steps[0], status: "complete" },
          { label: steps[1], status: "complete" },
          { label: steps[2], status: "active" },
        ],
      });

      const finalCoTSteps = [
        { label: steps[0], status: "complete" as const },
        { label: steps[1], status: "complete" as const },
        { label: steps[2], status: "complete" as const },
      ];
      
      await send({
        type: "cot",
        steps: finalCoTSteps,
      });
      
      // 保存CoT到assistantMessage
      assistantMessage.cot = { steps: finalCoTSteps };

      // 根据智能体定制回复内容
      const agentResponses = {
        "process-analysis": [
          `您好，我是工艺需求分析智能体。我已收到您的消息："${message || "(空)"}"。\n\n`,
          "基于您的需求，我将为您提供以下分析：\n\n",
          "1. 工艺流程分析和优化建议\n",
          "2. 技术规范和质量标准制定\n",
          "3. 关键控制点识别和监控方案\n",
          "我已经为您完成了《工艺需求分析文档》以及《待确认问题清单》的编写。请查阅附件"
        ],
        "component-selection": [
          `您好，我是组件智能选型助手。我已收到您的消息："${message || "(空)"}"。\n\n`,
          "我将为您提供专业的组件选型服务：\n\n",
          "1. 智能匹配最适合的组件型号\n",
          "2. 供应商对比和价格分析\n",
          "3. 技术参数验证和兼容性检查\n",
        ],
        "3d-design": [
          `您好，我是整线3D设计专家。我已收到您的消息："${message || "(空)"}"。\n\n`,
          "我将为您创建专业的3D设计方案：\n\n",
          "1. 完整的生产线3D建模\n",
          "2. 设备布局优化和空间规划\n",
          "3. 可视化效果图和技术图纸\n",
        ],
        "cost-calculation": [
          `您好，我是部件成本核算专家。我已收到您的消息："${message || "(空)"}"。\n\n`,
          "我将为您提供精确的成本分析：\n\n",
          "1. 详细的部件成本清单\n",
          "2. 制造和安装费用估算\n",
          "3. 投资回报率和成本优化建议\n",
        ]
      };
      
      const chunks = agentResponses[selectedAgent as keyof typeof agentResponses] || agentResponses["process-analysis"];

      for (const part of chunks) {
        await send({ type: "text", content: part });
        // 累积内容到assistantMessage
        assistantMessage.content += part;
      }

      // 根据不同智能体提供相关的文档引用
      const agentSources = {
        "process-analysis": [
          {
            id: "doc-1",
            title: "工艺流程设计规范 GB/T 19001-2016",
            content: "本标准规定了工艺流程设计的基本要求、设计原则和技术规范...",
            fileType: "pdf",
            url: "https://example.com/docs/gb19001-2016.pdf",
            preview: "本标准规定了工艺流程设计的基本要求、设计原则和技术规范。适用于各类制造业的工艺流程设计工作，包括但不限于机械加工、化工生产、食品加工等行业。",
            metadata: {
              size: "2.3 MB",
              lastModified: "2024-01-15",
              author: "国家标准化管理委员会"
            }
          },
          {
            id: "doc-2", 
            title: "智能制造系统架构参考模型",
            content: "智能制造系统架构包含设备层、控制层、管理层和企业层...",
            fileType: "doc",
            url: "https://example.com/docs/smart-manufacturing.docx",
            preview: "智能制造系统架构包含设备层、控制层、管理层和企业层四个层次。设备层负责数据采集和执行控制指令，控制层实现实时控制和优化...",
            metadata: {
              size: "1.8 MB",
              lastModified: "2024-02-20",
              author: "工信部智能制造专家委员会"
            }
          },
          {
            id: "doc-3",
            title: "质量管理体系要求 ISO 9001:2015",
            content: "质量管理体系的建立应基于过程方法和风险思维...",
            fileType: "pdf",
            url: "https://example.com/docs/iso9001-2015.pdf", 
            preview: "质量管理体系的建立应基于过程方法和风险思维。组织应确定质量管理体系所需的过程及其在整个组织中的应用...",
            metadata: {
              size: "3.1 MB",
              lastModified: "2023-12-10",
              author: "国际标准化组织"
            }
          }
        ],
        "component-selection": [
          {
            id: "comp-1",
            title: "工业自动化组件选型指南",
            content: "组件选型应考虑技术参数、环境条件、成本效益等因素...",
            fileType: "md",
            url: "https://example.com/docs/component-guide.md",
            preview: "组件选型应考虑技术参数、环境条件、成本效益等因素。首先需要明确应用场景和技术要求，然后对比不同供应商的产品规格...",
            metadata: {
              size: "856 KB",
              lastModified: "2024-03-05",
              author: "自动化工程师协会"
            }
          },
          {
            id: "comp-2",
            title: "PLC产品技术规格书",
            content: "可编程逻辑控制器技术参数和应用说明...",
            fileType: "pdf",
            url: "https://example.com/docs/plc-specs.pdf",
            preview: "可编程逻辑控制器技术参数和应用说明。包括CPU性能、I/O配置、通信接口、编程环境等详细技术指标...",
            metadata: {
              size: "4.2 MB", 
              lastModified: "2024-01-28",
              author: "西门子自动化"
            }
          }
        ],
        "3d-design": [
          {
            id: "design-1",
            title: "工厂布局设计标准 JB/T 9009-2016",
            content: "工厂布局设计应遵循安全、高效、经济的原则...",
            fileType: "pdf",
            url: "https://example.com/docs/factory-layout.pdf",
            preview: "工厂布局设计应遵循安全、高效、经济的原则。合理规划生产区域、辅助区域和管理区域的空间配置...",
            metadata: {
              size: "2.7 MB",
              lastModified: "2023-11-15", 
              author: "机械工业标准化技术委员会"
            }
          },
          {
            id: "design-2",
            title: "3D建模最佳实践指南",
            content: "三维建模的流程、方法和质量控制要点...",
            fileType: "doc",
            url: "https://example.com/docs/3d-modeling-guide.docx",
            preview: "三维建模的流程、方法和质量控制要点。包括建模准备、几何建模、装配建模、渲染输出等各个环节的技术要求...",
            metadata: {
              size: "1.5 MB",
              lastModified: "2024-02-12",
              author: "CAD设计师联盟"
            }
          }
        ],
        "cost-calculation": [
          {
            id: "cost-1",
            title: "制造成本核算方法与实务",
            content: "制造成本包括直接材料、直接人工和制造费用...",
            fileType: "pdf",
            url: "https://example.com/docs/cost-accounting.pdf",
            preview: "制造成本包括直接材料、直接人工和制造费用三个基本要素。成本核算应采用科学的分配方法和计算标准...",
            metadata: {
              size: "3.8 MB",
              lastModified: "2024-01-08",
              author: "财务管理研究院"
            }
          },
          {
            id: "cost-2",
            title: "设备投资回报率分析模型",
            content: "ROI计算模型和投资决策分析方法...",
            fileType: "txt",
            url: "https://example.com/docs/roi-analysis.txt",
            preview: "ROI计算模型和投资决策分析方法。通过净现值、内部收益率等财务指标评估设备投资的经济效益...",
            metadata: {
              size: "245 KB",
              lastModified: "2023-12-22",
              author: "投资分析专家组"
            }
          },
          {
            id: "cost-3",
            title: "供应链成本优化策略",
            content: "供应链各环节的成本控制和优化方法...",
            fileType: "image",
            url: "https://example.com/docs/supply-chain.png",
            preview: "供应链各环节的成本控制和优化方法。包括采购成本、库存成本、运输成本和管理成本的综合优化策略...",
            metadata: {
              size: "1.2 MB",
              lastModified: "2024-02-28",
              author: "供应链管理协会"
            }
          }
        ]
      };

      const sources = agentSources[selectedAgent as keyof typeof agentSources] || agentSources["process-analysis"];
      
      // 发送文档引用信息并保存到assistantMessage
      await send({ 
        type: "sources", 
        count: sources.length,
        sources: sources
      });
      assistantMessage.sourcesCount = sources.length;
      assistantMessage.sources = sources;

      // 发送markdown附件
      const attachments = [
        {
          id: "attachment-1",
          title: "工艺需求分析报告",
          filename: "process_analysis_report.md",
          content: `# 工艺需求分析报告

## 项目概述
本报告基于您提供的需求，对工艺流程进行了详细分析。

## 关键技术要求
1. **温度控制**：±2°C精度
2. **压力范围**：0.1-1.0 MPa
3. **流量控制**：精度±1%

## 质量标准
- ISO 9001:2015 质量管理体系
- 产品合格率 ≥99.5%
- 设备利用率 ≥85%

## 建议方案
基于以上分析，建议采用以下技术方案...`
        },
        {
          id: "attachment-2", 
          title: "设备配置清单",
          filename: "equipment_list.md",
          content: `# 设备配置清单

## 主要设备
| 设备名称 | 型号 | 数量 | 单价(万元) |
|---------|------|------|-----------|
| 控制器 | PLC-2000 | 2 | 15.5 |
| 传感器 | TS-100 | 8 | 2.3 |
| 执行器 | AC-500 | 4 | 8.7 |

## 辅助设备
- 配电柜：1套
- 操作台：1套
- 监控系统：1套

## 总投资估算
设备总价：约126万元`
        }
      ];

      await send({ 
        type: "attachments", 
        attachments: attachments.map(att => ({
          id: att.id,
          title: att.title,
          filename: att.filename
        }))
      });
      // 保存完整的attachments到assistantMessage
      assistantMessage.attachments = attachments;

      // 保存消息到历史记录
      const conversation = chatHistory[selectedAgent]?.find(conv => conv.id === currentConversationId);
      if (conversation) {
        // 添加用户消息
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };
        conversation.messages.push(userMessage);
        
        // 添加完整的助手消息
        conversation.messages.push(assistantMessage);
        
        conversation.updatedAt = new Date().toISOString();
      }

      // End of stream - 包含conversationId
      await send({ type: "done", attachments, conversationId: currentConversationId });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Allow CORS for local dev if needed
      "Access-Control-Allow-Origin": "*",
    },
  });
}
