import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import {
  CUSTOM_DATA_FORM_HIGHEST_NUMBER,
  CUSTOM_DATA_FORM_MAX_NUMBERS,
} from '@renderer/constants/constants'
import { z } from 'zod'

export default function useCustomDataForm() {
  const { defaultChartDataRef, setDefaultChartData } = useGlobalChartsInfo()
  const { t } = useTranslation('useCustomDataForm')

  const values = {
    numbers: defaultChartDataRef.current.fields.map(({ number }) => ({
      number,
    })),
  }

  const numberObj = z.object({
    number: z.coerce
      .number()
      .int({ message: t('integer') })
      .positive({ message: t('positive') })
      .max(CUSTOM_DATA_FORM_HIGHEST_NUMBER, {
        message: t('highest', { number: CUSTOM_DATA_FORM_HIGHEST_NUMBER }),
      }),
  })

  const CustomDataSchema = z.object({
    numbers: z
      .array(numberObj)
      .min(5, { message: t('min') })
      .max(CUSTOM_DATA_FORM_MAX_NUMBERS, {
        message: t('max', { number: CUSTOM_DATA_FORM_MAX_NUMBERS }),
      }),
  })

  const form = useForm<z.infer<typeof CustomDataSchema>>({
    resolver: zodResolver(CustomDataSchema),
    values,
    mode: 'all',
  })

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: 'numbers',
  })

  const onSubmit = (values: z.infer<typeof CustomDataSchema>) => {
    const validatedValues = CustomDataSchema.safeParse(values)

    if (validatedValues.success) {
      setDefaultChartData(values.numbers.map(({ number }) => number))
    }
  }

  return { form, onSubmit, fields, remove, insert }
}
