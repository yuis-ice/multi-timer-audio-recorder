import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import AudioRecorder from './components/AudioRecorder';
import { useLocalStorage } from './hooks/useLocalStorage';

interface AppState {
  isRunning: boolean;
  stopwatchTime: number;
  timerTime: number;
  timerDuration: number;
  isRecording: boolean;
}

function App() {
  const [state, setState] = useLocalStorage<AppState>('timerAppState', {
    isRunning: false,
    stopwatchTime: 0,
    timerTime: 0,
    timerDuration: 300, // 5 minutes default
    isRecording: false,
  });

  const [timerMinutes, setTimerMinutes] = useState(Math.floor(state.timerDuration / 60));
  const [timerSeconds, setTimerSeconds] = useState(state.timerDuration % 60);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRecorderRef = useRef<any>(null);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          stopwatchTime: prev.stopwatchTime + 100,
          timerTime: Math.max(0, prev.timerTime - 100),
        }));
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, setState]);

  const handleStartAll = () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      isRecording: true,
      timerTime: prev.timerTime > 0 ? prev.timerTime : prev.timerDuration * 1000,
    }));
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.startRecording();
    }
  };

  const handlePauseAll = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      isRecording: false,
    }));
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.pauseRecording();
    }
  };

  const handleResetAll = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      stopwatchTime: 0,
      timerTime: prev.timerDuration * 1000,
      isRecording: false,
    }));
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.resetRecording();
    }
  };

  const handleTimerDurationChange = (minutes: number, seconds: number) => {
    const newDuration = minutes * 60 + seconds;
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
    setState(prev => ({
      ...prev,
      timerDuration: newDuration,
      timerTime: prev.isRunning ? prev.timerTime : newDuration,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Multi-Timer Studio</h1>
          <p className="text-gray-600">Unified controls for stopwatch, timer, and audio recording</p>
        </div>

        {/* Unified Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleStartAll}
              disabled={state.isRunning}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start All</span>
            </button>
            
            <button
              onClick={handlePauseAll}
              disabled={!state.isRunning}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Pause className="w-5 h-5" />
              <span>Pause All</span>
            </button>
            
            <button
              onClick={handleResetAll}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Timer Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Stopwatch 
            time={state.stopwatchTime}
            isRunning={state.isRunning}
          />
          
          <Timer
            time={state.timerTime}
            duration={state.timerDuration}
            isRunning={state.isRunning}
            onDurationChange={handleTimerDurationChange}
            minutes={timerMinutes}
            seconds={timerSeconds}
            onTimerEnd={() => {
              // Optional: Add any additional logic when timer ends
              console.log('Timer ended!');
            }}
          />
          
          <AudioRecorder
            ref={audioRecorderRef}
            isRecording={state.isRecording}
            isRunning={state.isRunning}
          />
        </div>
      </div>
    </div>
  );
}

export default App;