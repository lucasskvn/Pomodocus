import PomodoroTimer from '../components/PomodoroTimer'
import EggShop from '../components/EggShop'

export default function TimerView() {
  return (
    <div className="flex flex-col">
      <PomodoroTimer />
      <EggShop />
    </div>
  )
}
