import React from 'react'
import './Connecting.scss'
import { Spinner } from '@pexip/components'

export const Connecting = () => {
  return (
    <div className="Connecting">
      <span className="ConnectingText">Connecting...</span>
      <Spinner colorScheme="dark" />
    </div>
  )
}
