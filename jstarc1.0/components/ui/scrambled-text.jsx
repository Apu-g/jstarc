"use client";
import { useEffect, useRef } from "react";

const chars = ".:";

const ScrambledText = ({ text, className, radius = 50, as: Component = "div" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const originalChars = text.split("");
    container.innerHTML = "";
    
    // Create spans for each character
    const spans = originalChars.map((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.dataset.original = char;
      span.style.display = "inline-block";
      span.style.minWidth = char === " " ? "0.3em" : "auto"; // Preserve space width
      // Preserve gradient text effect by inheriting color
      span.className = "transition-all duration-75"; 
      container.appendChild(span);
      return span;
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - centerX, clientY - centerY);

        if (distance < radius) {
          // Scramble logic
          // Change character randomly
          if (span.dataset.original !== " ") { // Don't scramble spaces
              span.textContent = chars[Math.floor(Math.random() * chars.length)];
          }
        } else {
          // Restore
          if (span.textContent !== span.dataset.original) {
            span.textContent = span.dataset.original;
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [text, radius]);

  return <Component ref={containerRef} className={className} aria-label={text} />;
};

export default ScrambledText;
