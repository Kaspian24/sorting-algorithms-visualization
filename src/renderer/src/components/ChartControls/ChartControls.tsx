import { useCallback } from 'react'
import SpeedToggleButton from '@renderer/components/buttons/SpeedToggleButton'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { Button } from '@renderer/components/ui/Button'
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
  const { globalMaxChartActionCounterState } = useGlobalChartsInfo()
  const {
    handleStart,
    handleStop,
    handleReset,
    handleDurationChange,
    isRunningState,
    globalChartActionCounterState,
    handlePrevious,
    handleNext,
    handleSetStep,
    durationState,
  } = useChartControls()

  const allHidden = globalMaxChartActionCounterState ? false : true

  const onSpeedValueChange = useCallback(
    (value: string) => handleDurationChange(Number(value)),
    [handleDurationChange],
  )

  return (
    <>
      <Button
        onClick={() => handlePrevious()}
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
        onClick={() => handleNext()}
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
        className={`h-4 w-1/2 ${allHidden && 'opacity-50'}`}
        rangeClassName={`${globalChartActionCounterState === globalMaxChartActionCounterState && 'bg-red-400'}`}
        value={[!allHidden ? globalChartActionCounterState : 0]}
        max={globalMaxChartActionCounterState}
        onValueChange={(value) => handleSetStep(value[0])}
        step={1}
      />
      <SpeedToggleButton
        duration={durationState}
        onValueChange={onSpeedValueChange}
      />
    </>
  )
}
