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
      return `Please analyze this image and determine if it contains ACTUAL MATCHA (Japanese green tea powder) or matcha-flavored items.

**REAL MATCHA CHARACTERISTICS:**
1. **Distinctive bright green color** - Vibrant, almost neon green (not just any green)
2. **Fine powder texture** - When visible as powder, very fine and smooth
3. **Japanese origin context** - Traditional or modern Japanese presentation

**MATCHA ITEMS TO DETECT:**
- Matcha powder itself (bright green powder)
- Matcha lattes/drinks (distinctive green color)
- Matcha ice cream, cakes, cookies, desserts
- Matcha Kit-Kats or Japanese sweets
- Traditional matcha tea ceremony items

**NOT MATCHA:**
- Regular green tea (different color, not powder-based)
- Green smoothies or vegetable drinks
- Mint-flavored items
- Artificial green coloring
- Green vegetables or herbs

**BE STRICT:** Only identify genuine matcha or matcha-flavored items with the characteristic bright green color.

Respond ONLY with a valid JSON object containing:
- isMatcha: boolean (true only if genuine matcha detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see and why you think it contains/doesn't contain matcha)`;

    case 'labubu':
      return `Please analyze this image and determine if it contains LABUBU characters or figures. Labubu are specific collectible characters with VERY distinct features:

**AUTHENTIC LABUBU CHARACTERISTICS:**
1. **Creature design** - Small monster/elf-like beings with distinctive ears
2. **Sharp teeth/fangs** - Visible pointed teeth in mouth
3. **Elf-like pointed ears** - Distinctive ear shape
4. **Fuzzy/plush texture** - Soft, stuffed animal appearance
5. **Pop Mart branding** - Often associated with Pop Mart blind boxes
6. **Pastel colors** - Usually soft pink, white, yellow, or muted tones

**COMMON LABUBU FORMS:**
- Keychain attachments on bags
- Small collectible figures (2-6 inches)
- Blind box toys with Pop Mart packaging
- Plush versions with characteristic features

**NOT LABUBU:**
- Other collectible figures or toys
- Generic plush animals
- Different anime/cartoon characters
- Regular keychains without Labubu features

**BE VERY SPECIFIC:** Only identify genuine Labubu characters with the distinctive ear and teeth features.

Respond ONLY with a valid JSON object containing:
- isLabubu: boolean (true only if genuine Labubu character detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (detailed explanation of what you see and specific Labubu features identified)
- status: string ("authentic", "replica", or "uncertain")
- trend: string ("rising", "peak", or "stable")
- popularity: number (0-100, current trend popularity)`;

    case 'tote':
      return `Please analyze this image and determine if it contains ACTUAL TOTE BAGS (not just any bag). A true tote bag must have ALL these characteristics:

**REQUIRED TOTE BAG FEATURES:**
1. **Open-top design** - No zippers, flaps, or closures across the main opening
2. **Two parallel handles** - Handles attached to opposite sides, meant for shoulder/hand carrying
3. **Rectangular/square base** - Wide, flat bottom that can stand upright
4. **Simple construction** - Usually canvas, cotton, leather, or sturdy fabric
5. **Shopping/utility purpose** - Designed for carrying groceries, books, everyday items

**NOT TOTE BAGS:**
- Handbags with zippers, clasps, or flaps
- Purses with single handles or chain straps
- Crossbody bags or messenger bags
- Backpacks or athletic bags
- Designer bags with complex closures
- Evening bags or clutches

**COMMON REAL TOTES:**
- Canvas shopping bags
- Reusable grocery bags
- Plain canvas totes with logos
- Library/bookstore bags
- Beach bags
- Work totes for laptops/documents

BE VERY STRICT - only identify actual tote bags, not designer handbags or purses.

Respond ONLY with a valid JSON object containing:
- isTote: boolean (true ONLY if genuine tote bag detected)
- confidence: number (0-100, your confidence percentage)
- explanation: string (explain specifically why this is/isn't a tote bag based on the criteria above)`;

    case 'performative':
      return `Please analyze this image for MALE subjects displaying 2025 performative/looksmaxxing behavior. This must be a MALE person (not female) showing specific cultural indicators.

**CRITICAL: MUST BE MALE SUBJECT** - If no male person is visible, return isPerformative: false.

**2025 PERFORMATIVE MALE INDICATORS:**

**TIER 1 - HIGH PERFORMATIVE (Weight: 30-40 points each):**
- Labubu/Pop Mart collectibles attached to bags or visible
- Multiple expensive accessories clearly displayed for photos
- "Sigma male" posing (trying to look effortlessly cool while clearly staged)
- Looksmaxxing gear: jade rollers, skincare products, grooming tools
- Strategic matcha drinks in frame (performative health aesthetic)

**TIER 2 - MEDIUM PERFORMATIVE (Weight: 15-25 points each):**
- Carabiners attached to clothing/bags for aesthetic (not functional use)
- Designer tote bags or branded accessories
- Overly curated "candid" poses
- Multiple rings, chains, or statement jewelry
- Expensive sneakers prominently featured

**TIER 3 - LOW PERFORMATIVE (Weight: 5-15 points each):**
- Basic accessories or grooming items
- Normal poses without obvious staging
- Single branded item without over-display

**NEGATIVE INDICATORS (Subtract points):**
- Genuine functional use of items (not for show)
- Natural, unstaged photos
- Minimal accessories or styling

**SCORING:**
- 0-20: Not performative
- 21-40: Mildly performative  
- 41-65: Moderately performative
- 66-85: Highly performative
- 86-100: Extremely performative

Analyze the cumulative performative score based on visible indicators.

Respond ONLY with a valid JSON object containing:
- isPerformative: boolean (true if score > 20 AND subject is male)
- performativeScore: number (0-100, calculated score)
- confidence: number (0-100, confidence in male identification and score)
- detectedItems: array of strings (specific performative items identified)
- sigmaLevel: string ("alpha", "beta", "sigma", or "omega" based on overall vibe)
- tiktokFactor: number (0-100, how TikTok-core the aesthetic is)
- explanation: string (detailed breakdown of scoring and why this is/isn't performative)`;

    default:
      return getPromptForModel('matcha'); // Default to matcha
  }
}

// POST /api/analyze
router.post('/', upload.single('image'), async (req: express.Request, res: express.Response) => {
  const requestId = Math.random().toString(36).substring(2, 15);
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided',
        requestId,
        timestamp: new Date().toISOString()
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'AI service not configured',
        requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Get model type from header, default to matcha
    const modelType = req.headers['x-model-type'] as string || 'matcha';
    
    // Convert file buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log(`🔍 [${requestId}] Analyzing image with ${modelType} model: ${req.file.originalname} (${req.file.size} bytes)`);

    // Get the appropriate prompt for the model
    const prompt = getPromptForModel(modelType);

    // Call OpenAI Vision API with timeout and retry logic
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
      max_tokens: 500,
    }, {
      // Add request timeout for better concurrent handling
      timeout: 30000, // 30 seconds
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

      console.log(`✅ [${requestId}] Analysis complete (${modelType}): ${detectionType} (${analysis.confidence}% confidence)`);
      
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

      console.log(`⚠️  [${requestId}] Fallback analysis (${modelType})`);
      
      res.json(fallbackResult);
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return res.status(429).json({ 
          error: 'AI service rate limit exceeded. Please try again later.',
          requestId,
          timestamp: new Date().toISOString()
        });
      }
      if (error.message.includes('invalid_api_key')) {
        return res.status(500).json({ 
          error: 'AI service configuration error',
          requestId,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze image. Please try again.',
      requestId,
      timestamp: new Date().toISOString()
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