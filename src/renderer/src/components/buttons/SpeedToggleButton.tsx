import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/Select'

interface SpeedToggleButtonProps {
  duration: number
  onValueChange: (value: string) => void
}

export default function SpeedToggleButton({
  duration,
  onValueChange,
}: SpeedToggleButtonProps) {
  const { t } = useTranslation('SpeedToggleButton')

  return (
    <Select
      defaultValue={(250 / duration).toString()}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('speed')}</SelectLabel>
          <SelectItem value="50">50x</SelectItem>
          <SelectItem value="10">25x</SelectItem>
          <SelectItem value="5">5x</SelectItem>
          <SelectItem value="1">1x</SelectItem>
          <SelectItem value="0.5">0.5x</SelectItem>
          <SelectItem value="0.25">0.25x</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
