'use client'

import React, { useState } from 'react'

interface DetectorModel {
  id: string
  name: string
  emoji: string
  description: string
  examples: string[]
  color: string
  accent: string
  bgPattern: string
}

const MODELS: DetectorModel[] = [
  {
    id: 'matcha',
    name: 'Matcha.AI',
    emoji: '🍵',
    description: 'Precision detection of matcha in foods, drinks, and desserts with cultural accuracy',
    examples: ['Matcha lattes', 'Matcha ice cream', 'Matcha powder', 'Matcha desserts'],
    color: 'from-emerald-400 via-green-500 to-teal-600',
    accent: 'emerald',
    bgPattern: 'bg-emerald-500/10'
  },
  {
    id: 'labubu',
    name: 'Lab.AI',
    emoji: '👹',
    description: 'Identifies viral Labubu status symbols - the 2025 designer bag charm obsession',
    examples: ['Labubu keychains', 'Blind box figures', 'Plush toys', 'Designer charms'],
    color: 'from-pink-400 via-purple-500 to-indigo-600',
    accent: 'pink',
    bgPattern: 'bg-pink-500/10'
  },
  {
    id: 'tote',
    name: 'Tote.AI',
    emoji: '👜',
    description: 'Sophisticated tote bag analysis - brand recognition and aesthetic evaluation',
    examples: ['Canvas totes', 'Designer bags', 'Branded carriers', 'Market bags'],
    color: 'from-amber-400 via-orange-500 to-red-600',
    accent: 'amber',
    bgPattern: 'bg-amber-500/10'
  },
  {
    id: 'performative',
    name: 'Perform.AI',
    emoji: '🎭',
    description: 'Ultimate performative male detector - sigma aesthetics, status symbols, TikTok culture',
    examples: ['Sigma male traits', 'Looksmaxxing gear', 'Status accessories', 'TikTok trends'],
    color: 'from-violet-400 via-purple-500 to-fuchsia-600',
    accent: 'violet',
    bgPattern: 'bg-violet-500/10'
  }
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  const handleModelSelect = (model: DetectorModel) => {
    window.location.href = `/${model.id}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Ultra-Modern Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-full mb-8 shadow-2xl shadow-violet-500/25 animate-pulse">
            <span className="text-5xl">🎭</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent animate-pulse">
              Performative.AI
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto mb-8 leading-relaxed font-light">
            The <span className="text-emerald-400 font-semibold">ultimate AI detection suite</span> for 2025's most 
            <span className="text-pink-400 font-semibold"> performative cultural trends</span>. 
            From matcha aesthetics to Labubu status symbols.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300">
              ✨ GPT-4o Vision Powered
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-pink-300 hover:bg-pink-500/20 transition-all duration-300">
              🚀 Real-time Analysis
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-amber-300 hover:bg-amber-500/20 transition-all duration-300">
              🎯 Cultural Accuracy
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-violet-300 hover:bg-violet-500/20 transition-all duration-300">
              🔥 2025 Trends
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className="max-w-8xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16 tracking-wide">
            Choose Your <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">Cultural Detector</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
              >
                <div className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden ${
                  hoveredModel === model.id ? 'shadow-2xl shadow-white/10' : ''
                }`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 ${model.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${model.color} rounded-2xl flex items-center justify-center shadow-xl mr-6 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-3xl">{model.emoji}</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                          {model.name}
                        </h3>
                        <div className={`w-32 h-1 bg-gradient-to-r ${model.color} rounded-full`}></div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {model.description}
                    </p>

                    {/* Examples */}
                    <div className="mb-8">
                      <h4 className="text-white font-bold mb-4 text-lg">Specialized Detection:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {model.examples.map((example, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-gray-300 rounded-lg text-sm border border-white/20 group-hover:bg-white/20 group-hover:text-white transition-all duration-300"
                          >
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <button className={`px-8 py-4 bg-gradient-to-r ${model.color} text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 text-lg`}>
                        Launch {model.name}
                      </button>
                      <div className="text-3xl text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-24 text-gray-400">
          <p className="text-lg mb-4">Built for the extremely online generation</p>
          <p className="mb-6">Powered by OpenAI Vision API • Frontend on Vercel • Backend on Railway</p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">About</a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">API Docs</a>
            <a href="https://github.com/Spoofyy-1/matcha.ai" className="hover:text-white transition-colors duration-300 hover:underline">GitHub</a>
            <a href="#" className="hover:text-white transition-colors duration-300 hover:underline">Contact</a>
          </div>
          <div className="mt-8 text-xs text-gray-500">
            <p>Detecting performativity since 2025 🎭</p>
          </div>
        </div>
      </div>
    </main>
  )
} 