import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import useChartControls from '@renderer/hooks/useChartControls'

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
  } = useChartControls()

  return (
    <>
      <p>
        {globalCompareActionCounterRef.current}/
        {globalMaxCompareActionCounterRef.current}
      </p>
      <Button onClick={handleStart}>start</Button>
      <Button onClick={handleStop}>stop</Button>
      <Button
        onClick={() => handleSetStep(globalCompareActionCounterRef.current - 1)}
      >
        previous
      </Button>
      <Button onClick={handleNext}>next</Button>
      <Button onClick={handleReset}>reset</Button>
      <Button onClick={() => handleSetStep(150)}>set step</Button>
      <Button onClick={() => handleDurationChange(250)}>speedUp</Button>
      <Button onClick={() => handleDurationChange(1000)}>speedDown</Button>
    </>
  )
}
