import { useRef, useState } from 'react'
import { useGameStore } from '../store/useGameStore'

export default function TaskList() {
  const sessionTasks = useGameStore((s) => s.sessionTasks)
  const addTask = useGameStore((s) => s.addTask)
  const toggleTask = useGameStore((s) => s.toggleTask)
  const removeTask = useGameStore((s) => s.removeTask)
  const clearTasks = useGameStore((s) => s.clearTasks)

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddTask = () => {
    if (inputValue.trim()) {
      addTask(inputValue)
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const completedCount = sessionTasks.filter((t) => t.completed).length

  return (
    <div className="w-full max-w-md">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-fredoka text-sm font-semibold text-white">📋 Tâches ({completedCount}/{sessionTasks.length})</h3>
          {sessionTasks.length > 0 && (
            <button
              onClick={clearTasks}
              className="text-white/40 hover:text-white/60 transition-colors text-xs"
              title="Effacer toutes les tâches"
            >
              ✕ Effacer
            </button>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une tâche..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-inter text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-accent-green/20 border border-accent-green/40 text-accent-green rounded-lg font-inter text-sm hover:bg-accent-green/30 transition-colors"
          >
            +
          </button>
        </div>

        {/* Tasks list */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sessionTasks.length === 0 ? (
            <p className="font-inter text-xs text-white/40 text-center py-4">Aucune tâche pour l'instant</p>
          ) : (
            sessionTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-2.5"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-accent-green/40 border-accent-green/60'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {task.completed && <span className="text-accent-green text-xs font-bold">✓</span>}
                </button>
                <span
                  className={`flex-1 font-inter text-sm transition-all ${
                    task.completed ? 'text-white/40 line-through' : 'text-white'
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors text-sm"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
