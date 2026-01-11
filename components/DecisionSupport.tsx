
import React, { useState } from 'react';
import { PatientData, Step, AlgorithmType } from '../types';
import { 
  CheckCircle2, Heart, Zap, Activity, Clock, Syringe, AlertCircle, 
  ChevronDown, ChevronUp, HelpCircle, Thermometer, Wind, Droplets, Brain, 
  Stethoscope, ZapOff
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
      { label: '分析心律：可电击 (VF/pVT)', targetId: 'SHOCKABLE_1', variant: 'danger' },
      { label: '分析心律：不可电击 (PEA/Asystole)', targetId: 'NON_SHOCKABLE_1', variant: 'warning' }
    ]
  },
  SHOCKABLE_1: {
    id: 'SHOCKABLE_1',
    title: '可电击心律 (VF/pVT)',
    description: '第1次除颤：尽快电击以恢复有效心律。',
    actions: [
      '立即实施第1次电击 (2 J/kg)',
      '立即恢复 CPR 2 分钟 (不检查脉搏/心律)',
      '建立 IV/IO 通路'
    ],
    nextSteps: [
      { label: '2 分钟后评估心律', targetId: 'SHOCKABLE_CHECK_2', variant: 'primary' }
    ]
  },
  SHOCKABLE_CHECK_2: {
    id: 'SHOCKABLE_CHECK_2',
    title: '循环评估 (第2次分析)',
    description: '判断心律是否仍可电击。',
    actions: ['分析监护仪心律，判断是否需要再次除颤'],
    nextSteps: [
      { label: '仍可电击', targetId: 'SHOCKABLE_2', variant: 'danger' },
      { label: '不可电击', targetId: 'NON_SHOCKABLE_1', variant: 'warning' },
      { label: 'ROSC (自主循环恢复)', targetId: 'ROSC', variant: 'success' }
    ]
  },
  SHOCKABLE_2: {
    id: 'SHOCKABLE_2',
    title: '第2次除颤',
    description: '提高电量电击并给予首剂药物。',
    actions: [
      '实施第2次电击 (4 J/kg)',
      '立即恢复 CPR 2 分钟',
      '给予肾上腺素 (0.01 mg/kg) 每 3-5 分钟一次',
      '考虑高级气道管理（气管插管/喉罩）'
    ],
    nextSteps: [
      { label: '2 分钟后评估心律', targetId: 'SHOCKABLE_CHECK_3', variant: 'primary' }
    ]
  },
  SHOCKABLE_CHECK_3: {
    id: 'SHOCKABLE_CHECK_3',
    title: '循环评估 (第3次分析)',
    description: '持续可电击心律处理。',
    actions: ['分析心律，准备抗心律失常药物'],
    nextSteps: [
      { label: '仍可电击', targetId: 'SHOCKABLE_3', variant: 'danger' },
      { label: '不可电击', targetId: 'NON_SHOCKABLE_1', variant: 'warning' },
      { label: 'ROSC (自主循环恢复)', targetId: 'ROSC', variant: 'success' }
    ]
  },
  SHOCKABLE_3: {
    id: 'SHOCKABLE_3',
    title: '难治性室颤 (Refractory VF)',
    description: '抗心律失常药物介入。',
    actions: [
      '电击 (≥4 J/kg，最大 10 J/kg)',
      '恢复 CPR 2 分钟',
      '给予胺碘酮 (5 mg/kg) 或利多卡因 (1 mg/kg)',
      '积极处理 H\'s & T\'s 可逆原因'
    ],
    nextSteps: [
      { label: '循环评估', targetId: 'SHOCKABLE_CHECK_2', variant: 'primary' }
    ]
  },
  NON_SHOCKABLE_1: {
    id: 'NON_SHOCKABLE_1',
    title: '不可电击心律 (PEA/Asystole)',
    description: '尽早使用肾上腺素是成功的关键。',
    actions: [
      '尽早给予肾上腺素 (0.01 mg/kg)',
      '立即开始高质量 CPR 2 分钟',
      '建立 IV/IO 通路',
      '重点排查 H\'s & T\'s（低氧、容量、离子等）'
    ],
    nextSteps: [
      { label: '2 分钟后评估心律', targetId: 'NON_SHOCKABLE_CHECK', variant: 'primary' }
    ]
  },
  NON_SHOCKABLE_CHECK: {
    id: 'NON_SHOCKABLE_CHECK',
    title: '心律评估',
    description: '判断后续路径。',
    actions: ['分析监护仪心律，检查脉搏'],
    nextSteps: [
      { label: '转为可电击', targetId: 'SHOCKABLE_1', variant: 'danger' },
      { label: '维持不可电击', targetId: 'NON_SHOCKABLE_1', variant: 'warning' },
      { label: 'ROSC (自主循环恢复)', targetId: 'ROSC', variant: 'success' }
    ]
  },
  ROSC: {
    id: 'ROSC',
    title: 'ROSC (自主循环恢复)',
    description: '进入复苏后护理核心路径。',
    actions: [
      '呼吸：维持 SpO2 94% - 99%，PaCO2 35 - 45 mmHg。',
      '循环：维持 SBP > 5th 百分位 [70 + (2 × 年龄)]。',
      '体温：TTM 管理 (32-34°C 或 36-37.5°C)，禁发热。',
      '频率：建立高级气道后 20-30 次/分（2-3秒一次）。',
      '神经：24h 内监测 EEG，评估脑损伤风险。',
      '代谢：控制血糖 80-150 mg/dL。'
    ],
    nextSteps: [
      { label: '查看 ROSC 详细管理', targetId: 'ROSC_DETAIL', variant: 'success' },
      { label: '重新开始复苏', targetId: 'START', variant: 'primary' }
    ]
  },
  ROSC_DETAIL: {
    id: 'ROSC_DETAIL',
    title: 'ROSC 详细管理细节',
    description: '多维度优化，减少继发性损伤。',
    actions: [
      '【呼吸】避免过度通气；PaCO2 目标 35-45 mmHg。',
      '【循环】SBP 下限：0-1月 >60, 1月-1岁 >70, 1-10岁 70+(2x年), >10岁 >90。',
      '【体温】目标体温管理应持续至少 72h。',
      '【神经】预防和识别非惊厥性癫痫；尽早行脑电监测。',
      '【糖代谢】密切监测，避免严重高血糖和低血糖。',
      '【诊断】12 导联 ECG、胸片、电解质、血气分析。'
    ],
    nextSteps: [
      { label: '返回主流程', targetId: 'START', variant: 'primary' }
    ]
  }
};

