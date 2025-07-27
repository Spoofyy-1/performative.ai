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
  isMatcha?: boolean;
  isLabubu?: boolean;
  isTote?: boolean;
  isPerformative?: boolean;
  confidence: number;
  explanation: string;
  detectedItems?: string[];
  performativeScore?: number;
}

// Get prompt based on model type
function getPromptForModel(modelType: string): string {
  switch (modelType) {
    case 'matcha':
      return `Please analyze this image and determine if it contains matcha (the Japanese green tea powder). Look for:

1. The distinctive bright green color of matcha
2. Matcha-flavored foods, drinks, or desserts (matcha latte, matcha ice cream, matcha cake, etc.)
3. Matcha powder itself
4. Any matcha-related items

Respond ONLY with a valid JSON object containing:
- isMatcha: boolean (true if matcha is detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see and why you think it contains/doesn't contain matcha)`;

    case 'labubu':
      return `Please analyze this image and determine if it contains Labubu dolls or figures. Labubu are small monster-like creatures with:

1. Fuzzy/plush texture and pastel colors
2. Sharp teeth/fangs and elf-like ears
3. Small keychain or figure size
4. Often attached to bags as charms
5. Blind box toy packaging

Respond ONLY with a valid JSON object containing:
- isLabubu: boolean (true if Labubu is detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see)`;

    case 'tote':
      return `Please analyze this image and determine if it contains tote bags. Look for:

1. Canvas or fabric bags with handles
2. Simple rectangular/square shape
3. Plain or branded designs
4. Shopping or utility bags
5. Designer or fashion tote bags

Respond ONLY with a valid JSON object containing:
- isTote: boolean (true if tote bag is detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see)`;

    case 'performative':
      return `Please analyze this image for performative male traits popular in 2025 TikTok/social media culture. Look for a MALE person with these items:

**STATUS SYMBOLS:**
- Labubu keychains/dolls attached to bags
- Designer bag charms or collectible toys
- Trendy accessories that signal wealth/taste

**FUNCTIONAL ACCESSORIES:**
- Carabiners clipped to clothing/bags
- Utility clips, key holders
- "Tactical" or outdoor gear used for aesthetic

**AESTHETIC ITEMS:**
- Matcha drinks/food items
- Tote bags (especially branded ones)
- Skincare products visible
- "Looksmaxxing" accessories

**SIGMA MALE/PERFORMATIVE INDICATORS:**
- Overly curated "candid" poses
- Multiple accessories that seem intentionally displayed
- Trying to appear nonchalant while clearly posing

Analyze if this is a MALE displaying performative behavior. Rate performativeness 0-100.

Respond ONLY with a valid JSON object containing:
- isPerformative: boolean (true if performative traits detected)
- performativeScore: number (0-100, how performative they appear)
- confidence: number (0-100, your confidence in the analysis)
- detectedItems: array of strings (list specific items you see)
- explanation: string (detailed breakdown of performative elements)`;

    default:
      return getPromptForModel('matcha'); // Default to matcha
  }
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

    // Get model type from header, default to matcha
    const modelType = req.headers['x-model-type'] as string || 'matcha';
    
    // Convert file buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log(`🔍 Analyzing image with ${modelType} model: ${req.file.originalname} (${req.file.size} bytes)`);

    // Get the appropriate prompt for the model
    const prompt = getPromptForModel(modelType);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
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
      
      // Validate and normalize response based on model type
      if (modelType === 'matcha') {
        if (typeof analysis.isMatcha !== 'boolean' || 
            typeof analysis.confidence !== 'number' || 
            typeof analysis.explanation !== 'string') {
          throw new Error('Invalid response structure from AI');
        }
      } else if (modelType === 'labubu') {
        if (typeof analysis.isLabubu !== 'boolean' || 
            typeof analysis.confidence !== 'number' || 
            typeof analysis.explanation !== 'string') {
          throw new Error('Invalid response structure from AI');
        }
      } else if (modelType === 'tote') {
        if (typeof analysis.isTote !== 'boolean' || 
            typeof analysis.confidence !== 'number' || 
            typeof analysis.explanation !== 'string') {
          throw new Error('Invalid response structure from AI');
        }
      } else if (modelType === 'performative') {
        if (typeof analysis.isPerformative !== 'boolean' || 
            typeof analysis.confidence !== 'number' || 
            typeof analysis.explanation !== 'string') {
          throw new Error('Invalid response structure from AI');
        }
        // Ensure performativeScore exists for performative model
        if (typeof analysis.performativeScore !== 'number') {
          analysis.performativeScore = analysis.isPerformative ? 75 : 25;
        }
        // Ensure detectedItems exists
        if (!Array.isArray(analysis.detectedItems)) {
          analysis.detectedItems = [];
        }
      }

      // Ensure confidence is within valid range
      analysis.confidence = Math.max(0, Math.min(100, analysis.confidence));
      if (analysis.performativeScore) {
        analysis.performativeScore = Math.max(0, Math.min(100, analysis.performativeScore));
      }

      const detectionType = modelType === 'matcha' ? (analysis.isMatcha ? 'Matcha' : 'No matcha') :
                           modelType === 'labubu' ? (analysis.isLabubu ? 'Labubu' : 'No Labubu') :
                           modelType === 'tote' ? (analysis.isTote ? 'Tote bag' : 'No tote bag') :
                           modelType === 'performative' ? (analysis.isPerformative ? 'Performative' : 'Not performative') :
                           'Unknown';

      console.log(`✅ Analysis complete (${modelType}): ${detectionType} (${analysis.confidence}% confidence)`);
      
      res.json(analysis);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Raw content:', cleanContent);
      
      // Fallback analysis based on model type
      const fallbackResult: AnalysisResult = {
        confidence: 50,
        explanation: content
      };

      if (modelType === 'matcha') {
        const isMatcha = content.toLowerCase().includes('matcha') && 
                         (content.toLowerCase().includes('yes') || 
                          content.toLowerCase().includes('true'));
        fallbackResult.isMatcha = isMatcha;
      } else if (modelType === 'labubu') {
        const isLabubu = content.toLowerCase().includes('labubu') && 
                         (content.toLowerCase().includes('yes') || 
                          content.toLowerCase().includes('true'));
        fallbackResult.isLabubu = isLabubu;
      } else if (modelType === 'tote') {
        const isTote = content.toLowerCase().includes('tote') && 
                       (content.toLowerCase().includes('yes') || 
                        content.toLowerCase().includes('true'));
        fallbackResult.isTote = isTote;
      } else if (modelType === 'performative') {
        const isPerformative = content.toLowerCase().includes('performative') && 
                               (content.toLowerCase().includes('yes') || 
                                content.toLowerCase().includes('true'));
        fallbackResult.isPerformative = isPerformative;
        fallbackResult.performativeScore = isPerformative ? 60 : 20;
        fallbackResult.detectedItems = [];
      }

      console.log(`⚠️  Fallback analysis (${modelType})`);
      
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
    supported_models: ['matcha', 'labubu', 'tote', 'performative'],
    timestamp: new Date().toISOString()
  });
});

export default router; 