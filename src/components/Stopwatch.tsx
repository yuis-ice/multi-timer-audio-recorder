import React from 'react';
import { Timer, Play } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface StopwatchProps {
  time: number;
  isRunning: boolean;
}

const Stopwatch: React.FC<StopwatchProps> = ({ time, isRunning }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Timer className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Stopwatch</h2>
        </div>
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-gray-800 mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-500">
          {isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>
      
      <div className="mt-4 bg-blue-50 rounded-lg p-3">
        <div className="text-sm text-blue-700 font-medium">Elapsed Time</div>
        <div className="text-lg font-semibold text-blue-800">
          {Math.floor(time / 60000)}m {Math.floor((time % 60000) / 1000)}s
        </div>
      </div>
    </div>
  );
};

export default Stopwatch