import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import SpeedToggleButton from '@renderer/components/buttons/SpeedToggleButton'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import { Checkbox } from '@renderer/components/ui/Checkbox'
import { Label } from '@renderer/components/ui/Label'
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
    globalMaxChartActionCounterState,
    globalMaxChartCompareCounterState,
  } = useGlobalChartsInfo()
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
    compareAsStepState,
    handleCompareAsStepChange,
    globalChartCompareCounterState,
  } = useChartControls()

  const allHidden = globalMaxChartActionCounterState ? false : true

  const onSpeedValueChange = useCallback(
    (value: string) => handleDurationChange(Number(value)),
    [handleDurationChange],
  )

  const { t } = useTranslation('ChatControls')

  let sliderValue: number

  if (!allHidden) {
    if (compareAsStepState) {
      sliderValue =
        globalChartActionCounterState === globalMaxChartActionCounterState
          ? globalChartCompareCounterState + 1
          : globalChartCompareCounterState
    } else {
      sliderValue = globalChartActionCounterState
    }
  } else {
    sliderValue = 0
  }

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
        onClick={() =>
          handleSetStep(
            compareAsStepState
              ? globalMaxChartCompareCounterState + 1
              : globalMaxChartActionCounterState,
          )
        }
        variant="ghost"
        className={`p-0 ${allHidden && 'opacity-50'}`}
      >
        <SkipForward />
      </Button>
      <Slider
        className={`h-4 w-1/2 ${allHidden && 'opacity-50'}`}
        rangeClassName={`${globalChartActionCounterState === globalMaxChartActionCounterState && 'bg-red-400'}`}
        value={[sliderValue]}
        max={
          compareAsStepState
            ? globalMaxChartCompareCounterState + 1
            : globalMaxChartActionCounterState
        }
        onValueChange={(value) => handleSetStep(value[0])}
        step={1}
      />
      <SpeedToggleButton
        duration={durationState}
        onValueChange={onSpeedValueChange}
      />
      <Checkbox
        id="compareAsStep"
        checked={compareAsStepState}
        onClick={() => handleCompareAsStepChange()}
      />
      <Label className="whitespace-pre text-balance" htmlFor="compareAsStep">
        {t('compareAsStep')}
      </Label>
    </>
  )
}
