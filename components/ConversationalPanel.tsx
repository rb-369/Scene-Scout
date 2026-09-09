'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ArrowUpDown, 
  Filter, 
  Moon, 
  DollarSign, 
  Bot, 
  User, 
  Loader2 
} from 'lucide-react';
import { FollowUpMessage, LocationCandidate } from '@/lib/types';

interface ConversationalPanelProps {
  messages: FollowUpMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onApplyPreset: (promptText: string) => void;
}

export const ConversationalPanel: React.FC<ConversationalPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onApplyPreset
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const msg = inputPrompt.trim() || "Which location on this shortlist has the best logistical access and lowest production risk?";
    setInputPrompt('');
    await onSendMessage(msg);
  };

  const presetChips = [
    { label: "Remove locations with uncertain access", icon: Filter },
    { label: "Re-rank by lowest production risk", icon: ArrowUpDown },
    { label: "Which location is best for night shoot?", icon: Moon },
    { label: "Find cheaper alternatives with standard tariffs", icon: DollarSign },
  ];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, rgba(14, 18, 28, 0.95) 0%, rgba(18, 24, 38, 0.9) 100%)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={16} color="#ffffff" />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              Ask SceneScout — Conversational Refinement
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Reason over current candidates, filter by constraints, or command the agent to re-rank.
            </span>
          </div>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8' }}>
            <Loader2 size={14} className="animate-spin-slow" />
            <span>Re-evaluating shortlist...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {presetChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => onApplyPreset(chip.label)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '5px 12px',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <Icon size={12} color="#38bdf8" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conversation Thread */}
      {messages.length > 0 && (
        <div 
          ref={messagesContainerRef}
          style={{
            maxHeight: '280px',
            overflowY: 'auto',
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(6, 182, 212, 0.08)',
                border: msg.sender === 'user' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(6, 182, 212, 0.2)'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.1)' : '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} color="#07090e" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: msg.sender === 'user' ? '#e2e8f0' : '#38bdf8' }}>
                      {msg.sender === 'user' ? 'Producer (You)' : 'SceneScout Agent'}
                    </span>
                    {msg.sender === 'agent' && (
                      <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                        Gemini Reasoning
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{msg.timestamp}</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {msg.text}
                </p>

                {msg.actionTaken && (
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      ✓ {msg.actionTaken}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="e.g. Remove locations with uncertain access and re-rank by lowest production risk..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(10, 14, 22, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '0.88rem',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
        />

        <button
          type="submit"
          id="ask-agent-submit-btn"
          disabled={isLoading}
          className="btn-cinema btn-cyan"
          style={{ padding: '0 18px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          title="Submit question or request to SceneScout Agent"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin-slow" />
          ) : (
            <>
              <span>Ask Agent</span>
              <Send size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
