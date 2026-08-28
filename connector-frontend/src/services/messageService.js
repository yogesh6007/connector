import { INITIAL_CONVERSATIONS } from '../data/mockData';

export const messageService = {
  sendMessage(conversations, convId, text, currentUserId) {
    return conversations.map((conv) => {
      if (conv.id === convId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId: currentUserId,
          text,
          timestamp: new Date().toISOString()
        };
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: new Date().toISOString(),
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });
  },

  startConversation(conversations, targetUser, initialMessage, currentUserId) {
    // Check if conversation already exists with this participant
    const existing = conversations.find((c) => c.participant?.id === targetUser.id);
    if (existing) {
      if (initialMessage) {
        return this.sendMessage(conversations, existing.id, initialMessage, currentUserId);
      }
      return conversations;
    }

    const newConv = {
      id: `conv-${Date.now()}`,
      participant: {
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role || 'student',
        title: targetUser.headline || targetUser.industry || '',
        avatar: targetUser.avatar || targetUser.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        online: true
      },
      lastMessage: initialMessage || 'Started a new conversation',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: initialMessage
        ? [
            {
              id: `msg-${Date.now()}`,
              senderId: currentUserId,
              text: initialMessage,
              timestamp: new Date().toISOString()
            }
          ]
        : []
    };

    return [newConv, ...conversations];
  }
};
