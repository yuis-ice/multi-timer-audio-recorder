# Multi-Timer Studio 🎯⏱️🎙️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

> **ストップウォッチ、タイマー、音声録音の統合コントロール**

Multi-Timer Studioは、ストップウォッチ、カウントダウンタイマー、音声録音機能を統合したWebアプリケーションです。すべての機能を同時に操作できる統合コントロールを提供し、セッションの永続化とリアルタイム波形表示に対応しています。

## ✨ 主な機能

### 🎯 統合コントロール
- **すべて開始**: ストップウォッチ、タイマー、音声録音を同時開始
- **すべて一時停止**: 全機能を同時に一時停止
- **すべてリセット**: 全機能をリセット、録音を停止

### ⏱️ 時間計測機能
- **ストップウォッチ**: 00:00:00から上向きにカウント
- **タイマー**: ユーザー設定可能なカウントダウン（分・秒設定）

### 🎙️ 音声録音機能
- **マイク録音**: MediaRecorder APIを使用したリアルタイム録音
- **波形表示**: リアルタイムオーディオ波形ビジュアライザー
- **音声保存**: .webmまたは.wav形式での録音保存
- **ダウンロード**: 録音完了後の音声ファイルダウンロード

### 💾 セッション永続化
- **ローカルストレージ**: 録音ファイル（Blob URL/base64）の保存
- **状態復元**: ストップウォッチ経過時間とタイマー残り時間の保存
- **自動復元**: コンポーネントマウント時の前回セッション状態復元

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm 9.0以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yuis-ice/multi-timer-audio-recorder.git
cd multi-timer-audio-recorder

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 🎮 使用方法

### 基本操作

1. **タイマー設定**: 分と秒を入力してカウントダウン時間を設定
2. **統合開始**: 「すべて開始」ボタンで全機能を同時開始
3. **録音確認**: 波形ビジュアライザーで録音状態を確認
4. **一時停止**: 必要に応じて「すべて一時停止」で中断
5. **完了・ダウンロード**: 終了後、録音ファイルをダウンロード

### 権限設定

初回使用時にブラウザからマイクアクセス許可が求められます。録音機能を使用するには許可が必要です。

### ブラウザサポート

- **推奨**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **必須API**: MediaRecorder API, Web Audio API, LocalStorage

## 🛠️ 技術仕様

### アーキテクチャ

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **録音**: MediaRecorder API
- **音声処理**: Web Audio API
- **永続化**: localStorage

### プロジェクト構造

```
src/
├── components/
│   ├── AudioRecorder.tsx      # 音声録音コンポーネント
│   ├── Stopwatch.tsx          # ストップウォッチコンポーネント
│   ├── Timer.tsx              # タイマーコンポーネント
│   └── WaveformVisualizer.tsx # 波形表示コンポーネント
├── hooks/
│   └── useLocalStorage.ts     # ローカルストレージフック
├── utils/
│   └── timeUtils.ts           # 時間計算ユーティリティ
├── App.tsx                    # メインアプリケーション
└── main.tsx                   # エントリーポイント
```

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

### 開発フロー

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発環境

```bash
# リンター実行
npm run lint

# 型チェック
npx tsc --noEmit
```

## 📝 ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

## 🔗 リンク

- **GitHub**: [yuis-ice/multi-timer-audio-recorder](https://github.com/yuis-ice/multi-timer-audio-recorder)
- **Issue報告**: [Issues](https://github.com/yuis-ice/multi-timer-audio-recorder/issues)
- **ディスカッション**: [Discussions](https://github.com/yuis-ice/multi-timer-audio-recorder/discussions)

## 📞 サポート

- 🐛 **バグ報告**: [Bug Report](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=bug_report.yml)
- ✨ **機能リクエスト**: [Feature Request](https://github.com/yuis-ice/multi-timer-audio-recorder/issues/new?template=feature_request.yml)
- 💬 **一般的な質問**: [Discussions](https://github.com/yuis-ice/multi-timer-audio-recorder/discussions)

---

**Multi-Timer Studio**で効率的な時間管理と録音を！🎉