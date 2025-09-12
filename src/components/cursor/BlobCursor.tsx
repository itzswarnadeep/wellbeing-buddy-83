import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const BlobCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'music' | 'game' | 'relaxation'>('default');
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function') {
        const isClickable = target.closest('a, button, [role="button"], input, textarea, select');
        setIsPointer(!!isClickable);
        
        // Detect cursor context for different themes
        if (target.closest('[data-cursor="music"]')) {
          setCursorType('music');
        } else if (target.closest('[data-cursor="game"]')) {
          setCursorType('game');
        } else if (target.closest('[data-cursor="relaxation"]')) {
          setCursorType('relaxation');
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsPointer(false);
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    const handleInteractiveEnter = () => setIsPointer(true);
    const handleInteractiveLeave = () => setIsPointer(false);
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleInteractiveEnter);
      el.addEventListener('mouseleave', handleInteractiveLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractiveEnter);
        el.removeEventListener('mouseleave', handleInteractiveLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  const getCursorGradient = () => {
    switch (cursorType) {
      case 'music': return 'bg-gradient-to-r from-accent to-success';
      case 'game': return 'bg-gradient-to-r from-warning to-primary';
      case 'relaxation': return 'bg-gradient-to-r from-success to-accent';
      default: return 'bg-gradient-to-r from-primary to-accent';
    }
  };

  return (
    <motion.div
      ref={cursorRef}
      className="blob-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isPointer ? 1.8 : 1.2,
        opacity: isPointer ? 0.9 : 0.7,
      }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 200,
      }}
    >
      <motion.div 
        className={`w-12 h-12 rounded-full ${getCursorGradient()} opacity-70`}
        animate={{
          rotate: cursorType !== 'default' ? 360 : 0,
        }}
        transition={{
          duration: cursorType !== 'default' ? 2 : 0,
          repeat: cursorType !== 'default' ? Infinity : 0,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};