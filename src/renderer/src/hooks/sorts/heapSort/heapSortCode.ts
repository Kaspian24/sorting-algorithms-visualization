const heapifyFunctionCode = `
function heapify(arr: number[], n: number, i: number) {
  let largest = i
  const l = 2 * i + 1
  const r = 2 * i + 2

  if (l < n && arr[l] > arr[largest]) {
    largest = l
  }

  if (r < n && arr[r] > arr[largest]) {
    largest = r
  }

  if (largest !== i) {
    const temp = arr[i]
    arr[i] = arr[largest]
    arr[largest] = temp

    heapify(arr, n, largest)
  }
}
`

const heapSortFunctionCode = `
function heapSort(arr: number[]) {
  const n = arr.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0]
    arr[0] = arr[i]
    arr[i] = temp

    heapify(arr, i, 0)
  }
}
`

export const heapSortCode = heapifyFunctionCode + heapSortFunctionCode
