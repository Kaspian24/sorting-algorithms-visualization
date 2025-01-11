const gapHibbardFunctionCode = `function gapHibbard(num: number) {
  let k = 1
  while (Math.pow(2, k) - 1 < num) {
    k++
  }
  return Math.floor(Math.pow(2, k - 1) - 1)
}`

const gapSedgewickFunctionCode = `function gapSedgewick(num: number) {
  if (num === 1) {
    return 0
  }

  let k = 1
  let gap = 1
  let newGap = 1

  while (newGap < num) {
    gap = newGap

    if (k % 2) {
      newGap = 8 * Math.pow(2, k) - 6 * Math.pow(2, (k + 1) / 2) + 1
    } else {
      newGap = 9 * (Math.pow(2, k) - Math.pow(2, k / 2)) + 1
    }

    k++
  }

  return gap
}`

const shellSortFunctionCode = (
  gapFunction1: string,
  gapFunction2: string,
) => `function shellSort(arr: number[]) {
  const n = arr.length

  for (let gap = ${gapFunction1}; gap > 0; gap = ${gapFunction2}) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      let j = i

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = temp
    }
  }
}`

export const shellSortShellCode = shellSortFunctionCode(
  `Math.floor(n / 2)`,
  `Math.floor(gap / 2)`,
)

export const shellSortHibbardCode =
  gapHibbardFunctionCode +
  '\n\n' +
  shellSortFunctionCode(`gapHibbard(n)`, `gapHibbard(gap)`)

export const shellSortSedgewickCode =
  gapSedgewickFunctionCode +
  '\n\n' +
  shellSortFunctionCode(`gapSedgewick(n)`, `gapSedgewick(gap)`)
