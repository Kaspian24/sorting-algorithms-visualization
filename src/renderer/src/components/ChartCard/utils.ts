import {
  CHART_ACTION,
  ChartAction,
  ChartDataField,
} from '@renderer/types/types'

function getDefaultColor(action: ChartAction) {
  return action === CHART_ACTION.FINISHED
    ? 'hsl(var(--chart-finish))'
    : 'hsl(var(--chart-default))'
}

function getFirstColor(action: ChartAction) {
  return action === CHART_ACTION.ANIMATE_SWAP ||
    action === CHART_ACTION.ANIMATE_REPLACE
    ? 'hsl(var(--chart-swap))'
    : 'hsl(var(--chart-compare-first))'
}

function getSecondColor(action: ChartAction, defaultColor: string) {
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return 'hsl(var(--chart-swap))'
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return defaultColor
  }
  return 'hsl(var(--chart-compare-second))'
}

function getFirstTransform(
  action: ChartAction,
  firstKey: number,
  secondKey: number,
  firstNumber: number,
  secondNumber: number,
  fields: ChartDataField[],
) {
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return `translateX(${(Math.abs(firstKey - secondKey) / fields.length) * 100}%)`
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return `scaleY(${1 / (fields[firstNumber!].number / secondNumber)})`
  }
  return 'translateX(0%) scaleY(1)'
}

function getSecondTransform(
  action: ChartAction,
  firstKey: number,
  secondKey: number,
  fields: ChartDataField[],
) {
  return action === CHART_ACTION.ANIMATE_SWAP
    ? `translateX(${(-Math.abs(firstKey - secondKey) / fields.length) * 100}%)`
    : 'translateX(0%) scaleY(1)'
}

export function getColorMappingFunction(
  action: ChartAction,
  firstKey: number,
  secondKey: number,
) {
  const defaultColor = getDefaultColor(action)
  const firstKeyColor = getFirstColor(action)
  const secondKeyColor = getSecondColor(action, defaultColor)

  return (key: number) => {
    if (key === firstKey) {
      return firstKeyColor
    }
    if (key === secondKey) {
      return secondKeyColor
    }
    return defaultColor
  }
}

export function getTransformMappingFunction(
  action: ChartAction,
  firstKey: number,
  secondKey: number,
  firstNumber: number,
  secondNumber: number,
  fields: ChartDataField[],
) {
  const firstKeyTransform = getFirstTransform(
    action,
    firstKey,
    secondKey,
    firstNumber,
    secondNumber,
    fields,
  )
  const secondKeyTransform = getSecondTransform(
    action,
    firstKey,
    secondKey,
    fields,
  )

  if (
    action === CHART_ACTION.ANIMATE_SWAP ||
    action === CHART_ACTION.ANIMATE_REPLACE
  ) {
    return (key: number) => {
      if (key === firstKey) {
        return firstKeyTransform
      }
      if (key === secondKey) {
        return secondKeyTransform
      }
      return 'translateX(0%) scaleY(1)'
    }
  }
  return () => 'translateX(0%) scaleY(1)'
}

export function getTransitionPropertyMappingFunction(
  isForward: boolean,
  action: ChartAction,
  firstKey: number,
  secondKey: number,
) {
  if (!isForward) {
    return () => 'none'
  }
  if (action === CHART_ACTION.ANIMATE_REPLACE) {
    return (key: number) => {
      if (key === firstKey || key === secondKey) {
        return 'transform'
      }
      return 'none'
    }
  }
  if (action === CHART_ACTION.ANIMATE_SWAP) {
    return (key: number) => {
      if (key === firstKey) {
        return 'transform'
      }
      return 'none'
    }
  }
  return () => 'none'
}
