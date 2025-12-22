# AI 引っ越し挨拶状メーカー 🏠✨

Google Gemini APIを活用した、新築一戸建て向け引っ越し挨拶状作成アプリです。
プライバシーに配慮し、入力データや写真はすべてブラウザ内に保存されます。

## 🌟 主な機能
- **AI挨拶文生成**: 趣味や出身地を元に、Geminiが最適な文章を作成。
- **2Dイラスト変換**: 家族写真をプライバシーに配慮した温かいイラスト調に加工。
- **印刷レイアウト調整**: A4やハガキサイズに合わせてAIが配置を自動提案。
- **PWA対応**: スマホのホーム画面に追加してアプリとして利用可能。
- **セキュリティ**: パスコードロック機能により、共有端末でも安心。

## 🚀 セットアップ（開発者向け）

1. **環境変数の設定**
   `.env.example` を `.env` にコピーし、Google AI Studioで取得したAPIキーを設定してください。
   ```bash
   VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

2. **インストールと起動**
   ```bash
   npm install
   npm run dev
   ```

3. **ビルド**
   ```bash
   npm run build
   ```

## 🛠 技術スタック
- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Tooling**: Vite

## 📄 ライセンス
MIT License
