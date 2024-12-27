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
          <SelectItem value={Number.MAX_SAFE_INTEGER.toString()}>
            Max
          </SelectItem>
          <SelectItem value="4">4x</SelectItem>
          <SelectItem value="2">2x</SelectItem>
          <SelectItem value="1">1x</SelectItem>
          <SelectItem value="0.5">0.5x</SelectItem>
          <SelectItem value="0.25">0.25x</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
