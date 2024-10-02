/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

export default function Canvas(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1024;
    canvas.height = 576;

    // Drawing a simple rectangle
    context.fillStyle = 'green';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={props.style}>
      
      </canvas>

    </div>
  );
};
