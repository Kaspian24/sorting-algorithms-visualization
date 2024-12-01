import { useTranslation } from 'react-i18next'
import { CardFooter } from '@renderer/components/ui/Card'
import { Progress } from '@renderer/components/ui/Progress'

interface ChartCardFooterProps {
  chartActionCounterState: number
  chartCompareCounterState: number
  maxChartActionCounterState: number
  maxChartCompareCounterState: number
}

export default function ChartCardFooter({
  chartActionCounterState,
  chartCompareCounterState,
  maxChartActionCounterState,
  maxChartCompareCounterState,
}: ChartCardFooterProps) {
  const { t } = useTranslation('ChartCardFooter')

  return (
    <CardFooter className="flex flex-col justify-center">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex-1">
          <p>{t('steps')}:</p>
        </div>
        <div className="basis-3/4">
          <div className="flex items-center justify-center gap-4">
            <p>{chartActionCounterState}</p>
            <Progress
              value={
                (chartActionCounterState / maxChartActionCounterState) * 100
              }
              indicatorClassName={`${chartActionCounterState === maxChartActionCounterState ? 'bg-red-400' : ''}`}
            />
            <p>{maxChartActionCounterState}</p>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <p>
          {t('comparisons')}: {chartCompareCounterState} /{' '}
          {maxChartCompareCounterState}
        </p>
      </div>
    </CardFooter>
  )
}
