import { create } from 'zustand';

const useChatbotStore = create((set) => ({
    isOpen: false,
    messages: [],
    openChatbot: () => set({ isOpen: true }),
    closeChatbot: () => set({ isOpen: false }),
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message]
        })),
    clearMessages: () => set({ messages: [] })
}));

export default useChatbotStore;