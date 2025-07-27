'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

interface LabubuResult {
  isLabubu: boolean
  confidence: number
  explanation: string
  loading?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LabubuDetector() {
  const [analysis, setAnalysis] = useState<LabubuResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const analyzeImage = async (file: File) => {
    setAnalysis({ isLabubu: false, confidence: 0, explanation: '', loading: true })
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Model-Type': 'labubu'
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
        isLabubu: false,
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
    <main className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-pink-300 hover:text-white mb-8 transition-all duration-300 group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Performative.AI
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-pink-500/25">
            <span className="text-4xl">👹</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Lab.AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Detect the viral <span className="text-pink-400 font-semibold">Labubu status symbol</span> that's taken over designer bags. 
            From blind box collectibles to keychain charms, we spot the 2025 trend everyone's obsessing over.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30 backdrop-blur-sm">
              🎁 Blind Box Recognition
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm">
              👜 Bag Charm Detection
            </span>
            <span className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30 backdrop-blur-sm">
              🧸 Plush Toy Analysis
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!imagePreview ? (
            <div
              {...getRootProps()}
              className={`group relative border-2 border-dashed border-pink-400/40 rounded-2xl p-16 text-center cursor-pointer transition-all duration-500 hover:border-pink-400/70 hover:bg-pink-500/5 backdrop-blur-sm bg-white/5 ${
                isDragActive ? 'border-pink-400 bg-pink-500/10 scale-105' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300">📸</div>
                <div>
                  <p className="text-2xl font-bold text-white mb-3">
                    {isDragActive ? '✨ Drop your Labubu here!' : '🎯 Upload to detect Labubu'}
                  </p>
                  <p className="text-gray-300 text-lg">Drag & drop or click to hunt for status symbols</p>
                  <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto">
                    Works best with clear photos of Labubu figures, keychains, or blind box packaging
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Hunt Another Labubu
                  </button>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-8">Labubu Analysis</h2>
                  
                  {analysis?.loading ? (
                    <div className="space-y-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-pink-300/20 rounded-lg w-3/4"></div>
                        <div className="h-6 bg-purple-300/20 rounded-lg w-1/2"></div>
                        <div className="h-24 bg-indigo-300/20 rounded-lg"></div>
                      </div>
                      <p className="text-gray-300 text-lg">🧠 AI is hunting for Labubu...</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-8">
                      <div className={`text-center p-6 rounded-2xl ${
                        analysis.isLabubu 
                          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30' 
                          : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-400/30'
                      }`}>
                        <div className={`text-6xl mb-4 ${analysis.isLabubu ? 'animate-bounce' : ''}`}>
                          {analysis.isLabubu ? '👹✨' : '🔍❌'}
                        </div>
                        <div className={`text-2xl font-bold mb-2 ${
                          analysis.isLabubu ? 'text-pink-400' : 'text-gray-400'
                        }`}>
                          {analysis.isLabubu ? 'LABUBU DETECTED!' : 'No Labubu Found'}
                        </div>
                        <div className="text-gray-300">
                          {analysis.isLabubu ? 'Status symbol confirmed' : 'Keep hunting'}
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
                              analysis.isLabubu 
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
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

                      {analysis.isLabubu && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-pink-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="text-white font-semibold text-sm">Status Level</div>
                            <div className="text-pink-300 text-xs">High Value</div>
                          </div>
                          <div className="bg-purple-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="text-white font-semibold text-sm">Trend Factor</div>
                            <div className="text-purple-300 text-xs">Viral 2025</div>
                          </div>
                          <div className="bg-indigo-500/20 rounded-xl p-4">
                            <div className="text-2xl mb-2">🔥</div>
                            <div className="text-white font-semibold text-sm">Popularity</div>
                            <div className="text-indigo-300 text-xs">Peak Hype</div>
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
          <p className="mb-2">Part of the Performative.AI Suite • Detecting 2025's Hottest Trends</p>
          <p className="text-sm">Powered by OpenAI Vision • Built for the extremely online</p>
        </div>
      </div>
    </main>
  )
} 