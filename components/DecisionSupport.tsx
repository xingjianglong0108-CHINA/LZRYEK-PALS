
import React, { useState } from 'react';
import { PatientData, Step, AlgorithmType } from '../types';
import { 
  CheckCircle2, Heart, Zap, Activity, Clock, Syringe, AlertCircle, 
  ChevronDown, ChevronUp, HelpCircle, Thermometer, Wind, Droplets, Brain, 
  Stethoscope, ZapOff, ArrowRight, TrendingDown, TrendingUp, AlertTriangle
} from 'lucide-react';

const CARDIAC_ARREST_FLOW: Record<string, Step> = {
  START: {
    id: 'START',
    title: '心脏骤停处理 (Cardiac Arrest)',
    description: '确认环境安全，开始高质量 CPR，连接监护仪。',
    actions: [
      '确认现场安全，检查反应和呼吸',
      '启动应急反应系统，获取 AED/除颤仪',
      '开始 CPR (按压:人工呼吸 = 30:2 或 15:2)',
      '连接监护仪/除颤仪，判断心律'
    ],
    nextSteps: [
      { label: '可电击 (VF/pVT)', targetId: 'SHOCKABLE_1', variant: 'danger' },
      { label: '不可电击 (PEA/Asystole)', targetId: 'NON_SHOCKABLE_1', variant: 'warning' }
    ]
  },
  SHOCKABLE_1: {
    id: 'SHOCKABLE_1',
    title: '可电击心律 (VF/pVT)',
    description: '第 1 次除颤：尽快电击。',
    actions: [
      '立即实施第 1 次电击 (2 J/kg)',
      '立即恢复 CPR 2 分钟',
      '建立 IV/IO 通路'
    ],
    nextSteps: [
      { label: '2 分钟后评估：仍为可电击', targetId: 'SHOCKABLE_2', variant: 'danger' },
      { label: '转为不可电击', targetId: 'NON_SHOCKABLE_1', variant: 'warning' },
      { label: 'ROSC', targetId: 'ROSC', variant: 'success' }
    ]
  },
  SHOCKABLE_2: {
    id: 'SHOCKABLE_2',
    title: '可电击心律 - 循环 2',
    description: '第 2 次除颤与给药。',
    actions: [
      '实施第 2 次电击 (4 J/kg)',
      '立即恢复 CPR 2 分钟',
      '给予肾上腺素 (0.01 mg/kg) 每 3-5 分钟'
    ],
    nextSteps: [
      { label: '仍为可电击', targetId: 'SHOCKABLE_3', variant: 'danger' },
      { label: 'ROSC', targetId: 'ROSC', variant: 'success' }
    ]
  },
  SHOCKABLE_3: {
    id: 'SHOCKABLE_3',
    title: '可电击心律 - 循环 3',
    description: '第 3 次除颤与抗心律失常药物。',
    actions: [
      '实施第 3 次电击 (≥ 4 J/kg，最高 10 J/kg)',
      '立即恢复 CPR 2 分钟',
      '给予胺碘酮 (5 mg/kg) 或 利多卡因 (1 mg/kg)'
    ],
    nextSteps: [
      { label: '持续复苏', targetId: 'START', variant: 'primary' },
      { label: 'ROSC', targetId: 'ROSC', variant: 'success' }
    ]
  },
  NON_SHOCKABLE_1: {
    id: 'NON_SHOCKABLE_1',
    title: '不可电击 (PEA/Asystole)',
    description: '尽早使用肾上腺素是核心。',
    actions: [
      '尽快给予肾上腺素 (0.01 mg/kg)',
      '持续高质量 CPR 2 分钟',
      '建立高级气道 (如适用)',
      '排查可逆原因 (H\'s & T\'s)'
    ],
    nextSteps: [
      { label: '评估心律：转为可电击', targetId: 'SHOCKABLE_1', variant: 'danger' },
      { label: '维持不可电击', targetId: 'NON_SHOCKABLE_1', variant: 'warning' },
      { label: 'ROSC', targetId: 'ROSC', variant: 'success' }
    ]
  },
  ROSC: {
    id: 'ROSC',
    title: 'ROSC (自主循环恢复)',
    description: '进入复苏后护理核心路径。',
    actions: [
      '呼吸：SpO2 94-99%，控制 PaCO2',
      '循环：维持 SBP > 第5百分位',
      '体温管理：避免发热，必要时 TTM',
      '监测：EEG 监测、血糖、电解质'
    ],
    nextSteps: [
      { label: '进入 2025 康复路线图', targetId: 'REHAB_ROADMAP', variant: 'success' }
    ]
  },
  REHAB_ROADMAP: {
    id: 'REHAB_ROADMAP',
    title: '康复路线图 (Rehab Roadmap)',
    description: '2025 新增：多学科长期康复。',
    actions: [
      '住院期：启动 PT/OT/SLP 评估',
      '出院前：提供结构化复苏总结',
      '长期：3-6 个月进行神经心理评估'
    ],
    nextSteps: [
      { label: '结束算法', targetId: 'START', variant: 'primary' }
    ]
  }
};

