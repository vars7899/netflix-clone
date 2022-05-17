import { useState } from 'react'
import { VolumeOffIcon, XIcon } from '@heroicons/react/solid'
import { Movie, Element, Genre } from '../typings'
import { Modal as MuiModal } from '@mui/material'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { modalState, movieState, trailerState } from '../atoms/modalAtom'
import { toast, ToastContainer } from 'react-toastify'
import ReactPlayer from 'react-player/lazy'
import { FaPlay } from 'react-icons/fa'
import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeUpIcon,
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import useAuth from '../hooks/useAuth'
import { db } from '../firebase/firebase'

const Modal = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [movie, setMovie] = useRecoilState(movieState)
  const [trailer, setTrailer] = useRecoilState(trailerState)
  const [genre, setGenre] = useState<Genre[]>([])
  const [muted, setMuted] = useState<boolean>(false)
  const [addedToList, setAddedToList] = useState<boolean>(false)
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([])

  function handleClose() {
    setShowModal(false)
    setTrailer('')
  }

  function handlePlay() {
    setShowModal(false)
    router.push(`/movie/${movie?.original_title}`)
    console.log(trailer, movie)
  }

  async function handleList() {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      )
      toast.success(
        `${movie?.title || movie?.original_name} has been removed from My List`
      )
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        { ...movie }
      )
      toast.success(
        `${movie?.title || movie?.original_name} has been added to My List`
      )
    }
  }

  useEffect(() => {
    if (!movie) return

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => {
          toast.error(`Unable to fetch Trailer ${err}`)
        })

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        )
        setTrailer(data.videos?.results[index]?.key)
      }

      if (data?.genres) {
        setGenre(data.genres)
      }
    }
    fetchMovie()
  }, [movie])

  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)
      )
    }
  }, [db, movie?.id])

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  )

  return (
    <>
      <ToastContainer />
      <MuiModal
        open={showModal}
        onClose={handleClose}
        className="!right-) fixed  !top-7 !left-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <>
          <button
            onClick={handleClose}
            className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          >
            <XIcon className="h-6 w-6" />
          </button>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={
                trailer
                  ? `https://www.youtube.com/watch?v=${trailer}`
                  : `https://www.youtube.com/watch?v=ubFq-wV3Eic`
              }
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: '0', left: '0' }}
              playing
              muted={muted}
            />
            <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
              <div className="flex space-x-2">
                <button
                  className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                  onClick={handlePlay}
                >
                  <FaPlay className="h-7 w-7 text-black" />
                  Play
                </button>
                <button className="modalButton" onClick={handleList}>
                  {!addedToList ? (
                    <PlusIcon className="h-7 w-7" />
                  ) : (
                    <CheckIcon className="h-7 w-7" />
                  )}
                </button>
                <button className="modalButton">
                  <ThumbUpIcon className="h-7 w-7" />
                </button>
              </div>
              <button
                className="modalButton"
                onClick={() => {
                  setMuted(!muted)
                }}
              >
                {muted ? (
                  <VolumeOffIcon className="h-7 w-7" />
                ) : (
                  <VolumeUpIcon className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
          <div className="spce-x-16 flex rounded-b-md bg-[#181818] px-10 py-8">
            <div className="space-y-6 text-lg">
              <div className="flex items-center space-x-2 text-sm">
                <p className="font-semibold text-green-400">
                  {movie?.vote_average * 10}% Match
                </p>
                <p className="font-light">
                  {movie?.release_date || movie?.first_air_date}
                </p>
                <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs ">
                  HD
                </div>
              </div>
              <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                <p className="w-5/6">{movie?.overview}</p>
                <div>
                  <div className="text-m">
                    <span className="text-[gray]">Genres: </span>
                    <span>{genre.map((item) => item.name).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[gray]">Language: </span>
                    {movie?.original_language}
                  </div>
                  <div>
                    <span className="text-[gray]">Total votes: </span>
                    {movie?.vote_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </MuiModal>
    </>
  )
}

export default Modal
