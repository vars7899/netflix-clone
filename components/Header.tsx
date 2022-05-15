import { FC, useEffect, useState } from 'react'
import { BellIcon, SearchIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'

const Header: FC = () => {
  const [isScroll, setIsScroll] = useState<Boolean>(false)
  const { logout } = useAuth()
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScroll(() => true)
      } else {
        setIsScroll(() => false)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`${isScroll && 'bg-[#141414]'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <img
          src="https://rb.gy/ulxxee"
          alt="netflix clone"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
        />
        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          <li className="headerLink">TV Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">New & Popular</li>
          <li className="headerLink">My List</li>
        </ul>
      </div>
      <div className="text-small flex items-center space-x-4 text-sm font-light">
        <SearchIcon className="hidden h-6 w-6 sm:inline " />
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="h6 w-6" />
        {/* <Link href="/account"> */}
        <img
          src="https://rb.gy/g1pwyx"
          alt="profileAvatar"
          className="cursor-pointer rounded"
          onClick={() => logout()}
        />
        {/* </Link> */}
      </div>
    </header>
  )
}

export default Header
