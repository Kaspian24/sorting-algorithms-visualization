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
import { formatComplexity } from '@renderer/utils/formatComplexity'

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
            <TableRow className="hover:bg-inherit">
              <TableHead className="text-center">{t('best')}</TableHead>
              <TableHead className="text-center">{t('average')}</TableHead>
              <TableHead className="text-center">{t('worst')}</TableHead>
              <TableHead className="text-center">{t('memory')}</TableHead>
              <TableHead className="text-center">{t('stability')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-inherit">
              <TableCell className="text-center">
                {formatComplexity(best)}
              </TableCell>
              <TableCell className="text-center">
                {formatComplexity(average)}
              </TableCell>
              <TableCell className="text-center">
                {formatComplexity(worst)}
              </TableCell>
              <TableCell className="text-center">
                {formatComplexity(memory)}
              </TableCell>
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
