import Head from 'next/head'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import Moment from 'react-moment'
import Membership from '../components/Membership'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import payments from '../lib/stripe'
import { GetStaticProps } from 'next'

interface Props {
  products: Product[] | []
}

const Account = ({ products = [] }: Props) => {
  const { user, logout } = useAuth()
  const subscription = useSubscription(user)
  console.log(
    products.filter((product) => product.id === subscription?.product)[0]?.name
  )
  return (
    <div>
      <Head>
        <title>Account Setting | Netflix Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-[#141414]">
        <Link href={'/'}>
          <img
            src="https://rb.gy/ulxxee"
            alt="netflix clone"
            width={100}
            height={100}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Link href={'/account'}>
          <img
            src="https://rb.gy/g1pwyx"
            alt="profileAvatar"
            className="cursor-pointer rounded"
          />
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since 
              <Moment format="YYYY-MM-DD HH:mm">{subscription?.created}</Moment>
            </p>
          </div>
        </div>
        <Membership />
        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4>Plan Details</h4>
          <div className="col-span-2 font-medium">
            {
              products.filter(
                (product) => product.id === subscription?.product
              )[0]?.name
            }
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change Plan
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4>Settings</h4>
          <div className="col-span-2"></div>
          <p
            className="cursor-pointer text-blue-500 hover:underline md:text-right"
            onClick={logout}
          >
            Sing out of all device
          </p>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message))

  return {
    props: {
      products,
    },
  }
}

export default Account
