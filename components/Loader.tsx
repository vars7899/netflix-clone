import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className="m-auto flex h-7 items-center justify-center  dark:text-transparent">
      <ThreeDots color="white" width={60} />
    </div>
  )
}

export default Loader
