import { useTranslation } from 'react-i18next'
import { SortingAlgorithmInfo } from '@renderer/types/types'

export interface ChartCardInfoProps {
  info: SortingAlgorithmInfo
}

export default function ChartCardInfo({
  info: { name, description, best, average, worst, memory, stable },
}: ChartCardInfoProps) {
  const { t } = useTranslation('ChartCardInfo')

  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-2xl flex-col items-center space-y-4 text-center">
        <p>{name}</p>
        <p>{description}</p>
        <p>{best}</p>
        <p>{average}</p>
        <p>{worst}</p>
        <p>{memory}</p>
        <p>{stable ? t('stable') : t('unstable')}</p>
      </div>
    </div>
  )
}
