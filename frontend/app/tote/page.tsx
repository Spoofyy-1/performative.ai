'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

interface ToteResult {
  isTote: boolean
  confidence: number
  explanation: string
  loading?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ToteDetector() {
  const [analysis, setAnalysis] = useState<ToteResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const analyzeImage = async (file: File) => {
    setAnalysis({ isTote: false, confidence: 0, explanation: '', loading: true })
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Model-Type': 'tote'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setAnalysis({
        isTote: false,
        confidence: 0,
        explanation: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Sorry, there was an error analyzing your image. Please try again.',
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      analyzeImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const resetAnalysis = () => {
    setAnalysis(null)
    setImagePreview(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 relative overflow-hidden">
      {/* Sophisticated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-red-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-amber-300 hover:text-white mb-8 transition-all duration-300 group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Performative.AI
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl mb-6 shadow-2xl shadow-amber-500/25">
            <span className="text-4xl">👜</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Tote.AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Analyze <span className="text-amber-400 font-semibold">tote bag aesthetics</span> and brand recognition. 
            From sustainable canvas to luxury designer pieces, we evaluate the cultural significance of your carry.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30 backdrop-blur-sm">
              🌱 Sustainable Materials
            </span>
            <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30 backdrop-blur-sm">
              👑 Luxury Brand Recognition
            </span>
            <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30 backdrop-blur-sm">
              🎨 Aesthetic Scoring
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!imagePreview ? (
            <div
              {...getRootProps()}
              className={`group relative border-2 border-dashed border-amber-400/40 rounded-2xl p-16 text-center cursor-pointer transition-all duration-500 hover:border-amber-400/70 hover:bg-amber-500/5 backdrop-blur-sm bg-white/5 ${
                isDragActive ? 'border-amber-400 bg-amber-500/10 scale-105' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">👜</div>
                <div>
                  <p className="text-2xl font-bold text-white mb-3">
                    {isDragActive ? '✨ Drop your tote here!' : '🎯 Upload to analyze tote aesthetics'}
                  </p>
                  <p className="text-gray-300 text-lg">Drag & drop or click to evaluate your bag game</p>
                  <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto">
                    Works with canvas totes, designer bags, branded carriers, and market bags
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-8">
                  <img
                    src={imagePreview}
                    alt="Uploaded image"
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Analyze Another Tote
                  </button>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-8">Tote Analysis</h2>
                  
                  {analysis?.loading ? (
                    <div className="space-y-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-amber-300/20 rounded-lg w-3/4"></div>
                        <div className="h-6 bg-orange-300/20 rounded-lg w-1/2"></div>
                        <div className="h-24 bg-red-300/20 rounded-lg"></div>
                      </div>
                      <p className="text-gray-300 text-lg">🧠 AI is evaluating bag aesthetics...</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-8">
                      <div className={`text-center p-6 rounded-2xl ${
                        analysis.isTote 
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30' 
                          : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-400/30'
                      }`}>
                        <div className={`text-6xl mb-4 ${analysis.isTote ? 'animate-bounce' : ''}`}>
                          {analysis.isTote ? '👜✨' : '🔍❌'}
                        </div>
                        <div className={`text-2xl font-bold mb-2 ${
                          analysis.isTote ? 'text-amber-400' : 'text-gray-400'
                        }`}>
                          {analysis.isTote ? 'TOTE DETECTED!' : 'No Tote Found'}
                        </div>
                        <div className="text-gray-300">
                          {analysis.isTote ? 'Bag game recognized' : 'Try another image'}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Detection Confidence</span>
                          <span className="font-semibold">{analysis.confidence}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-1000 ${
                              analysis.isTote 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-gray-500 to-slate-600'
                            }`}
                            style={{ width: `${analysis.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6">
                        <h4 className="text-white font-semibold mb-3 flex items-center">
                          <span className="mr-2">🔍</span>
                          AI Analysis
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{analysis.explanation}</p>
                      </div>

                      {analysis.isTote && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-amber-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">🌱</div>
                            <div className="text-white font-semibold text-sm">Sustainability</div>
                            <div className="text-amber-300 text-xs">Eco-Conscious</div>
                          </div>
                          <div className="bg-orange-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="text-white font-semibold text-sm">Brand Value</div>
                            <div className="text-orange-300 text-xs">Quality Detected</div>
                          </div>
                          <div className="bg-red-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="text-white font-semibold text-sm">Aesthetic Score</div>
                            <div className="text-red-300 text-xs">High Appeal</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p className="mb-2">Part of the Performative.AI Suite • Elevating Bag Culture</p>
          <p className="text-sm">Powered by OpenAI Vision • Designed for the aesthetically conscious</p>
        </div>
      </div>
    </main>
  )
} 