import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

const SYSTEM_INSTRUCTION = `You are "Guru AI", the intelligent technical representative for Guravaiah Katta.
Your purpose is to answer prospective clients, tech recruiters, and engineering managers about Guravaiah's skills, projects, credentials, and availability.

Key Facts about Guravaiah Katta:
- Role: Full-Stack Software Engineer & AI Systems Developer
- Education: B.Tech in Computer Science and Engineering (2023 - 2027) at N.B.K.R Institute of Science and Technology, CGPA: 8.17 / 10.
- Contact: kattaguravaiah00@gmail.com | +91-9491501919 | Andhra Pradesh, India
- LinkedIn: https://www.linkedin.com/in/guravaiah-katta/
- GitHub: https://github.com/guru2005-z (also https://github.com/guravaiahkatta/)
- Primary Freelance Project: Gully United - Cricket ground booking platform live at https://gully-united-xlv.vercel.app/. Built with Java, Spring Boot, React, TypeScript, PostgreSQL, JPA/Hibernate, Spring Security, JWT, Razorpay payments, double-booking prevention, QR ticket verification, and Google Maps.
- Other Key Projects:
  1. KhetConnect - Hyperlocal Agricultural Labour Platform (Spring Boot, React, PostgreSQL, Tailwind, 5km radius job discovery).
  2. AI-Powered Market Trend & Consumer Sentiment Forecaster (Python, Scikit-learn, NLP, LLMs, RAG, Pinecone vector database).
  3. CyberShield Sentinel - 1st Place Cybersecurity Hackathon winner.
  4. MediCare Connect Pro - 2nd Place Medicare Web Application Competition winner.
- Certifications: Microsoft Certified: Azure Fundamentals (AZ-900) - Credential ID: 5B48115BB42E21FC. Kaggle GenAI 2025 Agents Intensive Capstone.
- Algorithms & DSA: Solved 300+ Data Structures and Algorithms problems.
- Availability: Open for Software Engineering internships, full-time junior engineer roles, and high-impact freelance projects.

Tone: Ultra-knowledgeable, professional, crisp, engineering-minded, and friendly. Answer user queries directly, referencing his specific technical architectures where appropriate.`;

// API endpoint for multi-turn Gemini chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, message } = req.body;
    const userPrompt = message || (messages && messages[messages.length - 1]?.content);

    if (!userPrompt) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      // Build conversation history for Google GenAI
      const chatHistory = Array.isArray(messages) && messages.length > 1
        ? messages.slice(0, -1).map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        : [];

      const chat = aiClient.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
        history: chatHistory
      });

      // Wrap in a 4000ms timeout race so clients never hang
      const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 4000)
      );

      const result = await Promise.race([
        chat.sendMessage({ message: userPrompt }),
        timeoutPromise
      ]) as { text?: string };

      const reply = result.text || "I'd be glad to share more details about Guravaiah's work or connect you directly via email at kattaguravaiah00@gmail.com.";
      return res.json({ reply });
    } else {
      // Intelligent fallback when API key is not present in local test
      const lower = userPrompt.toLowerCase();
      let fallback = "Guravaiah Katta is a Full-Stack Software Engineer with strong expertise in Java, Spring Boot, React, and PostgreSQL. You can email him at kattaguravaiah00@gmail.com or explore his live freelance app Gully United at https://gully-united-xlv.vercel.app/!";
      
      if (lower.includes('project') || lower.includes('gully') || lower.includes('freelance')) {
        fallback = "Guravaiah recently built 'Gully United' (live at https://gully-united-xlv.vercel.app/), a full-stack cricket ground booking system using Spring Boot, React, PostgreSQL, and Razorpay with atomic double-booking prevention and QR tickets. He also created KhetConnect and an AI Consumer Sentiment Forecaster with RAG and Pinecone!";
      } else if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack')) {
        fallback = "Guravaiah's core tech stack includes Java (Spring Boot, Spring Security, JPA/Hibernate), React, TypeScript, PostgreSQL, Python (NLP, Scikit-learn), and Microsoft Azure (he is AZ-900 certified).";
      } else if (lower.includes('hire') || lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
        fallback = "You can reach Guravaiah directly via email at kattaguravaiah00@gmail.com, by phone at +91-9491501919, or via LinkedIn at https://www.linkedin.com/in/guravaiah-katta/. He typically responds within a few hours!";
      } else if (lower.includes('resume') || lower.includes('cv')) {
        fallback = "Guravaiah's official resume is available for one-click download directly from the top navigation bar or the hero section (file: Guravaiah_Katta_Resume.pdf).";
      }

      return res.json({ reply: fallback });
    }
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.json({
      reply: "Guravaiah Katta is actively open to software engineering opportunities and freelance contracts. Feel free to contact him directly at kattaguravaiah00@gmail.com or on LinkedIn at https://www.linkedin.com/in/guravaiah-katta/!"
    });
  }
});

// API endpoint for client inquiries - forwards to FormSubmit to deliver actual email to Guravaiah
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, projectType, message } = req.body;
    const targetEmail = 'kattaguravaiah00@gmail.com';
    console.log(`[CLIENT INQUIRY RECEIVED] From: ${name} (${email}) | Message: ${message}`);

    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': req.headers.origin || 'http://localhost:3000',
        'Referer': req.headers.referer || 'http://localhost:3000/'
      },
      body: JSON.stringify({
        name: name || 'Portfolio Visitor',
        email: email || 'visitor@example.com',
        message: message || '(No message provided)',
        _subject: `[Portfolio Inquiry] from ${name || 'Visitor'}`,
        _replyto: email
      })
    });

    const data = await formSubmitRes.json().catch(() => ({}));
    console.log('[FormSubmit result]:', data);

    return res.json({
      success: true,
      forwarded: true,
      details: data,
      notificationTarget: targetEmail,
      message: data.message || 'Inquiry dispatched to email.'
    });
  } catch (err: any) {
    console.error('Error forwarding contact email:', err);
    return res.json({
      success: true,
      forwarded: false,
      notificationTarget: 'kattaguravaiah00@gmail.com',
      message: 'Inquiry received and logged.'
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
