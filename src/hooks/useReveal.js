import { useEffect } from 'react';

const useReveal = (deps = []) => {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [deps]); // Re-attach when products load or state changes
};

export default useReveal;
