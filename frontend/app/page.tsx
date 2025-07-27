'use client'

import React, { useState } from 'react'

interface DetectorModel {
  id: string
  name: string
  emoji: string
  description: string
  examples: string[]
  color: string
}

const MODELS: DetectorModel[] = [
  {
    id: 'matcha',
    name: 'Matcha.AI',
    emoji: '🍵',
    description: 'Detects matcha in foods, drinks, and desserts with AI precision',
    examples: ['Matcha lattes', 'Matcha ice cream', 'Matcha powder', 'Matcha desserts'],
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'labubu',
    name: 'Lab.AI',
    emoji: '👹',
    description: 'Identifies Labubu dolls - the viral status symbol attached to bags',
    examples: ['Labubu keychains', 'Blind box figures', 'Plush toys', 'Designer bag charms'],
    color: 'from-pink-400 to-purple-600'
  },
  {
    id: 'tote',
    name: 'Tote.AI',
    emoji: '👜',
    description: 'Recognizes tote bags and their brands for aesthetic evaluation',
    examples: ['Canvas totes', 'Designer totes', 'Branded bags', 'Market bags'],
    color: 'from-orange-400 to-red-600'
  },
  {
    id: 'performative',
    name: 'Perform.AI',
    emoji: '🎭',
    description: 'Analyzes males for performative traits: Labubu, carabiners, matcha, totes',
    examples: ['Sigma male aesthetic', 'Looksmaxxing gear', 'Status accessories', 'TikTok trends'],
    color: 'from-blue-400 to-indigo-600'
  }
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<DetectorModel | null>(null)

  const handleModelSelect = (model: DetectorModel) => {
    setSelectedModel(model)
    // Navigate to the specific detector
    window.location.href = `/${model.id}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Performative.AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            The ultimate AI-powered detection suite for 2025's most performative trends. 
            From matcha to Labubu, we analyze what makes culture tick.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">✨ Powered by GPT-4o Vision</span>
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">🚀 Real-time Analysis</span>
            <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">🎯 Cultural Accuracy</span>
          </div>
        </div>

        {/* Model Grid */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Detector</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                  {/* Model Header */}
                  <div className="flex items-center mb-6">
                    <div className="text-6xl mr-4">{model.emoji}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{model.name}</h3>
                      <div className={`w-24 h-1 bg-gradient-to-r ${model.color} rounded-full`}></div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Detects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.examples.map((example, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 text-gray-300 rounded-full text-sm"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <button className={`px-6 py-3 bg-gradient-to-r ${model.color} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105`}>
                      Try {model.name}
                    </button>
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Feature Callout */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">🎭 Perform.AI - The Ultimate Performative Detector</h3>
              <p className="text-gray-300 text-lg mb-6">
                Our most advanced model analyzes photos of males for performative traits popular in 2025 TikTok culture. 
                Detects Labubu keychains, carabiners, matcha accessories, tote bags, and other sigma male/looksmaxxing indicators.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl mb-2">👹</div>
                  <div className="text-white font-semibold">Status Symbols</div>
                  <div className="text-gray-400">Labubu, designer charms</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="text-white font-semibold">Functional Accessories</div>
                  <div className="text-gray-400">Carabiners, utility clips</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl mb-2">🍵</div>
                  <div className="text-white font-semibold">Aesthetic Items</div>
                  <div className="text-gray-400">Matcha, tote bags</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-400">
          <p className="mb-4">Built for the extremely online generation • Powered by OpenAI Vision API</p>
          <p className="text-sm">Frontend on Vercel • Backend on Railway • Open Source on GitHub</p>
          <div className="mt-6 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </main>
  )
} 