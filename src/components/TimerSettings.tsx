import { useRef, useState } from 'react'
import { useGameStore, type TimerPreset } from '../store/useGameStore'
import { workReward, breakReward } from '../utils/gameLogic'

export default function TimerSettings() {
  const workMinutes      = useGameStore((s) => s.workMinutes)
  const breakMinutes     = useGameStore((s) => s.breakMinutes)
  const pomodoroPhase    = useGameStore((s) => s.pomodoroPhase)
  const presets          = useGameStore((s) => s.presets)
  const timerBackground  = useGameStore((s) => s.timerBackground)
  const setWorkMinutes   = useGameStore((s) => s.setWorkMinutes)
  const setBreakMinutes  = useGameStore((s) => s.setBreakMinutes)
  const applyPreset      = useGameStore((s) => s.applyPreset)
  const saveCustomPreset = useGameStore((s) => s.saveCustomPreset)
  const deleteCustomPreset = useGameStore((s) => s.deleteCustomPreset)
  const setTimerBackground = useGameStore((s) => s.setTimerBackground)
  const setTimerBackgroundImage = useGameStore((s) => s.setTimerBackgroundImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isIdle = pomodoroPhase === 'idle'
  const [editingSlot, setEditingSlot] = useState<0 | 1 | 2 | null>(null)
  const [editingName, setEditingName] = useState('')

  const builtinPresets = presets.slice(0, 3)
  const customSlots    = presets.slice(3)

  const isActive = (p: TimerPreset) =>
    p.workMinutes === workMinutes && p.breakMinutes === breakMinutes

  const handleSave = (slot: 0 | 1 | 2) => {
    if (!editingName.trim()) return
    saveCustomPreset(slot, editingName, workMinutes, breakMinutes)
    setEditingSlot(null)
    setEditingName('')
  }

  const handleCancel = () => {
    setEditingSlot(null)
    setEditingName('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setTimerBackgroundImage(base64)
      setTimerBackground('custom')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-5 px-3 py-6 justify-center w-full">

      {/* Travail */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Travail
        </span>
        <span className="font-fredoka text-accent-green text-lg font-bold leading-none">
          {workMinutes} min
        </span>
        <input
          type="range" min={5} max={90} step={5}
          value={workMinutes} disabled={!isIdle}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          className="w-full accent-accent-green disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-accent-green">
          +{workReward(workMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      {/* Pause */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Pause
        </span>
        <span className="font-fredoka text-[#60a5fa] text-lg font-bold leading-none">
          {breakMinutes} min
        </span>
        <input
          type="range" min={1} max={30} step={1}
          value={breakMinutes} disabled={!isIdle}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-full accent-[#60a5fa] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="font-inter text-xs font-semibold text-[#60a5fa]">
          +{breakReward(breakMinutes)} pts
        </span>
      </div>

      <div className="h-px bg-white/10" />

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Presets
        </span>

        {/* Builtin */}
        <div className="flex flex-col gap-1">
          {builtinPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => isIdle && applyPreset(preset.id)}
              disabled={!isIdle}
              className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
                isActive(preset)
                  ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                  : isIdle
                  ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {preset.name}
              <span className="text-white/40 font-inter font-normal ml-1 text-[10px]">
                {preset.workMinutes}/{preset.breakMinutes}
              </span>
            </button>
          ))}
        </div>

        {/* Custom slots */}
        <div className="flex flex-col gap-1 mt-1">
          {customSlots.map((slot, i) => {
            const slotIndex = i as 0 | 1 | 2
            const isEmpty   = slot.name === ''
            const isEditing = editingSlot === slotIndex

            if (isEditing) {
              return (
                <div key={slot.id} className="flex flex-col gap-1">
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(slotIndex)
                      if (e.key === 'Escape') handleCancel()
                    }}
                    maxLength={16}
                    placeholder="Nom..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 font-fredoka text-xs text-white outline-none focus:border-accent-green"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSave(slotIndex)}
                      disabled={!editingName.trim()}
                      className="flex-1 py-1 rounded-lg font-fredoka text-xs font-semibold bg-accent-green/20 border border-accent-green text-accent-green disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-1 rounded-lg font-fredoka text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            }

            if (isEmpty) {
              return (
                <button
                  key={slot.id}
                  onClick={() => { if (isIdle) { setEditingSlot(slotIndex); setEditingName('') } }}
                  disabled={!isIdle}
                  className="w-full px-2 py-1.5 rounded-lg font-fredoka text-xs text-white/30 border border-dashed border-white/15 hover:border-white/30 hover:text-white/50 transition-all disabled:cursor-not-allowed cursor-pointer"
                >
                  + Sauvegarder
                </button>
              )
            }

            return (
              <div key={slot.id} className="flex items-center gap-1">
                <button
                  onClick={() => isIdle && applyPreset(slot.id)}
                  disabled={!isIdle}
                  className={`flex-1 text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
                    isActive(slot)
                      ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                      : isIdle
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {slot.name}
                </button>
                <button
                  onClick={() => isIdle && deleteCustomPreset(slotIndex)}
                  disabled={!isIdle}
                  className="text-white/30 hover:text-red-400 transition-colors text-xs disabled:cursor-not-allowed cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Fond du timer */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-[10px] font-semibold text-white/50 tracking-widest uppercase">
          Fond
        </span>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setTimerBackground('default')}
            className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
              timerBackground === 'default'
                ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
            }`}
          >
            Défaut
          </button>
          <button
            onClick={() => setTimerBackground('gradient')}
            className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
              timerBackground === 'gradient'
                ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
            }`}
          >
            Gradient
          </button>
          <button
            onClick={() => setTimerBackground('solid')}
            className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
              timerBackground === 'solid'
                ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
            }`}
          >
            Sombre
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full text-left px-2 py-1.5 rounded-lg font-fredoka text-xs font-semibold transition-all ${
              timerBackground === 'custom'
                ? 'bg-accent-green/20 border border-accent-green text-accent-green'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 cursor-pointer'
            }`}
          >
            Perso
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
