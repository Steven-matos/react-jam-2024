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
        gravity = .03,
        preventInput = false,
        direction = 'right',
        jumps = 0,
        jumpCount = 1
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

        const keys = {
            w: {
                pressed: false
            },
            a: {
                pressed: false
            },
            d: {
                pressed: false
            },

        }

        function handleInput() {
            window.addEventListener('keydown', (event) => {
                if (preventInput) {
                    return
                }
                switch (event.key) {
                    case 'w':
                        if (jumps < jumpCount) {
                            velocity.y = -3.5;
                            jumps++;
                        }
                        break
                    case 'a':
                        keys.a.pressed = true;
                        break
                    case 'd':
                        keys.d.pressed = true;
                        break
                    // case 'f':
                    //     for (let i = 0; i < doors.length; i++) {
                    //         const door = doors[i];

                    //         if (player.hitbox.position.x + player.hitbox.width <= door.position.x + door.width &&
                    //             player.hitbox.position.x >= door.position.x &&
                    //             player.hitbox.position.y + player.hitbox.height >= door.position.y &&
                    //             player.hitbox.position.y <= door.position.y + door.height &&
                    //             !door.locked
                    //         ) {
                    //             player.velocity.x = 0;
                    //             player.velocity.y = 0;
                    //             player.preventInput = true;
                    //             player.switchSprite('enterDoor');
                    //             door.play();
                    //             return
                    //         }
                    //     }
                    //     break
                }
            })

            window.addEventListener('keyup', (event) => {
                switch (event.key) {
                    case 'a':
                        keys.a.pressed = false;
                        break
                    case 'd':
                        keys.d.pressed = false;
                        break
                }
            })

            if (keys.d.pressed && keys.a.pressed) {
                velocity.x = 0;
                // if (direction === 'right') {
                //     switchSprite('idleRight');
                // } else {
                //     switchSprite('idleLeft');
                // } 
            } else if (keys.a.pressed) {
                //switchSprite('runLeft');
                velocity.x = -2.5;
                //direction = 'left';
            } else if (keys.d.pressed) {
                //switchSprite('runRight');
                velocity.x = 2.5;
                //direction = 'right';
            }
            //else if (direction === 'right' && velocity.x == 0) {
            //switchSprite('idleRight');
            //} else {
            //switchSprite('idleLeft');
            //}
        }

        function animate() {
            window.requestAnimationFrame(animate)
            // let deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            // lastTime = currentTime;
            velocity.x = 0;

            // Clear the canvas before redrawing
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the sprite (a 100x100 box)
            context.fillStyle = color;
            context.fillRect(position.x, position.y, width, height);

            handleInput(keys);
            update()
        }

        function update() {
            position.x += velocity.x;
            position.y += velocity.y;
            sides.bottom = position.y + height;

            //Above bottom of canvas
            if (sides.bottom + velocity.y < canvas.height) {
                velocity.y += gravity;
            } else {
                velocity.y = 0;
                jumps = 0;
            }
        }

        animate();


    }, [position, width, height, color, style, sides, velocity, gravity, preventInput, direction, jumps, jumpCount]); // Re-render when props change

    return (
        <div style={style}>
            <canvas ref={canvasRef} />
        </div>
    );
};
