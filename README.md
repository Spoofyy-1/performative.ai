# 🍵 Matcha.AI

An AI-powered web application that detects whether photos contain matcha using OpenAI's Vision API. Simply drag and drop an image to get instant analysis with confidence levels and detailed explanations.

## Features

- 🖼️ **Drag & Drop Interface**: Easy image upload with visual feedback
- 🧠 **AI-Powered Analysis**: Uses OpenAI's GPT-4 Vision API for accurate matcha detection
- 📊 **Confidence Scoring**: Get confidence levels for each analysis
- 💡 **Detailed Explanations**: Understand why the AI made its decision
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Beautiful UI**: Modern design with matcha-inspired colors

## What It Can Detect

- Matcha powder
- Matcha lattes and beverages
- Matcha ice cream and desserts
- Matcha cakes and pastries
- Any food or drink with visible matcha

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 Vision API
- **File Upload**: React Dropzone

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key with access to GPT-4 Vision

### Installation

1. **Clone the repository** (or you're already in it!)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Make sure you have access to GPT-4 Vision (may require a paid plan)

## Usage

1. Open the application in your browser
2. Drag and drop an image file (JPG, PNG, or WebP) onto the upload area
3. Wait for the AI analysis to complete
4. View the results with confidence score and explanation
5. Click "Analyze Another Image" to try a different photo

## API Endpoints

### POST `/api/analyze`

Analyzes an uploaded image for matcha content.

**Request**: Multipart form data with an `image` file
**Response**: JSON object with analysis results

```json
{
  "isMatcha": boolean,
  "confidence": number,
  "explanation": string
}
```

## Contributing

Feel free to open issues and submit pull requests! This project is meant to be a fun exploration of AI vision capabilities.

## License

MIT License - feel free to use this project as a starting point for your own AI vision applications!

---

Built with ❤️ and lots of matcha 🍵 