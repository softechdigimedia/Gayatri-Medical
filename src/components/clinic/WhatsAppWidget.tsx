import React, { useState } from 'react';
import {  X, Send, Clock, Phone, Sparkles, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CLINIC_WHATSAPP_PHONE = '15626636564'; // +1 562-663-6564

export const getWhatsAppUrl = (text: string) => {
  return `https://wa.me/${CLINIC_WHATSAPP_PHONE}?text=${encodeURIComponent(text.trim())}`;
};

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickOptions = [
    { label: '📅 Book Appointment', prompt: 'Hello Gayetri Medical, I would like to schedule an appointment with a doctor.' },
    { label: '🩺 Doctor Consultation', prompt: 'Hello, I have a medical consultation question about clinical care.' },
    { label: '🛡️ Insurance & Fees', prompt: 'Hello, I want to inquire about health insurance coverage and treatment costs.' },
    { label: '🚨 Urgent Medical Care', prompt: 'URGENT: I need immediate guidance regarding a medical condition.' },
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || 'Hello Gayetri Medical, I would like to inquire about your healthcare services.';
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden text-neutral-900"
              role="dialog"
              aria-label="WhatsApp live chat support"
            >
              {/* Header */}
              <div className="bg-[#034e44] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold border-2 border-emerald-300">
                      GM
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#034e44] rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                      Gayetri Medical WhatsApp
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
                    </h3>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-normal">
                      <Clock className="w-3 h-3" />
                      Typically replies in ~2 mins
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close WhatsApp chat"
                  className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 bg-[#f8f9fa] space-y-3 max-h-[360px] overflow-y-auto">
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-neutral-100 text-xs sm:text-sm text-neutral-800 space-y-1">
                  <p className="font-semibold text-[#034e44]">
                    Hello! Welcome to Gayetri Medical.
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    How can our medical team assist you today? Select a topic below or type your custom message.
                  </p>
                  <div className="text-[10px] text-neutral-400 flex items-center justify-end gap-1 pt-1">
                    <span>Just now</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#034e44]" />
                  </div>
                </div>

                {/* Quick Topic Chips */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                    Quick Questions:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(opt.prompt)}
                        className="text-left text-xs bg-white hover:bg-emerald-50 hover:text-[#034e44] text-neutral-700 py-2 px-3 rounded-lg border border-neutral-200 hover:border-emerald-300 transition-all font-medium flex items-center justify-between group cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <Send className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#034e44] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type WhatsApp message..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 bg-neutral-100 focus:bg-white text-xs sm:text-sm text-neutral-900 rounded-xl px-3.5 py-2.5 border border-transparent focus:border-[#034e44] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  aria-label="Send WhatsApp message"
                  className="p-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] text-white rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Direct call banner */}
              <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3 h-3 text-[#034e44]" /> +1 562-663-6564
                </span>
                <span className="text-emerald-700 font-semibold">Available 24/7</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close WhatsApp support" : "Open WhatsApp support chat"}
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          <div className="relative">
  
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.101.005.237-.038.37.281.144.346.491 1.2.534 1.288.043.088.072.191.014.307-.058.116-.087.188-.173.289l-.26.302c-.087.087-.179.182-.077.357.101.174.45 7.42 1.056 1.282.781.696 1.439.91 1.641 1.012.202.101.32.087.439-.051.12-.138.513-.601.65-.809.137-.208.274-.173.462-.101.188.072 1.185.559 1.387.66.202.101.337.151.386.237.049.086.049.502-.095.907z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.177L2 22l4.982-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.684 0-3.25-.502-4.568-1.365l-.328-.215-3.045.854.814-2.973-.232-.345A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
          <span className="text-sm font-semibold tracking-tight hidden sm:inline">
            Chat on WhatsApp
          </span>
        </motion.button>
      </div>
    </>
  );
};
