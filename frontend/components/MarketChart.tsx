'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, ZoomIn, ZoomOut, Maximize2, Download, Clock } from 'lucide-react';

interface MarketChartProps {
  results: readonly bigint[];
  options: string[];
  totalVoters: bigint;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(0);
};

export function MarketChart({ results, options, totalVoters }: MarketChartProps) {
  const [visibleOptions, setVisibleOptions] = useState<Set<number>>(new Set(options.map((_, i) => i)));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalVotes = results.reduce((sum, votes) => sum + Number(votes), 0);
  
  // Calculate percentages for each option
  const percentages = results.map(votes => {
    const voteCount = Number(votes);
    return totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  });

  const getColor = (index: number) => {
    const colors = [
      { line: 'rgb(16, 185, 129)', glow: 'rgba(16, 185, 129, 0.3)', area: 'rgba(16, 185, 129, 0.1)' },
      { line: 'rgb(239, 68, 68)', glow: 'rgba(239, 68, 68, 0.3)', area: 'rgba(239, 68, 68, 0.1)' },
      { line: 'rgb(251, 191, 36)', glow: 'rgba(251, 191, 36, 0.3)', area: 'rgba(251, 191, 36, 0.1)' },
      { line: 'rgb(59, 130, 246)', glow: 'rgba(59, 130, 246, 0.3)', area: 'rgba(59, 130, 246, 0.1)' },
    ];
    return colors[index % colors.length];
  };

  // Generate chart data points (30 points for smooth visualization)
  const generateDataPoints = (currentPercentage: number) => {
    const points = 30;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      // Create a simple line that stays at current percentage
      // In real app, this would be historical data from blockchain events
      data.push(currentPercentage);
    }
    
    return data;
  };

  // Download chart as image
  const downloadChart = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'market-chart.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Toggle option visibility
  const toggleOption = (index: number) => {
    setVisibleOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const chartWidth = 800;
  const chartHeight = 300;
  const padding = 40;

  return (
    <div className="space-y-6">
      {/* Chart Area */}
      <div className="bg-slate-950/60 rounded-lg p-6 border border-slate-800/40" ref={containerRef}>
        {/* Header with Legend and Controls */}
        <div className="flex flex-col lg:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Market Activity
            </h3>
            <div className="flex gap-3 flex-wrap">
              {options.map((option, idx) => {
                const color = getColor(idx);
                const isVisible = visibleOptions.has(idx);
                const percentage = percentages[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleOption(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                      isVisible 
                        ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/70' 
                        : 'bg-slate-900/30 border-slate-800/40 opacity-50'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full transition-all"
                      style={{ 
                        backgroundColor: isVisible ? color.line : 'rgb(100, 116, 139)',
                        boxShadow: isVisible ? `0 0 8px ${color.glow}` : 'none'
                      }}
                    />
                    <span className={`text-xs font-medium ${isVisible ? 'text-white' : 'text-slate-500'}`}>
                      {option}
                    </span>
                    <span className={`text-xs font-bold ${isVisible ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-2 bg-slate-800/50 border border-slate-700/60 rounded-lg hover:bg-slate-800/70 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              className="p-2 bg-slate-800/50 border border-slate-700/60 rounded-lg hover:bg-slate-800/70 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 bg-slate-800/50 border border-slate-700/60 rounded-lg hover:bg-slate-800/70 transition-all"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={downloadChart}
              className="p-2 bg-slate-800/50 border border-slate-700/60 rounded-lg hover:bg-slate-800/70 transition-all"
              title="Download Chart"
            >
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative w-full overflow-hidden bg-slate-900/30 rounded-lg" style={{ height: '400px' }}>
          <svg 
            ref={svgRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            <defs>
              {options.map((_, idx) => {
                const color = getColor(idx);
                return (
                  <linearGradient key={`grad-${idx}`} id={`gradient-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: color.line, stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: color.line, stopOpacity: 0 }} />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => {
              const yPos = padding + (chartHeight - 2 * padding) * (1 - y / 100);
              return (
                <g key={y}>
                  <line
                    x1={padding}
                    y1={yPos}
                    x2={chartWidth - padding}
                    y2={yPos}
                    stroke="rgb(51, 65, 85)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity={y === 50 ? "0.5" : "0.3"}
                  />
                  <text
                    x={padding - 10}
                    y={yPos}
                    fill="rgb(148, 163, 184)"
                    fontSize="12"
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {y}%
                  </text>
                </g>
              );
            })}

            {/* Vertical grid lines */}
            {[0, 25, 50, 75, 100].map((x) => {
              const xPos = padding + (chartWidth - 2 * padding) * (x / 100);
              return (
                <line
                  key={`v-${x}`}
                  x1={xPos}
                  y1={padding}
                  x2={xPos}
                  y2={chartHeight - padding}
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.2"
                />
              );
            })}

            {/* Draw lines for each option */}
            {options.map((option, optionIdx) => {
              if (!visibleOptions.has(optionIdx)) return null;
              
              const color = getColor(optionIdx);
              const percentage = percentages[optionIdx];
              const dataPoints = generateDataPoints(percentage);
              
              // Generate path for line
              const pathData = dataPoints.map((value, i) => {
                const x = padding + (chartWidth - 2 * padding) * (i / (dataPoints.length - 1));
                const y = padding + (chartHeight - 2 * padding) * (1 - value / 100);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ');

              // Generate area path
              const areaPath = pathData + 
                ` L ${chartWidth - padding} ${chartHeight - padding}` +
                ` L ${padding} ${chartHeight - padding} Z`;

              return (
                <g key={optionIdx}>
                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill={`url(#gradient-${optionIdx})`}
                    opacity="0.4"
                  />
                  
                  {/* Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color.line}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Current point */}
                  <circle
                    cx={chartWidth - padding}
                    cy={padding + (chartHeight - 2 * padding) * (1 - percentage / 100)}
                    r="5"
                    fill={color.line}
                    stroke="rgb(15, 23, 42)"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="5;7;5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Time labels */}
        <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            24h ago
          </span>
          <span className="text-slate-400">12h ago</span>
          <span className="text-white font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 gap-3">
        {results.map((votes, idx) => {
          const voteCount = Number(votes);
          const percentage = percentages[idx];
          const maxVotes = Math.max(...results.map(Number));
          const isLeading = voteCount === maxVotes && voteCount > 0;
          const color = getColor(idx);
          const isVisible = visibleOptions.has(idx);

          return (
            <div 
              key={idx} 
              onClick={() => toggleOption(idx)}
              className={`bg-slate-900/40 hover:bg-slate-900/60 rounded-xl p-5 border transition-all cursor-pointer ${
                isLeading ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 'border-slate-700/40'
              } ${!isVisible ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full transition-all"
                      style={{ 
                        backgroundColor: color.line,
                        boxShadow: isVisible ? `0 0 12px ${color.glow}` : 'none'
                      }}
                    />
                    <span className="text-white font-bold text-lg">{options[idx]}</span>
                    {isLeading && (
                      <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs text-emerald-400 font-semibold">
                        🏆 Leading
                      </span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-3">{percentage.toFixed(1)}%</div>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Votes: </span>
                      <span className="text-slate-300 font-semibold">{formatNumber(voteCount)}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-700"></div>
                    <div>
                      <span className="text-slate-500">Share: </span>
                      <span className="text-slate-300 font-semibold">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</div>
                    <div className="text-xs text-slate-500">vote share</div>
                  </div>
                  <div className="w-32 h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/40">
                    <div
                      className="h-full transition-all duration-700 rounded-full relative overflow-hidden"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color.line
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}