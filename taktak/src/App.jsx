/* eslint-disable no-unused-vars */
import { useState } from 'react'
import TakTakGame from './Taktak'

function App() {
  const [count, setCount] = useState(0)

  return (
    <TakTakGame/>
  )
}

export default App
