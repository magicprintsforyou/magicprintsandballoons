"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  needsHuman: boolean;
  contactInfo?: { name: string; phone: string };
  createdAt: string;
}

// FAQ knowledge base - bot answers these automatically
const FAQ_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['price', 'cost', 'how much', 'precio', 'cuanto'],
    answer: "Our prices:\n• Photo Boards: $120-$950 (10 sizes)\n• Life-Size Cutouts: $40-$95\n• Floor Wraps: $250-$1,700\n• Seating Charts: $120-$160\n\nYou can see all sizes on our Products page. Would you like a custom quote?"
  },
  {
    keywords: ['long', 'take', 'turnaround', 'ready', 'days', 'tiempo', 'tarda'],
    answer: "Most orders are ready in 2-5 business days depending on size. A 5ft cutout takes about 2 days after we receive your photo and payment. Need it faster? Ask us about rush options!"
  },
  {
    keywords: ['deliver', 'delivery', 'ship', 'pickup', 'envio', 'entrega'],
    answer: "We offer:\n• Pickup in Arlington, TX (free)\n• Local delivery (additional cost)\n• Nationwide shipping\n\nAll products ship folded for safe transport."
  },
  {
    keywords: ['cutout', 'cut out', 'life-size'],
    answer: "Our Custom Life-Size Cutouts are printed on durable coroplast with a matching stand. Sizes: 2ft ($40), 3ft ($45), 4ft ($65), 5ft ($85), 6ft ($95). Perfect for birthdays, graduations, weddings and quinceañeras!"
  },
  {
    keywords: ['floor wrap', 'floor decal', 'dance floor'],
    answer: "Our Custom Vinyl Floor Wraps range from 8x8 ft ($250) to 20x20 ft ($1,700). Design is included! Installation and delivery available at an additional cost."
  },
  {
    keywords: ['photo board', 'backdrop'],
    answer: "Our Standard Photo Boards come in 10 sizes from 5x4 ft ($120) to 8x20 ft ($950). Available in foam board or coroplast. Great for weddings, birthdays, and corporate events!"
  },
  {
    keywords: ['seating chart'],
    answer: "Our Custom Seating Charts are $120-$160 depending on size (5x4 ft to 7x8 ft). Design fee is $20 additional, but FREE if you already have your design!"
  },
  {
    keywords: ['design', 'artwork', 'photo', 'diseno'],
    answer: "You can upload your photo/design when you place your order. If you need design help, we offer design services - just mention it in your order notes!"
  },
  {
    keywords: ['hour', 'open', 'location', 'where', 'donde', 'ubicacion'],
    answer: "We're located in Arlington, Texas. We offer pickup in Arlington and local delivery. For specific hours or to schedule a pickup, please leave your info and we'll get back to you!"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'hola', 'buenos'],
    answer: "Hello! Welcome to Magic Prints! How can I help you today? I can answer questions about prices, turnaround times, delivery, and our products."
  },
  {
    keywords: ['thank', 'thanks', 'gracias'],
    answer: "You're welcome! Is there anything else I can help you with?"
  },
];

const FALLBACK_MESSAGE = "I want to make sure you get the right answer. Could you please share your name and phone number? Our team will reach out to you shortly!";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [awaitingContact, setAwaitingContact] = useState(false);
  const [needsHuman, setNeedsHuman] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Hi there! I'm the Magic Prints assistant. I can help with prices, turnaround times, delivery info, and more. What can I do for you?");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string) => {
    msgId.current += 1;
    setMessages(prev => [...prev, { id: msgId.current, text, isBot: true, timestamp: new Date() }]);
  };

  const findAnswer = (question: string): string | null => {
    const q = question.toLowerCase();
    for (const faq of FAQ_RESPONSES) {
      if (faq.keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return faq.answer;
      }
    }
    return null;
  };

  const saveSession = (msgs: Message[], humanNeeded: boolean, contact?: { name: string; phone: string }) => {
    try {
      const session: ChatSession = {
        id: sessionId,
        messages: msgs,
        needsHuman: humanNeeded,
        contactInfo: contact,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('magic_prints_chats') || '[]');
      const updated = existing.filter((s: ChatSession) => s.id !== sessionId);
      updated.push(session);
      localStorage.setItem('magic_prints_chats', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save chat session', e);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    msgId.current += 1;
    const userMsg: Message = { id: msgId.current, text: input.trim(), isBot: false, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const userInput = input.trim();
    setInput('');

    setTimeout(() => {
      if (awaitingContact) {
        // Try to parse name and phone from input
        const phoneMatch = userInput.match(/[\d\-\(\)\+\s]{7,}/);
        if (phoneMatch) {
          const phone = phoneMatch[0].trim();
          const name = userInput.replace(phoneMatch[0], '').trim() || 'Not provided';
          setNeedsHuman(true);
          setAwaitingContact(false);
          const confirmMsg: Message = { 
            id: ++msgId.current, 
            text: `Thank you ${name}! We've received your info and our team will contact you at ${phone} shortly.`, 
            isBot: true, 
            timestamp: new Date() 
          };
          const finalMessages = [...newMessages, confirmMsg];
          setMessages(finalMessages);
          saveSession(finalMessages, true, { name, phone });
        } else {
          addBotMessage("I didn't catch a phone number. Please include your phone number so we can reach you (e.g., 'Maria 817-555-0123').");
        }
        return;
      }

      const answer = findAnswer(userInput);
      if (answer) {
        addBotMessage(answer);
        saveSession([...newMessages, { id: msgId.current + 1, text: answer, isBot: true, timestamp: new Date() }], false);
      } else {
        setAwaitingContact(true);
        addBotMessage(FALLBACK_MESSAGE);
        saveSession(newMessages, false);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105"
          aria-label="Open live chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <div>
                <div className="font-semibold">Magic Prints Chat</div>
                <div className="text-xs text-pink-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  Online - typically replies instantly
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-pink-700 rounded p-1" aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-line ${
                    msg.isBot
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-pink-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleSend}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg p-2 transition-colors"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              {needsHuman ? "Our team will contact you soon!" : "Ask about prices, sizes, delivery & more"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
