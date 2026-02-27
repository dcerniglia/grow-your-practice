'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

type Props = {
  content: string;
  children?: ReactNode;
};

export function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition(rect.top < 100 ? 'bottom' : 'top');
    }
  }, [visible]);

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children ?? (
        <span className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-background-dark text-[10px] text-text-muted">
          i
        </span>
      )}
      {visible && (
        <span
          className={`absolute left-1/2 z-50 w-56 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-text shadow-lg ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
