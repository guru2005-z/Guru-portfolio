import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { RAG_KNOWLEDGE_BASE, retrieveRelevantKnowledge } from './src/data/ragKnowledgeBase';

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
  1. HealthGuard AI - Wearable Smart Health Platform live at https://health-guard-ai-wearable-smart-heal.vercel.app/ (GitHub: https://github.com/guru2005-z/HealthGuard-AI---Wearable-Smart-Health-Platform). Web Bluetooth GATT (0x180D/0x180F) streaming, deterministic clinical safety triage (AHA/ACC, WHO), and Gemini 2.5 Flash clinical RAG assistant.
  2. AI-Powered Market Trend & Consumer Sentiment Forecaster - Infosys Springboard internship project deployed on Streamlit (https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/).
  3. NBKRIST IEEE Portal - Official IEEE Student Branch web platform live at https://nbkristieee.in (NexusVerse-2K26 symposium).
  4. HackSpirit Hackathon Hub - Campus hackathon arena live at https://hackspirit.fun.
  5. KhetConnect - Hyperlocal Agricultural Labour Platform (Spring Boot, React, PostgreSQL, Tailwind, 5km radius job discovery).
  6. CyberShield Sentinel - 1st Place Cybersecurity Hackathon winner (Supraja Technologies CTF, Best Student award).
  7. MediCare Connect Pro - 2nd Place Medicare Web Application Competition winner.
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

// API endpoint for client inquiries - sends email directly via Gmail SMTP with Google App Password
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, projectType, message } = req.body;
    const senderName = name?.trim() || 'Portfolio Visitor';
    const senderEmail = email?.trim() || 'no-reply@portfolio.visitor';
    const inquiryMessage = message?.trim() || '(No message content)';
    const inquiryType = projectType?.trim() || 'General Inquiry / Opportunity';

    const smtpUser = process.env.SMTP_USER || 'kattaguravaiah00@gmail.com';
    const smtpPass = (process.env.SMTP_PASS || 'wklhxijdaehnvklp').replace(/\s+/g, '');
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'kattaguravaiah00@gmail.com';

    console.log(`[CONTACT EMAIL INCOMING] From: ${senderName} <${senderEmail}> | Type: ${inquiryType}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Send notification email to Guravaiah
    const mailInfo = await transporter.sendMail({
      from: `"${senderName} via Portfolio" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: senderEmail,
      subject: `⚡ [Portfolio Inquiry] from ${senderName} — ${inquiryType}`,
      text: `New Portfolio Message received from: ${senderName}\nEmail: ${senderEmail}\nType: ${inquiryType}\nTime (IST): ${timestamp}\n\nMessage:\n${inquiryMessage}\n\n---\nDelivered via Guravaiah Katta's Portfolio Contact Engine`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: #161514; color: #ffffff; padding: 24px; text-align: left;">
            <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #d41514; font-weight: bold;">
              NEW CLIENT INQUIRY
            </div>
            <h2 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff;">
              ${senderName} sent you a message
            </h2>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
              Received on ${timestamp} (IST)
            </div>
          </div>

          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: 600; width: 120px;">Sender:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 700;">${senderName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                  <a href="mailto:${senderEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${senderEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Inquiry Type:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                  <span style="background: #f3f4f6; color: #1f2937; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-family: monospace;">${inquiryType}</span>
                </td>
              </tr>
            </table>

            <div style="background: #f9fafb; border-left: 4px solid #161514; border-radius: 4px; padding: 16px; margin: 16px 0;">
              <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; font-weight: bold;">
                Message Content:
              </div>
              <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${inquiryMessage}</p>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <a href="mailto:${senderEmail}?subject=Re: Portfolio Inquiry" style="display: inline-block; background: #161514; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 600;">
                Reply to ${senderName} ↗
              </a>
            </div>
          </div>

          <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 14px 24px; font-size: 11px; color: #9ca3af; font-family: monospace; text-align: center;">
            Guravaiah Katta · Full-Stack & AI Systems Developer · guru99.in
          </div>
        </div>
      `
    });

    console.log(`[EMAIL DISPATCHED] ID: ${mailInfo.messageId}`);

    // 2. Optionally send an automated confirmation to the sender if their email is valid
    if (senderEmail.includes('@') && senderEmail.includes('.')) {
      try {
        await transporter.sendMail({
          from: `"Guravaiah Katta" <${smtpUser}>`,
          to: senderEmail,
          subject: `Thanks for reaching out, ${senderName}! [Guravaiah Katta]`,
          text: `Hi ${senderName},\n\nThank you for reaching out through my portfolio website! I have received your message regarding "${inquiryType}" and will review it promptly.\n\nBest regards,\nGuravaiah Katta\nFull-Stack Software Engineer & AI Systems Developer\nkattaguravaiah00@gmail.com | +91-9491501919\nhttps://guru99.in`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; padding: 24px;">
              <h3 style="margin-top: 0; color: #161514; font-size: 18px;">Thank you for getting in touch, ${senderName}!</h3>
              <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                I have received your message regarding <strong>${inquiryType}</strong> and will get back to you shortly.
              </p>
              <div style="background: #f9fafb; border-radius: 8px; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #4b5563;">
                <em>"${inquiryMessage.slice(0, 160)}${inquiryMessage.length > 160 ? '...' : ''}"</em>
              </div>
              <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">
                Warm regards,<br/>
                <strong style="color: #111827;">Guravaiah Katta</strong><br/>
                <span style="font-size: 12px; color: #9ca3af;">Full-Stack Software Engineer & AI Systems Developer</span><br/>
                <a href="https://guru99.in" style="color: #2563eb; text-decoration: none; font-size: 12px;">guru99.in</a> · 
                <a href="mailto:kattaguravaiah00@gmail.com" style="color: #2563eb; text-decoration: none; font-size: 12px;">kattaguravaiah00@gmail.com</a>
              </p>
            </div>
          `
        });
      } catch (autoReplyErr) {
        console.warn('Auto-reply skipped:', autoReplyErr);
      }
    }

    return res.json({
      success: true,
      delivered: true,
      messageId: mailInfo.messageId,
      notificationTarget: receiverEmail,
      message: 'Message delivered directly to Guravaiah\'s inbox.'
    });

  } catch (err: any) {
    console.error('Error dispatching SMTP email:', err);
    return res.status(500).json({
      success: false,
      delivered: false,
      error: err.message || 'Failed to dispatch email via SMTP'
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
