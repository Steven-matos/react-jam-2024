import { useEffect } from 'react';
import Canvas from './components/Canvas.jsx'
import Player from './components/Player.jsx';
import Sprite from './components/Sprite.jsx';
import level1 from './assets/level/Starter_Level.png'

function App() {

  useEffect(() => {

  })

  return (
    <div>
      {/* <div style={{ position: 'absolute', zIndex: '1' }}>
        <canvas ref={canvasRef} />
      </div> */}
      <Canvas style={{ position: 'absolute', zIndex: '-1' }} />
      <Sprite imageSrc={level1} position={{ x: 0, y: 0 }} style={{ position: 'absolute', zIndex: '1' }} />
      <Player position={{ x: 100, y: 50 }} style={{ position: 'absolute', zIndex: '2' }} />
    </div>
  )
}

export default App
