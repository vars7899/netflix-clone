import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { Product } from '@stripe/firestore-stripe-payments'

interface Props {
  products: Product[]
  selectedPlan: Product | null
}

const Table = ({ products, selectedPlan }: Props) => {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly price</td>
          {products.map((item) => (
            <td
              key={item.id}
              className={`tableDataFeature ${
                selectedPlan?.id === item.id ? 'text-[#e50914]' : 'text-[gray]'
              }`}
            >
              CAD{item.prices[0].unit_amount! / 100}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Video Quality</td>
          {products.map((item) => (
            <td
              key={item.id}
              className={`tableDataFeature ${
                selectedPlan?.id === item.id ? 'text-[#e50914]' : 'text-[gray]'
              }`}
            >
              {item.metadata.videoQuality}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>
          {products.map((item) => (
            <td
              key={item.id}
              className={`tableDataFeature ${
                selectedPlan?.id === item.id ? 'text-[#e50914]' : 'text-[gray]'
              }`}
            >
              {item.metadata.resolution}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">
            Watch on your TV, computer, mobile phone and tablet
          </td>
          {products.map((item) => (
            <td
              key={item.id}
              className={`tableDataFeature ${
                selectedPlan?.id === item.id ? 'text-[#e50914]' : 'text-[gray]'
              }`}
            >
              {item.metadata.portability ? (
                <CheckIcon className="inline-block h-8 w-8" />
              ) : (
                <XIcon className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
