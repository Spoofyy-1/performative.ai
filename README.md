# 🍵 Matcha.AI

An AI-powered web application that detects whether photos contain matcha using OpenAI's Vision API. Split into a modern frontend/backend architecture for optimal performance and scalability.

## 🏗️ Architecture (2025)

- **Frontend**: Next.js app deployed on Vercel (client-side only)
- **Backend**: Express.js API deployed on Railway (handles OpenAI integration)
- **Deployment**: Automatic from Git commits

## Features

- 🖼️ **Drag & Drop Interface**: Easy image upload with visual feedback
- 🧠 **AI-Powered Analysis**: Uses OpenAI's GPT-4o Vision API for accurate matcha detection
- 📊 **Confidence Scoring**: Get confidence levels for each analysis
- 💡 **Detailed Explanations**: Understand why the AI made its decision
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Beautiful UI**: Modern design with matcha-inspired colors
- ⚡ **Fast & Scalable**: Optimized for performance with global CDN

## What It Can Detect

- Matcha powder
- Matcha lattes and beverages
- Matcha ice cream and desserts
- Matcha cakes and pastries
- Any food or drink with visible matcha

## Tech Stack

### Frontend (Vercel)
- **Framework**: Next.js 14 (client-side)
- **Styling**: Tailwind CSS
- **File Upload**: React Dropzone
- **Language**: TypeScript

### Backend (Railway)
- **Runtime**: Node.js with Express
- **AI**: OpenAI GPT-4o Vision API
- **Language**: TypeScript
- **Deployment**: Railway

## 🚀 Deployment Guide

### Backend Deployment (Railway)

1. **Create Railway account** at [railway.com](https://railway.com)

2. **Deploy backend**:
   ```bash
   cd backend
   # Railway will auto-detect and deploy
   ```

3. **Set environment variables** in Railway dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```

4. **Get your Railway URL** (e.g., `https://your-app.railway.app`)

### Frontend Deployment (Vercel)

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Set environment variable** in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
   ```

3. **Deploy frontend**:
   - Connect your GitHub repository
   - Vercel auto-detects Next.js and deploys

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- An OpenAI API key with access to GPT-4o Vision

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Spoofyy-1/matcha.ai.git
   cd matcha.ai
   ```

2. **Backend setup**:
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   echo "NODE_ENV=development" >> .env
   echo "PORT=8000" >> .env
   
   # Start backend server
   npm run dev
   ```

3. **Frontend setup** (in new terminal):
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   
   # Start frontend server
   npm run dev
   ```

4. **Access the app**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## 📁 Project Structure

```
matcha.ai/
├── frontend/                 # Next.js app (Vercel)
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── public/             # Static assets
│   ├── package.json
│   └── next.config.js
├── backend/                 # Express.js API (Railway)
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── app.ts          # Express app
│   ├── package.json
│   └── railway.toml        # Railway config
└── README.md
```

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

## 🔒 Security Best Practices

- ✅ API keys stored securely in Railway environment variables
- ✅ CORS properly configured
- ✅ File upload validation and limits
- ✅ Environment separation (dev/prod)
- ✅ No sensitive data in client-side code

## 📊 Performance

- **Frontend**: Global CDN via Vercel Edge Network
- **Backend**: Auto-scaling on Railway infrastructure
- **Images**: Optimized processing and validation
- **API**: Efficient OpenAI integration with error handling

## 🌍 Environment URLs

- **Production Frontend**: https://matcha-ai.vercel.app
- **Production Backend**: https://matcha-ai-backend.railway.app
- **Local Frontend**: http://localhost:3000
- **Local Backend**: http://localhost:8000

## Contributing

Feel free to open issues and submit pull requests! This project demonstrates modern full-stack architecture with AI integration.

## License

MIT License - feel free to use this project as a starting point for your own AI vision applications!

---

Built with ❤️ and lots of matcha 🍵 