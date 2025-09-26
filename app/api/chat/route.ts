import { NextRequest } from "next/server";

export const runtime = "edge";

// 扩展消息模型以支持完整内容
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  // 用户消息的上传文件
  uploadedFiles?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
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
      status: "complete" | "active" | "pending";
    }>;
  };
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
  // 后端思考过程（整段文本）
  cotText?: string;
}

// 模拟数据库存储 - 在实际项目中应该使用真实的数据库
let chatHistory: Record<
  string,
  Array<{
    id: string;
    title: string;
    messages: Array<ChatMessage>;
    createdAt: string;
    updatedAt: string;
  }>
> = {
  "process-analysis": [],
  "component-selection": [
    {
      id: "conv_demo_3",
      title: "行星轮移动分料工位选型",
      messages: [
        {
          id: "msg_5",
          role: "user",
          content:
            "我需要一个行星轮移动分料工位，处理能力要求800件/小时，定位精度±0.1mm",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          uploadedFiles: [
            {
              id: "file_demo_1",
              name: "工艺需求规格书.pdf",
              size: 2048576,
              type: "application/pdf",
            },
            {
              id: "file_demo_2", 
              name: "现场图片.jpg",
              size: 1024000,
              type: "image/jpeg",
            },
          ],
        },
        {
          id: "msg_6",
          role: "assistant",
          content:
            '您好，我是组件智能选型助手。我已收到您的消息："我需要一个行星轮移动分料工位，处理能力要求800件/小时，定位精度±0.1mm"。\n\n我将为您提供专业的组件选型服务：\n\n1. 智能匹配最适合的组件型号\n2. 供应商对比和价格分析\n3. 技术参数验证和兼容性检查\n',
          timestamp: new Date(Date.now() - 1700000).toISOString(),
          sourcesCount: 2,
          sources: [
            {
              id: "comp-1",
              title: "工业自动化组件选型指南",
              content: "组件选型应考虑技术参数、环境条件、成本效益等因素...",
              fileType: "md",
              url: "https://example.com/docs/component-guide.md",
              preview:
                "组件选型应考虑技术参数、环境条件、成本效益等因素。首先需要明确应用场景和技术要求，然后对比不同供应商的产品规格...",
              metadata: {
                size: "856 KB",
                lastModified: "2024-03-05",
                author: "自动化工程师协会",
              },
            },
            {
              id: "comp-2",
              title: "PLC产品技术规格书",
              content: "可编程逻辑控制器技术参数和应用说明...",
              fileType: "pdf",
              url: "https://example.com/docs/plc-specs.pdf",
              preview:
                "可编程逻辑控制器技术参数和应用说明。包括CPU性能、I/O配置、通信接口、编程环境等详细技术指标...",
              metadata: {
                size: "4.2 MB",
                lastModified: "2024-01-28",
                author: "西门子自动化",
              },
            },
          ],
          componentOptions: {
            message:
              "已为您找到匹配的方案。推荐行星轮移动分料工位带求。需要为您展示详情吗？",
            options: [
              {
                id: "3d-model",
                label: "查看3D模型",
                icon: "Box",
                type: "url",
                content: "https://models.example.com/planetary-gear-system",
              },
              {
                id: "parameters",
                label: "查看相关参数",
                icon: "Settings",
                type: "markdown",
                content: `# 行星轮移动分料工位技术参数

## 基本参数
- **型号**: PGS-2000
- **功率**: 5.5kW
- **转速**: 0-60 rpm (可调)
- **扭矩**: 1500 N·m
- **减速比**: 1:50

## 技术规格
### 机械参数
- 承载能力: 2000kg
- 定位精度: ±0.1mm
- 重复定位精度: ±0.05mm
- 工作温度: -10°C ~ +60°C
- 防护等级: IP65

### 电气参数
- 供电电压: AC 380V ±10%
- 控制电压: DC 24V
- 功率消耗: 6.5kW (最大)
- 通信接口: Profinet, Ethernet/IP

## 工艺能力
- 分料精度: ±2%
- 处理能力: 500-1200件/小时
- 适用物料: 直径10-80mm圆形零件
- 物料重量: 单件≤5kg

## 安全特性
- 急停按钮: 符合ISO 13850标准
- 安全光栅: 4级安全等级
- 故障诊断: 自动检测与报警
- 维护提醒: 智能预测性维护`,
              },
              {
                id: "design",
                label: "查看设计方案",
                icon: "FileCheck",
                type: "markdown",
                content: `# 行星轮移动分料工位设计方案

## 设计概述
本方案采用行星轮传动系统，实现高精度、高效率的物料分料作业。系统集成了先进的伺服控制技术和智能传感器，确保稳定可靠的工作性能。

## 系统架构
### 机械结构
1. **行星轮减速器**
   - 采用三级行星轮结构
   - 输出扭矩大，运行平稳
   - 噪音低于70dB

2. **移动平台**
   - 直线导轨系统
   - 伺服电机驱动
   - 行程可达2000mm

3. **分料机构**
   - 气动夹具设计
   - 快速响应时间<0.2s
   - 夹持力可调范围50-200N

### 控制系统
1. **主控制器**: 西门子S7-1500 PLC
2. **人机界面**: 10寸彩色触摸屏
3. **安全系统**: 符合CE安全标准
4. **通信网络**: 工业以太网架构

## 工艺流程
1. 物料输送至待分料位置
2. 传感器检测物料规格
3. 系统自动选择分料策略
4. 执行分料动作
5. 质量检测与反馈
6. 完成品输出

## 技术优势
- **高精度**: 定位精度达±0.1mm
- **高效率**: 处理能力提升30%
- **智能化**: 自适应控制算法
- **易维护**: 模块化设计，便于维修

## 投资回报
- 设备投资: 约85万元
- 年节省人工: 2-3人
- 投资回收期: 18-24个月
- 预期使用寿命: 10年以上`,
              },
            ],
          },
        },
      ],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1700000).toISOString(),
    },
  ],
  "cost-calculation": [
    {
      id: "conv_demo_cost_1",
      title: "生产线部件成本分析",
      messages: [
        {
          id: "msg_cost_1",
          role: "user",
          content: "请帮我分析这条生产线的各个部件成本，我上传了BOM清单和供应商报价单",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          uploadedFiles: [
            {
              id: "file_cost_1",
              name: "BOM清单_V2.1.xlsx",
              size: 512000,
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            {
              id: "file_cost_2",
              name: "供应商报价单.pdf",
              size: 1536000,
              type: "application/pdf",
            },
          ],
        },
        {
          id: "msg_cost_2",
          role: "assistant",
          content: "您好，我是部件成本核算助手。我已收到您上传的BOM清单和供应商报价单，正在为您分析生产线各部件的成本构成。\n\n基于您提供的文件，我将从以下几个维度进行成本分析：\n\n1. **直接材料成本**：根据BOM清单计算原材料成本\n2. **供应商对比**：分析不同供应商的报价差异\n3. **成本构成分析**：识别主要成本驱动因素\n4. **优化建议**：提供降本增效的具体方案\n\n正在处理您的文件数据...",
          timestamp: new Date(Date.now() - 3500000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3500000).toISOString(),
    },
  ],
  };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agent = searchParams.get("agent");

  if (!agent) {
    return Response.json(
      { error: "Agent parameter is required" },
      { status: 400 }
    );
  }

  const history = chatHistory[agent] || [];
  return Response.json({ history });
}

export async function POST(req: NextRequest) {
  const { message, selectedAgent, conversationId, files } = await req
    .json()
    .catch(() => ({ message: "", selectedAgent: "", conversationId: null, files: [] }));

  // 生成对话标题（取用户消息的前20个字符）
  const conversationTitle = message
    ? message.substring(0, 20) + (message.length > 20 ? "..." : "")
    : "新对话";

  // 如果没有提供conversationId，创建新对话
  let currentConversationId = conversationId;
  if (!currentConversationId) {
    currentConversationId = `conv_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 创建新的对话记录
    if (!chatHistory[selectedAgent]) {
      chatHistory[selectedAgent] = [];
    }

    chatHistory[selectedAgent].push({
      id: currentConversationId,
      title: conversationTitle,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();

      // 收集完整的消息信息用于保存
      let assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      // Helper to send SSE data chunks
      const send = async (data: unknown) => {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        controller.enqueue(encoder.encode(`data: ${text}\n\n`));
        // small delay to emulate streaming
        await new Promise((r) => setTimeout(r, Math.random() * 50));
      };

      // Optional: initial role/metadata with agent info
      await send({ type: "meta", role: "assistant", agent: selectedAgent });

      // 思考过程：组件智能选型、部件成本核算 不发送；其余按段落流式输出
      if (selectedAgent !== "component-selection" && selectedAgent !== "cost-calculation") {
        const cotParagraphs: Record<string, string> = {
          "process-analysis":
            "用户让我对上传的技术要求文档进行细化分析，给出详细的技术要求解读和可落地的设计方案。首先，我需要仔细梳理文档中的关键信息，包括项目基础情况、产品信息、产能规划、工艺描述、设计要求等方面，识别出关键内容进行重点分析，同时找出可能存在的潜在问题或需要进一步澄清的点。首先是项目部分，该项目需要完成托盘预处理线。文档中提到托盘预处理线主要包含的功能有:成品器具上料、托盘抓取、托盘翻转、液冷板气密测试、防爆阀气密测试、托盘自动清洁、托盘内腔粘贴膜、托盘码放至料车。接下来我可能要对这些重点功能所对应的点进行分析和思考。然后是节拍要求部分，文档中提到了托盘预处理线的线体数量、单线节拍和单日总产能。但是要计算节拍还需要考虑每天工作的小时数、工艺节拍等信息才能确认。这需要用户进一步补充信息才能得到相关的结果。产品尺寸部分，文档中提到托盘尺寸(mm):2165×1398×173.5，这会影响到整个线体的尺寸设计，以及用于支撑产品和线体的型材框架的选型。同时限制了产线可用面积为长24m×宽16m，这会对产线的布局造成影响。在工艺描述方面，这部分是核心。文档中描述了托盘预处理线需要具体的工艺流程。其中涉及到上料（叉车转运）、拍照抓取托盘并翻转、托盘流转、气密性测试、清洁、PI膜粘贴、下料等流程。我需要查看与工艺相关的资料。资料1提到托盘上料机可以实现成品器具二次定位、托盘拍照定位抓取、托盘翻转、托盘放置在工装板上并经过滚筒线输送至下一工序，并且提到上下双层的托盘传输线，能够以滚筒线的形式在各个工位间输送。资料2提到液冷板气密测试设备，通常是用于动力电池液冷板或其他液冷系统零部件在出厂前的气密性检测设备。需要人工进行操作。资料3提到的自动清洁机可以实现对平面进行等离子清洗与旋转毛刷吸尘，完成清洁操作。同时根据上下料需求以及物料传送需求，考虑增加建议龙门吊架以及托盘物料车等辅助设备。资料4提到一款简易龙门吊架，长 3.85m，高4m，水平方向为滑轨，无动力，竖直方向为电动助力，负载≥200kg。我需要对这些工艺所对应的重点设备进行工艺拆解和分析。在工艺要求部分，文档再次强调了了节拍和产能要求，同时对OEE、CMK等指标进行了要求，并要求各个机台HMI 屏可实时查看生产过程参数。交钥匙工程，爬坡陪产投标方派技术人员，零部件损坏投标方承担，这些都是关键的绩效指标和责任划分。还有 HMI 实时看参数、停机报警完善、投标方搭局域网、人工工位符合人机工程，这些都是运营保障的要求。人机协作部分，作业距离≥800mm，作业高度 750-850mm，物料路线规划，产品追踪数据上传，50 寸屏显示，这些是安全和数据管理的要求。然后是设备整体要求，包括技术标准、设计要求、制造要求、组装要求。技术标准里，优先国标，其次国际标准，文件铭牌中文，ISO9000 制造，国际单位，这些是合规性要求。设计要求里，设备易维修拆装，优先电机不用气缸，圆形气缸外置 U 型感应器，避免双气缸，布线考虑，绝缘件强度，设计人员资质，还有维修空间、一键换型、伺服一键归零、单元拼接易维修，这些都是设计层面的具体约束，尤其是人员资质和一键换型，关系到后期运维和柔性生产。制造要求里，熟练技工，零件互换性，质量控制，无铅等有害物质，表面防护，这些是制造质量的保障。可能遗漏的点：设备的供电、供气要求（文档里没提，比如电压、气压参数），环保要求（除了无铅涂层，还有废水、废气处理吗？），培训要求（投标方是否需要对招标方人员进行操作和维护培训？），质保期（设备的质保期限和范围？），这些虽然文档没提，但都是项目执行中重要的点，可能需要后续补充。现在把这些整理成结构化的分析，分文档结构与核心框架、各模块关键信息解析、核心诉求与潜在关注点、待补充 / 明确的关键事项这几个部分，形成技术需要细化文档和待确认问题清单，清晰地给到客户。",
          "3d-design":
            "正在构建设备与工位的空间约束模型，参考安全与维护规范进行布局迭代，评估路径干涉与装配公差累积，最终形成结构拆解与装配序列建议并标注关键检点。",
          "cost-calculation":
            "正在拆解物料清单与工序路径，按材料、加工、表面/热处理、装配与测试成本逐项估算，结合产量与良率进行单件摊销与敏感性分析，给出主要成本驱动因素与优化方向。",
        };
        const cotParagraph =
          cotParagraphs[selectedAgent as keyof typeof cotParagraphs] ||
          cotParagraphs["process-analysis"];
        for (const ch of cotParagraph) {
          await send({ type: "cot_text", content: ch });
        }
        await send({ type: "cot_text_done" });
        assistantMessage.cotText = cotParagraph;
      }

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
        ],
      };

      const steps =
        agentSteps[selectedAgent as keyof typeof agentSteps] ||
        agentSteps["process-analysis"];
      // （component-selection 已跳过）

      function getResponse(message: string) {
        if (message.includes('机械手')) {
          return "已匹配移栽机械手组件，请问 PCB 板移栽时负载及取料方式如何？"
        } else if (message.includes('夹爪')) {
          return "以为您找到匹配的方案。推荐行星轮移栽机械手机构，该机构可在 90 度旋转移栽时保持 PCB 板姿态不变，适配 3kg 内负载与夹爪取料，可匹配 SMT 分料工位需求。需要为您展示详情吗？"
        }
      }

      // 根据智能体定制回复内容
      const agentResponses = {
        "process-analysis": [
          `好的，我已收到您的请求，并已分析您提供的《托盘预处理线技术要求》参考文件。我将根据文档中的内容以及工艺资料库中的历史方案，为您进行节拍分析、工艺分析、以及相关相关工位的重点需求。

### 节拍分析如下：
序号 工序 单线节拍（S） 工位数 工序节拍（S） 
1 托盘上线 300 1 ＜300
2 液冷板气密测试 300 1 ＜300
3 防爆阀气密测试 300 2 ＜600
4 托盘内腔等离子清洗+毛刷吸尘 300 1 ＜300
5 人工粘贴PI膜 300 9 ＜2700
6 托盘下料装车 300 1 ＜300

### 工艺过程过程分析
flowchart LR

A["成品器具上料（叉车转运）"] --> B["设备内成品器具二次定位"]

B --> C["机械手拍照纠偏抓取托盘"]

C --> D["放置于翻转机构，托盘翻转"]

D --> E["机械手抓取放置于托盘载具上"]

E --> F["液冷板气密测试"]

F --> G["防爆阀气密测试"]

G --> H["托盘清洁"]

H --> I["托盘内腔PI膜粘贴"]

I --> J["放置于翻转机构，托盘翻转"]

J --> K["机械手抓取托盘码放至主线料车"]

J --> L["机械手抓取托盘码放至NG料车（托盘排废）"]


### 重点工位分析
托盘上料工位：该设备主要实现成品器具二次定位、托盘拍照定位抓取、托盘翻转、托盘放置在工装板上并经过滚筒线输送至下一工序。
#### 托盘上料工位
功能概述：该设备主要实现成品器具二次定位、托盘拍照定位抓取、托盘翻转、托盘放置在工装板上并经过滚筒线输送至下一工序。
工作流程：

1. 承载托盘的成品器具（器具无顶盖）放置于机台内，完成二次定位。
2. 六轴机器人拍摄托盘 MARK 点，进行位置纠偏。
3. 机器人夹爪从上到下伸入成品器具，抓取托盘两侧定位销和侧边梁（此时托盘内腔朝下）。
4. 夹爪气缸夹紧托盘。
5. 机器人夹爪自下而上垂直升起。
6. 将托盘放置于托盘翻转框架内。
7. 翻转机构夹紧托盘。
8. 机械手移动至安全区域。
9. 翻转机构以长边测产品中心线为轴，旋转 180°。
10. 机械手抓取翻转后的托盘（此时托盘内腔朝上），翻转机构夹紧机构松开。
11. 机械手将托盘抓取至输送线工装板上。
12. 放置完成后，机械手移动至安全区域，工装板承载产品转运至下一工序。

推荐设备：
根据相关工艺，推荐相关设备机构如下
1. 六轴机器人
2. 机器人地轨
3. 托盘搬运抓手
4. CCD 视觉系统
5. 工控机
6. 成品器具料车定位机构
7. 托盘翻转机构
8. 固定扫码器
9. 安全围栏 / 安全光栅
10. 电控系统
11. 触摸屏 HMI
12. 简易龙门吊

#### 托盘传输线
功能概述：该设备主要实现将承载托盘的工装板，以滚筒线的形式在各个工位间输送。托盘输送线形式为上下双层，上层输送带产品的工装板，下层回流空工装板，在托盘上线与托盘下线位置各设置一台提升机，可将空工装板升起承接新托盘。
工作流程：
1. 产品定位采用非金属零件，防止刮伤零件；
2. 配备缓冲块防止托盘硬性碰撞。
3. 工装板加工精度需满足产线其他工位设备需求精度。
4. 工装板与产品接触面采用软性材质，不可磕伤产品。
推荐设备：
1. 自定义工装板
2. 滚筒传输线
3. 举升机构

#### 防爆阀安装与气密测试工位
功能概述:该设备主要实现产品流转至顶升横移工位，将工装板顶起横移至两侧防爆阀气密测试工位，测试完成后顶升横移返回输送主线，并正常流转至下一工序。节拍（含防爆阀安装及气密测试时间与人工操作） ≤ 600s；
工作流程:
1. 防爆阀气密测试工位需要两个；
2. 托盘到达顶升横移工位，换向到防爆阀测试工位；
3. 产品到达测试工位后，进行二次定位，人工手持扫码器扫描托盘码，并安装防爆阀；
4. 人工安装防爆阀气密测试工装，气密性测试开始；
5. 测试完成后，人工拆除气密测试工装，并按下放行按钮，按钮应设置两个按钮， OK/NG，人工按下测试结果，托盘输送回顶升横移工位，并留回主线体；
推荐设备:
1. 防爆阀气密测试设备
2. 无限扫码枪
3. 气密测试仪
4. 屏幕
5. 可移动机柜

#### 托盘自动清洗工位
功能概述: 该设备主要实现产品流转至托盘自动清洁工位，将工装板顶起进行二次定位，对托盘内腔底部平面进行等离子清洗与旋转毛刷吸尘，清洁完成后正常流转至下一工序。
工作流程:
1. 产品到位后进行顶升二次定位；
2. 定位完成后启动清洁；
3. 清洁完成后自动流入下一工序；
4. 旋转毛刷吸尘后使用无尘布擦拭，布上不可有可见脏污与灰尘；
推荐设备:
1. 等离子清洗机
2. 除尘机
3. 安全围栏

#### 托盘下料工位
功能概述:该设备主要实现主线料车二次定位、托盘拍照定位抓取、托盘翻转、托盘放置在主线料车上。
工作流程:
1. 有料车上料位， 人工将料车推入料车上料位， 两侧需设置气缸定位夹紧机构；
2. 人工推入完成后， 按下上料完成按钮，设备识别到料车进入完成， 机器人对托盘进行拍照定位， CCD相机纠偏后发送坐标给机器人，机器人夹具运动至待抓取托盘上方；
3. 机器人夹紧工装深入托盘定位销，两侧夹紧气缸夹紧托盘横梁；
4. 机器人抓取托盘后竖直方向升起， 放入托盘翻转工位，托盘翻转后，由机械手将托盘放置到主线料车上；
5. 机器人回到等待位，等待抓取下一个托盘，如此循环；
6. 需设置托盘排废位及对应排废料车。
推荐设备:
1. 六轴机器人
2. 托盘搬运抓手
3. CCD 视觉系统
4. 托盘翻转机构
5. 固定扫码枪
6. 安全围栏 / 安全光栅
7. 电控柜及电控系统 

已经为您生成《详细技术要求分析》文档及《待确认问题清单》文档。`,
        ],
        "component-selection": [
          getResponse(message)
        ],
        "3d-design": [
          "好的，已经为您生成产线。其中双层循环倍速链采用DD马达驱动，可兼容不同角度转向，上层托盘为放置物料装配状态，下层为空托盘回流，两端设置升降机做上下层切换。中间设置有转向机，可作为方向转换。行星研磨工位的内外齿轮的转速差可使样品在磨盘上形成行星式研磨轨迹，使样品研磨后更平整。增加了机械臂进行物料的抓取工作，同时搭建铝型材工作站外罩。"
        ],
        "cost-calculation": [
          `【展示3D模型】

该零件是带多规格孔（含精密销孔）的小型固定件，结构含圆角设计，表面精度分区域控制（销孔更精密），需配合切割模板加工且有明确油漆颜色要求，核心用途是为设备组件提供定位与固定，适配中等精度的机械装配场景。
价格如下：
| 原材料费用 | 表面处理费用 | 热处理费用 | 加工价格费用 | 零件单价   |
|-------|--------|-------|--------|--------|
| 23.59 | 0.00   | 0.00  | 86.77  | 110.36 |
`,
        ],
      };

      const chunks =
        agentResponses[selectedAgent as keyof typeof agentResponses] ||
        agentResponses["process-analysis"];
      // 将多段文本拼接后按小块流式输出
      const fullText = chunks.join("");
      const CHUNK_SIZE = 24; // 每次推送字符数
      const TEXT_DELAY_MS = 120; // 仅对正文追加延时，放慢可读速度
      for (let i = 0; i < fullText.length; i += CHUNK_SIZE) {
        const piece = fullText.slice(i, i + CHUNK_SIZE);
        await send({ type: "text", content: piece });
        assistantMessage.content += piece;
        // 额外延迟，避免正文过快
        await new Promise((r) => setTimeout(r, TEXT_DELAY_MS));
      }

      // 根据不同智能体提供相关的文档引用
      const agentSources = {
        "process-analysis": [
          {
            id: "doc-1",
            title: "DK0124-托盘上料及移动升降",
            content:
              "设备描述 托盘上料机主要用于实现成品器具的二次定位、托盘的拍照定位抓取、托盘翻转以及将托盘放置在工装板上并输送至下一工序。该设备通常包含六轴机器人、",
            fileType: "pdf",
            url: "https://example.com/docs/gb19001-2016.pdf",
            preview:
              "设备描述 托盘上料机主要用于实现成品器具的二次定位、托盘的拍照定位抓取、托盘翻转以及将托盘放置在工装板上并输送至下一工序。该设备通常包含六轴机器人、",
            metadata: {
              size: "2.3 MB",
              lastModified: "2024-01-15",
              author: " - ",
            },
          },
          {
            id: "doc-2",
            title: "YL5411-液冷板气密测试设备",
            content: "智能制造系统架构包含设备层、控制层、管理层和企业层...",
            fileType: "doc",
            url: "https://example.com/docs/smart-manufacturing.docx",
            preview:
              "液冷板气密测试工位主要用于对托盘上的液冷板进行密封性检测，以确保其在后续使用中不会发生冷却液泄漏。该工位通过顶升横移机构将载有托盘的工装板从主输送线上转移至测试区域，测试完成后再送回主线。设备本身集成了二次定位装置、人工操作界面（扫码、按钮等），并为招标方提供的核心气密测试仪预留了接口和安装空间...",
            metadata: {
              size: "1.8 MB",
              lastModified: "2024-02-20",
              author: " - ",
            },
          },
          {
            id: "doc-3",
            title: "托盘内腔底部自动清洁机",
            content: "质量管理体系的建立应基于过程方法和风险思维...",
            fileType: "pdf",
            url: "https://example.com/docs/iso9001-2015.pdf",
            preview:
              "自动清洁机主要用于对托盘内腔底部平面进行高效清洁。该设备集成等离子清洗和旋转毛刷吸尘功能，能够将产品从输送线顶起并进行二次定位，完成清洁后自动流转至下一工序。设备通常包含三轴龙门机构、等离子清洗机、除尘机以及相关的控制系统...",
            metadata: {
              size: "3.1 MB",
              lastModified: "2023-12-10",
              author: " - ",
            },
          },
          {
            id: "doc-4",
            title: "HXC5271项目龙门桁架轨道",
            content: "质量管理体系的建立应基于过程方法和风险思维...",
            fileType: "pdf",
            url: "https://example.com/docs/iso9001-2015.pdf",
            preview:
              "用型KBK龙门桁架轨道基础结构，包含钢结构和轨道及小车结构，常用于人工物料搬运工位或大型抗扭臂拧紧工序。以期达到降低生产成本的目的。其设定场景为：通用型搬运移载工况钢构、轨道布置方案，结合电葫芦、平衡吊等主机可实现人工轻便地搬运重物工件...",
            metadata: {
              size: "3.1 MB",
              lastModified: "2022-12-12",
              author: " - ",
            },
          },
        ],
        "component-selection": [
          {
            id: "comp-1",
            title: "工业自动化组件选型指南",
            content: "组件选型应考虑技术参数、环境条件、成本效益等因素...",
            fileType: "md",
            url: "https://example.com/docs/component-guide.md",
            preview:
              "组件选型应考虑技术参数、环境条件、成本效益等因素。首先需要明确应用场景和技术要求，然后对比不同供应商的产品规格...",
            metadata: {
              size: "856 KB",
              lastModified: "2024-03-05",
              author: "自动化工程师协会",
            },
          },
          {
            id: "comp-2",
            title: "PLC产品技术规格书",
            content: "可编程逻辑控制器技术参数和应用说明...",
            fileType: "pdf",
            url: "https://example.com/docs/plc-specs.pdf",
            preview:
              "可编程逻辑控制器技术参数和应用说明。包括CPU性能、I/O配置、通信接口、编程环境等详细技术指标...",
            metadata: {
              size: "4.2 MB",
              lastModified: "2024-01-28",
              author: "西门子自动化",
            },
          },
        ],
        "3d-design": [
          {
            id: "design-1",
            title: "工厂布局设计标准 JB/T 9009-2016",
            content: "工厂布局设计应遵循安全、高效、经济的原则...",
            fileType: "pdf",
            url: "https://example.com/docs/factory-layout.pdf",
            preview:
              "工厂布局设计应遵循安全、高效、经济的原则。合理规划生产区域、辅助区域和管理区域的空间配置...",
            metadata: {
              size: "2.7 MB",
              lastModified: "2023-11-15",
              author: "机械工业标准化技术委员会",
            },
          },
          {
            id: "design-2",
            title: "3D建模最佳实践指南",
            content: "三维建模的流程、方法和质量控制要点...",
            fileType: "doc",
            url: "https://example.com/docs/3d-modeling-guide.docx",
            preview:
              "三维建模的流程、方法和质量控制要点。包括建模准备、几何建模、装配建模、渲染输出等各个环节的技术要求...",
            metadata: {
              size: "1.5 MB",
              lastModified: "2024-02-12",
              author: "CAD设计师联盟",
            },
          },
        ],
        "cost-calculation": [
          {
            id: "cost-1",
            title: "制造成本核算方法与实务",
            content: "制造成本包括直接材料、直接人工和制造费用...",
            fileType: "pdf",
            url: "https://example.com/docs/cost-accounting.pdf",
            preview:
              "制造成本包括直接材料、直接人工和制造费用三个基本要素。成本核算应采用科学的分配方法和计算标准...",
            metadata: {
              size: "3.8 MB",
              lastModified: "2024-01-08",
              author: "财务管理研究院",
            },
          },
          {
            id: "cost-2",
            title: "设备投资回报率分析模型",
            content: "ROI计算模型和投资决策分析方法...",
            fileType: "txt",
            url: "https://example.com/docs/roi-analysis.txt",
            preview:
              "ROI计算模型和投资决策分析方法。通过净现值、内部收益率等财务指标评估设备投资的经济效益...",
            metadata: {
              size: "245 KB",
              lastModified: "2023-12-22",
              author: "投资分析专家组",
            },
          },
          {
            id: "cost-3",
            title: "供应链成本优化策略",
            content: "供应链各环节的成本控制和优化方法...",
            fileType: "image",
            url: "https://example.com/docs/supply-chain.png",
            preview:
              "供应链各环节的成本控制和优化方法。包括采购成本、库存成本、运输成本和管理成本的综合优化策略...",
            metadata: {
              size: "1.2 MB",
              lastModified: "2024-02-28",
              author: "供应链管理协会",
            },
      },
    ],
  };

      // 文档引用：组件智能选型、部件成本核算不发送，其余按原逻辑
      if (selectedAgent !== "component-selection" && selectedAgent !== "cost-calculation") {
        const sources =
          agentSources[selectedAgent as keyof typeof agentSources] ||
          agentSources["process-analysis"];

        await send({
          type: "sources",
          count: sources.length,
          sources: sources,
        });
        assistantMessage.sourcesCount = sources.length;
        assistantMessage.sources = sources;
      }

      // 发送markdown附件（部件成本核算不需要附件）
      let attachments: Array<{ id: string; title: string; filename: string; content: string }> | undefined;
      if (selectedAgent !== "cost-calculation") {
        // 为组件智能选型提供专门的附件
        if (selectedAgent === "component-selection") {
          attachments = [
            {
              id: "attachment-1",
              title: "推荐组件技术规格书",
              filename: "recommended_component_specifications.md",
              content: `# 推荐组件技术规格书

## 行星轮移动分料工位夹爪系统

### 基本参数
- **型号**: PG-4000-GRIPPER
- **夹持力**: 50-200N (可调)
- **夹持范围**: 10-80mm
- **重复定位精度**: ±0.05mm
- **最大负载**: 3kg

### 技术特点
1. **高精度定位**: 采用伺服电机驱动，确保精确定位
2. **多点夹持**: 四指独立控制，适应不同形状工件
3. **智能检测**: 内置压力传感器，自动调节夹持力
4. **快速响应**: 夹取/释放时间 < 0.5秒

### 应用场景
- 样品旋转移栽作业
- 多工位自动化生产线
- 精密装配工艺

### 环境要求
- **工作温度**: -10°C ~ +60°C
- **湿度**: ≤85% RH
- **防护等级**: IP65
- **气源压力**: 0.4-0.8 MPa

### 安装接口
- **法兰尺寸**: ISO 9409-1-50-4-M6
- **电气接口**: M12圆形连接器
- **气路接口**: G1/4内螺纹

## 配套设备推荐
- 伺服驱动器: SERVO-2000
- 控制器: PLC-CTRL-500
- 传感器套件: SENSOR-KIT-A`,
            },
            {
              id: "attachment-2",
              title: "选型对比分析",
              filename: "component_selection_analysis.md",
              content: `# 选型对比分析

## 方案比较

### 方案A：行星轮夹爪系统 (推荐)
**优势:**
- 精度高 (±0.05mm)
- 适应性强，支持多种工件形状
- 维护成本低
- 可靠性高

**劣势:**
- 初期投资相对较高
- 需要专业调试

**适用场景:** 精密装配、多品种生产

### 方案B：气动夹爪
**优势:**
- 成本低
- 结构简单
- 响应快

**劣势:**
- 精度一般 (±0.2mm)
- 夹持力控制精度低
- 适应性有限

**适用场景:** 标准化产品、大批量生产

### 方案C：电动夹爪
**优势:**
- 控制精确
- 节能环保
- 噪音低

**劣势:**
- 响应速度慢
- 维护复杂
- 成本中等

**适用场景:** 对环境要求高的场合

## 推荐理由
基于您的应用需求（旋转移栽、保持角度不变），推荐**方案A：行星轮夹爪系统**，原因如下：

1. **精度匹配**: ±0.05mm精度完全满足精密移栽要求
2. **功能完备**: 四指独立控制，适应复杂工件形状
3. **可靠性高**: 工业级设计，适合连续作业
4. **扩展性好**: 支持多种控制接口，便于系统集成

## 投资回报分析
- **设备投资**: 约8.5万元
- **预计年节约人工成本**: 12万元
- **投资回收期**: 8.5个月
- **5年总收益**: 约51.5万元`,
            },
          ];
        } else {
          // 其他智能体的通用附件
          attachments = [
            {
              id: "attachment-1",
              title: "详细技术要求分析",
              filename: "detailed_technical_requirements_analysis.md",
              content: `# 详细技术要求分析

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
基于以上分析，建议采用以下技术方案...`,
            },
            {
              id: "attachment-2",
              title: "待确认问题清单",
              filename: "unverified_questions_list.md",
              content: `# 待确认问题清单

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
设备总价：约126万元`,
            },
          ];
        }

        await send({
          type: "attachments",
          attachments: attachments,
        });
        // 保存完整的attachments到assistantMessage
        assistantMessage.attachments = attachments;
      }

      // 为组件智能选型智能体添加可交互选项
      if (selectedAgent === "component-selection" && message.includes('夹爪')) {
        const componentOptions = {
          message:
            "已为您找到匹配的方案。推荐行星轮移动分料工位带求。需要为您展示详情吗？",
          options: [
            {
              id: "3d-model",
              label: "查看3D模型",
              icon: "Box",
              type: "url" as const,
              content: "https://models.example.com/planetary-gear-system",
            },
            {
              id: "parameters",
              label: "查看相关参数",
              icon: "Settings",
              type: "markdown" as const,
              content: `# 应用场景
样品在移栽（旋转移栽）过程中保持原有的角度不变

## 动作流程

1、机械手夹具下降，夹取主输送线物料后上升	
2、机械手摆臂旋转90度，夹具下降将物料放在左、右两边输送线上	
3、循环以上动作	
4、四指夹爪上升、回位，循环以上动作	
5、循环以上动作	

## 机构参数

| 外形尺寸：        | L1148xW800xH617(mm) |
|--------------|---------------------|
| 通用性(单个样品负载)： | 负载3kg以内物料，适用于夹爪夹料   |
| 循环周期：        | 3（S）                |
| 精度：          | ±0.5(mm)            |

### 机械参数
- 承载能力: 2000kg
- 定位精度: ±0.1mm
- 重复定位精度: ±0.05mm
- 工作温度: -10°C ~ +60°C
- 防护等级: IP65

### 示例应用
| 工件形状： | 长方形               |
|-------|-------------------|
| 工件尺寸： | 40×36×20mm        |
| 工件重量： | 0.2(g)            |
| 使用气压： | P=0.5(MPa)        |
| 电源：   | AC220V 50Hz/DC24V |

`,
            },
            {
              id: "design",
              label: "查看设计方案",
              icon: "FileCheck",
              type: "markdown" as const,
              content: `# 行星轮移动分料工位设计方案

## 设计概述
本方案采用行星轮传动系统，实现高精度、高效率的物料分料作业。系统集成了先进的伺服控制技术和智能传感器，确保稳定可靠的工作性能。

## 系统架构
### 机械结构
1. **行星轮减速器**
   - 采用三级行星轮结构
   - 输出扭矩大，运行平稳
   - 噪音低于70dB

2. **移动平台**
   - 直线导轨系统
   - 伺服电机驱动
   - 行程可达2000mm

3. **分料机构**
   - 气动夹具设计
   - 快速响应时间<0.2s
   - 夹持力可调范围50-200N

### 控制系统
1. **主控制器**: 西门子S7-1500 PLC
2. **人机界面**: 10寸彩色触摸屏
3. **安全系统**: 符合CE安全标准
4. **通信网络**: 工业以太网架构

## 工艺流程
1. 物料输送至待分料位置
2. 传感器检测物料规格
3. 系统自动选择分料策略
4. 执行分料动作
5. 质量检测与反馈
6. 完成品输出

## 技术优势
- **高精度**: 定位精度达±0.1mm
- **高效率**: 处理能力提升30%
- **智能化**: 自适应控制算法
- **易维护**: 模块化设计，便于维修

## 投资回报
- 设备投资: 约85万元
- 年节省人工: 2-3人
- 投资回收期: 18-24个月
- 预期使用寿命: 10年以上`,
      },
    ],
  };

        await send({
          type: "componentOptions",
          options: componentOptions,
        });
        assistantMessage.componentOptions = componentOptions;
      }

      // 保存消息到历史记录
      const conversation = chatHistory[selectedAgent]?.find(
        (conv) => conv.id === currentConversationId
      );
      if (conversation) {
        // 处理用户上传的文件信息
        const uploadedFiles = files && files.length > 0 ? files.map((file: any) => ({
          id: file.id || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.filename || file.name || "未知文件",
          size: file.size || 0,
          type: file.mediaType || file.type || "application/octet-stream",
        })) : undefined;

        // 添加用户消息
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
          uploadedFiles: uploadedFiles,
        };
        conversation.messages.push(userMessage);

        // 添加完整的助手消息
        conversation.messages.push(assistantMessage);

        conversation.updatedAt = new Date().toISOString();
      }

      // End of stream - 包含conversationId、组件选项、思考文本
      const donePayload: any = {
        type: "done",
        conversationId: currentConversationId,
        componentOptions: assistantMessage.componentOptions,
        cotText: assistantMessage.cotText,
      };
      if (selectedAgent !== "cost-calculation" && attachments) {
        donePayload.attachments = attachments;
      }
      await send(donePayload);
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
