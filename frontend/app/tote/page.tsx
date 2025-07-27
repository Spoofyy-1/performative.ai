'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface AnalysisResult {
  isTote?: boolean
  confidence?: number
  explanation?: string
  sustainability?: number
  brandValue?: number
  aestheticScore?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ToteDetector() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeImage = async (file: File) => {
    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'X-Model-Type': 'tote'
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze image. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      await analyzeImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  })

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-600 bg-slate-100'
    if (score >= 80) return 'text-emerald-600 bg-emerald-50'
    if (score >= 60) return 'text-amber-600 bg-amber-50'
    return 'text-orange-600 bg-orange-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Soft animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 to-amber-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-100/30 to-amber-100/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-6">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mr-6"
            >
              ← Back to Performative.AI
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-5xl">👜</span>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Tote.AI
            </h1>
          </div>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Drop a photo and discover if it contains tote bags with AI precision. Perfect for 
            identifying sustainable carriers and analyzing brand value!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer
              transition-all duration-300 bg-white/50 backdrop-blur-sm
              ${isDragActive 
                ? 'border-amber-300 bg-amber-50/80 scale-105' 
                : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50/50'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border border-amber-200/50">
                <span className="text-4xl">📷</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">
                Drag & drop an image here
              </h3>
              <p className="text-slate-500 mb-1">or click to select a file</p>
              <p className="text-sm text-slate-400">Supports JPG, PNG, and WebP files</p>
            </div>

            {analyzing && (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-300 border-t-amber-600"></div>
                <span className="text-slate-600">Analyzing for tote bags...</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          {(image || result || error) && (
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {/* Image Preview */}
              {image && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-700">Uploaded Image</h3>
                  <div className="rounded-2xl overflow-hidden border border-gray-200/50 bg-white/50 backdrop-blur-sm p-4">
                    <img 
                      src={image} 
                      alt="Uploaded for analysis" 
                      className="w-full h-auto rounded-xl shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {(result || error) && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-700">Analysis Results</h3>
                  
                  {error ? (
                    <div className="p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl">
                      <div className="flex items-center gap-3 text-red-600">
                        <span className="text-2xl">⚠️</span>
                        <p className="font-medium">{error}</p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      {/* Main Result */}
                      <div className="p-6 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-medium text-slate-700">
                            {result.isTote ? '✅ Tote Bag Detected!' : '❌ No Tote Bag Found'}
                          </span>
                          {result.confidence && (
                            <span className="px-3 py-1 bg-amber-100/80 text-amber-700 rounded-full text-sm font-medium">
                              {Math.round(result.confidence)}% confident
                            </span>
                          )}
                        </div>
                        
                        {/* Confidence Bar */}
                        {result.confidence && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                              <span>Confidence Level</span>
                              <span>{Math.round(result.confidence)}%</span>
                            </div>
                            <div className="w-full bg-gray-200/50 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        {result.explanation && (
                          <div className="mt-4 p-4 bg-slate-50/80 rounded-xl">
                            <p className="text-slate-600 leading-relaxed">{result.explanation}</p>
                          </div>
                        )}
                      </div>

                      {/* Additional Metrics */}
                      {result.isTote && (
                        <div className="grid grid-cols-1 gap-4">
                          {/* Sustainability Score */}
                          {result.sustainability && (
                            <div className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                              <div className="mb-2">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                  <span className="flex items-center gap-2">
                                    <span>🌱</span>
                                    Sustainability Score
                                  </span>
                                  <span>{result.sustainability}/100</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200/50 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${result.sustainability}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Brand Value */}
                          {result.brandValue && (
                            <div className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                              <div className="mb-2">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                  <span className="flex items-center gap-2">
                                    <span>💎</span>
                                    Brand Value
                                  </span>
                                  <span>{result.brandValue}/100</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200/50 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${result.brandValue}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Aesthetic Score */}
                          {result.aestheticScore && (
                            <div className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                              <div className="mb-2">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                  <span className="flex items-center gap-2">
                                    <span>✨</span>
                                    Aesthetic Score
                                  </span>
                                  <span>{result.aestheticScore}/100</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200/50 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${result.aestheticScore}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200/50">
          <p className="text-slate-500">
            Powered by OpenAI Vision API • Part of Performative.AI
          </p>
        </div>
      </div>
    </div>
  )
} 