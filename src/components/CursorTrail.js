import React, {useEffect, useState} from 'react';
import './CursorTrail.css';

const CursorTrail = () => {
  const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({x: e.clientX, y: e.clientY});
      createTrail(e.clientX, e.clientY);
    };

    const createTrail = (x, y) => {
      const trail = document.createElement('div');
      trail.className = 'paint-trail';

      const size = Math.random() * 20 + 20;
      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.style.transform = 'translate(-50%, -50%)';

      const hue = Math.random() * 360;
      trail.style.backgroundColor = `hsla(${hue}, 70%, 50%, 0.1)`;

      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
      <div
          className="paint-cursor"
          style={{left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px`}}
      ></div>
  );
};

export default CursorTrail;