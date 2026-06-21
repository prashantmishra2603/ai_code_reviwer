import React, { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

const ChatPanel = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = React.useState('')
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    const msg = input.trim()
    if (msg && !isLoading) {
      onSendMessage(msg)
      setInput('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="card flex flex-col h-full min-h-[420px] max-h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/50 shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          🤖
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-sm">AI Assistant</p>
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="text-4xl">💬</div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
              Ask me anything about your code — bugs, performance, security, or improvements.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'ai' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                  }`}
                  style={msg.type === 'user' ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
                >
                  {msg.type === 'ai' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              🤖
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex gap-2 shrink-0">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about the code…"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600
                     bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                     placeholder-slate-400 text-sm outline-none transition-smooth
                     focus:border-indigo-500 dark:focus:border-indigo-400 disabled:opacity-50"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          id="chat-send-btn"
          className="p-2.5 rounded-xl text-white disabled:opacity-50 transition-smooth"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

export default ChatPanel
