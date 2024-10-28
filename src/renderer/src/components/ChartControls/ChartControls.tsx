import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import { Slider } from '@renderer/components/ui/Slider'
import useChartControls from '@renderer/hooks/useChartControls'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'

export default function ChartControls() {
  const { globalCompareActionCounterRef, globalMaxCompareActionCounterRef } =
    useChartsInfo()
  const {
    handleStart,
    handleStop,
    handleNext,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
  } = useChartControls()

  return (
    <>
      <Button
        onClick={() => handleSetStep(globalCompareActionCounterRef.current - 1)}
        variant="ghost"
        className="p-0"
      >
        <ChevronLeft />
      </Button>
      {isRunningState ? (
        <Button onClick={handleStop} variant="ghost" className="p-0">
          <Pause />
        </Button>
      ) : (
        <Button onClick={handleStart} variant="ghost" className="p-0">
          <Play />
        </Button>
      )}
      <Button onClick={handleNext} variant="ghost" className="p-0">
        <ChevronRight />
      </Button>
      <Button onClick={handleReset} variant="ghost" className="p-0">
        <RotateCcw />
      </Button>
      <Slider
        className="w-1/2"
        rangeClassName={`${globalCompareActionCounterRef.current === globalMaxCompareActionCounterRef.current ? 'bg-red-400' : ''}`}
        value={[globalCompareActionCounterRef.current]}
        max={globalMaxCompareActionCounterRef.current}
        onValueChange={(value) => handleSetStep(value[0])}
        step={1}
      />
      <Button onClick={() => handleDurationChange(250)}>speedUp</Button>
      <Button onClick={() => handleDurationChange(1000)}>speedDown</Button>
    </>
  )
}
