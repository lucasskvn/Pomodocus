import EggShop from '../components/EggShop'
import UpgradeShop from '../components/UpgradeShop'

export default function ShopView() {
  return (
    <div className="flex flex-col py-8 px-6 max-w-lg mx-auto w-full gap-8">
      <EggShop />
      <div className="h-px bg-white/10" />
      <UpgradeShop />
    </div>
  )
}
