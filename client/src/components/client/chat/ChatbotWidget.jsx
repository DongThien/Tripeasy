import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, SendHorizontal, MapPin, Navigation } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import chatService from '../../../services/chatService';
import settingService from '../../../services/settingService';
import toast from 'react-hot-toast';
import ConfirmModal from '../../common/ConfirmModal';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";

const getWelcomeMessage = (siteName = 'Tripeasy') => ({
    role: 'model',
    text: `Xin chào! Mình là **${siteName} Bot** 🤖, trợ lý ảo thông minh của ${siteName}.\n\nMình có thể giúp gì cho bạn hôm nay?\n- Tư vấn các tour du lịch hot nhất\n- Gợi ý điểm đến du lịch theo yêu cầu\n- Hướng dẫn đặt tour và thanh toán nhanh chóng`,
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
});

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [sysSettings, setSysSettings] = useState(null);
    const [messages, setMessages] = useState(() => {
        // Load chat history from legacy localStorage if exists, otherwise load welcome message
        const saved = localStorage.getItem('tripeasy_chat_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        }
        return [getWelcomeMessage()];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedQr, setSelectedQr] = useState(null);
    const messagesEndRef = useRef(null);

    // Custom Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const location = useLocation();
    const [lastToken, setLastToken] = useState(() => localStorage.getItem('token'));

    // Listen to token changes from local storage or navigation transitions
    useEffect(() => {
        const currentToken = localStorage.getItem('token');
        if (currentToken !== lastToken) {
            setLastToken(currentToken);
        }
    }, [location, lastToken, isOpen]);

    // Handle storage event changes (e.g. from other tabs)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                setLastToken(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Fetch system settings on mount
    useEffect(() => {
        const fetchSysSettings = async () => {
            try {
                const res = await settingService.getSettings();
                if (res && res.success) {
                    setSysSettings(res.data);

                    // If messages only has the initial fallback welcome message, update it with correct siteName
                    const siteName = res.data.general?.siteName || 'Tripeasy';
                    setMessages(prev => {
                        if (prev.length === 1 && prev[0].role === 'model' && prev[0].text.includes('Tripeasy Bot')) {
                            return [getWelcomeMessage(siteName)];
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error('Error fetching settings for chatbot:', err);
            }
        };
        fetchSysSettings();
    }, []);

    // Initialize/sync session and fetch message history whenever the authentication token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        let sId = localStorage.getItem('tripeasy_chat_session');

        const isLoggingOut = !token && lastToken;

        if (isLoggingOut) {
            // Generate a fresh session ID for guest
            sId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            localStorage.setItem('tripeasy_chat_session', sId);
            localStorage.removeItem('tripeasy_chat_history');
            setSessionId(sId);
            setMessages([getWelcomeMessage(sysSettings?.general?.siteName || 'Tripeasy')]);
            return;
        }

        // On mount, or login/user change
        if (!sId) {
            sId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            localStorage.setItem('tripeasy_chat_session', sId);
        }
        setSessionId(sId);

        const fetchHistory = async () => {
            try {
                const res = await chatService.getChatHistory(sId);
                if (res.success) {
                    if (res.sessionId && res.sessionId !== sId) {
                        localStorage.setItem('tripeasy_chat_session', res.sessionId);
                        setSessionId(res.sessionId);
                    }
                    if (res.messages && res.messages.length > 0) {
                        setMessages(res.messages);
                    } else {
                        // Reset to welcome message if no history on backend
                        setMessages([getWelcomeMessage(sysSettings?.general?.siteName || 'Tripeasy')]);
                    }
                }
            } catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };

        fetchHistory();
    }, [lastToken]);

    // Save messages to localStorage whenever list changes
    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem('tripeasy_chat_history', JSON.stringify(messages));
        } else {
            localStorage.removeItem('tripeasy_chat_history');
        }
        scrollToBottom();
    }, [messages]);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Open widget and scroll to bottom
    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(scrollToBottom, 100);
        }
    };

    // Send Message Helper (handles sending text to AI)
    const sendMessageText = async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = text.trim();
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        // Add user message to state
        setMessages(prev => [
            ...prev,
            { role: 'user', text: userMessage, time: timeStr }
        ]);
        setIsLoading(true);

        try {
            // Call backend Gemini API with message and sessionId
            const response = await chatService.sendChatMessage(userMessage, sessionId);

            if (response.success) {
                if (response.sessionId && response.sessionId !== sessionId) {
                    localStorage.setItem('tripeasy_chat_session', response.sessionId);
                    setSessionId(response.sessionId);
                }
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'model',
                        text: response.reply,
                        metadata: response.metadata,
                        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
            } else {
                toast.error(response.message || 'Không nhận được phản hồi từ AI');
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [
                ...prev,
                {
                    role: 'model',
                    text: '⚠️ *Tripeasy Bot đang gặp sự cố kết nối. Xin lỗi bạn vì sự bất tiện này. Vui lòng thử lại sau giây lát.*',
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

// Send Message Handler
    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        await sendMessageText(userMessage);
    };

    // Reset Chat History Handler
    const handleClearChat = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa lịch sử trò chuyện',
            message: 'Bạn có muốn xóa toàn bộ lịch sử trò chuyện này không? Hành động này sẽ không thể khôi phục.',
            onConfirm: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                executeClearChat();
            }
        });
    };

    const executeClearChat = async () => {
        try {
            if (sessionId) {
                await chatService.clearChatHistory(sessionId);
            }
            const siteName = sysSettings?.general?.siteName || 'Tripeasy';
            const clearedMsg = [
                {
                    role: 'model',
                    text: `Lịch sử trò chuyện đã được làm sạch. Mình là **${siteName} Bot** 🤖, rất vui được tiếp tục hỗ trợ bạn!`,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
            ];
            setMessages(clearedMsg);
            localStorage.removeItem('tripeasy_chat_history');
            toast.success('Lịch sử trò chuyện đã được làm sạch!');
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi xóa lịch sử trò chuyện');
        }
    };

    // Safe JSX-based simple markdown formatter (bold **text** and bullet points - item)
    const formatMessageText = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        return lines.map((line, index) => {
            let formattedLine = line;

            // Check list item
            const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            if (isListItem) {
                formattedLine = line.trim().replace(/^[-*]\s+/, '');
            }

            // Parse bold **bold**
            const boldRegex = /\*\*(.*?)\*\*/g;
            const parts = [];
            let lastIndex = 0;
            let match;

            while ((match = boldRegex.exec(formattedLine)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(formattedLine.substring(lastIndex, match.index));
                }
                parts.push(<strong key={match.index} className="font-bold text-[#8B1A1A]">{match[1]}</strong>);
                lastIndex = boldRegex.lastIndex;
            }

            if (lastIndex < formattedLine.length) {
                parts.push(formattedLine.substring(lastIndex));
            }

            // Parse italic *italic*
            const formattedParts = [];
            parts.forEach((part, partIdx) => {
                if (typeof part === 'string') {
                    const italicRegex = /\*(.*?)\*/g;
                    let innerLastIdx = 0;
                    let innerMatch;
                    while ((innerMatch = italicRegex.exec(part)) !== null) {
                        if (innerMatch.index > innerLastIdx) {
                            formattedParts.push(part.substring(innerLastIdx, innerMatch.index));
                        }
                        formattedParts.push(<em key={`it-${innerMatch.index}`} className="italic text-gray-500">{innerMatch[1]}</em>);
                        innerLastIdx = italicRegex.lastIndex;
                    }
                    if (innerLastIdx < part.length) {
                        formattedParts.push(part.substring(innerLastIdx));
                    }
                } else {
                    formattedParts.push(part);
                }
            });

            if (isListItem) {
                return (
                    <li key={index} className="ml-4 list-disc mt-1 text-sm leading-relaxed text-gray-700">
                        {formattedParts}
                    </li>
                );
            }

            return (
                <p key={index} className="mt-1 text-sm leading-relaxed text-gray-700 min-h-[1rem]">
                    {formattedParts}
                </p>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Floating Chat Button */}
            <button
                onClick={handleToggle}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group
                    ${isOpen ? 'bg-gray-800 hover:bg-gray-900' : 'bg-[#8B1A1A] hover:bg-[#A32222] animate-bounce-slow'}`}
                title={isOpen ? 'Đóng cửa sổ chat' : 'Trò chuyện với Tripeasy Bot'}
            >
                {isOpen ? (
                    <X className="w-6 h-6 transition duration-300" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition duration-300" />
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Box Panel */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[550px] max-h-[calc(100vh-120px)] max-w-[calc(100vw-2rem)] flex flex-col bg-white/95 backdrop-blur-md border border-gray-150 shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#8B1A1A] to-[#A32222] text-white px-5 py-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                                    Tripeasy Bot
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                                </div>
                                <div className="text-[10px] text-white/80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                                    Hỗ trợ trực tuyến 24/7
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearChat}
                                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs"
                                title="Xóa lịch sử chat"
                            >
                                Dọn dẹp
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF9F6] scrollbar-thin">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                            >
                                <div className="max-w-[85%] flex flex-col">
                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm text-sm border
                                            ${msg.role === 'user'
                                                ? 'bg-[#8B1A1A] text-white rounded-br-none border-[#8B1A1A] shadow-red-950/5'
                                                : 'bg-white text-gray-800 rounded-bl-none border-gray-100'}`}
                                    >
                                        {msg.role === 'user' ? (
                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {formatMessageText(msg.text)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Rich Interactive Tour Recommendation Cards */}
                                    {msg.role === 'model' && msg.metadata && msg.metadata.tours && msg.metadata.tours.length > 0 && (
                                        <div className="mt-2.5 space-y-2">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 px-1">
                                                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                Gợi ý tour phù hợp:
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {msg.metadata.tours.map((t) => {
                                                    const tourLink = `/client/tours/${t.tour_id}`;
                                                    const hasOldPrice = t.old_price && t.old_price > t.price_adult;
                                                    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(t.price_adult);
                                                    const formattedOldPrice = hasOldPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(t.old_price) : null;
                                                    const imgUrl = t.image_url || FALLBACK_IMG;

                                                    return (
                                                        <Link
                                                            key={t.tour_id}
                                                            to={tourLink}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-150 shadow-sm hover:border-[#8B1A1A] hover:shadow-md transition-all duration-300 group"
                                                        >
                                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={t.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-355"
                                                                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#8B1A1A] transition-colors leading-tight">
                                                                    {t.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400">
                                                                    <span>📍 {t.destination}</span>
                                                                    <span>•</span>
                                                                    <span>⏱️ {t.duration}</span>
                                                                </div>
                                                                <div className="flex items-baseline gap-1.5 mt-1.5">
                                                                    <span className="text-xs font-extrabold text-[#8B1A1A]">{formattedPrice}</span>
                                                                    {formattedOldPrice && (
                                                                        <span className="text-[9px] text-gray-400 line-through">{formattedOldPrice}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rich Interactive Booking Payment Card */}
                                    {msg.role === 'model' && msg.metadata && msg.metadata.booking && (
                                        <div className="mt-2.5 bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm space-y-3 animate-in fade-in duration-300">
                                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                <span className="text-[10px] font-bold text-gray-800 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                                                    ĐƠN ĐẶT TOUR #{msg.metadata.booking.booking_id}
                                                </span>
                                                <span className="text-[9px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold">
                                                    Chờ thanh toán
                                                </span>
                                            </div>

                                            <div className="text-[11px] text-gray-600 space-y-1">
                                                <p><strong className="text-gray-800">Tour:</strong> {msg.metadata.booking.tour_title}</p>
                                                <p><strong className="text-gray-800">Khách hàng:</strong> {msg.metadata.booking.user_fullname}</p>
                                                <p><strong className="text-gray-800">Ngày đi:</strong> {new Date(msg.metadata.booking.start_date).toLocaleDateString('vi-VN')}</p>
                                                <p><strong className="text-gray-800">Tổng tiền:</strong> <span className="text-xs font-extrabold text-[#8B1A1A]">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(msg.metadata.booking.total_price)}</span></p>
                                            </div>

                                            {msg.metadata.booking.payment_method === 'BANK_TRANSFER' ? (() => {
                                                const bankCode = sysSettings?.payment?.bankCode || 'mb';
                                                const accountNumber = sysSettings?.payment?.accountNumber || '0869688128';
                                                const accountName = sysSettings?.payment?.accountName || 'NGUYEN DONG THIEN';
                                                const qrTemplate = sysSettings?.payment?.qrTemplate || 'TRIPEASY BK {booking_id}';

                                                const addInfoText = qrTemplate.replace('{booking_id}', msg.metadata.booking.booking_id);
                                                const encodedAddInfo = encodeURIComponent(addInfoText);
                                                const encodedAccountName = encodeURIComponent(accountName);
                                                const qrUrl = `https://img.vietqr.io/image/${bankCode.toLowerCase()}-${accountNumber}-compact2.png?amount=${msg.metadata.booking.total_price}&addInfo=${encodedAddInfo}&accountName=${encodedAccountName}`;

                                                return (
                                                    <div className="border-t border-gray-100 pt-2.5 space-y-2 text-center">
                                                        <p className="text-[9px] text-gray-400 font-medium">Nhấp vào QR Code để phóng to:</p>
                                                        <div
                                                            className="relative w-28 h-28 mx-auto border border-gray-100 rounded-xl p-1 bg-white shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer group"
                                                            onClick={() => setSelectedQr(qrUrl)}
                                                        >
                                                            <img
                                                                src={qrUrl}
                                                                alt="Mã VietQR"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center text-white text-[9px] font-bold">
                                                                🔍 Phóng to
                                                            </div>
                                                        </div>
                                                        <div className="text-[9px] text-gray-500 leading-relaxed text-left bg-gray-50/50 p-2 rounded-xl border border-gray-100 space-y-0.5">
                                                            <p className="font-bold text-gray-600">Thông tin tài khoản:</p>
                                                            <p>• {bankCode.toUpperCase()}: <span className="font-semibold text-gray-800">{accountNumber}</span></p>
                                                            <p>• Chủ TK: <span className="font-semibold text-gray-800">{accountName}</span></p>
                                                            <p>• Nội dung: <span className="font-bold text-[#8B1A1A]">{addInfoText}</span></p>
                                                        </div>
                                                    </div>
                                                );
                                            })() : (() => {
                                                const siteName = sysSettings?.general?.siteName || 'Tripeasy';
                                                const address = sysSettings?.general?.address || 'Số 3 Cầu Giấy, Hà Nội';
                                                return (
                                                    <div className="border-t border-gray-100 pt-2.5 text-[9px] text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                                                        <p className="font-bold text-gray-600">📍 Hướng dẫn thanh toán:</p>
                                                        <p className="mt-1 leading-normal">Vui lòng thanh toán trực tiếp tại văn phòng {siteName} ({address}) trong 24 giờ để xác nhận vé.</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Google Maps Directions Card */}
                                    {msg.role === 'model' && msg.metadata && msg.metadata.map && (
                                        <div className="mt-2.5 bg-white p-3 rounded-2xl border border-gray-150 shadow-sm space-y-2.5 overflow-hidden animate-in fade-in duration-300">
                                            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-800">
                                                    Bản đồ văn phòng Tripeasy
                                                </span>
                                            </div>
                                            <div className="h-28 w-full rounded-xl overflow-hidden border border-gray-100">
                                                <iframe
                                                    title="Bản đồ văn phòng"
                                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(msg.metadata.map.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                                    className="w-full h-full border-0 grayscale-[10%]"
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="text-[9px] text-gray-500 space-y-1">
                                                <p><strong className="text-gray-800">Địa chỉ:</strong> {msg.metadata.map.address}</p>
                                                <a
                                                    href={msg.metadata.map.directions_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[#8B1A1A] hover:underline font-bold"
                                                >
                                                    <Navigation className="w-2.5 h-2.5" /> Chỉ đường đi trên Google Maps
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* PDF Itinerary Download Button */}
                                    {msg.role === 'model' && msg.metadata && msg.metadata.pdf && (
                                        <div className="mt-2.5 animate-in fade-in duration-300">
                                            <a
                                                href={`${import.meta.env.VITE_BASE_URL || "https://tripeasy-backend-u9xd.onrender.com"}${msg.metadata.pdf.download_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#A32222] text-white py-2 px-3 rounded-2xl text-[11px] font-bold shadow-md hover:scale-103 transition-all duration-200 cursor-pointer"
                                            >
                                                📥 Tải PDF Lịch trình Tour
                                            </a>
                                        </div>
                                    )}

                                    <span
                                        className={`text-[9px] text-gray-400 mt-1 px-1
                                            ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                                    >
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing / Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-200">
                                <div className="flex items-start gap-2 max-w-[80%]">
                                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center justify-center gap-1 h-9">
                                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggestion Bubbles */}
                        {messages.length <= 1 && sysSettings?.chatbot?.quickQuestions && sysSettings.chatbot.quickQuestions.length > 0 && !isLoading && (
                            <div className="flex flex-col gap-2 mt-4 px-1 pb-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    Gợi ý nhanh cho bạn:
                                </p>
                                <div className="flex flex-col gap-2">
                                    {sysSettings.chatbot.quickQuestions.map((q, idx) => (
                                        q.trim() && (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => sendMessageText(q.trim())}
                                                className="text-xs bg-white text-gray-700 hover:text-[#8B1A1A] hover:bg-red-50/50 border border-gray-150 hover:border-[#8B1A1A]/30 px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-left shadow-sm hover:shadow-md cursor-pointer active:scale-98 flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full flex-shrink-0"></span>
                                                <span>{q.trim()}</span>
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input Form */}
                    <form
                        onSubmit={handleSend}
                        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi của bạn tại đây..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-gray-50/50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 transition disabled:opacity-75"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className="p-2.5 bg-[#8B1A1A] hover:bg-[#A32222] text-white rounded-xl transition duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center shadow-md shadow-red-950/10"
                            title="Gửi tin nhắn"
                        >
                            <SendHorizontal className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* QR Code Zoom Lightbox Overlay */}
            {selectedQr && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedQr(null)}
                >
                    <div
                        className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setSelectedQr(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                            title="Đóng"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5 self-start">
                            <span className="w-2 h-2 bg-[#8B1A1A] rounded-full"></span>
                            Quét mã thanh toán VietQR
                        </h3>

                        <div className="w-64 h-64 border border-gray-100 rounded-2xl p-2 bg-white shadow-sm flex items-center justify-center">
                            <img
                                src={selectedQr}
                                alt="Mã VietQR Phóng To"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                            Mở ứng dụng Ngân hàng / Ví điện tử bất kỳ của bạn để quét mã QR chuyển khoản tự động và hoàn tất giao dịch nhanh chóng.
                        </p>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                type="danger"
            />
        </div>
    );
};

export default ChatbotWidget;
