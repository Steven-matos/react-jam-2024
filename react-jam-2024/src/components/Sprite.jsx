/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

export default function Sprite(
  {
    position = {
      x: 0,
      y: 0
    },
    imageSrc = '',
    style = {
      position: 'absolute',
      zIndex: '0'
    }
  }
) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    let loaded = false;

    image.onload = () => {
      loaded = true;
    }

    // Set canvas dimensions
    canvas.width = 1024;
    canvas.height = 576;

    function animate() {
      window.requestAnimationFrame(animate);

      // Clear the canvas before redrawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the sprite (a 100x100 box)
      //context.fillStyle = 'blue';
      //context.fillRect(position.x, position.y, 200, 200);

      image.src = imageSrc;
      
      if (loaded) {
        context.drawImage(image, position.x, position.y)
      } else {
        return
      }

    }

    animate();

  }, [position, imageSrc, style]);

  return (
    <div style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};
