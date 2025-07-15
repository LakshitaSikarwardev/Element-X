import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const AnimatedCounter = ({ number, duration = 1 }) => {
  const digitsRef = useRef([]);

  useEffect(() => {
    const digits = number.toString().split(""); 

    digits.forEach((digit, index) => {
      gsap.fromTo(
        digitsRef.current[index], 
        { y: index % 2 === 0 ? 50 : -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: duration, delay: index * 0.3, ease: "power2.out" } 
      );
    });
  }, [number, duration]);

  return (
    <div style={{fontWeight: "bold", textAlign: "center", display: "flex", gap: "5px" }}>
      {number.toString().split("").map((digit, index) => (
        <span key={index} ref={(el) => (digitsRef.current[index] = el)}>
          {digit}
        </span>
      ))}
    </div>
  );
};

export default AnimatedCounter;
