import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signInWithPopup } from 'firebase/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../hooks/useAuth'

interface Inputs {
  email: string
  password: string
}

const Login = () => {
  const [login, setLogin] = useState<Boolean>(false)
  const { signIn, signUp } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (login) {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Login | Netflix Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        alt="Netflix Logo"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
      />
      <img
        src="https://rb.gy/ulxxee"
        alt="netflix"
        width={150}
        height={150}
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Email"
              className="input-cn"
            />
            {errors.email && (
              <p className="text=[13px] p-1 font-normal text-[red] ">
                please enter a valid email
              </p>
            )}
          </label>
          <label className="inline-block w-full">
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Password"
              className="input-cn"
            />
            {errors.password && (
              <p className="text=[13px] p-1 font-normal text-[red] ">
                Your password must contain between 4 to 60 characters
              </p>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-[#e50914] py-3 font-semibold"
          onClick={() => setLogin(true)}
        >
          Sign in
        </button>
        <div className="text-[gray]">
          New to Netflix? 
          <button
            type="submit"
            className="text-white hover:underline"
            onClick={() => {
              setLogin(false)
            }}
          >
            Sign up now
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}
export default Login
