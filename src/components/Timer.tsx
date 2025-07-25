import React from 'react';
import { Clock, Settings, Volume2 } from 'lucide-react';
import { formatTimerTime } from '../utils/timeUtils';

interface TimerProps {
  time: number;
  duration: number;
  isRunning: boolean;
  onDurationChange: (minutes: number, seconds: number) => void;
  minutes: number;
  seconds: number;
  onTimerEnd?: () => void;
}

const SOUND_OPTIONS = [
  { id: 'beep', name: 'Classic Beep', type: 'single', frequency: 800, waveform: 'sine' },
  { id: 'chime', name: 'Soft Chime', type: 'fade', frequency: 523.25, waveform: 'sine' },
  { id: 'bell', name: 'Bell Ring', type: 'decay', frequency: 659.25, waveform: 'triangle' },
  { id: 'ding', name: 'Pleasant Ding', type: 'single', frequency: 880, waveform: 'sine' },
  { id: 'notification', name: 'Notification', type: 'double', frequency: 800, waveform: 'square' },
  { id: 'gentle', name: 'Gentle Tone', type: 'fade', frequency: 440, waveform: 'sine' },
  { id: 'crystal', name: 'Crystal Clear', type: 'single', frequency: 1047, waveform: 'triangle' },
  { id: 'woodblock', name: 'Wood Block', type: 'sharp', frequency: 1200, waveform: 'square' },
];

const Timer: React.FC<TimerProps> = ({ 
  time, 
  duration, 
  isRunning, 
  onDurationChange, 
  minutes, 
  seconds,
  onTimerEnd
}) => {
  const [selectedSound, setSelectedSound] = React.useState('beep');
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hasEnded, setHasEnded] = React.useState(false);
  
  const durationMs = duration * 1000;
  const progressPercentage = durationMs > 0 ? ((durationMs - time) / durationMs) * 100 : 0;
  const isExpired = time <= 0 && durationMs > 0;

  // Play sound when timer ends
  React.useEffect(() => {
    if (isExpired && !hasEnded && soundEnabled) {
      playTimerSound();
      setHasEnded(true);
      onTimerEnd?.();
    } else if (!isExpired) {
      setHasEnded(false);
    }
  }, [isExpired, hasEnded, soundEnabled, onTimerEnd]);

  const playTimerSound = () => {
    const selectedSoundOption = SOUND_OPTIONS.find(s => s.id === selectedSound);
    if (!selectedSoundOption) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSound = (freq: number, startTime: number, duration: number, volume: number = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, startTime);
      oscillator.type = selectedSoundOption.waveform as OscillatorType;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      
      // Different envelope shapes based on sound type
      switch (selectedSoundOption.type) {
        case 'single':
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          break;
        case 'fade':
          gainNode.gain.linearRampToValueAtTime(0.01, startTime + duration);
          break;
        case 'decay':
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.3);
          break;
        case 'sharp':
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.1);
          break;
        case 'double':
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.4);
          break;
      }
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const currentTime = audioContext.currentTime;
    const { frequency, type } = selectedSoundOption;
    
    switch (type) {
      case 'single':
        playSound(frequency, currentTime, 0.8);
        break;
      case 'fade':
        playSound(frequency, currentTime, 1.5, 0.25);
        break;
      case 'decay':
        playSound(frequency, currentTime, 1.2);
        // Add harmonic for bell-like sound
        if (selectedSound === 'bell') {
          playSound(frequency * 2, currentTime, 0.8, 0.15);
          playSound(frequency * 3, currentTime, 0.5, 0.1);
        }
        break;
      case 'sharp':
        playSound(frequency, currentTime, 0.3, 0.4);
        break;
      case 'double':
        playSound(frequency, currentTime, 0.3);
        playSound(frequency, currentTime + 0.4, 0.3);
        break;
    }
  };

  const testSound = () => {
    if (soundEnabled) {
      playTimerSound();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800">Timer</h2>
        </div>
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isExpired ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-3xl font-mono font-bold mb-2 ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
          {formatTimerTime(Math.max(0, time))}
        </div>
        <div className="text-sm text-gray-500">
          {isExpired ? 'Time\'s up!' : isRunning ? 'Counting down' : 'Stopped'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${isExpired ? 'bg-red-500' : 'bg-orange-500'}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Timer Settings */}
      <div className="bg-orange-50 rounded-lg p-3 space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">Set Duration</span>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="number"
              value={minutes}
              onChange={(e) => onDurationChange(parseInt(e.target.value) || 0, seconds)}
              disabled={isRunning}
              min="0"
              max="99"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <label className="text-xs text-gray-500">Minutes</label>
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={seconds}
              onChange={(e) => onDurationChange(minutes, parseInt(e.target.value) || 0)}
              disabled={isRunning}
              min="0"
              max="59"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <label className="text-xs text-gray-500">Seconds</label>
          </div>
        </div>
        
        {/* Sound Settings */}
        <div className="border-t border-orange-200 pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Sound Settings</span>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="soundEnabled"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="soundEnabled" className="text-sm text-gray-700">
              Enable sound notification
            </label>
          </div>
          
          {soundEnabled && (
            <div className="space-y-2">
              <select
                value={selectedSound}
                onChange={(e) => setSelectedSound(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {SOUND_OPTIONS.map(sound => (
                  <option key={sound.id} value={sound.id}>
                    {sound.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={testSound}
                className="w-full px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition-colors"
              >
                Test Sound
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;