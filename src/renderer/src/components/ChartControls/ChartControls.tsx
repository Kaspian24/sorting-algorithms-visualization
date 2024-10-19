import { Button } from '@renderer/components/ui/Button'
import useChartControls from '@renderer/hooks/useChartControls'

export default function ChartControls() {
  const {
    handleStart,
    handleStop,
    handleNext,
    handleReset,
    handleSetStep,
    handleDurationChange,
    compareActionCounterRef,
    maxCompareActionCounterRef,
  } = useChartControls()

  return (
    <>
      <p>
        {compareActionCounterRef.current}/{maxCompareActionCounterRef.current}
      </p>
      <Button onClick={handleStart}>start</Button>
      <Button onClick={handleStop}>stop</Button>
      <Button
        onClick={() => handleSetStep(compareActionCounterRef.current - 1)}
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
