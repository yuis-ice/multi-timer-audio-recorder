# Multi-Timer Studio 🎯⏱️🎙️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

> **Unified controls for stopwatch, timer, and audio recording**

Multi-Timer Studio is a web application that integrates stopwatch, countdown timer, and audio recording functionality. It provides unified controls to operate all features simultaneously, with session persistence and real-time waveform visualization.

## ✨ Key Features

### 🎯 Unified Controls
- **Start All**: Simultaneously start stopwatch, timer, and audio recording
- **Pause All**: Pause all functions simultaneously
- **Reset All**: Reset all functions and stop recording

### ⏱️ Time Management
- **Stopwatch**: Counts up from 00:00:00
- **Timer**: User-configurable countdown (minutes and seconds)

### 🎙️ Audio Recording
- **Microphone Recording**: Real-time recording using MediaRecorder API
- **Waveform Display**: Real-time audio waveform visualizer
- **Audio Saving**: Save recordings in .webm or .wav format
- **Download**: Download recorded audio files after completion

### 💾 Session Persistence
- **Local Storage**: Save recording files (Blob URL/base64)
- **State Restoration**: Save stopwatch elapsed time and timer remaining time
- **Auto Restore**: Restore previous session state on component mount

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yuis-ice/multi-timer-audio-recorder.git
cd multi-timer-audio-recorder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview build result
npm run preview
```

## 🎮 Usage

### Basic Operations

1. **Timer Setup**: Enter minutes and seconds to set countdown time
2. **Unified Start**: Use "Start All" button to begin all functions simultaneously
3. **Recording Check**: Confirm recording status with waveform visualizer
4. **Pause**: Use "Pause All" to interrupt as needed
5. **Complete & Download**: Download recording file after completion

### Permissions

On first use, the browser will request microphone access permission. Permission is required to use recording features.

### Browser Support

- **Recommended**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Required APIs**: MediaRecorder API, Web Audio API, LocalStorage

## 🛠️ Technical Specifications

### Architecture

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Recording**: MediaRecorder API
- **Audio Processing**: Web Audio API
- **Persistence**: localStorage

### Project Structure

```
src/
├── components/
│   ├── AudioRecorder.tsx      # Audio recording component
│   ├── Stopwatch.tsx          # Stopwatch component
│   ├── Timer.tsx              # Timer component
│   └── WaveformVisualizer.tsx # Waveform display component
├── hooks/
│   └── useLocalStorage.ts     # Local storage hook
├── utils/
│   └── timeUtils.ts           # Time calculation utilities
├── App.tsx                    # Main application
└── main.tsx                   # Entry point
```

## 🤝 Contributing

We welcome contributions to the project! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Development Environment

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🔗 Links

- **GitHub**: [yuis-ice/multi-timer-audio-recorder](https://github.com/yuis-ice/multi-timer-audio-recorder)
- **Live Demo**: [https://multi-timer-audio-recorder.pages.dev/](https://multi-timer-audio-recorder.pages.dev/)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/yuis-ice/multi-timer-audio-recorder/issues)
- **Discussions**: [Community Discussions](https://github.com/yuis-ice/multi-timer-audio-recorder/discussions)

## 📞 Support

- 🐛 **Bug Reports**: [Bug Report Template](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=bug_report.yml)
- ✨ **Feature Requests**: [Feature Request Template](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=feature_request.yml)
- 💬 **General Questions**: [Discussions](https://github.com/yuis-ice/multi-timer-audio-recorder/discussions)

---

**Multi-Timer Studio** - Efficient time management and recording! 🎉