'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

interface PerformativeResult {
  isPerformative: boolean
  performativeScore: number
  confidence: number
  explanation: string
  detectedItems: string[]
  loading?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PerformativeDetector() {
  const [analysis, setAnalysis] = useState<PerformativeResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const analyzeImage = async (file: File) => {
    setAnalysis({ 
      isPerformative: false, 
      performativeScore: 0,
      confidence: 0, 
      explanation: '', 
      detectedItems: [],
      loading: true 
    })
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Model-Type': 'performative'
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
        isPerformative: false,
        performativeScore: 0,
        confidence: 0,
        detectedItems: [],
        explanation: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Sorry, there was an error analyzing your image. Please try again.',
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Analyze image
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

  const getPerformativeLevel = (score: number) => {
    if (score >= 80) return { level: 'EXTREMELY PERFORMATIVE', color: 'text-red-600', bg: 'bg-red-100' }
    if (score >= 60) return { level: 'HIGHLY PERFORMATIVE', color: 'text-orange-600', bg: 'bg-orange-100' }
    if (score >= 40) return { level: 'MODERATELY PERFORMATIVE', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 20) return { level: 'MILDLY PERFORMATIVE', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { level: 'NOT PERFORMATIVE', color: 'text-green-600', bg: 'bg-green-100' }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
        >
          ← Back to Performative.AI
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎭 <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Perform.AI</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            The ultimate performative male detector for 2025. Analyzes photos for sigma male aesthetics, 
            status accessories, and TikTok-core performative behavior.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
            <span className="px-3 py-1 bg-white/10 rounded-full">👹 Labubu Detection</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">🔗 Carabiner Spotting</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">🍵 Matcha Analysis</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">👜 Tote Assessment</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!imagePreview ? (
            /* Drop Zone */
            <div
              {...getRootProps()}
              className={`drop-zone border-2 border-dashed border-purple-400/50 rounded-xl p-12 text-center cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-500/10 backdrop-blur-sm bg-white/5 ${
                isDragActive ? 'active border-purple-400 bg-purple-500/20' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">📸</div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    {isDragActive ? 'Drop your image here!' : 'Upload a photo to analyze performative behavior'}
                  </p>
                  <p className="text-gray-300">Drag & drop or click to select an image</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Works best with photos of males and their accessories
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="p-6">
                  <img
                    src={imagePreview}
                    alt="Uploaded image"
                    className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="mt-4 w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm"
                  >
                    Analyze Another Image
                  </button>
                </div>

                {/* Analysis Result */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Performative Analysis</h2>
                  
                  {analysis?.loading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                        <div className="h-20 bg-white/20 rounded"></div>
                      </div>
                      <p className="text-gray-300">🧠 AI is analyzing performative traits...</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-6">
                      {/* Performative Score */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                          {analysis.performativeScore}%
                        </div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                          getPerformativeLevel(analysis.performativeScore).bg
                        } ${getPerformativeLevel(analysis.performativeScore).color}`}>
                          {getPerformativeLevel(analysis.performativeScore).level}
                        </div>
                      </div>

                      {/* Performative Score Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Performative Level</span>
                          <span>{analysis.performativeScore}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${analysis.performativeScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Detected Items */}
                      {analysis.detectedItems && analysis.detectedItems.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-3">🎯 Detected Performative Items</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.detectedItems.map((item, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm border border-purple-400/50"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Confidence */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>Analysis Confidence</span>
                          <span>{analysis.confidence}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-white/60"
                            style={{ width: `${analysis.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div>
                        <h4 className="text-white font-semibold mb-2">🔍 AI Analysis Breakdown</h4>
                        <p className="text-gray-300 leading-relaxed text-sm">{analysis.explanation}</p>
                      </div>

                      {/* Performance Indicators */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                          <div className="text-white font-semibold">Sigma Level</div>
                          <div className="text-gray-300">
                            {analysis.performativeScore >= 70 ? 'Alpha' : 
                             analysis.performativeScore >= 40 ? 'Beta' : 'Omega'}
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                          <div className="text-white font-semibold">TikTok Factor</div>
                          <div className="text-gray-300">
                            {analysis.performativeScore >= 60 ? 'Very High' : 
                             analysis.performativeScore >= 30 ? 'Moderate' : 'Low'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">👹</div>
              <div className="text-white font-semibold">Status Symbols</div>
              <div className="text-gray-300 text-sm">Labubu, designer charms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-white font-semibold">Functional Gear</div>
              <div className="text-gray-300 text-sm">Carabiners, utility clips</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">🍵</div>
              <div className="text-white font-semibold">Aesthetic Items</div>
              <div className="text-gray-300 text-sm">Matcha, skincare</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">👜</div>
              <div className="text-white font-semibold">Bag Game</div>
              <div className="text-gray-300 text-sm">Totes, crossbody bags</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>Built for the extremely online • Part of Performative.AI Suite</p>
        </div>
      </div>
    </main>
  )
} 