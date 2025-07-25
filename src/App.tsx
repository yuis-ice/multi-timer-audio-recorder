import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Github, Star, MessageCircle, ExternalLink } from 'lucide-react';
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
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Multi-Timer Studio</h1>
            <a
              href="https://github.com/yuis-ice/multi-timer-audio-recorder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="View on GitHub"
            >
              <Github size={28} />
            </a>
          </div>
          <p className="text-gray-600 mb-4">Unified controls for stopwatch, timer, and audio recording</p>
          
          {/* GitHub Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="https://github.com/yuis-ice/multi-timer-audio-recorder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Star size={16} />
              Star on GitHub
            </a>
            <a
              href="https://github.com/yuis-ice/multi-timer-audio-recorder/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle size={16} />
              Report Issue
            </a>
            <a
              href="https://github.com/yuis-ice/multi-timer-audio-recorder/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Discussions
            </a>
          </div>
        </header>

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

        {/* Footer with GitHub Links */}
        <footer className="mt-12 pt-8 border-t border-gray-300 text-center">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Help us improve Multi-Timer Studio!</h3>
            <p className="text-gray-600 mb-4">Your feedback and contributions make this project better for everyone.</p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/yuis-ice/multi-timer-audio-recorder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Github size={18} />
                View Source Code
                <ExternalLink size={14} />
              </a>
              
              <a
                href="https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=feature_request.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Star size={18} />
                Request Feature
                <ExternalLink size={14} />
              </a>
              
              <a
                href="https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=bug_report.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <MessageCircle size={18} />
                Report Bug
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p className="mb-2">
              Made with ❤️ by{' '}
              <a
                href="https://github.com/yuis-ice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                yuis-ice
              </a>
            </p>
            <p>
              Open source under{' '}
              <a
                href="https://github.com/yuis-ice/multi-timer-audio-recorder/blob/master/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                MIT License
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;