
import React, { useState } from 'react';
import { NavTab, PatientData, AlgorithmType } from './types';
import DecisionSupport from './components/DecisionSupport';
import PhysioTargets from './components/PhysioTargets';
import Calculator from './components/Calculator';
import Checklist from './components/Checklist';
import Theory from './components/Theory';
import { 
  Activity, 
  Calculator as CalcIcon, 
  ClipboardCheck, 
  BookOpen, 
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.DECISION);
  const [patient, setPatient] = useState<PatientData>({
    weight: 20,
    age: 5,
    isMultiRescuer: false
  });

  // 提升算法状态以供 Calculator 联动过滤
  const [algoType, setAlgoType] = useState<AlgorithmType>(AlgorithmType.CARDIAC_ARREST);
  const [currentStepId, setCurrentStepId] = useState('START');

  const renderTabContent = () => {
    switch (activeTab) {
      case NavTab.DECISION: 
        return (
          <DecisionSupport 
            patient={patient} 
            algoType={algoType} 
            setAlgoType={setAlgoType}
            currentStepId={currentStepId}
            setCurrentStepId={setCurrentStepId}
          />
        );
      case NavTab.TARGETS: return <PhysioTargets patient={patient} />;
      case NavTab.CALCULATOR: 
        return (
          <Calculator 
            patient={patient} 
            currentStepId={currentStepId} 
            algoType={algoType}
          />
        );
      case NavTab.CHECKLIST: return <Checklist />;
      case NavTab.THEORY: return <Theory />;
      default: return <DecisionSupport patient={patient} algoType={algoType} setAlgoType={setAlgoType} currentStepId={currentStepId} setCurrentStepId={setCurrentStepId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative">
      {/* Header */}
      <header className="p-6 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            儿科高级生命支持<span className="text-blue-600">-LZRYEK</span>
          </h1>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Build v2025.2</span>
             <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase">2025 AHA/AAP 指南</span>
          </div>
        </div>

        {/* Patient Config Area */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:border-blue-200">
            <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">体重 (KG)</label>
            <input 
              type="number" 
              value={patient.weight} 
              onChange={(e) => setPatient({...patient, weight: Number(e.target.value)})}
              className="text-2xl font-black text-slate-900 bg-transparent w-full focus:outline-none"
            />
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:border-blue-200">
            <label className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">年龄 (岁)</label>
            <input 
              type="number" 
              value={patient.age} 
              onChange={(e) => setPatient({...patient, age: Number(e.target.value)})}
              className="text-2xl font-black text-slate-900 bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Rescuer Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button 
            onClick={() => setPatient({...patient, isMultiRescuer: false})}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${!patient.isMultiRescuer ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-500'}`}
          >
            单人复苏 (30:2)
          </button>
          <button 
            onClick={() => setPatient({...patient, isMultiRescuer: true})}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${patient.isMultiRescuer ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'text-slate-500'}`}
          >
            多人复苏 (15:2)
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 px-2 mb-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">按压比例:</span>
            <span className="text-sm font-black text-rose-500 tracking-tight">{patient.isMultiRescuer ? '15:2' : '30:2'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">AED 电极:</span>
            <span className="text-sm font-black text-amber-500">{patient.weight < 25 ? '儿科型' : '成人型'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">通气频率:</span>
            <span className="text-sm font-black text-blue-600 tracking-tight">20-30 次/分</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">生理盐水:</span>
            <span className="text-sm font-black text-emerald-500">{patient.weight * 20} ml</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">肾上(IV/IO):</span>
            <span className="text-sm font-black text-rose-500">{(patient.weight * 0.1).toFixed(1)} ml</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">肾上(气管):</span>
            <span className="text-sm font-black text-rose-500 tracking-tight">{(patient.weight * 1.0).toFixed(1)} ml</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-8 flex justify-between items-center z-50">
        <NavButton 
          active={activeTab === NavTab.DECISION} 
          onClick={() => setActiveTab(NavTab.DECISION)} 
          icon={<Zap className="w-5 h-5" />} 
          label="决策引导" 
        />
        <NavButton 
          active={activeTab === NavTab.TARGETS} 
          onClick={() => setActiveTab(NavTab.TARGETS)} 
          icon={<Activity className="w-5 h-5" />} 
          label="生理目标" 
        />
        <NavButton 
          active={activeTab === NavTab.CALCULATOR} 
          onClick={() => setActiveTab(NavTab.CALCULATOR)} 
          icon={<CalcIcon className="w-5 h-5" />} 
          label="计算联动" 
        />
        <NavButton 
          active={activeTab === NavTab.CHECKLIST} 
          onClick={() => setActiveTab(NavTab.CHECKLIST)} 
          icon={<ClipboardCheck className="w-5 h-5" />} 
          label="核查清单" 
        />
        <NavButton 
          active={activeTab === NavTab.THEORY} 
          onClick={() => setActiveTab(NavTab.THEORY)} 
          icon={<BookOpen className="w-5 h-5" />} 
          label="理论要点" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-blue-50' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-black">{label}</span>
  </button>
);

export default App;
