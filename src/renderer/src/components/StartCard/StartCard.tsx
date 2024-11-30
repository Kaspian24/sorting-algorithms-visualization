import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/Card'

export default function StartCard() {
  const { t } = useTranslation('StartCard')

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>{t('welcome')}</CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col items-center justify-center p-6 pt-0">
        <div className="flex max-w-2xl flex-col items-center space-y-4 text-center">
          <p>{t('visibility')}</p>
          <p>{t('order')}</p>
          <p>{t('dane')}</p>
          <p>{t('theme')}</p>
          <p>{t('controls')}</p>
          <p>{t('info')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
