
import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Info, Wind, Zap, Syringe, Heart, Brain, Users, RefreshCw, Activity, Microscope, Eye, Compass, Home, GraduationCap, HeartHandshake } from 'lucide-react';

interface TheorySection {
  id: string;
  tag: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Theory: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('airway');

  const sections: TheorySection[] = [
    {
      id: 'airway',
      tag: '首要任务',
      title: '呼吸衰竭与开放气道',
      icon: <Wind className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-[11px] font-black text-blue-600 uppercase mb-2">【开放气道技术】</h4>
            <ul className="text-xs font-bold text-slate-700 space-y-2">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                仰头提颏法：适用于无脊柱损伤嫌疑的患儿。
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                推下颌法：怀疑有颈椎损伤时使用，减少颈部移动。
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <h4 className="text-[11px] font-black text-slate-500 uppercase mb-2">【2025 通气标准】</h4>
            <p className="text-xs font-bold text-slate-600 mb-3">若脉搏 ≥ 60 次/分但呼吸异常（营救通气）：</p>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-4 shadow-sm">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Wind className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900">20 - 30 次/分</span>
                <span className="block text-[10px] font-bold text-slate-400">即每 2-3 秒 1 次通气</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-3 italic">注：建立高级气道后，复苏期间亦应维持此频率。</p>
          </div>
        </div>
      )
    },
    {
      id: 'chain',
      tag: '生存核心',
      title: '2025 PALS 生存链',
      icon: <RefreshCw className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <span className="text-[10px] font-black text-rose-600 uppercase">院外 (OHCA)</span>
              <p className="text-[11px] font-bold text-slate-700 mt-1">预防(安全) → 识别并启动应急 → 高质量 CPR → 高级生命支持 → 复苏后护理 → 康复</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-[10px] font-black text-blue-600 uppercase">院内 (IHCA)</span>
              <p className="text-[11px] font-bold text-slate-700 mt-1">早期识别/预防(MET) → 启动应急 → 高质量 CPR → 高级生命支持 → 复苏后护理 → 康复</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'drugs',
      tag: '药物管理',
      title: '复苏药物给药规范',
      icon: <Syringe className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-2 px-1 text-[10px] font-black text-slate-400 uppercase">途径</th>
                  <th className="py-2 px-1 text-[10px] font-black text-slate-400 uppercase">剂量</th>
                  <th className="py-2 px-1 text-[10px] font-black text-slate-400 uppercase">备注</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2 px-1 text-blue-600">IV / IO</td>
                  <td className="py-2 px-1 font-black">0.01 mg/kg</td>
                  <td className="py-2 px-1 text-slate-500">1:10000 规格</td>
                </tr>
                <tr>
                  <td className="py-2 px-1 text-amber-600">ET (气管)</td>
                  <td className="py-2 px-1 font-black">0.1 mg/kg</td>
                  <td className="py-2 px-1 text-slate-500">1:1000 规格</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'neuro_prog',
      tag: '核心监测',
      title: '神经预后评估与时机',
      icon: <Brain className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <h4 className="text-[11px] font-black uppercase mb-1">多模态预后评估 (72h 后)</h4>
            <p className="text-[11px] font-bold opacity-90">复苏后脑损伤判定严禁单一指标，应结合临床、生理及影像。</p>
          </div>
          <div className="space-y-2">
            <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-[9px] font-black text-blue-500 block">24h</span>
                <Activity className="w-4 h-4 mx-auto mt-1 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-800">脑电图 (EEG)</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1">识别非惊厥性癫痫持续状态。</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-[9px] font-black text-amber-500 block">2-7天</span>
                <Eye className="w-4 h-4 mx-auto mt-1 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-800">MRI (DWI)</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1">广泛弥散受限提示预后不良。</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'roadmap',
      tag: '关键路径',
      title: 'Figure 5. 康复路线图 (Roadmap)',
      icon: <Compass className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 p-2">
               <HeartHandshake className="w-12 h-12 text-emerald-600" />
            </div>
            <h4 className="text-[11px] font-black text-emerald-700 uppercase mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> 阶段 1：住院期间 (In-Hospital)
            </h4>
            <ul className="text-[11px] font-bold text-slate-700 space-y-2">
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><span className="text-emerald-600">早期康复：</span>ROSC 后 48-72h 内启动物理/职业/言语治疗 (PT/OT/SLP) 评估。</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><span className="text-emerald-600">心理支持：</span>筛查患儿及其家属的创伤后应激 (PTSD) 风险。</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><span className="text-emerald-600">营养优化：</span>建立肠内营养目标，支持大脑修复与生长。</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h4 className="text-[11px] font-black text-blue-700 uppercase mb-3 flex items-center gap-2">
              <Home className="w-3.5 h-3.5" /> 阶段 2：出院与过渡 (Discharge)
            </h4>
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded-xl border border-blue-50">
                <p className="text-[11px] font-bold text-slate-800 leading-snug">
                  <span className="font-black text-blue-600">结构化摘要：</span>包含骤停详情、住院期间神经系统演变、后续药物计划及预定的随访清单。
                </p>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-blue-50">
                <p className="text-[11px] font-bold text-slate-800 leading-snug">
                  <span className="font-black text-blue-600">社区转衔：</span>确保初级保健医生 (PCP) 与社区康复资源的无缝对接。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl text-white relative shadow-xl">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-emerald-500 p-1.5 rounded-lg">
                 <GraduationCap className="w-4 h-4 text-white" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">阶段 3：长期康复 (Post-Discharge)</h4>
             </div>
             <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black">1</div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase">3-6 个月随访</span>
                    <p className="text-[11px] font-bold mt-0.5">多学科评估：重点关注认知缺陷、执行功能及运动协调能力。</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black">2</div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase">重返校园支持</span>
                    <p className="text-[11px] font-bold mt-0.5">提供“个性化教育计划 (IEP)”，针对由于脑损伤引起的学习障碍进行干预。</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black">3</div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase">PICS-p 监测</span>
                    <p className="text-[11px] font-bold mt-0.5">持续筛查儿童 PICU 后综合征，包括心理行为异常和社交退缩。</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">PALS 核心要点 (2025)</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MAJOR CONCEPTS & DETAILED GUIDELINES</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-all ${openSection === section.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${openSection === section.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                  {section.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter block opacity-60 ${openSection === section.id ? 'text-white' : 'text-amber-600'}`}>
                    {section.tag}
                  </span>
                  <span className="text-sm font-black">{section.title}</span>
                </div>
              </div>
              {openSection === section.id ? <ChevronUp className="w-5 h-5 opacity-60" /> : <ChevronDown className="w-5 h-5 opacity-40" />}
            </button>
            
            {openSection === section.id && (
              <div className="p-5 bg-white animate-in slide-in-from-top-2 duration-300">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Info className="w-5 h-5" />
          <h3 className="text-sm font-black uppercase tracking-wider">核心复盘考点</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <span className="text-blue-600 font-black text-lg">#1</span>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              神经评估应采用<span className="text-blue-600">多模态方式</span>，严禁在 ROSC 后 72h 内仅凭单一指标断言预后。
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-blue-600 font-black text-lg">#2</span>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              脑电图监测应在复苏后 <span className="text-blue-600">24h 内</span> 尽早启动，以识别并治疗非惊厥性癫痫持续状态。
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-blue-600 font-black text-lg">#3</span>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              康复路线图强调从 PICU 到社区的长程管理，必须重视生存者的心理健康与教育支持。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theory;
