import { useTranslation } from 'react-i18next'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
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
  const { compareAsStepRef } = useGlobalChartsInfo()
  const { t } = useTranslation('ChartCardFooter')

  return (
    <CardFooter className="flex flex-col justify-center">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex-1">
          {compareAsStepRef.current ? (
            <p>{t('comparisons')}:</p>
          ) : (
            <p>{t('steps')}:</p>
          )}
        </div>
        <div className="basis-3/4">
          <div className="flex items-center justify-center gap-4">
            <p>
              {compareAsStepRef.current
                ? chartCompareCounterState
                : chartActionCounterState}
            </p>
            <Progress
              value={
                compareAsStepRef.current &&
                chartActionCounterState !== maxChartActionCounterState
                  ? (chartCompareCounterState /
                      (maxChartCompareCounterState + 1)) *
                    100
                  : (chartActionCounterState / maxChartActionCounterState) * 100
              }
              indicatorClassName={`${chartActionCounterState === maxChartActionCounterState ? 'bg-red-400' : ''}`}
            />
            <p>
              {compareAsStepRef.current
                ? maxChartCompareCounterState
                : maxChartActionCounterState}
            </p>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      {!compareAsStepRef.current && (
        <div className="flex w-full items-center justify-center gap-4">
          <p>
            {t('comparisons')}: {chartCompareCounterState} /{' '}
            {maxChartCompareCounterState}
          </p>
        </div>
      )}
    </CardFooter>
  )
}
