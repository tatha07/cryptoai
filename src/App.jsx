import React, { useState, useRef, useEffect } from 'react';

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
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 120})`; 
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
      style={{ background: '#050505' }} // This handles our dark background now
    />
  );
};

// --- 2. The Crypto Card Component ---
const CryptoCard = ({ name, symbol, price, change, icon }) => {
  const [verdict, setVerdict] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isPositive = change >= 0;

  const generateVerdict = async () => {
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
    <div className="bg-black/60 border border-gray-800 backdrop-blur-md rounded-xl p-6 text-gray-200 w-full max-w-sm transition-all duration-300 hover:border-gray-600 hover:bg-black/80">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-2xl font-black border border-gray-800">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{name}</h2>
            <p className="text-gray-500 text-sm font-mono">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black font-mono tracking-tighter text-white">${price.toLocaleString()}</p>
          <p className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{change}% (24h)
          </p>
        </div>
      </div>

      <hr className="border-gray-800 my-5" />

      <div className="flex flex-col gap-3">
        <button 
          onClick={generateVerdict}
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
  const initialMarketData = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 64230, change: 2.4, icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3450, change: -1.2, icon: 'Ξ' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145, change: 5.7, icon: '◎' },
  ];

  return (
    // FIX: Changed bg-[#050505] to bg-transparent so the canvas behind it is visible
    <div className="min-h-screen bg-transparent p-8 font-sans relative overflow-hidden">
      
      {/* The background animation is mounted here */}
      <NetworkBackground /> 

      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">
            Crypto<span className="text-gray-500">Advisor</span>.AI
          </h1>
          <p className="text-gray-500 font-mono text-sm border-r-2 border-gray-700 pr-2 inline-block">
            Decentralized market analysis active_
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {initialMarketData.map((coin) => (
            <CryptoCard 
              key={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              price={coin.price}
              change={coin.change}
              icon={coin.icon}
            />
          ))}
        </div>

        <footer className="mt-20 text-center text-gray-600 text-xs font-mono max-w-xl mx-auto border-t border-gray-900 pt-6">
          <p>Educational purpose only. AI suggestions are not financial advice.</p>
        </footer>

      </div>
    </div>
  );
}