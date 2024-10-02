//import { useEffect } from 'react';
import { useEffect } from 'react';
import Canvas from './components/Canvas.jsx'
import Sprite from './components/Sprite';

function App() {

  useEffect(() => {
    
  })

  return (
    <div>
      <Canvas style={{ position: 'absolute', zIndex: '-1' }} />
      <Sprite position={{x:150, y:150}} style={{ position: 'absolute', zIndex: '1' }} />
    </div>
  )
}

export default App