const BRADYCARDIA_FLOW: Record<string, Step> = {
  START: {
    id: 'START',
    title: '心动过缓评估 (脉搏存在)',
    description: '识别灌注不良表现（神志改变、休克、发绀）。',
    actions: [
      '维持气道通畅，辅助通气，给予氧气',
      '连接心电监护、血压计、脉氧仪',
      '建立 IV/IO 通路',
      '记录 12 导联 ECG（如可行）'
    ],
    nextSteps: [
      { label: '由于低氧/通气不足导致', targetId: 'ABC_SUPPORT', variant: 'info' },
      { label: '尽管有氧合通气，HR仍<60 且灌注不良', targetId: 'CPR_START', variant: 'danger' }
    ]
  },
  ABC_SUPPORT: {
    id: 'ABC_SUPPORT',
    title: 'ABC 强化支持',
    description: '优先解决呼吸驱动问题。',
    actions: [
      '优化气道开放，确保有效 BVM 通气',
      '检查气管插管位置与密封性',
      '监测 HR 变化，准备药物'
    ],
    nextSteps: [
      { label: '心率改善 (>60)', targetId: 'OBSERVATION', variant: 'success' },
      { label: '心率持续低 (<60)', targetId: 'CPR_START', variant: 'danger' }
    ]
  },
  CPR_START: {
    id: 'CPR_START',
    title: '开始 CPR (HR < 60)',
    description: '症状性心动过缓等同于心脏骤停前驱。',
    actions: [
      '开始高质量 CPR',
      '给予肾上腺素 (0.01 mg/kg) 每 3-5 分钟一次',
      '阿托品 (0.02 mg/kg) 用于迷走张力增高',
      '寻找 H\'s & T\'s'
    ],
    nextSteps: [
      { label: '脉搏消失', targetId: 'ARREST_REDIRECT', variant: 'warning' },
      { label: '心率恢复', targetId: 'OBSERVATION', variant: 'success' }
    ]
  },
  OBSERVATION: {
    id: 'OBSERVATION',
    title: '稳定与监测',
    description: '持续评估灌注状态。',
    actions: [
      '维持血流动力学稳定',
      '咨询儿科心脏中心',
      '完善实验室检查（血气、电解质）'
    ],
    nextSteps: [{ label: '返回初始评估', targetId: 'START', variant: 'primary' }]
  },
  ARREST_REDIRECT: {
    id: 'ARREST_REDIRECT',
    title: '转入心脏骤停流程',
    description: '患者已无脉搏。',
    actions: ['立即启动心脏骤停核心算法'],
    nextSteps: []
  }
};

