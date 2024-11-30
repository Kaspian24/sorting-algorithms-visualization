import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@renderer/components/ui/Table'
import { SortingAlgorithmInfo } from '@renderer/types/types'

export interface ChartCardInfoProps {
  info: SortingAlgorithmInfo
}

export default function ChartCardInfo({
  info: { best, average, worst, memory, stable },
}: ChartCardInfoProps) {
  const { t } = useTranslation('ChartCardInfo')

  return (
    <div className="flex h-0 flex-auto items-center justify-center">
      <div className="w-125">
        <Table className="w-125">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{t('best')}</TableHead>
              <TableHead className="text-center">{t('average')}</TableHead>
              <TableHead className="text-center">{t('worst')}</TableHead>
              <TableHead className="text-center">{t('memory')}</TableHead>
              <TableHead className="text-center">{t('stability')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center">{best}</TableCell>
              <TableCell className="text-center">{average}</TableCell>
              <TableCell className="text-center">{worst}</TableCell>
              <TableCell className="text-center">{memory}</TableCell>
              <TableCell className="text-center">
                {stable ? t('stable') : t('unstable')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
