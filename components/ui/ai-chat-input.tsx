"use client" 

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GlowEffect } from "./glow-effect";
 
const PLACEHOLDERS = [
  "Generate website with HextaUI",
  "Create a new project with Next.js",
  "What is the meaning of life?",
  "What is the best way to learn React?",
  "How to cook a delicious meal?",
  "Summarize this article",
];

interface AIChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onAttach?: () => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  attachedImages?: string[];
  onRemoveImage?: (index: number) => void;
  placeholder?: string[];
  className?: string;
}
 
const AIChatInput = ({ 
  value: externalValue, 
  onChange, 
  onSend,
  onAttach,
  onPaste,
  attachedImages = [],
  onRemoveImage,
  placeholder = PLACEHOLDERS,
  className = ""
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external value if provided
  const value = externalValue !== undefined ? externalValue : inputValue;
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInputValue(newValue);
    }
  };

  // Auto-focus input when images are attached
  useEffect(() => {
    if (attachedImages.length > 0 && inputRef.current) {
      inputRef.current.focus();
      setIsActive(true);
    }
  }, [attachedImages.length]);
 
  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || value) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholder.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
 
    return () => clearInterval(interval);
  }, [isActive, value, placeholder.length]);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!value) setIsActive(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);
 
  const handleActivate = () => setIsActive(true);

  const handleSend = () => {
    if (onSend && value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
 
  // Calculate height based on images
  const baseHeight = 68;
  const imageRowHeight = attachedImages.length > 0 ? 88 : 0; // 64px image + padding
  const totalHeight = baseHeight + imageRowHeight;

  const containerVariants = {
    collapsed: {
      height: totalHeight,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      height: totalHeight,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };
 
  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };
 
  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  };
 
  return (
    <div className={`w-full text-black ${className}`}>
      <div className="relative w-full">
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: isActive || value ? 0.35 : 0.2,
            scale: isActive || value ? 1.03 : 1.02,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <GlowEffect
            colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
            mode='rotate'
            blur='stronger'
            duration={8}
            className='rounded-[32px]'
          />
        </motion.div>
        <motion.div
          ref={wrapperRef}
          className="w-full relative"
          variants={containerVariants}
          animate={isActive || value ? "expanded" : "collapsed"}
          initial="collapsed"
          style={{ overflow: "hidden", borderRadius: 32, background: "#fff" }}
          onClick={handleActivate}
        >
          <div className="flex flex-col items-stretch w-full h-full">
          {/* Image Preview Row - Inside input container */}
          {attachedImages.length > 0 && (
            <div className="px-4 pt-3 pb-2">
              <div className="flex flex-wrap gap-2">
                {attachedImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img 
                      src={img} 
                      alt={`Attached ${idx + 1}`} 
                      className="h-16 w-16 object-cover rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage?.(idx);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Row */}
          <div className="flex items-center gap-2 p-3 rounded-full bg-white w-full">
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Attach file"
              type="button"
              tabIndex={-1}
              onClick={onAttach}
            >
              <Paperclip size={20} />
            </button>

            {/* Text Input & Placeholder */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={onPaste}
                className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !value && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {placeholder[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
 
            {/* Microphone - Hidden for now */}
            {/* <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Voice input"
              type="button"
              tabIndex={-1}
            >
              <Mic size={20} />
            </button> */}
            <button
              className="flex items-center gap-1 bg-black hover:bg-zinc-700 text-white p-3 rounded-full font-medium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send"
              type="button"
              tabIndex={-1}
              onClick={handleSend}
              disabled={!value.trim()}
            >
              <Send size={18} />
            </button>
          </div>
 
          {/* Expanded Controls - Hidden for now (Think and Deep Search) */}
          {/* TODO: Re-enable Think and Deep Search buttons when ready */}
          {/* <motion.div
            className="w-full flex justify-start px-4 items-center text-sm"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: "none" as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial="hidden"
            animate={isActive || value ? "visible" : "hidden"}
            style={{ marginTop: 8 }}
          >
            <div className="flex gap-3 items-center">
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all font-medium group ${
                  thinkActive
                    ? "bg-green-600/10 outline outline-green-600/60 text-green-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Think"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThinkActive((a) => !a);
                }}
              >
                <Lightbulb
                  className="group-hover:fill-yellow-300 transition-all"
                  size={18}
                />
                Think
              </button>
 
              <motion.button
                className={`flex items-center px-4 gap-1 py-2 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start  ${
                  deepSearchActive
                    ? "bg-green-600/10 outline outline-green-600/60 text-green-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Deep Search"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeepSearchActive((a) => !a);
                }}
                initial={false}
                animate={{
                  width: deepSearchActive ? 125 : 36,
                  paddingLeft: deepSearchActive ? 8 : 9,
                }}
              >
                <div className="flex-1">
                  <Globe size={18} />
                </div>
                <motion.span
                className="pb-[2px]"
                  initial={false}
                  animate={{
                    opacity: deepSearchActive ? 1 : 0,
                  }}
                >
                  Deep Search
                </motion.span>
              </motion.button>
            </div>
          </motion.div> */}
        </div>
      </motion.div>
      </div>
    </div>
  );
};
 
export { AIChatInput };
