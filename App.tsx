
import React, { useState } from 'react';
import { NavTab, PatientData, AlgorithmType } from './types';
import DecisionSupport from './components/DecisionSupport';
import PhysioTargets from './components/PhysioTargets';
import Calculator from './components/Calculator';
import Checklist from './components/Checklist';
import Theory from './components/Theory';
import ResuscitationTimer from './components/ResuscitationTimer';
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

  const [algoType, setAlgoType] = useState<AlgorithmType>(AlgorithmType.CARDIAC_ARREST);
  const [currentStepId, setCurrentStepId] = useState('START');

  // 即时计算输出项逻辑
  const calcStats = {
    ratio: patient.isMultiRescuer ? '15:2' : '30:2',
    aed: (patient.age < 8 || patient.weight < 25) ? '儿科型' : '成人型',
    vent: '20-30 次/分',
    saline: `${patient.weight * 20} ml`,
    epiIv: `${(patient.weight * 0.1).toFixed(1)} ml`,
    epiEt: `${(patient.weight * 1.0).toFixed(1)} ml`
  };

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
          <h1 className="text-xl font-black text-slate-900 leading-tight">
            儿科高级生命支持<span className="text-blue-600">-LZRYEK</span>
          </h1>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Build v2025.3</span>
          </div>
        </div>

        {/* Patient Config Area */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:border-blue-200">
            <label className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">体重 (KG)</label>
            <input 
              type="number" 
              value={patient.weight} 
              onChange={(e) => setPatient({...patient, weight: Number(e.target.value)})}
              className="text-xl font-black text-slate-900 bg-transparent w-full focus:outline-none"
            />
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:border-blue-200">
            <label className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">年龄 (岁)</label>
            <input 
              type="number" 
              value={patient.age} 
              onChange={(e) => setPatient({...patient, age: Number(e.target.value)})}
              className="text-xl font-black text-slate-900 bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Rescuer Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button 
            onClick={() => setPatient({...patient, isMultiRescuer: false})}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${!patient.isMultiRescuer ? 'bg-white shadow-md text-blue-600 scale-[1.01]' : 'text-slate-500'}`}
          >
            单人复苏 (30:2)
          </button>
          <button 
            onClick={() => setPatient({...patient, isMultiRescuer: true})}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${patient.isMultiRescuer ? 'bg-white shadow-md text-blue-600 scale-[1.01]' : 'text-slate-500'}`}
          >
            多人复苏 (15:2)
          </button>
        </div>

        {/* 即时计算输出项卡盘 - 参照图片样式 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-[11px] font-bold text-slate-500">按压比例:</span>
              <span className="text-[13px] font-black text-rose-500">{calcStats.ratio}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-[11px] font-bold text-slate-500">AED 电极:</span>
              <span className="text-[13px] font-black text-amber-500">{calcStats.aed}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-[11px] font-bold text-slate-500">通气频率:</span>
              <span className="text-[13px] font-black text-blue-500">{calcStats.vent}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-[11px] font-bold text-slate-500">生理盐水:</span>
              <span className="text-[13px] font-black text-emerald-500">{calcStats.saline}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500">肾上(IV/IO):</span>
              <span className="text-[13px] font-black text-rose-500">{calcStats.epiIv}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500">肾上(气管):</span>
              <span className="text-[13px] font-black text-rose-500">{calcStats.epiEt}</span>
            </div>
          </div>
        </div>

        {/* Global Resuscitation Timer */}
        <div className="mb-6">
           <ResuscitationTimer />
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
          label="决策" 
        />
        <NavButton 
          active={activeTab === NavTab.TARGETS} 
          onClick={() => setActiveTab(NavTab.TARGETS)} 
          icon={<Activity className="w-5 h-5" />} 
          label="目标" 
        />
        <NavButton 
          active={activeTab === NavTab.CALCULATOR} 
          onClick={() => setActiveTab(NavTab.CALCULATOR)} 
          icon={<CalcIcon className="w-5 h-5" />} 
          label="剂量" 
        />
        <NavButton 
          active={activeTab === NavTab.CHECKLIST} 
          onClick={() => setActiveTab(NavTab.CHECKLIST)} 
          icon={<ClipboardCheck className="w-5 h-5" />} 
          label="核查" 
        />
        <NavButton 
          active={activeTab === NavTab.THEORY} 
          onClick={() => setActiveTab(NavTab.THEORY)} 
          icon={<BookOpen className="w-5 h-5" />} 
          label="要点" 
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
