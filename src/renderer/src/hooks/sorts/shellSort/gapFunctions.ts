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
