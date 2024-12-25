export function gapShell(num: number) {
  return Math.floor(num / 2)
}

export function gapHibbard(num: number) {
  let k = 1
  while (Math.pow(2, k) - 1 < num) {
    k++
  }
  return Math.floor(Math.pow(2, k - 1) - 1)
}

export function gapSedgewick(num: number) {
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
}
