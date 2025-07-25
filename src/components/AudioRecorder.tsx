import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Mic, Download, Square, Play, Pause, Volume2, SkipBack, Trash2 } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AudioRecorderProps {
  isRecording: boolean;
  isRunning: boolean;
}

interface AudioRecorderHandle {
  startRecording: () => void;
  pauseRecording: () => void;
  resetRecording: () => void;
}

interface RecordingSession {
  id: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
  url?: string;
}

const AudioRecorder = forwardRef<AudioRecorderHandle, AudioRecorderProps>(
  ({ isRecording, isRunning }, ref) => {
    const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [recordingSessions, setRecordingSessions] = useLocalStorage<RecordingSession[]>('recordingSessions', []);
    const [playingSessionId, setPlayingSessionId] = useState<string | null>(null);
    const [sessionPlaybackTimes, setSessionPlaybackTimes] = useState<{[key: string]: number}>({});
    const [sessionDurations, setSessionDurations] = useState<{[key: string]: number}>({});
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const sessionAudioRefs = useRef<{[key: string]: HTMLAudioElement}>({});
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    useImperativeHandle(ref, () => ({
      startRecording: handleStartRecording,
      pauseRecording: handlePauseRecording,
      resetRecording: handleResetRecording,
    }));

    useEffect(() => {
      initializeMediaRecorder();
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
        // Cleanup audio URLs
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        Object.values(sessionAudioRefs.current).forEach(audio => {
          if (audio.src) {
            URL.revokeObjectURL(audio.src);
          }
        });
      };
    }, []);

    const initializeMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setIsInitialized(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const handleStartRecording = () => {
      if (!streamRef.current || !isInitialized) return;

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setCurrentBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Calculate actual duration from recording time
        const actualDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTotalDuration(actualDuration);
        
        // Save recording session with metadata
        const session: RecordingSession = {
          id: Date.now().toString(),
          blob,
          duration: actualDuration,
          timestamp: new Date(),
          url
        };
        setRecordingSessions(prev => [...prev, session]);
      };

      mediaRecorder.start();
      setDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    };

    const handlePauseRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };

    const handleResetRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      
      setDuration(0);
      setCurrentBlob(null);
      setIsPlaying(false);
      setPlaybackTime(0);
      setTotalDuration(0);
      setPlayingSessionId(null);
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };

    const handleDownload = (blob: Blob, filename?: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handlePlayPause = () => {
      if (!audioUrl || !currentBlob) return;

      if (!audioElementRef.current) {
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;
        audio.addEventListener('loadedmetadata', () => {
          const duration = isFinite(audio.duration) ? audio.duration : totalDuration;
          setTotalDuration(duration);
        });
        audio.addEventListener('timeupdate', () => {
          if (audio.currentTime && isFinite(audio.currentTime)) {
            setPlaybackTime(audio.currentTime);
          }
        });
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setPlaybackTime(0);
          if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
          }
        });
      }
      
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioElementRef.current || !totalDuration || !isFinite(totalDuration)) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * totalDuration;
      
      if (isFinite(newTime)) {
        audioElementRef.current.currentTime = newTime;
        setPlaybackTime(newTime);
      }
    };

    const handleRestart = () => {
      if (audioElementRef.current) {
        audioElementRef.current.currentTime = 0;
        setPlaybackTime(0);
      }
    };

    // Session playback functions
    const handleSessionPlayPause = (session: RecordingSession) => {
      const sessionId = session.id;
      
      if (playingSessionId === sessionId) {
        // Pause current session
        const audio = sessionAudioRefs.current[sessionId];
        if (audio) {
          audio.pause();
        }
        setPlayingSessionId(null);
      } else {
        // Stop any currently playing session
        if (playingSessionId) {
          const currentAudio = sessionAudioRefs.current[playingSessionId];
          if (currentAudio) {
            currentAudio.pause();
          }
        }
        
        // Start new session
        if (!sessionAudioRefs.current[sessionId]) {
          const audio = new Audio();
          const url = URL.createObjectURL(session.blob);
          audio.src = url;
          
          audio.addEventListener('loadedmetadata', () => {
            const duration = isFinite(audio.duration) ? audio.duration : session.duration;
            setSessionDurations(prev => ({ ...prev, [sessionId]: duration }));
          });
          
          audio.addEventListener('timeupdate', () => {
            if (audio.currentTime && isFinite(audio.currentTime)) {
              setSessionPlaybackTimes(prev => ({ ...prev, [sessionId]: audio.currentTime }));
            }
          });
          
          audio.addEventListener('ended', () => {
            setPlayingSessionId(null);
            setSessionPlaybackTimes(prev => ({ ...prev, [sessionId]: 0 }));
          });
          
          sessionAudioRefs.current[sessionId] = audio;
        }
        
        sessionAudioRefs.current[sessionId].play();
        setPlayingSessionId(sessionId);
      }
    };

    const handleSessionSeek = (sessionId: string, e: React.MouseEvent<HTMLDivElement>) => {
      const audio = sessionAudioRefs.current[sessionId];
      const duration = sessionDurations[sessionId];
      
      if (!audio || !duration || !isFinite(duration)) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      
      if (isFinite(newTime)) {
        audio.currentTime = newTime;
        setSessionPlaybackTimes(prev => ({ ...prev, [sessionId]: newTime }));
      }
    };

    const handleSessionRestart = (sessionId: string) => {
      const audio = sessionAudioRefs.current[sessionId];
      if (audio) {
        audio.currentTime = 0;
        setSessionPlaybackTimes(prev => ({ ...prev, [sessionId]: 0 }));
      }
    };

    const deleteSession = (sessionId: string) => {
      // Stop playback if this session is playing
      if (playingSessionId === sessionId) {
        const audio = sessionAudioRefs.current[sessionId];
        if (audio) {
          audio.pause();
        }
        setPlayingSessionId(null);
      }
      
      // Clean up audio element and URL
      if (sessionAudioRefs.current[sessionId]) {
        const audio = sessionAudioRefs.current[sessionId];
        if (audio.src) {
          URL.revokeObjectURL(audio.src);
        }
        delete sessionAudioRefs.current[sessionId];
      }
      
      // Remove from sessions
      setRecordingSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Clean up state
      setSessionPlaybackTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[sessionId];
        return newTimes;
      });
      setSessionDurations(prev => {
        const newDurations = { ...prev };
        delete newDurations[sessionId];
        return newDurations;
      });
    };

    const formatDuration = (seconds: number) => {
      if (!isFinite(seconds) || isNaN(seconds)) {
        return '00:00:00.000';
      }
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 1000);
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Mic className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Audio Recorder</h2>
          </div>
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
        </div>

        {/* Waveform Visualization */}
        <div className="mb-4">
          <WaveformVisualizer 
            stream={streamRef.current}
            isRecording={isRecording}
          />
        </div>

        {/* Recording Info */}
        <div className="text-center mb-4">
          <div className="text-2xl font-mono font-bold text-gray-800 mb-1">
            {formatDuration(duration)}
          </div>
          <div className="text-sm text-gray-500">
            {isRecording ? 'Recording...' : 'Ready to record'}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium text-green-700">Status</div>
              <div className="text-green-600">
                {isRecording ? 'Recording in progress' : 'Standby'}
              </div>
            </div>
            
            {currentBlob && (
              <button
                onClick={() => handleDownload(currentBlob)}
                className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Recording Playback Controls */}
        {currentBlob && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-3">Current Recording Playback</div>
            
            {/* Waveform for current recording */}
            <div className="mb-3 bg-gray-100 rounded p-2">
              <div className="text-xs text-gray-600 mb-1">Audio Waveform</div>
              <div className="h-12 bg-gradient-to-r from-green-200 to-green-300 rounded flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div 
              className="w-full bg-gray-200 rounded-full h-2 mb-3 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${totalDuration > 0 && isFinite(totalDuration) ? (playbackTime / totalDuration) * 100 : 0}%` }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-600 mb-3">
              <span>{formatDuration(playbackTime)}</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Recording History */}
        {recordingSessions.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-3">Recording History</div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recordingSessions.slice(-5).reverse().map((session) => {
                const sessionId = session.id;
                const isSessionPlaying = playingSessionId === sessionId;
                const sessionPlaybackTime = sessionPlaybackTimes[sessionId] || 0;
                const sessionDuration = sessionDurations[sessionId] || session.duration;
                
                return (
                  <div key={sessionId} className="p-3 bg-white rounded border">
                    {/* Session Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs">
                        <div className="font-medium text-gray-700">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          Duration: {formatDuration(session.duration)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDownload(session.blob, `recording_${session.id}.webm`)}
                          className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteSession(sessionId)}
                          className="flex items-center justify-center w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Waveform visualization */}
                    <div className="mb-2 bg-gray-100 rounded p-2">
                      <div className="text-xs text-gray-600 mb-1">Audio Waveform</div>
                      <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded flex items-center justify-center">
                        <Volume2 className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div 
                      className="w-full bg-gray-200 rounded-full h-1.5 mb-2 cursor-pointer"
                      onClick={(e) => handleSessionSeek(sessionId, e)}
                    >
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-100"
                        style={{ width: `${sessionDuration > 0 && isFinite(sessionDuration) ? (sessionPlaybackTime / sessionDuration) * 100 : 0}%` }}
                      />
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>{formatDuration(sessionPlaybackTime)}</span>
                      <span>{formatDuration(sessionDuration)}</span>
                    </div>
                    
                    {/* Playback Controls */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleSessionRestart(sessionId)}
                        className="flex items-center justify-center w-6 h-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                      >
                        <SkipBack className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => handleSessionPlayPause(session)}
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                      >
                        {isSessionPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default AudioRecorder;