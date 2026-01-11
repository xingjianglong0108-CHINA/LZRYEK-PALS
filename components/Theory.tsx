
import React, { useState } from 'react';
import { 
  ChevronDown, Wind, Zap, Syringe, Heart, Brain, 
  Activity, Microscope, Eye, Compass, AlertCircle, 
  Users, LifeBuoy, Stethoscope, Thermometer, Workflow, ShieldAlert,
  Settings2, HeartPulse
} from 'lucide-react';

interface TheorySection {
  id: string;
  tag: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Theory: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('chain_of_survival');

  const sections: TheorySection[] = [
    {
      id: 'chain_of_survival',
      tag: '核心体系',
      title: '生存链 (Chain of Survival)',
      icon: <LifeBuoy className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-md shadow-blue-100">
            <h4 className="text-[11px] font-black uppercase mb-2 border-b border-white/20 pb-1">院内生存链 (IHCA)</h4>
            <p className="text-[10px] font-bold leading-relaxed">早期识别预防 → 启动响应 → 高质量 CPR → 高级生命支持 → 复苏后护理 → 康复</p>
          </div>
          <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-md shadow-emerald-100">
            <h4 className="text-[11px] font-black uppercase mb-2 border-b border-white/20 pb-1">院外生存链 (OHCA)</h4>
            <p className="text-[10px] font-bold leading-relaxed">预防 → 启动响应 → 高质量 CPR → 快速除颤 → ALS 与转运 → 复苏后护理 → 康复</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 italic">2025 更新：生存链第 6 环“康复”贯穿急性期后的多学科管理。</p>
        </div>
      )
    },
    {
      id: 'airway_ventilation',
      tag: '高级气道',
      title: '通气与气道策略 (Airway Strategies)',
      icon: <Wind className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-[11px] font-black text-slate-600 uppercase mb-3">2025 通气频率标准</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-50">
                <span className="text-[9px] font-black text-blue-500 block uppercase">营救通气</span>
                <span className="text-sm font-black text-slate-700">20-30 次/分</span>
                <span className="text-[8px] block opacity-40">每 2-3s 一次</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-50">
                <span className="text-[9px] font-black text-blue-500 block uppercase">高级气道</span>
                <span className="text-sm font-black text-slate-700">20-30 次/分</span>
                <span className="text-[8px] block opacity-40">持续按压不中断</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h4 className="text-[11px] font-black text-slate-400 uppercase">关键决策要点</h4>
            <ul className="text-[10px] font-bold text-slate-600 space-y-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                <span><span className="text-blue-600">有囊导管：</span>首选。可减少漏气、降低再次插管率。套囊压需监测（&lt;20-25cmH2O）。</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                <span><span className="text-blue-600">EtCO2 确认：</span>金标准。波形二氧化碳监测是确认插管成功及位置的强制要求。</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'drug_admin',
      tag: '给药管理',
      title: '心脏骤停期间给药 (Drug Admin)',
      icon: <Syringe className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900 p-4 rounded-2xl text-white shadow-lg">
            <h4 className="text-[11px] font-black text-blue-300 uppercase mb-3">给药途径优先级 (Routes)</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 p-3 rounded-xl text-center border border-white/5">
                <span className="text-xs font-black">IV</span>
                <span className="block text-[8px] opacity-60">静脉 (首选)</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="flex-1 bg-white/10 p-3 rounded-xl text-center border border-white/5">
                <span className="text-xs font-black">IO</span>
                <span className="block text-[8px] opacity-60">骨内 (次选)</span>
              </div>
              <div className="text-white/20">→</div>
              <div className="flex-1 bg-white/5 p-3 rounded-xl text-center border border-white/5 opacity-60">
                <span className="text-xs font-black">ET</span>
                <span className="block text-[8px] opacity-60">气管内 (末选)</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <h4 className="text-[11px] font-black text-amber-600 uppercase mb-2">体重基准剂量 (Weight-Based)</h4>
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
              PALS 强调所有儿科给药必须基于体重。心脏骤停时，<span className="text-rose-600">肾上腺素 0.01 mg/kg</span> 是核心药物。ET 给药剂量需增加至 10 倍 (0.1 mg/kg)。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'cpr_quality',
      tag: '生理监测',
      title: 'CPR 生理学与质量衡量 (Quality)',
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3">目标生理指标</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-600">EtCO2 (呼气末二氧化碳)</span>
                <span className="text-sm font-black text-blue-600">&gt; 15 mmHg</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-600">DBP (舒张期动脉压) - 婴儿</span>
                <span className="text-sm font-black text-rose-600">≥ 25 mmHg</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-600">DBP (舒张期动脉压) - 儿童</span>
                <span className="text-sm font-black text-rose-600">≥ 30 mmHg</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 italic text-center">
            * 持续不达标提示按压深度不足或需要更换按压人员。
          </p>
        </div>
      )
    },
    {
      id: 'ecpr',
      tag: '体外复苏',
      title: '体外心肺复苏 (ECPR)',
      icon: <Workflow className="w-4 h-4" />,
      content: (
        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
          <h4 className="text-[11px] font-black text-sky-700 uppercase mb-2 flex items-center gap-2"><Workflow className="w-3.5 h-3.5" /> ECPR 启动指征</h4>
          <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
            对于院内发生的、有可逆病因且常规 CPR 无效的患儿，应尽早（复苏 20-30 分钟内）考虑启动 ECPR。
          </p>
          <div className="mt-3 p-3 bg-white rounded-xl border border-sky-50 text-[10px] font-bold text-slate-500">
            • 特别适用于心源性疾病、单心室或术后心脏停搏。<br />
            • 需由具有丰富经验的体外生命支持团队执行。
          </div>
        </div>
      )
    },
    {
      id: 'post_arrest_care',
      tag: 'ROSC 阶段',
      title: '复苏后治疗与监护 (PCAC)',
      icon: <Brain className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
            <h4 className="text-[11px] font-black text-sky-700 uppercase mb-2 flex items-center gap-2"><Thermometer className="w-3.5 h-3.5" /> 目标体温管理 (TTM)</h4>
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed mb-2">
              方案 A: 32°C-34°C 维持 2 天，再 36°C-37.5°C 维持 3 天。<br />
              方案 B: 36°C-37.5°C 维持 5 天。
            </p>
            <span className="text-[10px] font-black text-rose-600">严禁：ROSC 后发热 (&gt;38°C)。</span>
          </div>
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <h4 className="text-[11px] font-black text-indigo-700 uppercase mb-2">循环与氧合管理</h4>
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
              • 血压：SBP &gt; 第 5 百分位数。<br />
              • 氧合：SpO2 94%-99%，PaO2 目标正常化（避免高氧伤害）。
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-[11px] font-black text-slate-500 uppercase mb-2">神经学监护 (EEG)</h4>
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
              24h 内启动 EEG 监测。识别并积极治疗非惊厥性癫痫并积极治疗。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'neuro_prognosis',
      tag: '预后判定',
      title: '神经预后评估时机 (Neuroprog)',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-[10px] text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-2 font-black text-slate-500 uppercase">时机</th>
                <th className="p-2 font-black text-slate-500 uppercase">评估方式</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
              <tr>
                <td className="p-2 text-blue-600">24h 内</td>
                <td className="p-2">EEG 监测</td>
              </tr>
              <tr>
                <td className="p-2 text-amber-600">24-72h</td>
                <td className="p-2">SSEP (诱发电位)、临床反射</td>
              </tr>
              <tr>
                <td className="p-2 text-rose-600">2-7 天</td>
                <td className="p-2">MRI (DWI 序列) - 关键影像期</td>
              </tr>
              <tr>
                <td className="p-2 text-emerald-600">72h 后</td>
                <td className="p-2">多模态综合判定 (不应单靠一种方式)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'single_ventricle',
      tag: '复杂 CHD',
      title: '单心室复苏要点 (SV CHD)',
      icon: <Heart className="w-4 h-4" />,
      content: (
        <div className="space-y-4 bg-rose-50 p-4 rounded-2xl border border-rose-100">
          <h4 className="text-[11px] font-black text-rose-600 uppercase mb-2 flex items-center gap-2"><HeartPulse className="w-3.5 h-3.5" /> 生理特异性管理</h4>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-rose-500 block">Stage I (Norwood)</span>
              <p className="text-[10px] font-bold text-slate-500 mt-1">需平衡 Qp:Qs。避免高氧（会降低肺阻力引发体循环低灌注）。</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-rose-500 block">Stage II/III (Fontan)</span>
              <p className="text-[10px] font-bold text-slate-500 mt-1">依赖静脉压驱动。复苏需极低气道压（低 PEEP、低频率）。常规 CPR 效果极差，首选 ECPR。</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'recovery_roadmap',
      tag: '康复期',
      title: '康复路线图与猝死评估 (SUCA)',
      icon: <Compass className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-100">
            <h4 className="text-xs font-black uppercase mb-3">康复路线图要点</h4>
            <div className="space-y-2 text-[10px] font-bold opacity-90 leading-relaxed">
              <p>• 早期 PT/OT/SLP 介入，筛查 PTSD。</p>
              <p>• 3-6 个月内完成系统神经心理评估（学习、记忆）。</p>
              <p>• 制定个体化教育计划 (IEP) 支持学校融入。</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <h4 className="text-[11px] font-black text-amber-700 uppercase mb-2">猝死评估 (SUCA) 与家属</h4>
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
              对于不明原因猝死，建议进行尸检和分子筛查。应允许并支持家属在复苏现场陪同（指派专人沟通）。
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 leading-tight">PALS 要点库 2025</h2>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Comprehensive Decision Support Encyclopedia</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-all ${
                openSection === section.id ? 'bg-slate-100 text-blue-600 shadow-inner' : 'hover:bg-slate-50 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  openSection === section.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter block opacity-60 ${
                    openSection === section.id ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {section.tag}
                  </span>
                  <span className="text-sm font-black">{section.title}</span>
                </div>
              </div>
              {openSection === section.id ? <ChevronDown className="w-5 h-5 opacity-60 rotate-180 transition-transform" /> : <ChevronDown className="w-5 h-5 opacity-40 transition-transform" />}
            </button>
            
            {openSection === section.id && (
              <div className="p-5 bg-white border-x border-b border-slate-100 animate-in slide-in-from-top-2 duration-300">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-200">
        <div className="flex items-center gap-2 mb-2 text-slate-400">
          <ShieldAlert className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">临床参考声明</h3>
        </div>
        <p className="text-[9px] font-bold text-slate-500 leading-relaxed text-justify">
          本库内容基于 2025 年 AHA/AAP 指南最新修订版编译。所有剂量和生理指标均为理论参考值，旨在辅助教学与决策复盘。抢救现场应遵循标准流程及执业医师判断。
        </p>
      </div>
    </div>
  );
};

export default Theory;
