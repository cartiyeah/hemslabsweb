"use client";

import { useState, useEffect, memo } from "react";

interface ChatWindowProps {
    isOpen: boolean;
}

const placeholderPrompts = [
    "What is HEMS?",
    "What is Bubbles?",
    "What can Bubbles do?",
    "Building our infrastructure...",
    "Ask me about our products!",
];

const ChatWindow = memo(function ChatWindow({ isOpen }: ChatWindowProps) {
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
        { text: "🫧 Hey! I'm Bubbles. I'm here to help you navigate HEMS Labs and show you what we're building!", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState("");

    // Cyclic placeholder logic
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
        setInputValue("");

        // Mock response with personality
        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "Ooh, good one! HEMS is all about building the future of student life. And I'm Bubbles, your guide to everything cool happening here! 🫧✨",
                sender: 'ai'
            }]);
        }, 1500);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '80px',
                right: '24px',
                width: '320px',
                height: '450px',
                zIndex: 95,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                // Bouncy warp transition - snappy 0.4s
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                // Aligning origin precisely with the bubble icon center (approx 30px from right edge, 26px above top edge)
                transformOrigin: 'calc(100% - 30px) -26px',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'scale(1)' : 'scale(0)',
                pointerEvents: isOpen ? 'auto' : 'none',
            }}
        >
            {/* Header / Identity */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                <div style={{
                    fontFamily: 'var(--font-rowdies), sans-serif',
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                }}>
                    🫧 Hey, I&apos;m Bubbles
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                scrollbarWidth: 'none'
            }}>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: m.sender === 'user' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                            padding: '10px 15px',
                            borderRadius: m.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                            maxWidth: '85%',
                            fontSize: '13px',
                            fontFamily: 'var(--font-bree-serif), serif',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            animation: 'message-fade-in 0.3s ease-out forwards',
                        }}
                    >
                        {m.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    gap: '10px'
                }}
            >
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder=""
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            color: 'white',
                            fontSize: '13px',
                            outline: 'none',
                        }}
                    />
                    {!inputValue && (
                        <div style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontFamily: 'var(--font-bree-serif), serif',
                            height: '20px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                transform: `translateY(-${currentPlaceholderIndex * 20}px)`,
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}>
                                {placeholderPrompts.map((p, i) => (
                                    <div key={i} style={{ height: '20px', lineHeight: '20px' }}>{p}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '12px',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    →
                </button>
            </form>

            <style jsx>{`
                @keyframes message-fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
});

export default ChatWindow;
