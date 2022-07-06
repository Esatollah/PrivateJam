import React from 'react'
import { useParams } from 'react-router-dom'

const Room = () => {
    const { rid } = useParams();


  return (
    <div>Room</div>
  )
}

export default Room