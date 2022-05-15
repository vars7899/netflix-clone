import { useState, createContext, useContext, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from '../firebase/firebase'

// interface AuthProviderProps {
//   children: React.ReactNode
// }

interface IAuth {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

// authentication context
const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false,
})

export const AuthProvider: React.FC = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
          setLoading(false)
        } else {
          setUser(null)
          setLoading(true)
          router.push('/login')
        }
        setInitialLoading(false)
      }),
    [auth]
  )

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setUser(userCredentials.user)
        router.push('/')
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        toast.error(
          `Something went wrong !!!! ${
            process.env.NODE_ENV === 'development' && err
          }`
        )
      })
      .finally(() => {
        setLoading(false)
        toast.success(`Signed in successfully`)
      })
  }
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setUser(userCredentials.user)
        router.push('/')
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        toast.error(
          `Something went wrong ${
            process.env.NODE_ENV === 'development' && err
          }`
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const logout = async () => {
    setLoading(true)
    await signOut(auth)
      .then(() => {
        setUser(null)
      })
      .catch((err) => {
        setError(err)
        toast.error(
          `Something went wrong ${
            process.env.NODE_ENV === 'development' && err
          }`
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      logout,
      error,
    }),
    [user, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
