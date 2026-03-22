# Crypto Advisor

A modern, AI-powered cryptocurrency market analysis dashboard built with React and Vite. Get real-time market insights, price tracking, and AI-generated trading verdicts for major cryptocurrencies.

## 🚀 Features

- **Real-Time Market Data**: Track Bitcoin, Ethereum, and Solana with live pricing and 24-hour change indicators
- **AI Verdict Generation**: Get AI-powered buy/hold recommendations with detailed market analysis reasoning
- **Animated Network Background**: Dynamic particle animation system with cyberpunk aesthetics creating an immersive visual experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Theme with Glassmorphism**: Professional UI with frosted glass effects and smooth transitions
- **On-Chain Analysis Simulation**: AI verdicts consider accumulation patterns and market behavior

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite with HMR (Hot Module Replacement)
- **Styling**: Tailwind CSS with PostCSS & Autoprefixer
- **Animation**: HTML5 Canvas API
- **Code Quality**: ESLint with React plugins
- **Package Manager**: npm

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tatha07/cryptoai
cd crypto-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 Usage

1. **View Market Data**: The dashboard displays three major cryptocurrencies with current prices and 24-hour changes
2. **Generate AI Verdicts**: Click the "Generate AI Verdict" button on any cryptocurrency card
3. **Analyze Recommendations**: Review the AI-generated buy/hold recommendations with supporting market analysis

## 🔨 Build Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎨 Design Highlights

- **Dark Mode Aesthetic**: Deep black background with slate-gray nodes and blue connecting lines
- **Responsive Grid**: Adapts from 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Smooth Animations**: Particle connections and hover effects for enhanced interactivity
- **Professional Typography**: Monospace fonts for technical data with careful tracking adjustments

## 📝 Project Structure

```
crypto-advisor/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # Application entry point
│   ├── NetworkBackground.jsx   # Animated particle background
│   ├── index.css               # Global styles
│   └── assets/                 # Static assets
├── public/                     # Public assets
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
└── package.json                # Project dependencies
```

## 🚀 Deployment

Build the optimized production version:
```bash
npm run build
```

The output will be in the `dist/` directory, ready for deployment to any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

## 🚧 Project Status (In Active Development)
- [x] Frontend UI and glassmorphism design
- [x] Canvas-based neural network background animation
- [ ] Integration with CoinGecko API for live price feeds (In Progress)
- [ ] Integration with Gemini API for dynamic LLM market analysis (In Progress)
