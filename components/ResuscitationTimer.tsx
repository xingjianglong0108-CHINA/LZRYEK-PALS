
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Timer as TimerIcon } from 'lucide-react';

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
          if (c >= 120) return 0; // 2 min cycle
          return c + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Simple Metronome Logic (Simulated Beep)
  useEffect(() => {
    let metronomeInterval: any;
    if (isMetronomeOn && isRunning) {
      const bpm = 110;
      const intervalMs = (60 / bpm) * 1000;
      
      metronomeInterval = setInterval(() => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1);
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
    <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl overflow-hidden relative border border-white/10">
      <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">总抢救时长</span>
            <span className="text-2xl font-black tabular-nums">{formatTime(totalTime)}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">2分钟循环周期</span>
          <span className={`text-2xl font-black tabular-nums ${cycleTime > 110 ? 'text-rose-500' : 'text-blue-400'}`}>
            {formatTime(cycleTime)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`col-span-2 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95 ${
            isRunning ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? '暂停' : '启动复苏'}
        </button>
        
        <button 
          onClick={() => {
            setTotalTime(0);
            setCycleTime(0);
            setIsRunning(false);
          }}
          className="bg-slate-800 py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95 hover:bg-slate-700"
        >
          <RotateCcw className="w-5 h-5 text-slate-400" />
        </button>

        <button 
          onClick={() => setIsMetronomeOn(!isMetronomeOn)}
          className={`py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
            isMetronomeOn ? 'bg-blue-600' : 'bg-slate-800'
          }`}
        >
          {isMetronomeOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
         <div className="flex items-center gap-1.5 opacity-50">
            <TimerIcon className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase">Metronome: 110 BPM</span>
         </div>
         {cycleTime >= 120 && (
           <span className="text-[9px] font-black text-rose-500 uppercase animate-bounce">请立即评估心律！</span>
         )}
      </div>
    </div>
  );
};

export default ResuscitationTimer;
