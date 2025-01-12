import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BlockMath } from 'react-katex'

import 'katex/dist/katex.min.css'

interface GapInfoProps {
  children: ReactNode
}
const GapInfo = ({ children }: GapInfoProps) => {
  const { t } = useTranslation('ShellSortGapsInfo')
  return (
    <div className="flex h-0 flex-auto flex-col items-center justify-center text-lg">
      <p>{t('usedFunction')}</p>
      <div>{children}</div>
    </div>
  )
}

export const ShellGapInfo = () => {
  return (
    <GapInfo>
      <BlockMath math={String.raw`\frac{N}{2^k}`} />
    </GapInfo>
  )
}

export const HibbardGapInfo = () => {
  return (
    <GapInfo>
      <BlockMath math={String.raw`2^k - 1`} />
    </GapInfo>
  )
}

export const SedgewickGapInfo = () => {
  const { t } = useTranslation('ShellSortGapsInfo')

  return (
    <GapInfo>
      <BlockMath
        math={String.raw`
          \left\{
          \begin{array}{ll}
          9 \cdot (2^k - 2^\frac{k}{2}) + 1 & \text{${t('for')} } k \leq 0 \\
          8 \cdot (2^{k} - 6 \cdot 2^\frac{k+1}{2}) + 1 & \text{${t('for')} } k \geq 1
          \end{array}
          \right.
          `}
      />
    </GapInfo>
  )
}
