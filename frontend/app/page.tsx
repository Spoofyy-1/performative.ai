'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface AnalysisResult {
  isMatcha: boolean
  confidence: number
  explanation: string
  loading?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const analyzeImage = async (file: File) => {
    setAnalysis({ isMatcha: false, confidence: 0, explanation: '', loading: true })
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
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
        isMatcha: false,
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            🍵 <span className="matcha-gradient bg-clip-text text-transparent">Matcha.AI</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Drop a photo and discover if it contains matcha with AI precision. 
            Perfect for identifying matcha in foods, drinks, and desserts!
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!imagePreview ? (
            /* Drop Zone */
            <div
              {...getRootProps()}
              className={`drop-zone border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer transition-all hover:border-matcha-400 hover:bg-matcha-50 ${
                isDragActive ? 'active' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-6xl">📸</div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {isDragActive ? 'Drop your image here!' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-gray-500">or click to select a file</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Supports JPG, PNG, and WebP files
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="p-6">
                  <img
                    src={imagePreview}
                    alt="Uploaded image"
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Analyze Another Image
                  </button>
                </div>

                {/* Analysis Result */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Result</h2>
                  
                  {analysis?.loading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                      <p className="text-gray-600">🧠 AI is analyzing your image...</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-4">
                      {/* Result Badge */}
                      <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                        analysis.isMatcha 
                          ? 'bg-matcha-100 text-matcha-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysis.isMatcha ? '✅ Contains Matcha!' : '❌ No Matcha Detected'}
                      </div>

                      {/* Confidence */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              analysis.isMatcha ? 'bg-matcha-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysis.confidence}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{analysis.confidence}%</p>
                      </div>

                      {/* Explanation */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">AI Analysis</p>
                        <p className="text-gray-800 leading-relaxed">{analysis.explanation}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by OpenAI Vision API • Built with Next.js & Tailwind CSS</p>
          <p className="text-xs mt-2">Frontend on Vercel • Backend on Railway</p>
        </div>
      </div>
    </main>
  )
} 