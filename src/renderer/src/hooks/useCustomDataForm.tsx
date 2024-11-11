import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { z } from 'zod'

export default function useCustomDataForm() {
  const { getDefaultChartData, setDefaultChartData } = useChartsInfo()

  const values = {
    numbers: getDefaultChartData().map(({ number }) => ({ number })),
  }

  const numberObj = z.object({
    number: z.coerce
      .number()
      .int({ message: 'Number must be an integer' })
      .positive({ message: 'Number must be positive' }),
  })

  const CustomDataSchema = z.object({
    numbers: numberObj
      .array()
      .min(5, { message: 'There must be at least 5 numbers' }),
  })

  const form = useForm<z.infer<typeof CustomDataSchema>>({
    resolver: zodResolver(CustomDataSchema),
    values,
    mode: 'onChange',
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
