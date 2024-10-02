/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

export default function Sprite(
    {
        position = {
            x: 0,
            y: 0
        },
        width = 64,
        height = 64,
        color = 'red',
        style = {
            position: 'absolute',
            zIndex: '1'
        },
        sides = {
            bottom: position.y + 100,
            top: 100,
            left: 100,
            right: 100
        },
        velocity = {
            x: 0,
            y: 0
        },
        gravity = .03
    }
) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = 1024;
        canvas.height = 576;
        //let lastTime = 0;

        function animate() {
            window.requestAnimationFrame(animate)
            // let deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            // lastTime = currentTime;

            // Clear the canvas before redrawing
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the sprite (a 100x100 box)
            context.fillStyle = color;
            context.fillRect(position.x, position.y, width, height);

            update()
        }

        function update() {
            position.y += velocity.y;

            //Above bottom of canvas
            if (sides.bottom + velocity.y < canvas.height) {
                velocity.y += gravity;
                sides.bottom = position.y + height
            } else {
                velocity.y = 0
            }
        }

        animate();


    }, [position, width, height, color, style, sides, velocity, gravity]); // Re-render when props change

    return (
        <div style={style}>
            <canvas ref={canvasRef} />
        </div>
    );
};
