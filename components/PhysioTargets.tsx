
import React from 'react';
import { PatientData } from '../types';
import { Target, Thermometer, Droplets, Wind, Activity, HeartPulse } from 'lucide-react';

const PhysioTargets: React.FC<{ patient: PatientData }> = ({ patient }) => {
  const age = patient.age;

  // 2025 PALS 指南：各年龄段正常心率范围 (清醒状态)
  const getHRRange = (age: number) => {
    if (age < 0.1) return "100 - 180"; // 新生儿 (0-1月)
    if (age < 1) return "100 - 160";   // 婴儿 (1月-1岁)
    if (age <= 3) return "90 - 150";   // 幼儿 (1-3岁)
    if (age <= 5) return "80 - 140";   // 学龄前 (3-5岁)
    if (age <= 12) return "70 - 120";  // 学龄期 (5-12岁)
    return "60 - 100";                 // 青少年 (>12岁)
  };

  // 2025 PALS 指南：各年龄段收缩压 (SBP) 第5百分位数 (低血压界限)
  const getMinSBP = (age: number) => {
    if (age < 0.1) return 60; // 新生儿
    if (age < 1) return 70;   // 婴儿
    if (age <= 10) return 70 + (2 * age); // 1-10岁公式
    return 90; // >10岁
  };

  // 2025 PALS 指南：心肺复苏期间舒张压 (DBP) 监测目标 (有创动脉压)
  const getMinDBP = (age: number) => {
    return age < 1 ? 25 : 30; // 婴儿 ≥25, 儿童 ≥30
  };

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
        <Target className="w-3 h-3" />
        Physiological Targets 2025
      </div>
      
      <div className="px-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">生理监测金标准</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">当前患者年龄: {age} 岁</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 心率目标 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">心率范围 (HR)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">目标：维持在对应年龄的正常范围内。</p>
            <div className="bg-rose-50 p-3 rounded-xl inline-block">
              <span className="text-lg font-black text-rose-600">{getHRRange(age)}</span>
              <span className="text-[10px] font-bold text-rose-400 ml-1 uppercase">次/分</span>
            </div>
          </div>
        </div>

        {/* 血压目标 - 强化收缩压与舒张压 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">血压目标 (BP)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">防止灌注不足。维持 SBP &gt; 5th 百分位数。</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-xl">
                <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">SBP 低限</span>
                <span className="text-lg font-black text-amber-700">≥{getMinSBP(age)}</span>
                <span className="text-[10px] font-bold text-amber-500 ml-1">mmHg</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">CPR DBP</span>
                <span className="text-lg font-black text-slate-600">≥{getMinDBP(age)}</span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 呼吸目标 - ETCO2 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Wind className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">呼吸与氧合 (SpO2/EtCO2)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">维持 SpO2 94-99%。ROSC 后控制 PaCO2。</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center">
                <span className="block text-[10px] font-black text-blue-400 uppercase">SpO2 目标</span>
                <span className="text-base font-black text-blue-700">94% - 99%</span>
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center">
                <span className="block text-[10px] font-black text-blue-400 uppercase">CPR EtCO2</span>
                <span className="text-base font-black text-blue-700">&gt;15 mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 体温管理 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">体温目标 (TTM)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-2">防止脑损伤。严禁发热 (&gt;37.5°C)。</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black border border-emerald-100">
              36.0°C - 37.5°C
            </div>
          </div>
        </div>
      </div>

      {/* CPR 质量深度核查卡片 */}
      <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">高质量 CPR 实时基准</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-3">
            <div>
              <span className="block text-[10px] font-bold opacity-40 uppercase tracking-tighter">按压频率</span>
              <span className="text-sm font-black">100 - 120 次/分</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold opacity-40 uppercase tracking-tighter">按压深度</span>
              <span className="text-sm font-black">≥1/3 胸廓前后径</span>
            </div>
          </div>
          <div className="flex justify-between items-end border-b border-white/10 pb-3">
            <div>
              <span className="block text-[10px] font-bold opacity-40 uppercase tracking-tighter">通气频率 (有气道)</span>
              <span className="text-sm font-black">1 次 / 2-3 秒</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold opacity-40 uppercase tracking-tighter">通气频率 (无气道)</span>
              <span className="text-sm font-black">{patient.isMultiRescuer ? '15 : 2' : '30 : 2'}</span>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-[10px] font-bold text-emerald-400/80 leading-relaxed italic">
              * 临床提醒：舒张压 (DBP) &lt; 25/30 mmHg 提示按压质量不足，需改进。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysioTargets;
