import { useState } from 'react'
import EggShop from '../components/EggShop'
import UpgradeShop from '../components/UpgradeShop'
import CosmeticsShop from '../components/CosmeticsShop'

type ShopTab = 'items' | 'cosmetics'

export default function ShopView() {
  const [tab, setTab] = useState<ShopTab>('items')

  return (
    <div className="flex flex-col py-8 px-6 max-w-lg mx-auto w-full gap-8">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setTab('items')}
          className={`px-4 py-2 font-fredoka font-semibold transition-colors ${
            tab === 'items'
              ? 'text-accent-green border-b-2 border-accent-green -mb-1'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          🥚 Œufs & Upgrades
        </button>
        <button
          onClick={() => setTab('cosmetics')}
          className={`px-4 py-2 font-fredoka font-semibold transition-colors ${
            tab === 'cosmetics'
              ? 'text-accent-green border-b-2 border-accent-green -mb-1'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          ✨ Cosmétiques
        </button>
      </div>

      {/* Content */}
      {tab === 'items' && (
        <>
          <EggShop />
          <div className="h-px bg-white/10" />
          <UpgradeShop />
        </>
      )}
      {tab === 'cosmetics' && <CosmeticsShop />}
    </div>
  )
}
