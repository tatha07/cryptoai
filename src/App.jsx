import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const NetworkBackground = ({ isKira }) => {
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
            const r = isKira ? 251 : 34;
            const g = isKira ? 113 : 211;
            const b = isKira ? 133 : 238;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - distance / 120})`; 
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
  }, [isKira]); 
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-colors duration-500" 
      style={{ background: '#050505' }} 
    />
  );
};
const BloombergChart = ({ coinId, coinName, isKira }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mainColor = isKira ? '#fb7185' : '#22d3ee'; 
  const glowShadow = isKira ? 'rgba(251,113,133,0.2)' : 'rgba(34,211,238,0.2)';
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
        if (!response.ok) throw new Error('API Rate Limited');
        const data = await response.json();
        if (!data.prices) throw new Error('No price data returned');

        const formattedData = data.prices.map(([timestamp, price]) => {
          const date = new Date(timestamp);
          return { date: `${date.getMonth() + 1}/${date.getDate()}`, fullDate: date.toLocaleDateString(), price: price };
        });
        setChartData(formattedData);
      } catch (error) {
        const mockData = Array.from({ length: 30 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (30 - i));
          const basePrice = coinId === 'bitcoin' ? 64000 : coinId === 'ethereum' ? 3400 : 140;
          const noise = (Math.random() - 0.5) * (basePrice * 0.05); 
          return { date: `${d.getMonth() + 1}/${d.getDate()}`, fullDate: d.toLocaleDateString(), price: basePrice + noise };
        });
        setChartData(mockData);
      } finally {
        setIsLoading(false);
      }
    };
    if (coinId) fetchHistory();
  }, [coinId]); 

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-black p-3 font-mono border"
          style={{ borderColor: mainColor, boxShadow: `0 0 15px ${glowShadow}` }}
        >
          <p className="text-gray-400 text-xs mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-lg font-bold" style={{ color: mainColor }}>
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className={`w-full bg-[#050505] border border-gray-800 p-6 rounded-xl shadow-2xl relative overflow-hidden z-10 mb-8 transition-colors duration-500`}>
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
        <div>
          <h3 className="font-mono text-2xl font-bold uppercase tracking-widest transition-colors" style={{ color: mainColor }}>{coinName} / USD</h3>
          <p className="text-gray-600 font-mono text-xs mt-1">30-DAY HISTORICAL VOLATILITY</p>
        </div>
        {isLoading && <span className="font-mono text-sm animate-pulse" style={{ color: mainColor }}>FETCHING NODE DATA_</span>}
      </div>
      <div className="h-80 w-full">
        {!isLoading && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#4b5563" tick={{ fill: '#6b7280', fontFamily: 'monospace', fontSize: 11 }} minTickGap={30} />
              <YAxis domain={['dataMin', 'dataMax']} stroke="#4b5563" tick={{ fill: '#6b7280', fontFamily: 'monospace', fontSize: 11 }} tickFormatter={(val) => `$${val.toLocaleString()}`} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="price" stroke={mainColor} strokeWidth={2} dot={false} activeDot={{ r: 5, fill: mainColor, stroke: '#000', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
const GlobalVoiceAdvisor = ({ marketData, isKira }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatLog, setChatLog] = useState({ user: "", ai: "" });
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const persona = isKira ? 'Kira' : 'Kiro';
  const themeColorText = isKira ? 'text-rose-400' : 'text-cyan-400';
  const themeColorBorder = isKira ? 'border-rose-500' : 'border-cyan-500';
  const themeColorBg = isKira ? 'bg-rose-600' : 'bg-cyan-600';
  useEffect(() => {
    setChatLog({ user: "", ai: `System initialized. I am ${persona}, your macro advisor. Click the mic to begin.` });
    setHasIntroduced(false); 
  }, [isKira]);
  const getVoiceForPersona = () => {
    const voices = window.speechSynthesis.getVoices();
    if (isKira) {
      return voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Female') || v.name.includes('Zira')) || voices.find(v => v.lang.startsWith('en'));
    } else {
      return voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male') || v.name.includes('David')) || voices.find(v => v.lang.startsWith('en'));
    }
  };
  const startRecognition = (SpeechRecognition) => {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.onstart = () => {
      setIsListening(true);
      setIsOpen(true);
      setChatLog(prev => ({ ...prev, user: "Listening..." }));
    };
    recognition.onresult = async (event) => {
      setIsListening(false);
      const transcript = event.results[0][0].transcript;
      setChatLog({ user: transcript, ai: `Analyzing data as ${persona}...` });
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const topCoinsSummary = marketData.slice(0, 10).map(c => `${c.name} ($${c.price.toLocaleString()}, ${c.change}%)`).join(" | ");
        const prompt = `You are a high-end, human-sounding macro-economic crypto advisor named ${persona}.
        Context: ${topCoinsSummary}
        User asks: "${transcript}"
        Provide a highly conversational, insightful, and concise answer (max 3 sentences). Speak naturally.`;
        const result = await model.generateContent(prompt);
        const aiResponseText = result.response.text();
        setChatLog({ user: transcript, ai: aiResponseText });
        const utterance = new SpeechSynthesisUtterance(aiResponseText);
        utterance.voice = getVoiceForPersona();
        utterance.rate = 1.05; 
        utterance.pitch = isKira ? 1.1 : 0.9; 
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        setChatLog({ user: transcript, ai: "Error connecting to the global neural network." });
      }
    };
    recognition.onerror = () => { setIsListening(false); setChatLog({ user: "Microphone error.", ai: "Try again." }); };
    recognition.start();
  };
  const handleGlobalVoiceChat = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice features require Chrome or Edge.");
    window.speechSynthesis.cancel();
    if (!hasIntroduced) {
      setHasIntroduced(true);
      setIsOpen(true);
      const introText = `Hello, I am ${persona}, your macro advisor. What would you like to analyze?`;
      setChatLog({ user: "", ai: introText });
      const utterance = new SpeechSynthesisUtterance(introText);
      utterance.voice = getVoiceForPersona();
      utterance.rate = 1.05;
      utterance.pitch = isKira ? 1.1 : 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        startRecognition(SpeechRecognition);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      startRecognition(SpeechRecognition);
    }
  };
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-black/90 backdrop-blur-xl border border-gray-700 p-5 rounded-2xl w-80 shadow-2xl animate-fade-in transition-colors">
          <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
            <span className={`${themeColorText} font-mono text-xs uppercase tracking-widest font-bold`}>{persona} (AI)</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white text-xs">✕</button>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2"><span className="text-gray-600 font-mono text-xs block mb-1">YOU:</span>{chatLog.user}</p>
          <p className={`text-sm leading-relaxed ${isSpeaking ? 'text-white' : 'text-gray-300'}`}>
            <span className={`${themeColorText} font-mono text-xs block mb-1`}>{persona.toUpperCase()}:</span>{chatLog.ai}
          </p>
        </div>
      )}
      <button 
        onClick={handleGlobalVoiceChat}
        disabled={isSpeaking && !hasIntroduced}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 
          ${isListening ? 'bg-red-600 border-red-400 animate-pulse scale-110' : 
            isSpeaking ? `${themeColorBg} ${themeColorBorder} animate-pulse scale-110` : 
            `bg-gray-900 ${themeColorBorder} hover:scale-105 hover:bg-gray-800`}`}
      >
        {isListening ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11v1a7 7 0 01-14 0v-1M12 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v3"></path>
          </svg>
        ) : isSpeaking ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
          </svg>
        ) : (
          <span className={`text-3xl font-black font-mono italic ${themeColorText} drop-shadow-md`}>
            $
          </span>
        )}
      </button>
    </div>
  );
};
const CryptoCard = ({ id, name, symbol, price, change, icon, isActive, onSelect, isKira }) => {
  const [verdict, setVerdict] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isPositive = change >= 0;
  const activeGlow = isKira 
    ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
    : 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
  const handleGenerateVerdict = async (e) => {
    e.stopPropagation(); 
    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
      const prompt = `You are a crypto analyst. Asset: ${name}. Price: $${price}. 24h: ${change}%. Action: BUY/HOLD/SELL. Give 2 sentence reason in JSON {"action": "", "reason": ""}`;
      const result = await model.generateContent(prompt);
      const aiData = JSON.parse(result.response.text());
      let colorClass = 'bg-gray-950/50 text-gray-400 border border-gray-900/50';
      if (aiData.action === 'BUY') colorClass = 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50';
      if (aiData.action === 'SELL') colorClass = 'bg-rose-950/50 text-rose-400 border border-rose-900/50';
      if (aiData.action === 'HOLD') colorClass = 'bg-yellow-950/50 text-yellow-400 border border-yellow-900/50';
      setVerdict({ action: aiData.action, color: colorClass, reason: aiData.reason });
    } catch {
      setVerdict({ action: "ERROR", color: "bg-red-950/50 text-red-500 border-red-900/50", reason: "API Error." });
    } finally { setIsAnalyzing(false); }
  };
  return (
    <div 
      onClick={() => onSelect({ id, name })}
      className={`bg-black/60 backdrop-blur-md rounded-xl p-6 text-gray-200 w-full max-w-sm transition-all duration-300 cursor-pointer border-2
      ${isActive ? activeGlow : 'border-gray-800 hover:border-gray-600 hover:bg-black/80'}`}
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
          <p className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>{isPositive ? '+' : ''}{change}% (24h)</p>
        </div>
      </div>
      <hr className="border-gray-800 my-5" />
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleGenerateVerdict} disabled={isAnalyzing}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 border 
            ${isAnalyzing ? 'bg-gray-900 border-gray-800 text-gray-600 animate-pulse' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Generate AI Verdict'}
        </button>
        {verdict && !isAnalyzing && (
          <div className="bg-black/50 rounded-lg p-4 border border-gray-800 mt-2 animate-fade-in">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded mb-2 ${verdict.color}`}>VERDICT: {verdict.action}</span>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">{verdict.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default function CryptoAdvisorDashboard() {
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [activeChartCoin, setActiveChartCoin] = useState({ id: 'bitcoin', name: 'Bitcoin' });
  const [isKira, setIsKira] = useState(false); 
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
        if (!response.ok) throw new Error('Rate limited');
        const data = await response.json();
        const formattedData = data.map((coin) => ({
          id: coin.id, name: coin.name, symbol: coin.symbol, price: coin.current_price, change: parseFloat(coin.price_change_percentage_24h?.toFixed(2) || 0), icon: coin.image,
        }));
        setMarketData(formattedData);
        setIsLoading(false);
      } catch (error) {
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
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans relative overflow-hidden transition-colors duration-500">
      <NetworkBackground isKira={isKira} /> 
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-gray-800">
        <span className={`text-xs font-bold font-mono ${!isKira ? 'text-cyan-400' : 'text-gray-500'}`}>KIRO</span>
        <button 
          onClick={() => {
            setIsKira(!isKira);
            window.speechSynthesis.cancel(); // Stop talking if user switches
          }}
          className="w-12 h-6 rounded-full bg-gray-900 border border-gray-700 relative transition-colors duration-300 focus:outline-none flex items-center"
        >
          <div className={`w-4 h-4 rounded-full absolute transition-all duration-300 shadow-lg ${isKira ? 'bg-rose-500 right-1' : 'bg-cyan-500 left-1'}`}></div>
        </button>
        <span className={`text-xs font-bold font-mono ${isKira ? 'text-rose-400' : 'text-gray-500'}`}>KIRA</span>
      </div>
      <div className="max-w-6xl mx-auto relative z-10 pt-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">
            Crypto<span className="text-gray-500">Advisor</span>.AI
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center">
            <p className="text-gray-500 font-mono text-sm inline-block">
              Decentralized market analysis active_
            </p>
            {apiError && <span className="text-xs font-mono text-yellow-500 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-900/50">⚠️ USING OFFLINE CACHE</span>}
          </div>
        </header>
        <BloombergChart coinId={activeChartCoin.id} coinName={activeChartCoin.name} isKira={isKira} /> 
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isKira ? 'border-rose-500' : 'border-cyan-500'}`}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {marketData.map((coin) => (
              <CryptoCard 
                key={coin.id} id={coin.id} name={coin.name} symbol={coin.symbol} price={coin.price} change={coin.change} icon={coin.icon} isActive={activeChartCoin.id === coin.id} onSelect={setActiveChartCoin}
                isKira={isKira} // Card knows the theme
              />
            ))}
          </div>
        )}
      </div>
      <GlobalVoiceAdvisor marketData={marketData} isKira={isKira} />
    </div>
  );
}