const BRADYCARDIA_FLOW: Record<string, Step> = {
  START: {
    id: 'START',
    title: '心动过缓评估 (脉搏存在)',
    description: '识别灌注不良表现（神志改变、低血压、休克）。',
    actions: [
      '维持气道通畅，辅助通气，给予氧气',
      '连接监护仪 (心电、血压、脉氧)',
      '建立 IV/IO 通路',
      '获取 12 导联心电图 (如可能)'
    ],
    nextSteps: [
      { label: '持续灌注不良', targetId: 'CPR_START', variant: 'danger' },
      { label: '灌注尚可 (观察)', targetId: 'OBSERVATION', variant: 'info' }
    ]
  },
  CPR_START: {
    id: 'CPR_START',
    title: '开始 CPR (心率 < 60)',
    description: '若氧合/通气后心率仍 < 60 且灌注差，立即按压。',
    actions: [
      '开始高质量 CPR (按压 100-120 次/分)',
      '给予肾上腺素 (0.01 mg/kg IV/IO)',
      '阿托品 (0.02 mg/kg)：针对迷走张力增高或原发性房室传导阻滞',
      '考虑经皮/经静脉起搏'
    ],
    nextSteps: [
      { label: '心率改善 (> 60)', targetId: 'START', variant: 'success' },
      { label: '无脉搏 (心脏骤停)', targetId: 'ARREST_REDIRECT', variant: 'warning' }
    ]
  },
  OBSERVATION: {
    id: 'OBSERVATION',
    title: '临床观察与支持',
    description: '心率偏慢但灌注尚可。',
    actions: [
      '持续监护',
      '寻找并处理潜在原因 (缺氧、药物、体温过低)',
      '咨询专家意见'
    ],
    nextSteps: [
      { label: '病情恶化', targetId: 'START', variant: 'danger' }
    ]
  }
};

const TACHYCARDIA_FLOW: Record<string, Step> = {
  START: {
    id: 'START',
    title: '心动过速评估 (脉搏存在)',
    description: '区分 QRS 宽度 (≤ 0.09s 或 > 0.09s)。',
    actions: [
      '维持气道、氧合，获取 12 导联 ECG',
      '评估是否稳定 (是否有低血压、神志改变、休克)'
    ],
    nextSteps: [
      { label: '不稳定 (灌注差)', targetId: 'UNSTABLE', variant: 'danger' },
      { label: '稳定 (窄 QRS)', targetId: 'NARROW_STABLE', variant: 'primary' },
      { label: '稳定 (宽 QRS)', targetId: 'WIDE_STABLE', variant: 'warning' }
    ]
  },
  UNSTABLE: {
    id: 'UNSTABLE',
    title: '不稳定型处理 (紧急)',
    description: '紧急同步电复律或给药。',
    actions: [
      '窄 QRS (SVT)：同步电复律 (0.5-1 J/kg)',
      '宽 QRS (VT)：同步电复律 (0.5-1 J/kg)',
      '若有通路且为 SVT：可尝试腺苷 (0.1 mg/kg)'
    ],
    nextSteps: [
      { label: '转复成功', targetId: 'START', variant: 'success' },
      { label: '无脉搏 (心脏骤停)', targetId: 'ARREST_REDIRECT', variant: 'warning' }
    ]
  },
  NARROW_STABLE: {
    id: 'NARROW_STABLE',
    title: '稳定型 - 窄 QRS',
    description: '区分窦速 (ST) 与室上速 (SVT)。',
    actions: [
      'ST (有诱因)：治疗原发病',
      'SVT (突发、心率固定、P波缺失)：',
      '- 迷走神经刺激 (如冰敷面部)',
      '- 腺苷 (0.1 mg/kg, 快速推注)',
      '- 若无效，第二剂 0.2 mg/kg'
    ],
    nextSteps: [
      { label: '转复成功', targetId: 'START', variant: 'success' },
      { label: '变为不稳定', targetId: 'UNSTABLE', variant: 'danger' }
    ]
  },
  WIDE_STABLE: {
    id: 'WIDE_STABLE',
    title: '稳定型 - 宽 QRS',
    description: '可能是室速 (VT) 或室上速伴差异传导。',
    actions: [
      '寻求专家咨询',
      '考虑腺苷 (仅当节律规整且 QRS 单形)',
      '准备抗心律失常药 (胺碘酮或普鲁卡因胺)'
    ],
    nextSteps: [
      { label: '变为不稳定', targetId: 'UNSTABLE', variant: 'danger' }
    ]
  }
};

