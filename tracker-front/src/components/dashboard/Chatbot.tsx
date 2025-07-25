
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import './Chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente financiero. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);


  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Llama al endpoint de IA
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/summary/monthly-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_message: userMessage.text })
        });
        const json = await res.json();
        const botResponse: Message = {
          id: messages.length + 2,
          text: json.success ? json.message : 'Hubo un error al obtener la respuesta de la IA.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } catch (err) {
        const botResponse: Message = {
          id: messages.length + 2,
          text: 'Error de conexión con el asistente IA.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`chatbot-button ${isOpen ? 'hidden' : 'visible'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="chatbot-button-icon" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <Bot className="chatbot-avatar-icon" />
                </div>
                <div>
                  <h3 className="chatbot-title">Asistente Noox</h3>
                  <p className="chatbot-status">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="chatbot-close-button">
                <X />
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chatbot-message-row ${message.sender === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`}
                >
                  <div className="chatbot-message-bubble">
                    <div className={`chatbot-avatar-small ${message.sender}`}>
                      {message.sender === 'user' ? <User /> : <Bot />}
                    </div>
                    <div className={`chatbot-text-bubble ${message.sender}`}>
                      <p>{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregúntame sobre tus finanzas..."
              />
              <button onClick={handleSend}>
                <Send />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
