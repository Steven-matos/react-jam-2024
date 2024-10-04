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
    },
    frameRate = 1,
    animations,
    frameBuffer = 2,
    loop = true,
    autoplay = true,
    locked = false
  }
) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    let loaded = false;
    let width;
    let height;
    let elapsedFrames = 0;
    let currentFrame = 0;
    let currentAnimation;

    if (animations) {
      for (let key in animations) {
        const image = new Image();
        image.src = animations[key].imageSrc
        animations[key].image = image;
      }
    } else {
      image.src = imageSrc;
    }

    image.onload = () => {
      loaded = true;
      width = image.width / frameRate;
      height = image.height;
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

      draw();
    }

    function draw() {
      const cropBox = {
        position: {
          x: width * currentFrame,
          y: 0,
        },
        width: width,
        height: height
      }

      if (animations && loaded) {
        context.drawImage(
          image,
          cropBox.position.x,
          cropBox.position.y,
          cropBox.width,
          cropBox.height,
          position.x,
          position.y,
          width,
          height
        )
      } else if (loaded) {
        context.drawImage(image, position.x, position.y)
      }


      updateFrames();
    }

    function updateFrames() {
      if (!autoplay) {
        return
      }
      elapsedFrames++;
      if (elapsedFrames % frameBuffer === 0) {
        if (currentFrame < frameRate - 1) {
          currentFrame++;
        } else if (loop) {
          currentFrame = 0;
        }
      }
      if (currentAnimation?.onComplete) {
        if (currentFrame === frameRate - 1 && !currentAnimation.isActive) {
          currentAnimation.onComplete();
          currentAnimation.isActive = true;
        }

      }

    }

    animate();

  }, [position, imageSrc, style, frameRate, animations, frameBuffer, loop, autoplay, locked]);

  return (
    <div style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};
