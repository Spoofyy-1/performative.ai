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
    color: 'from-emerald-100 via-green-50 to-teal-100',
    accent: 'emerald',
    bgPattern: 'bg-emerald-50/30'
  },
  {
    id: 'labubu',
    name: 'Lab.AI',
    emoji: '👹',
    description: 'Identifies viral Labubu status symbols - the 2025 designer bag charm obsession',
    examples: ['Labubu keychains', 'Pop Mart collections', 'Designer bag charms', 'Viral collectibles'],
    color: 'from-pink-100 via-rose-50 to-purple-100',
    accent: 'pink',
    bgPattern: 'bg-pink-50/30'
  },
  {
    id: 'tote',
    name: 'Tote.AI',
    emoji: '👜',
    description: 'Advanced tote bag recognition with sustainability and brand value analysis',
    examples: ['Canvas totes', 'Designer bags', 'Eco-friendly carriers', 'Branded merchandise'],
    color: 'from-amber-100 via-orange-50 to-yellow-100',
    accent: 'amber',
    bgPattern: 'bg-amber-50/30'
  },
  {
    id: 'performative',
    name: 'Perform.AI',
    emoji: '📱',
    description: 'Detects performative male indicators based on 2025 TikTok culture and looksmaxxing trends',
    examples: ['Looksmaxxing gear', 'Sigma male props', 'TikTok aesthetics', 'Performance indicators'],
    color: 'from-indigo-100 via-purple-50 to-blue-100',
    accent: 'indigo',
    bgPattern: 'bg-indigo-50/30'
  }
]

export default function PerformativeAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-rose-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-600 via-gray-700 to-stone-600 bg-clip-text text-transparent">
            Performative.AI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Advanced AI detection suite for modern culture analysis. 
            <span className="block mt-2 text-slate-500">Four specialized models, infinite possibilities.</span>
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
          {MODELS.map((model) => (
            <div
              key={model.id}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-500 active:scale-95 sm:hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50"
            >
              {/* Soft gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="text-3xl sm:text-4xl">{model.emoji}</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-700 group-hover:text-slate-800 transition-colors">
                    {model.name}
                  </h2>
                </div>
                
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                  {model.description}
                </p>
                
                <div className="space-y-2 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Examples:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {model.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 text-xs rounded-full bg-white/60 text-slate-600 border border-gray-200/50"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = `/${model.id}`}
                  className={`w-full py-3 sm:py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r ${model.color} border border-gray-200/50 text-slate-700 font-medium hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 active:scale-95 sm:group-hover:scale-[1.02] text-sm sm:text-base`}
                >
                  Try {model.name} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200/50 px-4">
          <p className="text-sm sm:text-base text-slate-500 mb-4">
            Powered by OpenAI Vision API • Built for 2025 Culture
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <a href="https://github.com/spoofyy1/matcha.ai" className="hover:text-slate-600 transition-colors">GitHub</a>
            <span>•</span>
            <a href="/api/health" className="hover:text-slate-600 transition-colors">API Status</a>
            <span>•</span>
            <span>Made with 💚 for modern AI</span>
          </div>
        </div>
      </div>
    </div>
  )
} 