import { useEffect, useCallback, useState } from 'react';
import Canvas from './components/Canvas.jsx'
import Player from './components/Player.jsx';
import Sprite from './components/Sprite.jsx';
import playerSprite from './assets/Kings and Pigs/Sprites/01-King Human/idleRight.png'
import playerAnimations from './data/playerAnimations.jsx'
import Trap from './components/Trap.jsx';
import level1 from './assets/level/Starter_Level.png';
import collisions from './data/collisions.js';
import levels from './data/levels.jsx';

function App() {
  const [currentLevel, setLevel] = useState(levels[1].src);
  const [parsedCollisions, setCollisions] = useState(parse2d(collisions.level1));
  const [collisionBlocksData, setCollisionData] = useState(createObjectsFrom2D(parsedCollisions));
  let levelKey = 1;

  const handleKey = useCallback((e) => {
    console.log(`user has pressed ${e.key}`);
    if (e.key == 'f') {
      console.log('Current Level: ' + levelKey);
      if (levelKey == Object.keys(levels).length) {
        levelKey = 1;
      } else {
        levelKey++;
      }
      console.log('Next Level: ' + levelKey);
      setLevel(levels[levelKey].src);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey])

  function switchLevel(level, collisions) {
    const collisionData = setCollisions(collisions);
    setCollisionData(collisionData);
    setLevel(level);
  }

  function parse2d(array) {
    const rows = [];
    for (let i = 0; i < array.length; i += 32) {
      rows.push(array.slice(i, i + 32))
    }
    return rows;
  }

  function createObjectsFrom2D(parsedArray) {
    const objects = [];
    parsedArray.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 292 || tile === 290) {
          //push a new collision into collisionblocks array
          objects.push({
            position: {
              x: x * 32,
              y: y * 32
            },
            width: 32,
            height: 32
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
      <Sprite loop={false} autoplay={false} imageSrc={currentLevel} position={{ x: 0, y: 0 }} style={{ position: 'absolute', zIndex: '1' }} />
      <Player
        animations={playerAnimations}
        imageSrc={playerSprite}
        frameRate={11}
        collisionBlocks={collisionBlocksData}
        position={{ x: 200, y: 400 }}
        style={{ position: 'absolute', zIndex: '2' }}
      />
      <Trap position={{ x: 525, y: 360 }} style={{ position: 'absolute', zIndex: '2' }} />
    </div>
  )
}

export default App
