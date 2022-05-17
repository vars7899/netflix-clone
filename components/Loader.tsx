import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const Loader = ({ color = 'white' }: { color: string }) => {
  return (
    <div className="m-auto flex h-7 items-center justify-center  dark:text-transparent">
      <ThreeDots color={color} width={60} />
    </div>
  )
}

export default Loader
