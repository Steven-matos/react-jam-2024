//import { useEffect } from 'react';
import Canvas from './components/Canvas.jsx'
import Player from './components/Player.jsx';
import Sprite from './components/Sprite.jsx';
import level1 from './assets/background/backgroundLevel1.png';
import collisionsLevel1 from './data/collisions.js'
import playerSprite from './assets/Kings and Pigs/Sprites/01-King Human/idleRight.png'
import playerAnimations from './data/playerAnimations.jsx'
import collisionsLevel1 from './data/collisions.js';
import Trap from './components/Trap.jsx';
//import level2 from './assets/level/Starter_Level.png';

function App() {
  let parsedCollisions1 = [];
  let collisionBlocksData;

  parsedCollisions1 = parse2d(collisionsLevel1);

  collisionBlocksData = createObjectsFrom2D(parsedCollisions1);

  function parse2d(array) {
    const rows = [];
    for (let i = 0; i < array.length; i += 16) {
      rows.push(array.slice(i, i + 16))
    }
    return rows;
  }

  function createObjectsFrom2D(parsedArray) {
    const objects = [];
    parsedArray.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 292) {
          //push a new collision into collisionblocks array
          objects.push({
            position: {
              x: x * 64,
              y: y * 64
            },
            width: 64,
            height: 64
          })
        }
      })
    });

    return objects;
  }

  return (
    <div>
      {/* <div style={{ position: 'absolute', zIndex: '1' }}>
        <canvas ref={canvasRef} />
      </div> */}
      <Canvas style={{ position: 'absolute', zIndex: '-1' }} />
      <Sprite loop={false} autoplay={false} imageSrc={level1} position={{ x: 0, y: 0 }} style={{ position: 'absolute', zIndex: '1' }} />
      <Player 
      animations={playerAnimations} 
      imageSrc={playerSprite}
      frameRate={11}
      collisionBlocks={collisionBlocksData} 
      position={{ x: 200, y: 300 }} 
      style={{ position: 'absolute', zIndex: '2' }} 
      />
      <Trap position={{ x: 525, y: 360 }} style={{ position: 'absolute', zIndex: '2' }} />
    </div>
  )
}

export default App
