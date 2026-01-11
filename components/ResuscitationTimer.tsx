
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Activity } from 'lucide-react';

const ResuscitationTimer: React.FC = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [cycleTime, setCycleTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalTime(t => t + 1);
        setCycleTime(c => {
          if (c >= 120) return 0; // 2 min cycle for Pulse Check
          return c + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let metronomeInterval: any;
    if (isMetronomeOn && isRunning) {
      const bpm = 110; 
      const intervalMs = (60 / bpm) * 1000;
      
      metronomeInterval = setInterval(() => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.1);
      }, intervalMs);
    }
    return () => clearInterval(metronomeInterval);
  }, [isMetronomeOn, isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (cycleTime / 120) * 100;

  return (
    <div className="bg-blue-900 rounded-3xl p-5 text-white shadow-2xl relative border border-white/10 overflow-hidden transition-all active:scale-[0.99]">
      <div className="absolute bottom-0 left-0 h-1 bg-blue-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Resus Time
          </span>
          <span className="text-3xl font-black tabular-nums tracking-tighter">{formatTime(totalTime)}</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Cycle (2 Min)</span>
          <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1.5 ${cycleTime > 110 ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-800 text-blue-300'}`}>
             <Activity className="w-3 h-3" />
             <span className="text-sm font-black tabular-nums">{formatTime(cycleTime)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95 shadow-lg ${
            isRunning ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? '暂停' : '开始复苏'}
        </button>
        
        <button 
          onClick={() => {
            setTotalTime(0);
            setCycleTime(0);
            setIsRunning(false);
          }}
          className="bg-blue-800 px-4 rounded-2xl flex items-center justify-center transition-all active:scale-90"
        >
          <RotateCcw className="w-5 h-5 text-blue-300" />
        </button>

        <button 
          onClick={() => setIsMetronomeOn(!isMetronomeOn)}
          className={`px-4 rounded-2xl flex items-center justify-center transition-all ${
            isMetronomeOn ? 'bg-blue-500 text-white' : 'bg-blue-800 text-blue-300'
          }`}
        >
          {isMetronomeOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
      
      {cycleTime > 115 && (
        <div className="mt-3 text-center animate-bounce">
           <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">检查心律与脉搏！</span>
        </div>
      )}
    </div>
  );
};

export default ResuscitationTimer;
