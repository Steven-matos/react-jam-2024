/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";

export default function Trap({
  up = true,
  moveTimer = 0,
  moveDelay = 500,
  position = {
    x: 0,
    y: 0,
  },
  width = 32,
  height = 32,
  color = "red",
  style = {
    position: "absolute",
    zIndex: "1",
  },
  preventInput = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 1024;
    canvas.height = 576;


    function animate() {
      render();
      update();
      window.requestAnimationFrame(animate);
    }

    function render() {
      // Clear the canvas before redrawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the sprite (a 100x100 box)
      context.fillStyle = color;
      // context.fillRect(position.x, position.y, width, height);
      context.beginPath();
      context.moveTo(position.x, position.y);
      context.lineTo(position.x + 25, position.y + 25);
      context.lineTo(position.x - 25, position.y + 25);
      context.fill();
    }

    function updatePosition() {
      
      moveTimer += 1;
      if (moveTimer >= moveDelay) {
        console.log(up);
        
        moveTimer = 0;
        up ? position.y += 25 : position.y -= 25
        up = !up;
        moveDelay = (Math.random() * 10) * 100
        console.log(moveDelay);
        
      }

    }

    function update() {
      updatePosition()
    }

    animate();
  }, [position, width, height, color, style, preventInput]); // Re-render when props change

  return (
    <div style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
}
