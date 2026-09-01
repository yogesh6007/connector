import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  CheckCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Messages = () => {
  const { user } = useAuth();
  const { conversations, sendMessage } = useApp();

  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (!activeConvId && conversations.length > 0) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  const filteredConversations = conversations.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.participantName?.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q);
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden h-[calc(100vh-8.5rem)] flex flex-col md:flex-row">
      
      {/* Left Column: Conversation Sidebar (1/3 Width) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/50">
        
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Direct Messages</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100/80 border border-transparent focus:border-brand-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConvId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                    isActive ? 'bg-white shadow-sm border-l-4 border-brand-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    {/* No presence indicator */}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.participantName}</h4>
                      <span className="text-[10px] text-slate-400">{formatRelativeTime(conv.lastMessageTime)}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1">
                      {conv.participantRole}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* Right Column: Chat Window */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Active Chat Header */}
          <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeConversation.participantName}</h3>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  {activeConversation.participantRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-2 rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {(activeConversation.messages || []).length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-slate-400">
                Send a message to start this collaborative conversation.
              </div>
            ) : (
              (activeConversation.messages || []).map(msg => {
                const isMe = msg.senderId === user?.id || msg.senderId === 'stu-1' || msg.senderId === 'org-1';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-600 text-white rounded-br-xs font-medium'
                          : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{formatRelativeTime(msg.time)}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-600" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 focus-within:border-brand-500 focus-within:bg-white transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation.participantName}...`}
                className="flex-1 px-3 py-2 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!inputText.trim()}
                icon={Send}
              >
                Send
              </Button>
            </div>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Select a conversation from the left to start chatting.
        </div>
      )}

    </div>
  );
};
