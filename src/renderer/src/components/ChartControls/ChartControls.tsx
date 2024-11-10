import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/Select'
import { Slider } from '@renderer/components/ui/Slider'
import useChartControls from '@renderer/hooks/useChartControls'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react'

export default function ChartControls() {
  const {
    getGlobalChartActionCounter,
    globalChartActionCounterState,
    globalMaxChartActionCounterState,
  } = useChartsInfo()
  const {
    handleStart,
    handleStop,
    handleNext,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
  } = useChartControls()

  const allHidden = globalMaxChartActionCounterState ? false : true

  return (
    <>
      <Button
        onClick={() => handleSetStep(getGlobalChartActionCounter() - 1)}
        variant="ghost"
        className={`p-0 ${allHidden && 'opacity-50'}`}
      >
        <ChevronLeft />
      </Button>
      {isRunningState ? (
        <Button
          onClick={handleStop}
          variant="ghost"
          className={`p-0 ${allHidden && 'opacity-50'}`}
        >
          <Pause />
        </Button>
      ) : (
        <Button
          onClick={handleStart}
          variant="ghost"
          className={`p-0 ${allHidden && 'opacity-50'}`}
        >
          <Play />
        </Button>
      )}
      <Button
        onClick={handleNext}
        variant="ghost"
        className={`p-0 ${allHidden && 'opacity-50'}`}
      >
        <ChevronRight />
      </Button>
      <Button
        onClick={handleReset}
        variant="ghost"
        className={`p-0 ${allHidden && 'opacity-50'}`}
      >
        <RotateCcw />
      </Button>
      <Button
        onClick={() => handleSetStep(globalMaxChartActionCounterState)}
        variant="ghost"
        className={`p-0 ${allHidden && 'opacity-50'}`}
      >
        <SkipForward />
      </Button>
      <Slider
        className={`w-1/2 ${allHidden && 'opacity-50'}`}
        rangeClassName={`${globalChartActionCounterState === globalMaxChartActionCounterState && 'bg-red-400'}`}
        value={[!allHidden ? globalChartActionCounterState : 0]}
        max={globalMaxChartActionCounterState}
        onValueChange={(value) => handleSetStep(value[0])}
        step={1}
      />
      <Select onValueChange={(value) => handleDurationChange(Number(value))}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="1x" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Speed</SelectLabel>
            <SelectItem value="10">10x</SelectItem>
            <SelectItem value="5">5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="0.25">0.25x</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
