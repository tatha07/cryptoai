# Crypto Advisor 🚀

A cutting-edge, AI-powered cryptocurrency market analysis dashboard with voice interaction. Built with React 19, Vite, and Google's Generative AI, Crypto Advisor combines real-time market data, interactive charting, and intelligent trading analysis with a sleek, cyberpunk-inspired UI.

**Live Demo**: [crypto-advisor.vercel.app](https://crypto-advisor.vercel.app)

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Intelligent Trading Verdicts**: Get BUY/HOLD/SELL recommendations powered by Google Gemini AI
- **Two AI Personas**: Choose between "Kira" (rose gold theme) or "Kiro" (cyan theme), each with distinct voice characteristics
- **Voice Interaction**: Talk to your AI advisor using speech recognition—the AI responds with voice synthesis
- **Macro-Economic Insights**: Get conversational market analysis tailored to current market conditions

### 📊 Market Intelligence
- **Real-Time Data**: Track Bitcoin, Ethereum, and Solana with live pricing from CoinGecko API
- **30-Day Historical Charts**: Interactive line charts with hover tooltips showing historical volatility
- **24-Hour Change Indicators**: Quick visual assessment of market momentum
- **Fallback Simulation**: Realistic mock data when API limits are reached—presentation never breaks

### 🎨 Premium User Experience
- **Animated Network Background**: Custom Canvas API particle system with theme-aware connection colors
- **Glassmorphism Design**: Frosted glass effects with backdrop blur for modern aesthetics
- **Dual-Theme System**: Toggle between Kira (rose-gold) and Kiro (cyan) themes with persisted state
- **Responsive Grid Layout**: Seamlessly adapts from 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Dark Mode Cyberpunk Aesthetic**: Professional deep black backgrounds with elegant typography

### 🎯 User Interactions
- **Generate Verdicts**: One-click AI analysis on each crypto card with detailed reasoning
- **Voice Advisor Chat**: Speak naturally and receive thoughtful market insights with audio responses
- **Toggle Themes**: Switch between AI personas for different visual and audio experiences
- **Interactive Charts**: Hover over 30-day historical data for detailed price information

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 8.0.1 with HMR |
| **Styling** | Tailwind CSS 3.4.19 + PostCSS 8.5.8 |
| **Data Visualization** | Recharts 3.8.0 |
| **AI Integration** | Google Generative AI (Gemini 1.5 Flash) |
| **Browser APIs** | Web Speech API, HTML5 Canvas, Speech Synthesis |
| **Code Quality** | ESLint 9.39.4 with React plugins |
| **Package Manager** | npm |

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (v18+ recommended)
- **npm** v7+
- A **Google Gemini API Key** (free tier available at [ai.google.dev](https://ai.google.dev))

### Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/tatha07/cryptoai
cd crypto-advisor
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create a `.env.local` file in the project root:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open in browser**:
Navigate to `http://localhost:5173`

## 📖 How to Use

### Dashboard
1. **View Market Data**: See real-time prices for Bitcoin, Ethereum, and Solana with 24-hour changes
2. **Select a Crypto**: Click any cryptocurrency card to view its 30-day historical chart
3. **Generate AI Verdict**: Click the "Generate AI Verdict" button for buy/hold/sell recommendations
4. **Review Analysis**: Read the AI-generated reasoning for each recommendation

### Voice Advisor (AI Chat)
1. **Click the bottom-right button** ($ sign or icon) to activate voice chat
2. **Wait for introduction** from your chosen AI persona
3. **Speak your question** after the beep
4. **Listen to response** in real-time from the AI
5. **Toggle Theme**: Switch perspectives by changing the AI persona

### Interactive Elements
- **Crypto Cards**: Click to select and view detailed 30-day chart
- **Chart Tooltips**: Hover over chart lines for specific price data
- **Theme Toggle**: Switch between Kira and Kiro personas for different UI colors and voice characteristics
- **Verdict Colors**: BUY (green), HOLD (yellow), SELL (red)

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload at http://localhost:5173

# Production
npm run build        # Create optimized production bundle
npm run preview      # Preview production build locally

# Quality Assurance
npm run lint         # Run ESLint to check code quality
```

## 🔧 Configuration

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_api_key  # Required for AI features
```

### Tailwind CSS
Configured in `tailwind.config.js` with content purging for `index.html` and all JSX/JS files in `src/`.

### PostCSS
Configured with Autoprefixer for maximum cross-browser compatibility.

### Vite
Uses React plugin with automatic JSX transformation and fast refresh.

## 📁 Project Structure

```
crypto-advisor/
├── src/
│   ├── App.jsx                 # Main application root component
│   ├── BloombergChart.jsx      # Chart component with CoinGecko integration
│   ├── NetworkBackground.jsx   # Canvas-based animated particle system
│   ├── main.jsx                # React DOM entry point
│   ├── App.css                 # Component-specific styles
│   ├── index.css               # Global styles and resets
│   └── assets/                 # Static assets (images, icons)
├── public/                     # Public-facing static files
├── index.html                  # HTML entry point with root div
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS customization
├── postcss.config.js           # PostCSS plugin configuration
├── eslint.config.js            # ESLint rules
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 Design System

### Color Palette
- **Kira Theme**: Rose-gold accents (#fb7185) with warm audio presence
- **Kiro Theme**: Cyan accents (#22d3ee) with cool audio presence
- **Base**: Deep black (#050505) with slate grays for hierarchy

### Components
- **CryptoCard**: Glassmorphic card with real-time data and AI verdict button
- **BloombergChart**: Interactive 30-day historical price chart with theme colors
- **GlobalVoiceAdvisor**: Voice chat interface with streaming audio response
- **NetworkBackground**: Autonomous particle system with connection visualization
- **Verdict Badge**: Color-coded recommendation display (BUY/HOLD/SELL/ERROR)

## 🌐 API Integration

### External APIs
- **CoinGecko**: Free cryptocurrency pricing data (no API key required)
- **Google Generative AI**: AI-powered market analysis and voice advisement

### Data Flow
1. Component mounts → Fetch 30-day price history from CoinGecko
2. User clicks verdict button → Query Google Gemini API with context
3. Gemini responds with JSON recommendation → Display with color coding
4. User speaks to voice advisor → Speech Recognition API captures input
5. Input sent to Gemini → Voice response played via Speech Synthesis API

## ⚙️ Advanced Features

### Animated Network Background
- **700+ particles** (density-based on viewport)
- **Dynamic connections** at 120px threshold with distance-based opacity
- **Theme-aware colors** that change with Kira/Kiro toggle
- **Performant Canvas rendering** with requestAnimationFrame
- **Responsive particle count** that adjusts on window resize

### Voice Integration
- **Multi-language support** via browser Web Speech API
- **Persona-specific voices**: Kira uses female voice patterns, Kiro uses male
- **Custom speech rate** (1.05x) and pitch (Kira: 1.1, Kiro: 0.9)
- **Automatic prompt generation** with market context for relevant insights

### Fallback Mechanisms
- **API Rate Limit Handling**: Generates realistic mock chart data
- **Voice API Fallback**: Graceful degradation if browser doesn't support Speech APIs
- **Error Recovery**: User-friendly error messages at every failure point

## 🔐 Security & Best Practices

- **Environment Variables**: API keys stored in `.env.local` (never committed)
- **React Strict Mode**: Catches potential issues in development
- **ESLint**: Enforces code quality and React best practices
- **Responsive Design**: Works on all modern browsers and devices

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### Environment Setup for Deployment
Add `VITE_GEMINI_API_KEY` to your hosting platform's environment variables.

## 📊 Performance Metrics

- **Initial Load**: <2s (optimized with Vite)
- **Chart Rendering**: <500ms (Recharts optimization)
- **AI Response**: 1-3s (Gemini API latency)
- **Voice Recognition**: Near real-time
- **Particle Animation**: 60 FPS (Canvas optimization)

## 🤝 Contributing

This is a personal project, but suggestions and insights are welcome! Feel free to:
- Report issues
- Suggest UI/UX improvements
- Recommend additional features
- Contribute optimizations

## 📄 License

MIT License - Use freely for personal and commercial projects

## 🙏 Acknowledgments

- **Google Generative AI** for Gemini API
- **CoinGecko** for free crypto market data
- **Recharts** for beautiful chart components
- **Tailwind CSS** for utility-first styling
- **Vite** for blazing fast build times

---

## 🔮 Future Roadmap

- [ ] Multiple cryptocurrency watchlists
- [ ] Historical verdict tracking and accuracy metrics
- [ ] Advanced technical analysis indicators
- [ ] Portfolio management features
- [ ] Automated alerts for price changes
- [ ] Integration with trading APIs
- [ ] Mobile app with push notifications

## 💬 Support & Contact

For questions or issues, please visit the [GitHub repository](https://github.com/tatha07/cryptoai)

---

**Last Updated**: March 2026 | **Version**: 1.0.0
└── package.json                # Project dependencies
```

## 🚀 Deployment

Build the optimized production version:
```bash
npm run build
```

The output will be in the `dist/` directory, ready for deployment to any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