interface DecisionSupportProps {
  patient: PatientData;
  algoType: AlgorithmType;
  setAlgoType: (type: AlgorithmType) => void;
  currentStepId: string;
  setCurrentStepId: (id: string) => void;
}

const DecisionSupport: React.FC<DecisionSupportProps> = ({ 
  patient, algoType, setAlgoType, currentStepId, setCurrentStepId 
}) => {
  const flows = {
    [AlgorithmType.CARDIAC_ARREST]: CARDIAC_ARREST_FLOW,
    [AlgorithmType.BRADYCARDIA]: BRADYCARDIA_FLOW,
    [AlgorithmType.TACHYCARDIA]: TACHYCARDIA_FLOW,
  };

  const currentStep = flows[algoType][currentStepId] || flows[algoType]['START'];

  const handleNext = (targetId: string) => {
    if (targetId === 'ARREST_REDIRECT') {
      setAlgoType(AlgorithmType.CARDIAC_ARREST);
      setCurrentStepId('START');
    } else {
      setCurrentStepId(targetId);
    }
  };

  const handleAlgoSwitch = (type: AlgorithmType) => {
    setAlgoType(type);
    setCurrentStepId('START');
  };

  const getVariantClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary': return 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100';
      case 'danger': return 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100';
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100';
      case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100';
      case 'info': return 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-100';
      default: return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-4 pt-4 pb-24">
      {/* 算法切换选择器 */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
        <button 
          onClick={() => handleAlgoSwitch(AlgorithmType.CARDIAC_ARREST)}
          className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${algoType === AlgorithmType.CARDIAC_ARREST ? 'bg-white shadow-md text-rose-600 scale-[1.02]' : 'text-slate-400 opacity-60'}`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-black">心脏骤停</span>
        </button>
        <button 
          onClick={() => handleAlgoSwitch(AlgorithmType.BRADYCARDIA)}
          className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${algoType === AlgorithmType.BRADYCARDIA ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-400 opacity-60'}`}
        >
          <TrendingDown className="w-4 h-4" />
          <span className="text-[10px] font-black">心动过缓</span>
        </button>
        <button 
          onClick={() => handleAlgoSwitch(AlgorithmType.TACHYCARDIA)}
          className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${algoType === AlgorithmType.TACHYCARDIA ? 'bg-white shadow-md text-amber-600 scale-[1.02]' : 'text-slate-400 opacity-60'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] font-black">心动过速</span>
        </button>
      </div>

      {/* 主决策卡片 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 text-center border-b border-slate-50 relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
             <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
               algoType === AlgorithmType.CARDIAC_ARREST ? 'bg-rose-100 text-rose-600' : 
               algoType === AlgorithmType.BRADYCARDIA ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
             }`}>
               PALS Algorithm
             </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight mt-2">{currentStep.title}</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{currentStep.description}</p>
        </div>
        
        <div className="p-8 space-y-4 bg-slate-50/30">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Stethoscope className="w-3.5 h-3.5" /> 核心操作清单
          </div>
          <ul className="space-y-3">
            {currentStep.actions.map((action, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-bold leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 pt-4 space-y-3">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">选择临床决策路径</div>
          {currentStep.nextSteps?.map((next, idx) => (
            <button
              key={idx}
              onClick={() => handleNext(next.targetId)}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-between shadow-lg active:scale-[0.98] ${getVariantClasses(next.variant)}`}
            >
              {next.label}
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
          <button 
            onClick={() => setCurrentStepId('START')}
            className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all"
          >
            重置当前算法步骤
          </button>
        </div>
      </div>

      {/* 2025 警示/特别提示 */}
      <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-xl flex items-start gap-4 border border-white/5">
        <div className="bg-amber-500 p-2 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-[9px] font-black text-amber-500 uppercase block mb-1">2025 重要提醒</span>
          <p className="text-[11px] font-bold text-slate-300 leading-relaxed">
            {algoType === AlgorithmType.CARDIAC_ARREST 
              ? '心脏骤停时，除颤、按压与肾上腺素的衔接必须无缝。除颤后立即恢复按压，不检查心律。' 
              : algoType === AlgorithmType.BRADYCARDIA 
              ? '通气是儿科心动过缓的首选干预。如果充分通气后心率仍低，才考虑给药。'
              : '同步电复律前应尽量获取 12 导联 ECG。稳定型窄 QRS 首选迷走神经刺激。'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default DecisionSupport;
