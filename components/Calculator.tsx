
import React, { useState, useMemo } from 'react';
import { PatientData, DrugDose, AlgorithmType } from '../types';
import { Calculator as CalcIcon, AlertTriangle, Shield, Info, ChevronDown, ChevronUp, Filter, Eye, EyeOff } from 'lucide-react';

interface CalculatorProps {
  patient: PatientData;
  currentStepId: string;
  algoType: AlgorithmType;
}

const Calculator: React.FC<CalculatorProps> = ({ patient, currentStepId, algoType }) => {
  const weight = patient.weight;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const drugs: DrugDose[] = [
    { 
      name: '肾上腺素 (IV/IO 1:10000)', 
      dose: `${(weight * 0.1).toFixed(1)} ml`, 
      note: '0.01 mg/kg, 每3-5min', 
      max: '1 mg (10ml)',
      relevantSteps: ['SHOCKABLE_2', 'SHOCKABLE_3', 'NON_SHOCKABLE_1', 'CPR_START', 'ADVANCED_BRADY'],
      details: {
        indication: '心脏骤停 (VF/pVT, PEA/Asystole)、症状性心动过缓。',
        route: '静脉推注 (IV) 或骨内推注 (IO)。',
        info: '强效 α/β 受体激动剂。增加外周血管阻力，提高冠脉灌注压。'
      }
    },
    { 
      name: '肾上腺素 (气管给药 1:1000)', 
      dose: `${(weight * 0.1).toFixed(1)} ml`, 
      note: '0.1 mg/kg, 仅限无通路时', 
      max: '2.5 mg',
      relevantSteps: ['SHOCKABLE_2', 'SHOCKABLE_3', 'NON_SHOCKABLE_1'],
      details: {
        indication: '无法及时建立 IV/IO 通路时的心脏骤停替代方案。',
        route: '气管导管 (ET)。',
        info: '吸收不可预测，剂量通常需为 IV 的 10 倍。效果不如血管内给药。'
      }
    },
    { 
      name: '阿托品', 
      dose: `${Math.max(0.1, weight * 0.02).toFixed(2)} mg`, 
      note: '0.02 mg/kg, 最小0.1mg', 
      max: '0.5 mg',
      relevantSteps: ['CPR_START', 'ADVANCED_BRADY'],
      details: {
        indication: '迷走张力增高、AV 传导阻滞引起的心动过缓。',
        route: 'IV/IO。',
        info: '最小剂量限制 0.1mg 以防止引起矛盾性心动过缓。'
      }
    },
    { 
      name: '胺碘酮 (首剂)', 
      dose: `${(weight * 5).toFixed(0)} mg`, 
      note: 'VF/pVT: 5 mg/kg', 
      max: '300 mg',
      relevantSteps: ['SHOCKABLE_3', 'WIDE_QRS'],
      details: {
        indication: '难治性 VF/无脉性室速 (pVT)。',
        route: 'IV/IO。',
        info: '副作用包括低血压、心动过缓。在复苏期间可重复给药。'
      }
    },
    { 
      name: '腺苷 (1st → 2nd)', 
      dose: `${(weight * 0.1).toFixed(1)} → ${(weight * 0.2).toFixed(1)} mg`, 
      note: 'SVT快速推注', 
      max: '6mg → 12mg',
      relevantSteps: ['NARROW_QRS', 'WIDE_QRS', 'UNSTABLE'],
      details: {
        indication: '室上性心动过速 (SVT) 的药物转复。',
        route: '极速 IV/IO 推注（靠近心脏处）。',
        info: '半衰期 <10 秒。推注后需立即用 5-10ml 盐水冲管。可能引起短暂停搏。'
      }
    },
    { 
      name: '等张晶体液', 
      dose: `${(weight * 20).toFixed(0)} ml`, 
      note: '20 ml/kg, 快速输注',
      relevantSteps: ['NON_SHOCKABLE_1', 'ROSC', 'START'],
      details: {
        indication: '低血容量休克、严重脱水导致的循环灌注不良。',
        route: 'IV/IO 快速滴注。',
        info: '根据临床反应决定是否追加。注意评估心功能避免容量负荷过重。'
      }
    },
    { 
      name: '电除颤 (1st → 2nd → 次后)', 
      dose: `${(weight * 2).toFixed(0)} → ${(weight * 4).toFixed(0)} → ≥${(weight * 4).toFixed(0)} J`, 
      note: '最大 10 J/kg 或成人量',
      relevantSteps: ['SHOCKABLE_1', 'SHOCKABLE_CHECK_2', 'SHOCKABLE_2', 'SHOCKABLE_CHECK_3', 'SHOCKABLE_3'],
      details: {
        indication: '心室颤动 (VF)、无脉性室性心动过速 (pVT)。',
        route: '除颤仪电击。',
        info: '确保同步功能关闭。电击后立即恢复 CPR，不要停下来检查心律。'
      }
    },
    { 
      name: '同步电复律 (1st → 2nd)', 
      dose: `${(weight * 0.5).toFixed(1)} → ${(weight * 2).toFixed(0)} J`, 
      note: '首剂 0.5-1 J/kg',
      relevantSteps: ['UNSTABLE'],
      details: {
        indication: '不稳定型 SVT、不稳定型单形性 VT。',
        route: '除颤仪同步电击。',
        info: '必须确认开启 SYNC 模式。电击前确认 R 波同步标记正确。'
      }
    },
  ];

  const filteredDrugs = useMemo(() => {
    if (showAll || currentStepId === 'START' || currentStepId === 'ROSC') return drugs;
    return drugs.filter(drug => drug.relevantSteps?.includes(currentStepId));
  }, [currentStepId, showAll, drugs]);

  const hasFilter = currentStepId !== 'START' && currentStepId !== 'ROSC' && !showAll;

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900">精准剂量联动</h2>
          {hasFilter && (
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <Filter className="w-3 h-3" /> 已根据当前步骤过滤相关药物
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-100">
            {weight} KG
          </div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black transition-all ${showAll ? 'bg-slate-200 text-slate-600' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}
          >
            {showAll ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showAll ? '还原过滤' : '显示所有'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredDrugs.length > 0 ? filteredDrugs.map((drug, idx) => {
          const originalIdx = drugs.findIndex(d => d.name === drug.name);
          return (
            <div 
              key={originalIdx} 
              className={`bg-white rounded-[1.5rem] border transition-all cursor-pointer ${expandedIdx === originalIdx ? 'border-blue-400 shadow-md ring-1 ring-blue-100' : 'border-slate-100 shadow-sm hover:border-blue-200'}`}
              onClick={() => setExpandedIdx(expandedIdx === originalIdx ? null : originalIdx)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 pr-4">
                    <span className="text-[13px] font-black text-slate-800 leading-tight">{drug.name}</span>
                    <Info className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-base font-black text-blue-600 tabular-nums whitespace-nowrap">{drug.dose}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">{drug.note}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {drug.max && (
                      <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">极值: {drug.max}</span>
                    )}
                    {expandedIdx === originalIdx ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </div>
              </div>

              {expandedIdx === originalIdx && drug.details && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-blue-50/30 rounded-b-[1.5rem] animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-black text-blue-500 uppercase block mb-0.5">适应症</span>
                      <p className="text-[11px] font-bold text-slate-600 leading-snug">{drug.details.indication}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-blue-500 uppercase block mb-0.5">给药途径</span>
                      <p className="text-[11px] font-bold text-slate-600 leading-snug">{drug.details.route}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-blue-500 uppercase block mb-0.5">临床备注 / 副作用</span>
                      <p className="text-[11px] font-bold text-slate-700 leading-snug italic">{drug.details.info}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
             <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
             <p className="text-xs font-bold text-slate-400">当前步骤下无特定推荐药物</p>
             <button onClick={() => setShowAll(true)} className="mt-4 text-xs font-black text-blue-600 underline">查看完整清单</button>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-black text-slate-900 uppercase">临床实操提醒</span>
        </div>
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed space-y-2">
          • <span className="text-slate-900">肾上腺素</span>：如果是 1:1000 规格用于 IV，必须稀释 10 倍。<br/>
          • <span className="text-slate-900">胺碘酮</span>：在 VF/pVT 时可重复使用至 3 次。<br/>
          • <span className="text-slate-900">腺苷</span>：必须使用最靠近心脏的通路，并紧随 5-10ml 盐水冲管。
        </p>
      </div>
    </div>
  );
};

export default Calculator;
