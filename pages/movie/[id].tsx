import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { movieState, trailerState } from '../../atoms/modalAtom'
import ReactPlayer from 'react-player'
import { BsArrowLeft } from 'react-icons/bs'
import { IoPause, IoPlay } from 'react-icons/io5'

const Movie = () => {
  const router = useRouter()
  const [movie, setMovie] = useRecoilState(movieState)
  const [trailer, setTrailer] = useRecoilState(trailerState)
  const [muted, setMuted] = useState<boolean>(false)
  const [play, setPlay] = useState<boolean>(true)
  useEffect(() => {
    if (!movie && !trailer) router.push('/')
  }, [])

  return (
    <div className="relative">
      <div className="!z-index-20 absolute top-10 left-7 ">
        <BsArrowLeft
          className=" h-6 w-6 cursor-pointer  font-bold text-white"
          onClick={() => {
            router.push('/')
          }}
        />
      </div>
      <div className="z-index-1">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${trailer}`}
          width="100vw"
          height="100vh"
          playing={play}
          muted={muted}
          loop={true}
          controls={true}
        />
      </div>
    </div>
  )
}

export default Movie
