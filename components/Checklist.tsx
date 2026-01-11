
import React, { useState } from 'react';
import { ClipboardCheck, CheckSquare, Square, Zap, HeartPulse } from 'lucide-react';

const Checklist: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'DURING' | 'POST'>('DURING');
  
  const [duringItems, setDuringItems] = useState([
    { id: 'd1', text: '指派团队负责人（Team Leader）', checked: false },
    { id: 'd2', text: '连接监护仪与除颤电极板', checked: false },
    { id: 'd3', text: '建立静脉 (IV) 或骨内 (IO) 通路', checked: false },
    { id: 'd4', text: '准备肾上腺素并确认剂量', checked: false },
    { id: 'd5', text: '评估可逆原因 (H\'s & T\'s)', checked: false },
    { id: 'd6', text: '确认 CPR 质量：深度、频率、回弹', checked: false },
    { id: 'd7', text: '如果建立高级气道：确认 ETCO2 波动', checked: false }
  ]);

  const [postItems, setPostItems] = useState([
    { id: 'p1', text: '呼吸：SpO2 94%-99%，PaCO2 35-45mmHg', checked: false },
    { id: 'p2', text: '循环：维持收缩压/舒张压在目标范围', checked: false },
    { id: 'p3', text: '神经：评估意识，避免高热 (&gt;37.5°C)', checked: false },
    { id: 'p4', text: '代谢：监测血糖与电解质', checked: false },
    { id: 'p5', text: '影像：完成 12 导联 ECG 与 胸片', checked: false },
    { id: 'p6', text: '转运：联系 PICU 进行后续 TTM 管理', checked: false }
  ]);

  const toggleItem = (id: string, list: any[], setList: any) => {
    setList(list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const renderList = (items: any[], setList: any) => (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => toggleItem(item.id, items, setList)}
          className="w-full flex items-center gap-4 p-5 text-left transition-all border-b border-slate-50 last:border-0 hover:bg-slate-50"
        >
          <div className="flex-shrink-0">
            {item.checked ? (
              <CheckSquare className="w-6 h-6 text-blue-600 fill-blue-50" />
            ) : (
              <Square className="w-6 h-6 text-slate-200" />
            )}
          </div>
          <span className={`text-sm font-bold leading-tight ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
            {item.text}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-slate-900">临床核查清单</h2>
        <ClipboardCheck className="w-6 h-6 text-blue-600" />
      </div>

      {/* 模式切换 */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveMode('DURING')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-black rounded-xl transition-all ${activeMode === 'DURING' ? 'bg-white shadow-md text-rose-600' : 'text-slate-500'}`}
        >
          <Zap className="w-4 h-4" />
          复苏中 (实时)
        </button>
        <button 
          onClick={() => setActiveMode('POST')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-black rounded-xl transition-all ${activeMode === 'POST' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}
        >
          <HeartPulse className="w-4 h-4" />
          复苏后 (ROSC)
        </button>
      </div>

      {/* 列表渲染 */}
      {activeMode === 'DURING' ? renderList(duringItems, setDuringItems) : renderList(postItems, setPostItems)}
      
      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">复苏决策背景 (H's & T's)</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500">
          <div>• 低血容量 (Hypovolemia)</div>
          <div>• 低氧血症 (Hypoxia)</div>
          <div>• 氢离子 (Acidosis)</div>
          <div>• 低/高钾血症</div>
          <div>• 张力性气胸</div>
          <div>• 心脏压塞</div>
          <div>• 毒素/药物</div>
          <div>• 肺/冠脉血栓</div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => {
            setDuringItems(duringItems.map(i => ({...i, checked: false})));
            setPostItems(postItems.map(i => ({...i, checked: false})));
          }}
          className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          重置所有核查项
        </button>
      </div>
    </div>
  );
};

export default Checklist;
