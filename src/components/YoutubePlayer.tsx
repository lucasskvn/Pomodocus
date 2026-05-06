import { useState } from 'react'

function extractVideoId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  const liveMatch = url.match(/(?:live|embed)\/([a-zA-Z0-9_-]{11})/)
  if (liveMatch) return liveMatch[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim()
  return null
}

const PRESETS = [
  { label: 'Lo-fi', id: 'jfKfPfyJRdk' },
  { label: 'Space', id: 'yLOM8R6lbzg' },
  { label: 'Nature', id: 'mPZkdNFkNps' },
  { label: 'Jazz', id: 'Dx5qFachd3A' },
]

export default function YoutubePlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [error, setError] = useState(false)

  const isPlaying = videoId !== null

  const loadUrl = () => {
    const id = extractVideoId(inputUrl.trim())
    if (id) {
      setVideoId(id)
      setError(false)
      setInputUrl('')
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed bottom-[88px] right-4 z-50 flex flex-col items-end gap-3">
      {/*
        Le panel est toujours dans le DOM (pas de unmount).
        On le déplace hors écran via transform quand fermé
        pour que l'iframe reste actif et l'audio continue.
      */}
      <div
        className="bg-[#0a1219] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-80 transition-all duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 2rem))',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Player — toujours monté une fois videoId défini */}
        {videoId ? (
          <iframe
            width="320"
            height="180"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="block w-full"
          />
        ) : (
          <div className="w-full h-[180px] bg-white/5 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🎵</span>
            <span className="font-inter text-white/30 text-xs">Sélectionne une vidéo</span>
          </div>
        )}

        {/* Presets */}
        <div className="px-3 pt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setVideoId(p.id)}
              className={`px-3 py-1.5 rounded-full font-inter text-xs font-medium border transition-colors ${
                videoId === p.id
                  ? 'border-accent-green text-accent-green bg-accent-green/10'
                  : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* URL custom */}
        <div className="px-3 py-3 flex gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); setError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && loadUrl()}
            placeholder="Colle une URL YouTube..."
            className={`flex-1 bg-white/5 border rounded-lg px-3 py-2 font-inter text-xs text-white placeholder-white/30 outline-none focus:border-white/40 transition-colors ${
              error ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          <button
            onClick={loadUrl}
            className="px-3 py-2 bg-accent-green rounded-lg font-fredoka font-bold text-sm text-bg-dark hover:opacity-90 transition-opacity flex-shrink-0"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Bouton toggle — anneau vert quand musique joue en arrière-plan */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all ${
          isPlaying && !isOpen
            ? 'bg-accent-green/10 border-2 border-accent-green'
            : 'bg-[#0a1219] border border-white/20 hover:border-white/40'
        }`}
      >
        {isOpen ? '✕' : '🎵'}
      </button>
    </div>
  )
}
