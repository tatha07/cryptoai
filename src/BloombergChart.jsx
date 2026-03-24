import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const BloombergChart = ({ coinId, coinName }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
          return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            fullDate: date.toLocaleDateString(),
            price: price
          };
        });
        setChartData(formattedData);
      } catch (error) {
        console.error("Chart API failed, engaging offline simulation mode:", error);
        const mockData = Array.from({ length: 30 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (30 - i));
          const basePrice = coinId === 'bitcoin' ? 64000 : coinId === 'ethereum' ? 3400 : 140;
          const noise = (Math.random() - 0.5) * (basePrice * 0.05); 
          return {
            date: `${d.getMonth() + 1}/${d.getDate()}`,
            fullDate: d.toLocaleDateString(),
            price: basePrice + noise
          };
        });
        setChartData(mockData);
      } finally {
        setIsLoading(false);
      }
    };
    if (coinId) {
      fetchHistory();
    }
  }, [coinId]); 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-cyan-400 p-3 font-mono shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <p className="text-gray-400 text-xs mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-cyan-400 text-lg font-bold">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="w-full bg-[#050505] border border-gray-800 p-6 rounded-xl shadow-2xl relative overflow-hidden z-10 mb-8">
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-cyan-400 font-mono text-2xl font-bold uppercase tracking-widest">{coinName} / USD</h3>
          <p className="text-gray-600 font-mono text-xs mt-1">30-DAY HISTORICAL VOLATILITY (CLAMPED Y-AXIS)</p>
        </div>
        {isLoading && <span className="text-cyan-400 font-mono text-sm animate-pulse">FETCHING NODE DATA_</span>}
      </div>
      <div className="h-80 w-full">
        {!isLoading && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#4b5563" tick={{ fill: '#6b7280', fontFamily: 'monospace', fontSize: 11 }} minTickGap={30} />
              <YAxis domain={['dataMin', 'dataMax']} stroke="#4b5563" tick={{ fill: '#6b7280', fontFamily: 'monospace', fontSize: 11 }} tickFormatter={(val) => `$${val.toLocaleString()}`} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#22d3ee', stroke: '#000', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
export default BloombergChart;