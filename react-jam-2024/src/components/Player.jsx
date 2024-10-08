/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";

export default function Player(
  {
    position = {
      x: 0,
      y: 0
    },
    width = 32,
    height = 32,
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
    jumpCount = 2,
    collisionBlocks = [],
    frameRate = 1,
    animations,
    frameBuffer = 20,
    loop = true,
    autoplay = true,
    imageSrc,
    image = new Image()
  }
) {
  const canvasRef = useRef(null);
  let loaded = false;
  let elapsedFrames = 0;
  let currentFrame = 0;
  let currentAnimation;

  image.src = imageSrc;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 1024;
    canvas.height = 576;

    if (animations) {
      console.log(animations)
      for (let key in animations) {
        const image = new Image();
        image.src = animations[key].imageSrc
        animations[key].image = image;
      }
    }

    image.onload = () => {
      loaded = true;
      width = image.width / frameRate;
      height = image.height;
      console.log({ loaded: loaded, width: image.width / 11, height: image.width })
    }

    //Hitbox Dimensions
    let hitbox = {
      position: {
        x: position.x - 10,
        y: position.y
      },
      width: 32,
      height: 32
    }

    const keys = {
      w: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    };

    function handleInput() {
      window.addEventListener('keydown', (event) => {
        if (preventInput) {
          return
        }
        switch (event.key) {
          case 'w':
            if (jumps < jumpCount) {
              velocity.y = -2.25;
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
      });

      window.addEventListener("keyup", (event) => {
        switch (event.key) {
          case "a":
            keys.a.pressed = false;
            break;
          case "d":
            keys.d.pressed = false;
            break;
        }
      });

      if (keys.d.pressed && keys.a.pressed) {
        velocity.x = 0;
        if (direction === 'right') {
          switchSprite('idleRight');
        } else {
          image.src = animations.idleLeft.imageSrc
          switchSprite('idleLeft');
        }
      } else if (keys.a.pressed) {
        switchSprite('runLeft');
        velocity.x = -1.0;
        direction = 'left';
      } else if (keys.d.pressed) {
        switchSprite('runRight');
        velocity.x = 1.0;
        direction = 'right';
      } else if (direction === 'right' && velocity.x == 0) {
        switchSprite('idleRight');
      } else {
        switchSprite('idleLeft');
      }
    }

    function animate() {
      window.requestAnimationFrame(animate);
      velocity.x = 0;

      render();
      handleInput(keys);
      update();
    }

    function render() {
      // Clear the canvas before redrawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the sprite (a 100x100 box)
      // context.fillStyle = color;
      // context.fillRect(position.x, position.y, width, height);

      draw();
    }

    function switchSprite(name) {
      if (image === animations[name].image) {
        return
      }
      image = animations[name].image
      image.src = animations[name].imageSrc;
      currentFrame = 0;
      frameRate = animations[name].frameRate;
      frameBuffer = animations[name].frameBuffer;
      loop = animations[name].loop;
      currentAnimation = animations[name];
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

      collisionBlocks.forEach((block) => {
        context.fillStyle = 'rgba(255, 0, 0, 0.3)';
        context.fillRect(block.position.x, block.position.y, block.width, block.height);
      })

      if (loaded) {
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

    function checkForHorizontalCollisions() {
      for (let i = 0; i < collisionBlocks.length; i++) {
        const collisionBlock = collisionBlocks[i];

        //If a collision exists
        if (
          hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
          hitbox.position.x + hitbox.width >= collisionBlock.position.x &&
          hitbox.position.y + hitbox.height >= collisionBlock.position.y &&
          hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
        ) {
          //Collision on x axis going to the left
          if (velocity.x < 0) {
            const offset = hitbox.position.x - position.x;
            position.x =
              collisionBlock.position.x + collisionBlock.width - offset + 0.01;
            jumps--;
            break;
          }

          //Collision on x axis going to the right
          if (velocity.x > 0) {
            const offset = hitbox.position.x - position.x + hitbox.width;
            position.x = collisionBlock.position.x - offset - 0.01;
            jumps--;
            break;
          }
        }
      }
    }

    function applyGravity() {
      velocity.y += gravity;
      position.y += velocity.y;
    }

    function updateHitbox() {
      hitbox = {
        position: {
          x: position.x + 19,
          y: position.y + 17
        },
        width: 28,
        height: 28
      }
    }

    function checkforVerticalCollisions() {
      for (let i = 0; i < collisionBlocks.length; i++) {
        const collisionBlock = collisionBlocks[i];

        //If a collision exists
        if (
          hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
          hitbox.position.x + hitbox.width >= collisionBlock.position.x &&
          hitbox.position.y + hitbox.height >= collisionBlock.position.y &&
          hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
        ) {
          //Collision on y axis going up
          if (velocity.y < 0) {
            velocity.y = 0;
            const offset = hitbox.position.y - position.y;
            position.y =
              collisionBlock.position.y + collisionBlock.height - offset + 0.01;
            break;
          }

          //Collision on y axis going down
          if (velocity.y > 0) {
            velocity.y = 0;
            const offset = hitbox.position.y - position.y + hitbox.height;
            position.y = collisionBlock.position.y - offset - 0.01;
            jumps = 0;
            break
          }
        }
      }
    }

    function update() {
      position.x += velocity.x;

      updateHitbox();
      context.fillStyle = "rgba(0, 255, 0, .5)";
      context.fillRect(
        hitbox.position.x,
        hitbox.position.y,
        hitbox.width,
        hitbox.height
      );
      checkForHorizontalCollisions();
      applyGravity();
      updateHitbox();
      checkforVerticalCollisions();
    }

    animate();
  }, [
    position,
    width,
    height,
    color,
    style,
    sides,
    velocity,
    gravity,
    preventInput,
    direction,
    jumps,
    jumpCount,
    collisionBlocks,
    frameRate,
    animations,
    frameBuffer,
    loop,
    autoplay,
    imageSrc
  ]); // Re-render when props change

  return (
    <div style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
}
