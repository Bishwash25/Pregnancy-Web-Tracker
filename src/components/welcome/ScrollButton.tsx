import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ScrollButtonProps {
  isAtTop: boolean;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ isAtTop }) => {
  return (
    <button
      onClick={() => {
        if (isAtTop) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="fixed bottom-4 sm:bottom-6 md:bottom-10 left-4 sm:left-6 md:left-8 bg-white/20 hover:bg-black text-black p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 z-50"
      aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
    >
      {isAtTop ? <ArrowDown size={20} className="sm:w-6 sm:h-6" /> : <ArrowUp size={20} className="sm:w-6 sm:h-6" />}
    </button>
  );
};

export default ScrollButton;
