"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  needsHuman: boolean;
  contactInfo?: { name: string; phone: string };
  createdAt: string;
}

export default function ChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selected, setSelected] = useState<ChatSession | null>(null);
  const [filter, setFilter] = useState<'all' | 'needsHuman'>('needsHuman');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('magic_prints_chats') || '[]');
      setSessions(saved.sort((a: ChatSession, b: ChatSession) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (e) {
      console.warn('Could not load chats', e);
    }
  }, []);

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.needsHuman);
  const needsAttention = sessions.filter(s => s.needsHuman).length;

  const markResolved = (id: string) => {
    const updated = sessions.map(s => s.id === id ? { ...s, needsHuman: false } : s);
    setSessions(updated);
    localStorage.setItem('magic_prints_chats', JSON.stringify(updated));
    if (selected?.id === id) setSelected({ ...selected, needsHuman: false });
  };

  const deleteSession = (id: string) => {
    if (!confirm('Delete this conversation?')) return;
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('magic_prints_chats', JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Website Chats</h1>
            <p className="text-gray-600">
              {needsAttention > 0 ? (
                <span className="text-red-600 font-semibold">{needsAttention} need your attention</span>
              ) : (
                "All caught up!"
              )}
            </p>
          </div>
          <Link href="/admin" className="text-pink-600 hover:underline">← Back to Admin</Link>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('needsHuman')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'needsHuman' ? 'bg-pink-600 text-white' : 'bg-white border'}`}
          >
            Needs Attention ({needsAttention})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-pink-600 text-white' : 'bg-white border'}`}
          >
            All Chats ({sessions.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat list */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-3">Conversations</h2>
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm">No conversations yet.</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`w-full text-left p-3 rounded-lg border text-sm ${selected?.id === s.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {s.contactInfo ? s.contactInfo.name : 'Website Visitor'}
                      </span>
                      {s.needsHuman && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          Needs you
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(s.createdAt).toLocaleString()} • {s.messages.length} messages
                    </div>
                    {s.contactInfo && (
                      <div className="text-gray-600 text-xs mt-1">📞 {s.contactInfo.phone}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat detail */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
            {!selected ? (
              <p className="text-gray-500 text-center py-12">Select a conversation to view</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{selected.contactInfo ? selected.contactInfo.name : 'Website Visitor'}</h3>
                    {selected.contactInfo && (
                      <p className="text-sm text-gray-600">📞 {selected.contactInfo.phone}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selected.needsHuman && (
                      <button
                        onClick={() => markResolved(selected.id)}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => deleteSession(selected.id)}
                      className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto bg-gray-50 rounded-lg p-4">
                  {selected.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-line ${msg.isBot ? 'bg-white border' : 'bg-pink-600 text-white'}`}>
                        {!msg.isBot && <div className="text-xs opacity-75 mb-1">Visitor</div>}
                        {msg.isBot && <div className="text-xs text-gray-500 mb-1">Bot</div>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
