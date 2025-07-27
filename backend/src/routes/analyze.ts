import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

interface AnalysisResult {
  isMatcha: boolean;
  confidence: number;
  explanation: string;
}

// POST /api/analyze
router.post('/', upload.single('image'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Convert file buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log(`🔍 Analyzing image: ${req.file.originalname} (${req.file.size} bytes)`);

    // Call OpenAI Vision API
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
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Clean and parse the response
    let cleanContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Extract JSON from response
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }

    try {
      const analysis: AnalysisResult = JSON.parse(cleanContent);
      
      // Validate response structure
      if (typeof analysis.isMatcha !== 'boolean' || 
          typeof analysis.confidence !== 'number' || 
          typeof analysis.explanation !== 'string') {
        throw new Error('Invalid response structure from AI');
      }

      // Ensure confidence is within valid range
      analysis.confidence = Math.max(0, Math.min(100, analysis.confidence));

      console.log(`✅ Analysis complete: ${analysis.isMatcha ? 'Matcha detected' : 'No matcha'} (${analysis.confidence}% confidence)`);
      
      res.json(analysis);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Raw content:', cleanContent);
      
      // Fallback analysis
      const isMatcha = content.toLowerCase().includes('matcha') && 
                      (content.toLowerCase().includes('yes') || 
                       content.toLowerCase().includes('true') ||
                       content.toLowerCase().includes('"ismatcha": true'));
      
      const confidenceMatch = content.match(/confidence['":\s]*(\d+)/i);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : (isMatcha ? 75 : 25);
      
      const fallbackResult: AnalysisResult = {
        isMatcha,
        confidence: Math.max(0, Math.min(100, confidence)),
        explanation: content.replace(/^.*?"explanation":\s*"?/, '').replace(/"?\s*\}.*$/, '').trim() || content
      };

      console.log(`⚠️  Fallback analysis: ${fallbackResult.isMatcha ? 'Matcha detected' : 'No matcha'} (${fallbackResult.confidence}% confidence)`);
      
      res.json(fallbackResult);
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return res.status(429).json({ 
          error: 'AI service rate limit exceeded. Please try again later.' 
        });
      }
      if (error.message.includes('invalid_api_key')) {
        return res.status(500).json({ 
          error: 'AI service configuration error' 
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze image. Please try again.' 
    });
  }
});

// Health check for this route
router.get('/health', (req: express.Request, res: express.Response) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  res.json({
    status: 'healthy',
    openai_configured: hasApiKey,
    timestamp: new Date().toISOString()
  });
});

export default router; 