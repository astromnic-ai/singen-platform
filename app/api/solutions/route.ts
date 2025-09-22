import { NextResponse } from 'next/server'
import { Solution } from '@/types/solution'

// 模拟方案数据
const mockSolutions: Solution[] = [
  {
    id: "P833",
    name: "北美 P833-Cokpit 装配项目方案",
    description: "北美 P833-Cokpit 装配项目方案",
    documents: [
      {
        id: "P833-0001",
        name: "P833 Cockpit 装配工时明细-R5-20250606(1).xlsx",
        type: "excel",
        url: "/storage/P833/001.xlsx",
      },
      {
        id: "P833-0002",
        name: "P833 Cockpit总成装配线技术要求V2.0.docx",
        type: "docx",
        url: "/storage/P833/002.docx",
      },
      {
        id: "P833-0003",
        name: "北美P833-Cokpit 装配项目方案20250715-1.pptx",
        type: "pptx",
        url: "/storage/P833/003.pptx",
      },
      {
        id: "P833-0004",
        name: "附件1-AU310 Cockpit 装配线技术协议-V5-20250108.xlsx",
        type: "excel",
        url: "/storage/P833/004.xlsx",
      },
    ],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "C255",
    name: "后转总成装配线",
    description: "后转总成装配线",
    documents: [
      {
        id: "C255-0001",
        name: "C255技术协议（定版V5）.docx",
        type: "docx",
        url: "/storage/P833-Cokpit/001.docx",
      },
    ],
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "D50",
    name: "墨西哥卡扣压合工装线",
    description: "墨西哥卡扣压合工装线",
    documents: [
      {
        id: "D50-0001",
        name: "墨西哥-D50后部包覆面板半自动装卡扣工装VENT COVER PANEL Semi-automatic snap-on tooling-2025-6-10.docx",
        type: "docx",
        url: "/storage/D50/001.docx",
      },
      {
        id: "D50-0002",
        name: "墨西哥-Highland&D50左右侧包覆饰条半自动装卡扣工装HOCKEY STICK Semi-automatic snap-on tooling-2025-6-10.docx",
        type: "docx",
        url: "/storage/D50/002.docx",
      },
      {
        id: "D50-0003",
        name: "墨西哥-Highland后部包覆面板半自动装卡扣工装VENT COVER PANEL Semi-automatic snap-on tooling-2025-6-10.docx",
        type: "docx",
        url: "/storage/D50/003.docx",
      },
      {
        id: "D50-0004",
        name: "墨西哥-无线充电面板半自动装卡扣工装PHONE DOCK Semi-automatic snap-on tooling-2025-6-10.docx",
        type: "docx",
        url: "/storage/D50/004.docx",
      },
    ],
    createdAt: "2024-01-05T07:30:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
  },
  {
    id: "XJ24492",
    name: "门板三角饰板检测设备方案",
    description: "门板三角饰板检测设备方案",
    documents: [],
    tree: [
      {
        id: 'folder-客户输入文件',
        name: '1.客户输入文件',
        kind: 'folder',
        children: [
          {
            id: 'folder-三角板项目',
            name: '三角板项目',
            kind: 'folder',
            children: [
              {
                id: 'file-特斯拉XYO门板三角饰板总成视觉电检测设备.xlsx',
                name: '特斯拉XYO门板三角饰板总成视觉电检测设备.xlsx',
                kind: 'file',
                fileType: 'excel',
                url: '/storage/P833/001.xlsx'
              }
            ]
          },
          {
            id: 'folder-三角窗饰板',
            name: '三角窗饰板',
            kind: 'folder',
            children: [
              {
                id: 'folder-三角窗饰板-子',
                name: '三角窗饰板',
                kind: 'folder',
                children: [
                  { id: 'file-3641644-00-D.stp', name: '3641644-00-D.stp', kind: 'file', fileType: 'stp' },
                  { id: 'file-3641645-00-D.stp', name: '3641645-00-D.stp', kind: 'file', fileType: 'stp' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'folder-3D&布局',
        name: '2.3D&布局',
        kind: 'folder',
        children: [
          {
            id: 'folder-三角窗方案三维',
            name: '三角窗方案三维',
            kind: 'folder',
            children: [
              { id: 'file-_NPart#1015045.CATPart', name: '_NPart#1015045.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1128816.CATPart', name: '_NPart#1128816.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1163352.CATPart', name: '_NPart#1163352.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1200352.CATPart', name: '_NPart#1200352.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1222839.CATPart', name: '_NPart#1222839.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1279915.CATPart', name: '_NPart#1279915.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#13200.CATPart', name: '_NPart#13200.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1354159.CATPart', name: '_NPart#1354159.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1358100.CATPart', name: '_NPart#1358100.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1686548.CATPart', name: '_NPart#1686548.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1748795.CATPart', name: '_NPart#1748795.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1754143.CATPart', name: '_NPart#1754143.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#1849631.CATPart', name: '_NPart#1849631.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#22560.CATPart', name: '_NPart#22560.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#262417.CATPart', name: '_NPart#262417.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#302232.CATPart', name: '_NPart#302232.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#484933.CATPart', name: '_NPart#484933.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#490375.CATPart', name: '_NPart#490375.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#567111.CATPart', name: '_NPart#567111.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#598865.CATPart', name: '_NPart#598865.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#641409.CATPart', name: '_NPart#641409.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#673191.CATPart', name: '_NPart#673191.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#846719.CATPart', name: '_NPart#846719.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#891735.CATPart', name: '_NPart#891735.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-_NPart#941872.CATPart', name: '_NPart#941872.CATPart', kind: 'file', fileType: 'CATPart' }
            ]
          }
        ]
      },
      {
        id: 'folder-方案PPT',
        name: '3.方案PPT',
        kind: 'folder',
        children: [
          { id: 'file-三角饰板.xls', name: '三角饰板.xls', kind: 'file', fileType: 'excel', url: '/storage/P833/001.xlsx' },
          { id: 'file-XYO门板三角饰板分总成检测方案20241016-2.pptx', name: 'XYO门板三角饰板分总成检测方案20241016-2.pptx', kind: 'file', fileType: 'pptx', url: '/storage/P833/003.pptx' }
        ]
      },
      {
        id: 'folder-技术报价',
        name: '4.技术报价',
        kind: 'folder',
        children: [
          { id: 'file-三角窗项目-技术报价国内2024.11.08.xlsx', name: '三角窗项目-技术报价国内2024.11.08.xlsx', kind: 'file', fileType: 'excel', url: '/storage/P833/001.xlsx' },
          { id: 'file-三角窗项目-技术报价国内2024.11.15.xlsx', name: '三角窗项目-技术报价国内2024.11.15.xlsx', kind: 'file', fileType: 'excel', url: '/storage/P833/001.xlsx' },
          { id: 'file-XJ24492-新泉三角板视觉、电检系统报价-合心凯达20241024-V1S.xlsx', name: 'XJ24492-新泉三角板视觉、电检系统报价-合心凯达20241024-V1S.xlsx', kind: 'file', fileType: 'excel', url: '/storage/P833/001.xlsx' },
          { id: 'file-XJ24492斯洛伐克三角饰板检测设备技术报价20241023-1.xlsm', name: 'XJ24492斯洛伐克三角饰板检测设备技术报价20241023-1.xlsm', kind: 'file', fileType: 'excel', url: '/storage/P833/001.xlsx' }
        ]
      },
      {
        id: 'folder-供应商报价资料',
        name: '5.供应商报价资料',
        kind: 'folder',
        children: [
          {
            id: 'folder-方案图片',
            name: '方案图片',
            kind: 'folder',
            children: [
              { id: 'file-00004.bmp', name: '00004.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-00005.bmp', name: '00005.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-0001.bmp', name: '0001.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-0002.bmp', name: '0002.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-0003.bmp', name: '0003.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-001.bmp', name: '001.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-002.bmp', name: '002.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-003.bmp', name: '003.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-004.bmp', name: '004.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-005.bmp', name: '005.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-006.bmp', name: '006.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-007.bmp', name: '007.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-008.bmp', name: '008.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-009.bmp', name: '009.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-010.bmp', name: '010.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-011.bmp', name: '011.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-022.bmp', name: '022.bmp', kind: 'file', fileType: 'bmp' },
              { id: 'file-033.bmp', name: '033.bmp', kind: 'file', fileType: 'bmp' }
            ]
          }
        ]
      },
      {
        id: 'folder-XYO三角饰板产品数模1220',
        name: 'XYO三角饰板产品数模1220',
        kind: 'folder',
        children: [
          { id: 'file-2135769-00-A-DOOR TRIM_ BASE TWEETER ASSY_ FR LH.stp', name: '2135769-00-A-DOOR TRIM_ BASE TWEETER ASSY_ FR LH.stp', kind: 'file', fileType: 'stp' },
          {
            id: 'folder-FR TWEETER 24-11-25',
            name: 'FR TWEETER 24-11-25',
            kind: 'folder',
            children: [
              { id: 'file-2135769-00-A-DOOR TRIM_ BASE TWEETER ASSY_ FR LH.24-11-26.CATPart', name: '2135769-00-A-DOOR TRIM_ BASE TWEETER ASSY_ FR LH.24-11-26.CATPart', kind: 'file', fileType: 'CATPart' },
              { id: 'file-2135769-00-A-DOOR TRIM, BASE TWEETER ASSY, FR LH.24-11-26.CATPart', name: '2135769-00-A-DOOR TRIM, BASE TWEETER ASSY, FR LH.24-11-26.CATPart', kind: 'file', fileType: 'CATPart' }
            ]
          },
          { id: 'file-FR TWEETER 24-11-25.rar', name: 'FR TWEETER 24-11-25.rar', kind: 'file', fileType: 'rar' }
        ]
      }
    ],
    createdAt: "2024-01-05T07:30:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
  },
]

export async function GET() {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return NextResponse.json({
      success: true,
      data: mockSolutions,
      message: "获取方案列表成功"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      message: "获取方案列表失败"
    }, { status: 500 })
  }
}
