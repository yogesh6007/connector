import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  CheckCheck,
  User,
  Plus
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function Messages() {
  const { currentUser } = useAuth();
  const { conversations, sendMessage, students } = useApp();

  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessageText, setNewMessageText] = useState('');

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      c.participant?.name?.toLowerCase().includes(term) ||
      c.lastMessage?.toLowerCase().includes(term)
    );
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, newMessageText.trim());
    setNewMessageText('');
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages & Communications</h1>
        <p className="text-xs text-slate-500">
          Direct messaging with project leaders, teammates, organizations, and mentors
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs h-[72vh] flex overflow-hidden">
        {/* Left: Conversation List */}
        <div className="w-full sm:w-80 border-r border-slate-200 flex flex-col justify-between shrink-0">
          <div>
            {/* Search Bar */}
            <div className="p-3.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="overflow-y-auto max-h-[58vh] divide-y divide-slate-100">
              {filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer ${
                      isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Avatar
                      src={conv.participant?.avatar}
                      name={conv.participant?.name}
                      size="md"
                      online={conv.participant?.online}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{conv.participant?.name}</h4>
                        <span className="text-[10px] text-slate-400">{formatDate(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-[11px] text-slate-400 font-semibold">End-to-End Chat Connected</span>
          </div>
        </div>

        {/* Right: Active Chat View */}
        {activeConversation ? (
          <div className="hidden sm:flex flex-1 flex-col justify-between bg-slate-50/50">
            {/* Thread Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeConversation.participant?.avatar}
                  name={activeConversation.participant?.name}
                  size="md"
                  online={activeConversation.participant?.online}
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeConversation.participant?.name}</h3>
                  <p className="text-[11px] text-slate-500">
                    {activeConversation.participant?.title || activeConversation.participant?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Online
                </span>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {(activeConversation.messages || []).map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[10px] text-right mt-1 ${
                          isMe ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={`Message ${activeConversation.participant?.name}...`}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <Button
                type="submit"
                variant="gradient"
                size="md"
                disabled={!newMessageText.trim()}
                icon={Send}
              >
                Send
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={MessageSquare}
              title="No Conversation Selected"
              description="Pick a conversation thread from the left or message a project leader from the projects page."
            />
          </div>
        )}
      </div>
    </div>
  );
}
