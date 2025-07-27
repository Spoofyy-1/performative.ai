import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type

    // Analyze image with OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this image and determine if it contains matcha (the Japanese green tea powder). Look for:

1. The distinctive bright green color of matcha
2. Matcha-flavored foods, drinks, or desserts (matcha latte, matcha ice cream, matcha cake, etc.)
3. Matcha powder itself
4. Any matcha-related items

Respond ONLY with a valid JSON object (no markdown formatting, no extra text) containing:
- isMatcha: boolean (true if matcha is detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see and why you think it contains/doesn't contain matcha)

Be specific about what matcha-related elements you can identify in the image.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Clean the response and parse JSON
    let cleanContent = content.trim()
    
    // Remove markdown code blocks if present
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Remove any extra text before or after JSON
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanContent = jsonMatch[0]
    }

    try {
      const analysis = JSON.parse(cleanContent)
      
      // Validate the response structure
      if (typeof analysis.isMatcha !== 'boolean' || 
          typeof analysis.confidence !== 'number' || 
          typeof analysis.explanation !== 'string') {
        throw new Error('Invalid response structure')
      }
      
      return NextResponse.json(analysis)
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      console.error('Content:', cleanContent)
      
      // Fallback: analyze the text response manually
      const isMatcha = content.toLowerCase().includes('matcha') && 
                      (content.toLowerCase().includes('yes') || 
                       content.toLowerCase().includes('true') ||
                       content.toLowerCase().includes('"ismatcha": true'))
      
      // Try to extract confidence if mentioned
      const confidenceMatch = content.match(/confidence['":\s]*(\d+)/i)
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : (isMatcha ? 75 : 25)
      
      return NextResponse.json({
        isMatcha,
        confidence,
        explanation: content.replace(/^.*?"explanation":\s*"?/, '').replace(/"?\s*\}.*$/, '').trim() || content
      })
    }

  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
} 