const TACHYCARDIA_FLOW: Record<string, Step> = {
  START: {
    id: 'START',
    title: '心动过速评估 (脉搏存在)',
    description: '识别异常增快（婴儿>220, 儿童>180）。',
    actions: [
      '维持气道，吸氧，连接监护仪',
      '建立 IV/IO 通路',
      '获取 12 导联 ECG'
    ],
    nextSteps: [
      { label: '不稳定 (有休克/神志障碍)', targetId: 'UNSTABLE', variant: 'danger' },
      { label: '稳定 (灌注良好)', targetId: 'STABLE_ASSESS', variant: 'info' }
    ]
  },
  UNSTABLE: {
    id: 'UNSTABLE',
    title: '不稳定型心动过速',
    description: '紧急同步电复律 (Synchronized Cardioversion)。',
    actions: [
      '准备同步电复律（确认开启 SYNC 模式）',
      '首剂电量：0.5 - 1 J/kg',
      '若无效，增加至 2 J/kg',
      '若为宽 QRS 且考虑为室速，咨询专家后可使用胺碘酮'
    ],
    nextSteps: [
      { label: '转复成功', targetId: 'POST_CARDIOVERSION', variant: 'success' },
      { label: '无效或转为室颤', targetId: 'ARREST_REDIRECT', variant: 'warning' }
    ]
  },
  STABLE_ASSESS: {
    id: 'STABLE_ASSESS',
    title: '稳定型分析',
    description: '通过 QRS 宽度决定后续用药。',
    actions: [
      '窄 QRS (≤0.09s): SVT 或 窦速 (ST)',
      '宽 QRS (>0.09s): VT (室速)'
    ],
    nextSteps: [
      { label: '窄 QRS (SVT 可能性大)', targetId: 'NARROW_QRS', variant: 'primary' },
      { label: '宽 QRS (VT 可能性大)', targetId: 'WIDE_QRS', variant: 'warning' }
    ]
  },
  NARROW_QRS: {
    id: 'NARROW_QRS',
    title: '窄 QRS (SVT)',
    description: '尝试物理或药物复律。',
    actions: [
      '迷走神经刺激（婴儿冰敷面部15s，儿童吹管）',
      '腺苷 (Adenosine)：首剂 0.1 mg/kg，次剂 0.2 mg/kg',
      '腺苷要求：快速推注 + 5-10ml 盐水冲管'
    ],
    nextSteps: [
      { label: '转复成功', targetId: 'POST_CARDIOVERSION', variant: 'success' },
      { label: '转为不稳定', targetId: 'UNSTABLE', variant: 'danger' }
    ]
  },
  WIDE_QRS: {
    id: 'WIDE_QRS',
    title: '宽 QRS (VT)',
    description: '稳定型室性心动过速处理。',
    actions: [
      '咨询儿科心脏病学专家',
      '考虑使用胺碘酮 (5 mg/kg) 缓慢推注',
      '或使用普鲁卡因胺 (15 mg/kg)'
    ],
    nextSteps: [
      { label: '恶化/转为不稳定', targetId: 'UNSTABLE', variant: 'danger' }
    ]
  },
  POST_CARDIOVERSION: {
    id: 'POST_CARDIOVERSION',
    title: '转复后护理',
    description: '维持与预防。',
    actions: [
      '完善全面评估，寻找诱因（电解质等）',
      '维持心电监护，转入 PICU'
    ],
    nextSteps: [{ label: '返回初始评估', targetId: 'START', variant: 'primary' }]
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
  patient, 
  algoType, 
  setAlgoType, 
  currentStepId, 
  setCurrentStepId 
}) => {
  const [showHsTs, setShowHsTs] = useState(false);

  const flows = {
    [AlgorithmType.CARDIAC_ARREST]: CARDIAC_ARREST_FLOW,
    [AlgorithmType.BRADYCARDIA]: BRADYCARDIA_FLOW,
    [AlgorithmType.TACHYCARDIA]: TACHYCARDIA_FLOW,
  };

  const currentStep = flows[algoType][currentStepId] || flows[algoType]['START'];

  const handleNext = (targetId: string) => {
    setShowHsTs(false);
    if (targetId === 'ARREST_REDIRECT') {
      setAlgoType(AlgorithmType.CARDIAC_ARREST);
      setCurrentStepId('START');
    } else {
      setCurrentStepId(targetId);
    }
  };

  const resetAlgorithm = (type: AlgorithmType) => {
    setShowHsTs(false);
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
      default: return 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-100';
    }
  };

  const hsAndTs = [
    { title: 'H: Hypovolemia (低血容量)', detail: '补液 20ml/kg 晶体液，评估出血。' },
    { title: 'H: Hypoxia (低氧血症)', detail: '检查插管，给氧，确保有效通气。' },
    { title: 'H: Hydrogen ion (酸中毒)', detail: '优化通气，必要时补碱。' },
    { title: 'H: Hypo/Hyperkalemia (钾失衡)', detail: '电解质校正。' },
    { title: 'H: Hypothermia (低温)', detail: '核心复温。' },
    { title: 'T: Tension Pneumothorax (气胸)', detail: '立即穿刺排气。' },
    { title: 'T: Tamponade (心脏压塞)', detail: '心包穿刺。' },
    { title: 'T: Toxins (毒素)', detail: '识别毒物，对症。' },
    { title: 'T: Thrombosis (血栓)', detail: '极罕见。' }
  ];

  return (
    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 实时动态提醒 */}
      {(algoType === AlgorithmType.CARDIAC_ARREST || algoType === AlgorithmType.BRADYCARDIA) && 
       currentStepId !== 'START' && !currentStepId.includes('ROSC') && (
        <div className="flex gap-2 mb-4 sticky top-0 z-10">
          <div className="flex-1 bg-rose-600 text-white p-3 rounded-2xl shadow-lg border-2 border-rose-400 flex items-center justify-center gap-2 animate-pulse">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase opacity-80 leading-none mb-1 tracking-tighter">评估周期</span>
              <span className="text-sm font-black leading-none">每 2 分钟分析心律</span>
            </div>
          </div>
          <div className="flex-1 bg-amber-500 text-white p-3 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2">
            <Syringe className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase opacity-80 leading-none mb-1 tracking-tighter">给药周期</span>
              <span className="text-sm font-black leading-none">3-5 分钟肾上腺素</span>
            </div>
          </div>
        </div>
      )}

      {/* 算法选择 */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-2">
        <button 
          onClick={() => resetAlgorithm(AlgorithmType.CARDIAC_ARREST)}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-black rounded-xl transition-all ${algoType === AlgorithmType.CARDIAC_ARREST ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
        >
          <Zap className="w-3.5 h-3.5" />
          心脏骤停
        </button>
        <button 
          onClick={() => resetAlgorithm(AlgorithmType.BRADYCARDIA)}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-black rounded-xl transition-all ${algoType === AlgorithmType.BRADYCARDIA ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}
        >
          <Activity className="w-3.5 h-3.5" />
          心动过缓
        </button>
        <button 
          onClick={() => resetAlgorithm(AlgorithmType.TACHYCARDIA)}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-black rounded-xl transition-all ${algoType === AlgorithmType.TACHYCARDIA ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          <Heart className="w-3.5 h-3.5" />
          心动过速
        </button>
      </div>

      {/* 主决策卡片 */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="p-8 text-center">
          <div className={`inline-flex items-center justify-center p-2 rounded-xl mb-4 ${
            algoType === AlgorithmType.CARDIAC_ARREST ? 'bg-rose-50 text-rose-600' : 
            algoType === AlgorithmType.BRADYCARDIA ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-widest">{algoType.replace('_', ' ')}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight">{currentStep.title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{currentStep.description}</p>
          
          <div className="space-y-3 mb-4">
            {currentStep.nextSteps?.map((next, idx) => (
              <button
                key={idx}
                onClick={() => handleNext(next.targetId)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg ${getVariantClasses(next.variant)}`}
              >
                {next.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ROSC 可视化目标卡片 */}
      {currentStepId === 'ROSC' && (
        <div className="grid grid-cols-2 gap-3 mb-2 animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
              <Wind className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-[10px] font-black text-blue-400 uppercase">SpO2 目标</div>
              <div className="text-sm font-black text-slate-900">94% - 99%</div>
           </div>
           <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100">
              <Droplets className="w-5 h-5 text-rose-600 mb-2" />
              <div className="text-[10px] font-black text-rose-400 uppercase">收缩压 (SBP)</div>
              <div className="text-sm font-black text-slate-900">> 5th 百分位</div>
           </div>
           <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
              <Thermometer className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-[10px] font-black text-emerald-400 uppercase">体温 TTM</div>
              <div className="text-sm font-black text-slate-900">32-34 / 36-37.5</div>
           </div>
           <div className="bg-purple-50 p-4 rounded-3xl border border-purple-100">
              <Brain className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-[10px] font-black text-purple-400 uppercase">EEG 监测</div>
              <div className="text-sm font-black text-slate-900">24h 内启动</div>
           </div>
        </div>
      )}

      {/* 辅助操作清单 */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <div className="flex items-center gap-2 mb-4 text-slate-900">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-black uppercase tracking-wider">当前步骤操作核心</span>
        </div>
        <ul className="space-y-4">
          {currentStep.actions.map((action, idx) => (
            <li key={idx} className="flex gap-3 text-slate-700">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm font-bold leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 病因排查展开项 */}
      {(currentStepId === 'NON_SHOCKABLE_1' || currentStepId === 'SHOCKABLE_3') && (
        <div className="bg-amber-50 rounded-3xl border border-amber-200 overflow-hidden">
          <button 
            onClick={() => setShowHsTs(!showHsTs)}
            className="w-full flex items-center justify-between p-5 transition-all hover:bg-amber-100"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-black text-slate-900">排查可逆原因 (H's & T's)</span>
            </div>
            {showHsTs ? <ChevronUp className="w-5 h-5 text-amber-600" /> : <ChevronDown className="w-5 h-5 text-amber-600" />}
          </button>
          {showHsTs && (
            <div className="px-5 pb-5 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-300">
              {hsAndTs.map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-black text-amber-600 uppercase block mb-0.5">{h.title}</span>
                  <p className="text-[11px] font-bold text-slate-600">{h.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CPR 质量底线 */}
      {algoType === AlgorithmType.CARDIAC_ARREST && currentStepId !== 'START' && !currentStepId.includes('ROSC') && (
        <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-xl">
           <div className="flex items-center gap-2 mb-3">
              <ZapOff className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase text-emerald-400">高质量 CPR 基准</span>
           </div>
           <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
              <div className="opacity-80">频率: 100-120/min</div>
              <div className="opacity-80">深度: ≥1/3 前后径</div>
              <div className="opacity-80">中断: &lt;10s</div>
              <div className="opacity-80">通气: 建立气道后 20-30/min</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DecisionSupport;
