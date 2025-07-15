import { useState, useEffect, useRef } from "react";

const useInViewport = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting), 
      { threshold: 0.5, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect(); 
  }, []);

  return [ref, isVisible];
};

export default useInViewport;
