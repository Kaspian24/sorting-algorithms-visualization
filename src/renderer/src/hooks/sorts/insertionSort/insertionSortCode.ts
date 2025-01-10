export const insertionSortCode = `
function insertionSort(arr: number[]) {
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const current = arr[i]
    let j = i - 1

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j]

      j--
    }
    arr[j + 1] = current
  }
}
`
