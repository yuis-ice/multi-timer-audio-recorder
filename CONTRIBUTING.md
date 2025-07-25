# Contributing to Multi-Timer Audio Recorder 🤝

Welcome to the Multi-Timer Audio Recorder project! We're excited that you're interested in contributing. This document outlines how to contribute to this project effectively.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Contributor License Agreement (CLA)](#contributor-license-agreement-cla)
- [Recognition](#recognition)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Standards

- **Be respectful**: Treat all community members with kindness and respect
- **Be inclusive**: Welcome newcomers and help create a positive environment
- **Be collaborative**: Share knowledge and work together constructively
- **Be patient**: Remember that everyone was a beginner once
- **Be constructive**: Provide helpful feedback and suggestions

### Unacceptable Behavior

- Harassment, discrimination, or abusive language
- Personal attacks or trolling
- Spam or off-topic discussions
- Publishing private information without consent
- Any behavior that would be inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/multi-timer-audio-recorder.git
   cd multi-timer-audio-recorder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Verify setup**
   - Open browser to `http://localhost:5173`
   - Test basic functionality (timer, stopwatch, recording)
   - Grant microphone permissions when prompted

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix existing issues
- ✨ **New features**: Add new functionality
- 📚 **Documentation**: Improve docs, comments, or examples
- 🎨 **UI/UX improvements**: Enhance user interface and experience
- ⚡ **Performance**: Optimize existing code
- 🧪 **Testing**: Add or improve tests
- 🔧 **Tooling**: Improve development workflow

### Contribution Workflow

1. **Find or create an issue**
   - Check [existing issues](https://github.com/yuis-ice/multi-timer-audio-recorder/issues)
   - For new features, create a feature request first
   - For bugs, create a bug report with reproduction steps

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow our coding standards
   - Write clear, concise commit messages
   - Test your changes thoroughly

4. **Submit a pull request**
   - Use our PR template
   - Provide detailed description of changes
   - Link related issues

## 📝 Coding Standards

### TypeScript/React Guidelines

- **Use TypeScript**: All new code should be written in TypeScript
- **Component structure**: Follow existing component patterns
- **Hooks**: Use React hooks for state management
- **Props interfaces**: Define clear interfaces for component props
- **Error handling**: Implement proper error boundaries and error handling

### Code Style

- **ESLint**: Follow existing ESLint configuration
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming conventions**: 
  - PascalCase for components and interfaces
  - camelCase for functions and variables
  - SCREAMING_SNAKE_CASE for constants

### File Organization

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── __tests__/        # Test files
```

### Comments and Documentation

- Write clear, concise comments for complex logic
- Use JSDoc for function documentation
- Keep comments up-to-date with code changes
- Explain "why" not just "what"

## 🧪 Testing Guidelines

### Testing Requirements

- **Manual testing**: Test all affected functionality
- **Browser testing**: Verify compatibility across browsers
- **Mobile testing**: Ensure responsive design works
- **Audio testing**: Test microphone permissions and recording

### Testing Checklist

- [ ] Stopwatch starts, pauses, and resets correctly
- [ ] Timer countdown works with custom durations
- [ ] Audio recording captures and saves properly
- [ ] Waveform visualization displays during recording
- [ ] Unified controls (Start All, Pause All, Reset All) work
- [ ] Session persistence saves and restores state
- [ ] Download functionality works for recorded audio
- [ ] UI is responsive on different screen sizes
- [ ] Accessibility features work (keyboard navigation, screen readers)

### Performance Testing

- Check for memory leaks during long recording sessions
- Verify smooth audio visualization performance
- Test with large timer durations
- Monitor localStorage usage

## 📤 Pull Request Process

### Before Submitting

1. **Self-review your code**
   - Check for commented-out code
   - Ensure proper error handling
   - Verify TypeScript types are correct

2. **Test thoroughly**
   - Run `npm run lint` and fix any issues
   - Test in multiple browsers
   - Verify mobile responsiveness

3. **Update documentation**
   - Update README if needed
   - Add comments for complex logic
   - Update type definitions

### PR Requirements

- **Clear title**: Summarize changes concisely
- **Detailed description**: Explain what and why
- **Link issues**: Reference related issues
- **Screenshots**: Include visual changes
- **Testing evidence**: Show that you've tested changes

### Review Process

1. **Automated checks**: Ensure all CI checks pass
2. **Code review**: Address reviewer feedback promptly
3. **Testing**: Verify functionality works as expected
4. **Approval**: Wait for maintainer approval before merging

## 🐛 Issue Reporting

### Bug Reports

Use our [bug report template](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=bug_report.yml) and include:

- **Reproduction steps**: Clear, step-by-step instructions
- **Expected vs actual behavior**: What should happen vs what does happen
- **Environment details**: Browser, OS, device type
- **Console errors**: Any JavaScript errors from browser console
- **Screenshots**: Visual evidence of the issue

### Feature Requests

Use our [feature request template](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=feature_request.yml) and include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Use cases**: When would this be useful?
- **Implementation ideas**: Technical considerations (if any)

## 🛡️ Contributor License Agreement (CLA)

By submitting a pull request or contribution, you agree to the following:

> You grant the project founder a **non-exclusive, irrevocable, worldwide, royalty-free license** to use, modify, sublicense, and relicense your contribution, including the right to incorporate it into dual-licensed or commercial versions of the project.

This ensures that the project can grow sustainably while preserving creator rights.

If you are contributing on behalf of a company or organization, please contact us in advance.

### What This Means

- **Your rights**: You retain ownership of your contributions
- **Project rights**: We can use your contributions in any version of the project
- **Future licensing**: Allows potential dual-licensing or commercial use
- **Protection**: Protects both you and the project legally

### Corporate Contributions

If you're contributing on behalf of your employer:
- Ensure you have authorization to contribute
- Your employer may need to sign a separate agreement
- Contact project maintainers before making large contributions

## 🎉 Recognition

### Contributors

All contributors are recognized in our project:
- GitHub contributors page
- Special mentions for significant contributions
- Optional inclusion in project credits

### Contribution Types

We recognize various contribution types:
- 💻 Code contributions
- 📖 Documentation improvements
- 🐛 Bug reports and testing
- 💡 Feature ideas and feedback
- 🎨 Design and UX improvements
- 🌍 Translations (future)

## 📞 Getting Help

### Community Support

- **Discussions**: [GitHub Discussions](https://github.com/yuis-ice/multi-timer-audio-recorder/discussions) for general questions
- **Issues**: [GitHub Issues](https://github.com/yuis-ice/multi-timer-audio-recorder/issues) for bugs and features
- **Email**: Contact maintainers for sensitive issues

### Development Help

- Check existing issues and PRs for similar work
- Ask questions in discussions before starting large features
- Review existing code to understand patterns
- Start with small contributions to learn the codebase

## 📚 Additional Resources

- [Project README](README.md)
- [Architecture Documentation](architecture.md)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

---

Thank you for contributing to Multi-Timer Audio Recorder! Your contributions help make this project better for everyone. 🚀