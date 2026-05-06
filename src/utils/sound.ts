export function playDing(): void {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    const makeNote = (freq: number, startDelay: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + startDelay)
      gain.gain.setValueAtTime(0, now + startDelay)
      gain.gain.linearRampToValueAtTime(0.5, now + startDelay + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + 0.8)
      osc.start(now + startDelay)
      osc.stop(now + startDelay + 0.8)
    }

    makeNote(880, 0)      // La5
    makeNote(1108, 0.08)  // Do#6 légèrement décalé
  } catch {
    // AudioContext non supporté ou autoplay policy — fail silently
  }
}
