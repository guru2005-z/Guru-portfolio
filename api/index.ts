import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { RAG_KNOWLEDGE_BASE, retrieveRelevantKnowledge } from '../src/data/ragKnowledgeBase.js';

dotenv.config();

const app = express();
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

// API endpoint for multi-turn RAG-grounded chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { messages, message } = req.body;
    const userPrompt = message || (messages && messages[messages.length - 1]?.content);

    if (!userPrompt) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Step 1: Execute in-memory RAG retrieval over Guravaiah's portfolio knowledge index
    const retrieved = retrieveRelevantKnowledge(userPrompt, 3);
    const retrievalLatency = `${Date.now() - startTime}ms`;

    const ragContextText = retrieved
      .map((r, i) => `[Source ${i + 1} - ${r.chunk.title} (${r.chunk.category})]:\n${r.chunk.content}`)
      .join('\n\n');

    let reply = '';
    let isAIGenerated = false;

    if (aiClient) {
      try {
        const chatHistory = Array.isArray(messages) && messages.length > 1
          ? messages.slice(0, -1).map((m: { role: string; content: string }) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          : [];

        const dynamicSystemInstruction = `${SYSTEM_INSTRUCTION}

=== RETRIEVED KNOWLEDGE CONTEXT ===
Ground your response accurately in these retrieved facts:
${ragContextText}

Rules:
1. Answer the user query clearly and accurately using the retrieved context.
2. If relevant, cite facts or live links directly (e.g. Gully United at https://gully-united-xlv.vercel.app/).
3. Be professional, direct, and highlight Guravaiah's strengths.`;

        const chat = aiClient.chats.create({
          model: 'gemini-3.8-flash',
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: 0.6,
          },
          history: chatHistory
        });

        const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out')), 4000)
        );

        const result = await Promise.race([
          chat.sendMessage({ message: userPrompt }),
          timeoutPromise
        ]) as { text?: string };

        if (result.text) {
          reply = result.text;
          isAIGenerated = true;
        }
      } catch (aiErr) {
        console.warn('Gemini inference fallback to RAG synthesizer:', aiErr);
      }
    }

    // If Gemini was unavailable or timed out, synthesize a deterministic grounded answer using RAG chunks
    if (!reply) {
      const topChunk = retrieved[0]?.chunk;
      const secondChunk = retrieved[1]?.chunk;

      if (topChunk) {
        reply = `${topChunk.content}`;
        if (secondChunk && secondChunk.id !== topChunk.id) {
          reply += ` Additionally, ${secondChunk.highlight}`;
        }
      } else {
        reply = "Guravaiah Katta is a Full-Stack Software Engineer with strong expertise in Java, Spring Boot, React, and PostgreSQL. You can email him directly at kattaguravaiah00@gmail.com or call +91-9491501919!";
      }
    }

    return res.json({
      reply,
      rag: {
        retrievalLatency,
        totalLatency: `${Date.now() - startTime}ms`,
        confidenceScore: retrieved[0]?.score || 0.85,
        sources: retrieved.map(r => ({
          id: r.chunk.id,
          title: r.chunk.title,
          category: r.chunk.category,
          score: r.score,
          highlight: r.chunk.highlight,
          content: r.chunk.content,
          matchedKeywords: r.matchedKeywords
        })),
        grounded: true,
        model: isAIGenerated ? 'gemini-3.8-flash (RAG)' : 'rag-hybrid-synthesizer'
      }
    });

  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.json({
      reply: "Guravaiah Katta is actively open to software engineering opportunities and freelance contracts. Feel free to contact him directly at kattaguravaiah00@gmail.com or on LinkedIn at https://www.linkedin.com/in/guravaiah-katta/!",
      rag: {
        retrievalLatency: '0ms',
        totalLatency: `${Date.now() - startTime}ms`,
        confidenceScore: 0.70,
        sources: [],
        grounded: false,
        model: 'fallback'
      }
    });
  }
});

// API endpoint to inspect full RAG knowledge corpus
app.get('/api/rag/corpus', (_req: Request, res: Response) => {
  res.json({
    totalChunks: RAG_KNOWLEDGE_BASE.length,
    chunks: RAG_KNOWLEDGE_BASE
  });
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

export default app;

