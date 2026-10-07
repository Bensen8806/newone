"use client"
import React, { useState } from 'react';
import Link from 'next/link';

export default function ConfessionsPage() {
  const [newSecret, setNewSecret] = useState('');
  const [secrets, setSecrets] = useState([
    { id: 1, text: "To the person who always leaves their umbrella in the library... thank you. It saved me from the rain yesterday.", time: "Just now" },
    { id: 2, text: "I pretend to study in the cafeteria but I'm really just people-watching.", time: "2 hours ago" }
  ]);

  const handleSubmit = () => {
    if (!newSecret.trim()) return;

    // Simple mock filter for inappropriate words
    const badWords = ['badword1', 'badword2', 'hate', 'spam'];
    const lowerSecret = newSecret.toLowerCase();
    
    const containsBadWord = badWords.some(word => lowerSecret.includes(word));
    
    if (containsBadWord) {
      alert("Your message contained inappropriate content and was filtered.");
      return;
    }

    // Real-time optimistic update
    setSecrets([{ id: Date.now(), text: newSecret, time: "Just now" }, ...secrets]);
    setNewSecret('');
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      {/* Header */}
      <header className="w-full p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/">
          <span className="text-white/50 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-widest uppercase">
            &larr; Back to Portal
          </span>
        </Link>
        <div className="text-xs font-bold text-[#ff2a00] uppercase tracking-widest border border-[#ff2a00]/30 px-3 py-1 rounded-full">
          Anonymous Mode
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 text-center">
          NSSCE SECRETS
        </h1>
        <p className="text-white/50 text-center text-sm tracking-widest uppercase mb-12">
          Share your secrets. We filter the noise.
        </p>

        {/* Confession Input Box */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 mb-12 shadow-2xl">
          <textarea 
            value={newSecret}
            onChange={(e) => setNewSecret(e.target.value)}
            className="w-full bg-transparent/50 border border-white/5 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none mb-4"
            rows={4}
            placeholder="I have a secret to share..."
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/40 italic max-w-xs">
              Messages are filtered through an automated profanity/abuse API before going live.
            </p>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition text-sm"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {secrets.map((secret) => (
            <div key={secret.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
              <p className="text-white/80 leading-relaxed">
                "{secret.text}"
              </p>
              <p className="text-xs text-white/30 mt-4 text-right">{secret.time}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
