import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, VolumeX, Loader, Send } from 'lucide-react';
import Orb from '../ui/Orb';
import { useSpeech } from '../../hooks/useSpeech';
import { generateChatResponse, ChatMessage } from '../../lib/gemini';
import { cn } from '../../lib/utils';

interface VoiceOrbProps {
  onClose: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ onClose }) => {
  const {
    isListening,
    transcript,
    finalTranscript,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    permissionStatus
  } = useSpeech();
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
      { role: 'model', content: "Hi! I'm Kael, your AI study buddy. How can I help you learn today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user' as const, content: messageText };
    setMessages(prev => [...prev, userMessage]);
    
    const chatHistory: ChatMessage[] = [...messages, userMessage].map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    setIsAiThinking(true);
    try {
      const response = await generateChatResponse(chatHistory);
      const aiMessage = { role: 'model' as const, content: response };
      setMessages(prev => [...prev, aiMessage]);
      if (!isMuted) {
        speak({ text: response });
      }
    } catch (error) {
        console.error("Error from AI:", error);
        const errorMessage = { role: 'model' as const, content: "Sorry, I'm having a little trouble thinking right now. Please try again in a moment." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiThinking(false);
    }
  };
  
  useEffect(() => {
    if (finalTranscript) {
      handleSendMessage(finalTranscript);
    }
  }, [finalTranscript]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
    setInputText('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl m-4 relative flex flex-col h-[80vh] max-h-[700px]"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-neutral-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Kael AI Assistant</h2>
                <div className="flex items-center gap-4">
                     <button onClick={() => setIsMuted(!isMuted)} className="text-neutral-400 hover:text-white transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 self-start"></div>}
                        <div className={cn("max-w-md p-3 rounded-xl", msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200')}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isListening && (
                    <div className="flex justify-end">
                         <div className="max-w-md p-3 rounded-xl bg-blue-600 text-white/70 italic">
                            <p>{transcript || "Listening..."}</p>
                        </div>
                    </div>
                )}
                 {isAiThinking && (
                    <div className="flex justify-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0"></div>
                         <div className="max-w-md p-3 rounded-xl bg-neutral-800 text-neutral-200 flex items-center">
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse mr-2 [animation-delay:0s]"></div>
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse mr-2 [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 p-4 border-t border-neutral-800">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <Orb forceHoverState={isListening || isSpeaking || isAiThinking} />
                </div>
                {permissionStatus === 'denied' && <p className="text-red-400 text-sm text-center mb-2">Microphone access denied. Please enable it in browser settings.</p>}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleMicClick}
                        disabled={permissionStatus !== 'granted' || isAiThinking}
                        className={cn("w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        isListening ? "bg-red-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <form onSubmit={handleTextSubmit} className="flex-grow flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message or tap the mic..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isListening || isAiThinking}
                             onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTextSubmit(e);
                                }
                             }}
                        />
                        <button
                            type="submit"
                            className="w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed"
                            disabled={!inputText.trim() || isAiThinking}
                            aria-label="Send message"
                        >
                            {isAiThinking && !isListening ? (
                                <Loader size={20} className="animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceOrb;