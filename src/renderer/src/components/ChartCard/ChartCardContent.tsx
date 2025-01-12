import { ReactElement, useState } from 'react'
import ChartBarChart from '@renderer/components/ChartCard/ChartBarChart'
import ChartCardCode from '@renderer/components/ChartCard/ChartCardCode'
import ChartCardFooter from '@renderer/components/ChartCard/ChartCardFooter'
import ChartCardInfo from '@renderer/components/ChartCard/ChartCardInfo'
import ChartCardInfoFooter from '@renderer/components/ChartCard/ChartCardInfoFooter'
import { CardContent } from '@renderer/components/ui/Card'
import useChartCard from '@renderer/hooks/useChartCard'
import { UseSort } from '@renderer/types/types'

export interface ChartCardContentProps {
  useSort: UseSort
  showInfo: boolean
}

export default function ChartCardContent({
  useSort,
  showInfo,
}: ChartCardContentProps) {
  const {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
    info,
    code,
    AdditionalInfo,
  } = useChartCard(useSort)

  const [infoPage, setInfoPage] = useState(0)

  const pages: ReactElement[] = []
  pages.push(<ChartCardInfo info={info} />)
  AdditionalInfo && pages.push(AdditionalInfo)
  pages.push(<ChartCardCode code={code} />)

  return (
    <>
      <CardContent className="flex grow flex-col justify-center p-6 pt-0">
        {showInfo ? (
          pages[infoPage]
        ) : (
          <ChartBarChart chartDataState={chartDataState} />
        )}
      </CardContent>
      {showInfo ? (
        <ChartCardInfoFooter
          page={infoPage}
          lastPage={pages.length - 1}
          setPage={setInfoPage}
        />
      ) : (
        <ChartCardFooter
          chartActionCounterState={chartActionCounterState}
          chartCompareCounterState={chartCompareCounterState}
          maxChartActionCounterState={maxChartActionCounterState}
          maxChartCompareCounterState={maxChartCompareCounterState}
        />
      )}
    </>
  )
}
