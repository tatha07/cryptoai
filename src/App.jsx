import React, { useState, useRef, useEffect } from 'react';
import BloombergChart from './BloombergChart'; 

// --- 1. The Network Animation Component ---
const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; 
        this.speedX = Math.random() * 1 - 0.5; 
        this.speedY = Math.random() * 1 - 0.5;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'; 
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 15000; 
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) { 
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${1 - distance / 120})`; // Switched to cyan to match the Bloomberg chart
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" 
      style={{ background: '#050505' }} 
    />
  );
};

// --- 2. The Crypto Card Component ---
const CryptoCard = ({ id, name, symbol, price, change, icon, isActive, onSelect }) => {
  const [verdict, setVerdict] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isPositive = change >= 0;

  const handleGenerateVerdict = async (e) => {
    e.stopPropagation(); // Prevents the card click event from firing when you click the AI button
    setIsAnalyzing(true);
    setTimeout(() => {
      setVerdict({
        action: isPositive ? 'BUY' : 'HOLD',
        color: isPositive ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-yellow-950/50 text-yellow-400 border border-yellow-900/50',
        reason: `${name} is showing solid on-chain stability. AI model detects subtle accumulation behavior. Maintain current position or execute a tactical entry.`
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div 
      onClick={() => onSelect({ id, name })}
      className={`bg-black/60 backdrop-blur-md rounded-xl p-6 text-gray-200 w-full max-w-sm transition-all duration-300 cursor-pointer 
      ${isActive ? 'border-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border border-gray-800 hover:border-gray-600 hover:bg-black/80'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center p-1 border border-gray-800 overflow-hidden">
            <img src={icon} alt={`${name} logo`} className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{name}</h2>
            <p className="text-gray-500 text-sm font-mono uppercase">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black font-mono tracking-tighter text-white">${(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
          <p className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{change}% (24h)
          </p>
        </div>
      </div>

      <hr className="border-gray-800 my-5" />

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleGenerateVerdict}
          disabled={isAnalyzing}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 border 
            ${isAnalyzing 
              ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          {isAnalyzing ? 'Analyzing Data...' : 'Generate AI Verdict'}
        </button>

        {verdict && !isAnalyzing && (
          <div className="bg-black/50 rounded-lg p-5 border border-gray-800 mt-2 animate-fade-in">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded mb-3 ${verdict.color}`}>
              Verdict: {verdict.action}
            </span>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              {verdict.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. The Main Dashboard Component ---
export default function CryptoAdvisorDashboard() {
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [activeChartCoin, setActiveChartCoin] = useState({ id: 'bitcoin', name: 'Bitcoin' });

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
        
        if (!response.ok) throw new Error('Rate limited or network error');
        
        const data = await response.json();

        const formattedData = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          change: parseFloat(coin.price_change_percentage_24h?.toFixed(2) || 0),
          icon: coin.image,
        }));

        setMarketData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch live prices, using fallback data:", error);
        setApiError(true);
        setMarketData([
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 64230, change: 2.4, icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3450, change: -1.2, icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145, change: 5.7, icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
        ]);
        setIsLoading(false);
      }
    };

    fetchLivePrices();
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans relative overflow-hidden">
      <NetworkBackground /> 

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">
            Crypto<span className="text-gray-500">Advisor</span>.AI
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <p className="text-gray-500 font-mono text-sm border-b-2 md:border-b-0 md:border-r-2 border-gray-700 pb-2 md:pb-0 pr-2 inline-block">
              Decentralized market analysis active_
            </p>
            {apiError && (
              <span className="text-xs font-mono text-yellow-500 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-900/50">
                ⚠️ USING OFFLINE CACHE
              </span>
            )}
          </div>
        </header>

        {/* The Bloomberg Chart Component */}
        <BloombergChart coinId={activeChartCoin.id} coinName={activeChartCoin.name} />

        {/* Loading Spinner or Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {marketData.map((coin) => (
              <CryptoCard 
                key={coin.id}
                id={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                price={coin.price}
                change={coin.change}
                icon={coin.icon}
                isActive={activeChartCoin.id === coin.id}
                onSelect={setActiveChartCoin}
              />
            ))}
          </div>
        )}

        <footer className="mt-20 text-center text-gray-600 text-xs font-mono max-w-xl mx-auto border-t border-gray-900 pt-6 pb-8">
          <p>Educational purpose only. AI suggestions are not financial advice.</p>
        </footer>
      </div>
    </div>
  );
}