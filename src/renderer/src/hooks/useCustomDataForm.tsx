import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { z } from 'zod'

export default function useCustomDataForm() {
  const { defaultChartData, setDefaultChartData } = useChartsInfo()

  const defaultValues = {
    numbers: defaultChartData.map(({ number }) => ({ number })),
  }

  const numberObj = z.object({
    number: z.coerce.number().int().nonnegative(),
  })

  const CustomDataSchema = z.object({
    numbers: z.array(numberObj).min(5),
  })

  const form = useForm<z.infer<typeof CustomDataSchema>>({
    resolver: zodResolver(CustomDataSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: 'numbers',
    rules: { minLength: 5 },
  })

  const onSubmit = (values: z.infer<typeof CustomDataSchema>) => {
    const validatedValues = CustomDataSchema.safeParse(values)

    if (validatedValues.success) {
      setDefaultChartData(values.numbers.map(({ number }) => number))
    }
  }

  return { form, onSubmit, fields, remove, insert }
}
