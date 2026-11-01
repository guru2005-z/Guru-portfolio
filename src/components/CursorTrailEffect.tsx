import React, { useEffect, useRef } from 'react';
import { soundManager } from '../utils/soundManager';

export const CursorTrailEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBoxRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    // Apply custom cursor class to document element
    document.documentElement.classList.add('custom-cursor-enabled');

    let mouseX = -100;
    let mouseY = -100;
    let lastTrailX = -999;
    let lastTrailY = -999;
    let activeTrailCount = 0;
    const MAX_TRAIL_ITEMS = 10;
    let isHovering = false;
    let isOverInput = false;

    const cursor = cursorRef.current;
    const cursorBox = cursorBoxRef.current;
    const cursorDot = cursorDotRef.current;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursor) {
        cursor.style.display = 'block';
        cursor.style.transform = `translate3d(${mouseX - 9}px, ${mouseY - 9}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const isInput = Boolean(target?.closest('input, textarea, [contenteditable="true"]'));
      const isClickable = Boolean(
        target?.closest('a, button, [role=button], [role=tab], select, .clickable, .interactive-click')
      );

      // Over text input
      if (isInput !== isOverInput) {
        isOverInput = isInput;
        if (cursor) {
          cursor.style.opacity = isInput ? '0.2' : '1';
        }
      }

      // Interactive hover state
      if (isClickable !== isHovering) {
        isHovering = isClickable;
        if (cursorBox && cursorDot) {
          if (isClickable) {
            cursorBox.style.width = '24px';
            cursorBox.style.height = '24px';
            cursorBox.style.borderColor = '#f59e0b';
            cursorBox.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
            cursorBox.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
            cursorDot.style.width = '7px';
            cursorDot.style.height = '7px';
            cursorDot.style.backgroundColor = '#f59e0b';
            if (cursor) {
              cursor.style.transform = `translate3d(${mouseX - 12}px, ${mouseY - 12}px, 0)`;
            }
          } else {
            cursorBox.style.width = '18px';
            cursorBox.style.height = '18px';
            cursorBox.style.borderColor = '#161514';
            cursorBox.style.backgroundColor = '#ffffff';
            cursorBox.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
            cursorDot.style.width = '6px';
            cursorDot.style.height = '6px';
            cursorDot.style.backgroundColor = '#161514';
            if (cursor) {
              cursor.style.transform = `translate3d(${mouseX - 9}px, ${mouseY - 9}px, 0)`;
            }
          }
        }
      }

      // Discrete 8px-grid trail matching mohammad-rizwan.tech
      if (
        Math.hypot(mouseX - lastTrailX, mouseY - lastTrailY) >= 28 &&
        activeTrailCount < MAX_TRAIL_ITEMS
      ) {
        lastTrailX = mouseX;
        lastTrailY = mouseY;

        const trail = document.createElement('i');
        trail.className = 'trail' + (isClickable ? ' on' : '');

        const gridX = 8 * Math.round(mouseX / 8) - 3;
        const gridY = 8 * Math.round(mouseY / 8) - 3;

        document.body.appendChild(trail);
        activeTrailCount++;

        trail
          .animate(
            [
              { transform: `translate3d(${gridX}px, ${gridY}px, 0)`, opacity: 0.65 },
              { transform: `translate3d(${gridX}px, ${gridY}px, 0) scale(0.35)`, opacity: 0 }
            ],
            {
              duration: 500,
              easing: 'cubic-bezier(.23, 1, .32, 1)',
              fill: 'forwards'
            }
          )
          .finished.catch(() => {})
          .finally(() => {
            trail.remove();
            activeTrailCount = Math.max(0, activeTrailCount - 1);
          });
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, [role=button], [role=tab], select, input, textarea')
      );

      // Contract cursor on click
      if (cursorBox) {
        cursorBox.style.transform = 'scale(0.82)';
      }

      soundManager.play('click');

      // Click ripple matching screenshot square theme
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple' + (isInteractive ? ' on' : '');
      const initSize = 16;
      ripple.style.width = `${initSize}px`;
      ripple.style.height = `${initSize}px`;
      document.body.appendChild(ripple);

      ripple
        .animate(
          [
            {
              transform: `translate3d(${clientX - initSize / 2}px, ${clientY - initSize / 2}px, 0) scale(0.7)`,
              opacity: 0.9
            },
            {
              transform: `translate3d(${clientX - 24}px, ${clientY - 24}px, 0) scale(1.6)`,
              opacity: 0
            }
          ],
          {
            duration: 380,
            easing: 'cubic-bezier(.16, 1, .3, 1)',
            fill: 'forwards'
          }
        )
        .finished.finally(() => ripple.remove());

      // 4 diagonal spark squares
      const offsets = [
        [-16, -16],
        [16, -16],
        [-16, 16],
        [16, 16]
      ];

      offsets.forEach(([dx, dy]) => {
        const spark = document.createElement('span');
        spark.className = 'click-spark' + (isInteractive ? ' on' : '');
        document.body.appendChild(spark);

        spark
          .animate(
            [
              {
                transform: `translate3d(${clientX - 2}px, ${clientY - 2}px, 0) scale(1)`,
                opacity: 0.85
              },
              {
                transform: `translate3d(${clientX - 2 + dx}px, ${clientY - 2 + dy}px, 0) scale(0.2)`,
                opacity: 0
              }
            ],
            {
              duration: 340,
              easing: 'cubic-bezier(.16, 1, .3, 1)',
              fill: 'forwards'
            }
          )
          .finished.finally(() => spark.remove());
      });
    };

    const handlePointerUp = () => {
      if (cursorBox) {
        cursorBox.style.transform = 'scale(1)';
      }
    };

    const handleMouseLeave = () => {
      if (cursor) cursor.style.display = 'none';
    };

    const handleMouseEnter = () => {
      if (cursor) cursor.style.display = 'block';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[999999] will-change-transform hidden sm:block"
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      {/* Precision square reticle matching mohammad-rizwan.tech [ ▪ ] */}
      <div
        ref={cursorBoxRef}
        className="relative flex items-center justify-center border-[1.5px] border-[#161514] bg-white rounded-[1px] shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-[width,height,border-color,background-color,box-shadow,transform] duration-150 ease-out"
        style={{ width: '18px', height: '18px' }}
      >
        {/* Center black square dot */}
        <span
          ref={cursorDotRef}
          className="bg-[#161514] rounded-[0.5px] transition-all duration-150"
          style={{ width: '6px', height: '6px' }}
        />
      </div>
    </div>
  );
};
