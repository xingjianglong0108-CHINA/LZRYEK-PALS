
import React, { useState, useMemo } from 'react';
import { PatientData, DrugDose, AlgorithmType, EquipmentSize } from '../types';
import { 
  AlertTriangle, Shield, ChevronDown, Ruler, Beaker, Binary, Info, HeartPulse, Zap
} from 'lucide-react';

interface CalculatorProps {
  patient: PatientData;
  currentStepId: string;
  algoType: AlgorithmType;
}

const Calculator: React.FC<CalculatorProps> = ({ patient, currentStepId, algoType }) => {
  const weight = patient.weight;
  const age = patient.age;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'DRUGS' | 'EQUIPMENT'>('DRUGS');

  const equipment: EquipmentSize[] = [
    { name: '气管导管 (ETT - 有囊)', size: `${(age / 4 + 3.5).toFixed(1)} mm`, note: '内径 (ID)' },
    { name: '气管导管 (ETT - 无囊)', size: `${(age / 4 + 4).toFixed(1)} mm`, note: '内径 (ID)' },
    { name: '插管深度 (唇)', size: `${(weight / 2 + 12).toFixed(1)} cm`, note: '或 ID × 3' },
    { name: '喉镜片 (Laryngoscope)', size: age < 1 ? '1 号' : (age < 2 ? '1.5 号' : '2 号'), note: 'Miller 或 Macintosh' },
    { name: '吸痰管 (Suction Catheter)', size: `${Math.round((age / 4 + 4) * 2) + 2} F`, note: '插管 ID × 2' },
    { name: '除颤电极板 (Paddles)', size: weight < 10 ? '婴儿型 (4.5cm)' : '成人型 (8-12cm)', note: '接触充分是关键' }
  ];

  const drugs: DrugDose[] = [
    { 
      name: '肾上腺素 (IV/IO)', 
      dose: `${(weight * 0.1).toFixed(1)} ml`, 
      note: '0.01 mg/kg (1:10000)', 
      max: '1 mg (10ml)',
      details: {
        indication: '【所有心脏骤停】(VF/pVT/PEA/心脏停搏)；有症状的心动过缓。',
        route: '静脉/骨内快速推注；每3-5分钟一次。',
        info: 'PALS 核心药物。不可电击心律(PEA/停搏)应尽早给药。'
      }
    },
    { 
      name: '肾上腺素 (气管内/ET)', 
      dose: `${(weight * 0.1).toFixed(1)} ml (1:1000)`, 
      note: '0.1 mg/kg (浓度为1:1000)', 
      max: '2.5 mg (2.5ml)',
      details: {
        indication: '心脏骤停期间无法建立 IV/IO 通路时的最后选择。',
        route: '气管内给药；给药后需数次正压通气。',
        info: '注意：ET 给药浓度是 1:1000，剂量是 IV 的 10 倍，吸收不确定。'
      }
    },
    { 
      name: '胺碘酮 (Amiodarone)', 
      dose: `${(weight * 5).toFixed(0)} mg`, 
      note: '5 mg/kg', 
      max: '300 mg',
      details: {
        indication: '【难治性心律失常】：电击无效的室颤 (VF) 或无脉性室速 (pVT)。',
        route: 'IV/IO 快速推注；复苏期间最多使用 3 剂。',
        info: '若有脉搏的室速，需在 20-60 分钟内缓慢滴注。'
      }
    },
    { 
      name: '利多卡因 (Lidocaine)', 
      dose: `${(weight * 1).toFixed(0)} mg`, 
      note: '1 mg/kg', 
      details: {
        indication: '【心室性心律失常】：室颤 (VF) 或无脉性室速 (pVT) 的替代药。',
        route: 'IV/IO 推注；维持量 20-50 mcg/kg/min。',
        info: '与胺碘酮效果相当，可根据科室习惯选择。'
      }
    },
    { 
      name: '腺苷 (Adenosine)', 
      dose: `${(weight * 0.1).toFixed(1)} mg`, 
      note: '0.1 mg/kg (首剂)', 
      max: '6 mg',
      details: {
        indication: '【室上速 (SVT)】：用于折返性室上性心动过速的转复。',
        route: '最靠近心脏的静脉，极速推注 + 快速盐水冲管。',
        info: '半衰期极短(<10s)；若无效，第二剂可增加至 0.2 mg/kg。'
      }
    },
    { 
      name: '阿托品 (Atropine)', 
      dose: `${(weight * 0.02).toFixed(2)} mg`, 
      note: '0.02 mg/kg', 
      max: '0.5 mg (单剂)',
      details: {
        indication: '【心动过缓】：由迷走神经张力增高、药物毒性或原发性房室传导阻滞引起。',
        route: 'IV/IO 推注；最小剂量 0.1 mg。',
        info: '气管插管期间预防迷走神经反射引起的心率下降。'
      }
    },
    { 
      name: '碳酸氢钠 (NaHCO3)', 
      dose: `${(weight * 1).toFixed(0)} ml (8.4%)`, 
      note: '1 mEq/kg', 
      details: {
        indication: '【代谢性酸中毒】：严重的代谢性酸中毒、高钾血症、三环类抗抑郁药中毒。',
        route: 'IV/IO 缓慢给药。',
        info: '确保通气充足（排除产生的CO2），避免与儿茶酚胺在同一管路混合。'
      }
    },
    { 
      name: '氯化钙 (CaCl2)', 
      dose: `${(weight * 20).toFixed(0)} mg`, 
      note: '20 mg/kg (10%溶液为0.2ml/kg)', 
      details: {
        indication: '【特定代谢异常】：低钙血症、高钾血症、高镁血症、钙通道阻滞剂中毒。',
        route: 'IV/IO 缓慢推注（最好经中心静脉）。',
        info: '常规复苏不推荐使用，可能加重缺血再灌注损伤。'
      }
    },
    { 
      name: '硫酸镁 (MgSO4)', 
      dose: `${(weight * 50).toFixed(0)} mg`, 
      note: '25-50 mg/kg', 
      max: '2 g',
      details: {
        indication: '【特殊心律失常】：尖端扭转室速 (Torsades de Pointes)；严重哮喘。',
        route: '心脏骤停时快速推注；有脉搏时 15-30 分钟。',
        info: '注意可能引起严重低血压。'
      }
    },
    { 
      name: '葡萄糖 (Dextrose)', 
      dose: `${(weight * 5).toFixed(0)} ml (D10W)`, 
      note: '0.5 g/kg', 
      details: {
        indication: '【代谢支持】：低血糖症。',
        route: 'IV/IO；建议使用 10% 葡萄糖。',
        info: '复苏期间及复苏后均应严密监测血糖，避免高血糖或低血糖。'
      }
    }
  ];

  return (
    <div className="space-y-4 pt-4 pb-20 animate-in fade-in duration-500">
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveSubTab('DRUGS')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${activeSubTab === 'DRUGS' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          <Beaker className="w-4 h-4 inline-block mr-1 mb-0.5" /> 核心给药计算
        </button>
        <button 
          onClick={() => setActiveSubTab('EQUIPMENT')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${activeSubTab === 'EQUIPMENT' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          <Ruler className="w-4 h-4 inline-block mr-1 mb-0.5" /> 设备规格
        </button>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Binary className="w-3 h-3" />
          {activeSubTab === 'DRUGS' ? '2025 PALS Weight-Based Drugs' : 'Equipment Sizing'}
        </div>
        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-lg shadow-emerald-100">
          {weight} KG
        </span>
      </div>

      {activeSubTab === 'DRUGS' ? (
        <div className="grid grid-cols-1 gap-3">
          {drugs.map((drug, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${expandedIdx === idx ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-100 shadow-sm'}`}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="p-4 flex justify-between items-center">
                <div className="flex flex-col flex-1 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-800 leading-tight">{drug.name}</span>
                    {(drug.name.includes('肾上腺') || drug.name.includes('胺碘') || drug.name.includes('利多') || drug.name.includes('腺苷') || drug.name.includes('阿托')) && (
                       <Zap className="w-3 h-3 text-rose-500" />
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{drug.note}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-lg font-black tabular-nums">
                    {drug.dose}
                  </div>
                  {drug.max && <span className="text-[8px] font-black text-rose-500 uppercase mt-1">MAX: {drug.max}</span>}
                </div>
              </div>
              {expandedIdx === idx && drug.details && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-50 bg-slate-50/50">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-black text-blue-500 uppercase block mb-0.5">核心指征 (Arrhythmia/Condition)</span>
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed">{drug.details.indication}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-0.5">给药路径 (Route)</span>
                        <p className="text-[10px] font-bold text-slate-600">{drug.details.route}</p>
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-0.5">临床备注 (Expert Note)</span>
                        <p className="text-[10px] font-bold text-slate-500 italic">{drug.details.info}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {equipment.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center transition-all hover:border-blue-100">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800">{item.name}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.note}</span>
              </div>
              <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">{item.size}</span>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 flex items-start gap-4 shadow-sm">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase mb-1">给药安全提示</p>
          <p className="text-[9px] font-bold opacity-80 leading-relaxed">
            所有计算均基于 2025 PALS 指南。在抢救高压环境下，请务必实行“双人核对、大声宣读”制度，核实药物浓度、途径及指征后再行给药。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
