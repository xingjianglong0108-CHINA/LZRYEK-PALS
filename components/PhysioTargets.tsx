
import React from 'react';
import { PatientData } from '../types';
import { Target, HeartPulse, Droplets, Beaker, Wind, Zap } from 'lucide-react';

const PhysioTargets: React.FC<{ patient: PatientData }> = ({ patient }) => {
  const { age, weight } = patient;

  const getHRRange = (age: number) => {
    if (age < 0.25) return { min: 100, max: 205, label: "0-3月 (婴儿)" }; 
    if (age < 2) return { min: 100, max: 190, label: "3月-2岁 (幼儿)" };
    if (age <= 10) return { min: 60, max: 140, label: "2-10岁 (儿童)" };
    return { min: 60, max: 100, label: ">10岁 (青少年)" };
  };

  const getMinSBP = (age: number) => {
    if (age < 0.1) return 60; 
    if (age < 1) return 70;   
    if (age <= 10) return 70 + (2 * age); 
    return 90; 
  };

  const getMinDBP = (age: number) => {
    return age < 1 ? 25 : 30; 
  };

  const bolusVolume = weight * 20;
  const hrData = getHRRange(age);
  const minSbp = getMinSBP(age);
  const minDbp = getMinDBP(age);

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex justify-between items-center px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Target className="w-3 h-3" />
          Physiological Targets 2025
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-black text-slate-400">AGE: <span className="text-blue-600">{age}Y</span></span>
          <span className="text-[10px] font-black text-slate-400">WT: <span className="text-blue-600">{weight}KG</span></span>
        </div>
      </div>
      
      <div className="px-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">生理监测金标准</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          基于当前 {age}岁 / {weight}kg 动态计算
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-black text-slate-900 mb-1">心率范围 (HR)</h3>
              <span className="text-[9px] font-black text-slate-300 uppercase">{hrData.label}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mb-3">目标：维持在清醒状态参考值内。</p>
            <div className="bg-rose-50 p-3 rounded-xl inline-block border border-rose-100/50">
              <span className="text-lg font-black text-rose-600">{hrData.min} - {hrData.max}</span>
              <span className="text-[10px] font-bold text-rose-400 ml-1 uppercase">次/分</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">血压目标 (BP)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">公式: {age <= 10 && age >= 1 ? '70 + (2 × Age)' : '固定阈值'}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100/50">
                <span className="block text-[10px] font-black text-amber-600 uppercase mb-1">SBP 低限</span>
                <span className="text-lg font-black text-amber-700">≥{minSbp}</span>
                <span className="text-[10px] font-bold text-amber-500 ml-1">mmHg</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">CPR DBP</span>
                <span className="text-lg font-black text-slate-600">≥{minDbp}</span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md border-l-4 border-l-emerald-400">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Beaker className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">容量/液体复苏 (Bolus)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">首剂扩容：20 ml/kg 等渗晶体液。</p>
            <div className="bg-emerald-600 p-4 rounded-xl inline-flex items-center gap-3 shadow-lg shadow-emerald-100">
               <span className="text-2xl font-black text-white tabular-nums">{bolusVolume}</span>
               <div className="flex flex-col border-l border-white/20 pl-2">
                 <span className="text-[10px] font-bold text-emerald-100 uppercase leading-none mb-1">ML</span>
                 <span className="text-[8px] font-black text-emerald-200 uppercase leading-none">Total Volume</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Wind className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-slate-900 mb-1">呼吸与氧合 (SpO2/EtCO2)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-3">维持 SpO2 94-99%。ROSC 后控制 PaCO2。</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center border border-blue-100/50">
                <span className="block text-[10px] font-black text-blue-400 uppercase">SpO2 目标</span>
                <span className="text-base font-black text-blue-700">94% - 99%</span>
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center border border-blue-100/50">
                <span className="block text-[10px] font-black text-blue-400 uppercase">CPR EtCO2</span>
                <span className="text-base font-black text-blue-700">&gt;15 mmHg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Zap className="w-20 h-20" />
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">高质量 CPR 核心提示</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <span className="text-[9px] font-bold text-blue-300 uppercase block">频率</span>
               <span className="text-sm font-black text-slate-100">100-120 次/分</span>
             </div>
             <div>
               <span className="text-[9px] font-bold text-blue-300 uppercase block">深度</span>
               <span className="text-sm font-black text-slate-100">≥ 1/3 胸廓前后径</span>
             </div>
          </div>
          <p className="text-[10px] font-bold text-blue-200/60 leading-relaxed border-t border-white/10 pt-3">
            * 如发现 EtCO2 &lt; 15 mmHg 或 CPR DBP &lt; {minDbp} mmHg，提示按压质量不足。
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysioTargets;
