const mergeFunctionCode = `function merge(arr: number[], left: number, mid: number, right: number) {
  const n1 = mid - left + 1
  const n2 = right - mid

  const L = new Array(n1)
  const R = new Array(n2)

  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i]
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j]
  }

  let i = 0
  let j = 0
  let k = left

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i]
      i++
    } else {
      arr[k] = R[j]
      j++
    }
    k++
  }

  while (i < n1) {
    arr[k] = L[i]
    i++
    k++
  }

  while (j < n2) {
    arr[k] = R[j]
    j++
    k++
  }
}`

const mergeSortTopBottomFunctionCode = `function mergeSort(arr: number[], left: number, right: number) {
  if (left >= right) {
    return
  }

  const mid = Math.floor(left + (right - left) / 2)
  mergeSort(arr, left, mid)
  mergeSort(arr, mid + 1, right)
  merge(arr, left, mid, right)
}`

const mergeSortBottomUpFunctionCode = `function mergeSort(arr: number[]) {
  const n = arr.length

  for (let curr_size = 1; curr_size <= n - 1; curr_size *= 2) {
    for (let left = 0; left < n - 1; left += 2 * curr_size) {
      const mid = Math.min(left + curr_size - 1, n - 1)
      const right = Math.min(left + 2 * curr_size - 1, n - 1)

      merge(arr, left, mid, right)
    }
  }
}`

export const mergeSortTopBottomCode =
  mergeFunctionCode + '\n\n' + mergeSortTopBottomFunctionCode

export const mergeSortBottomUpCode =
  mergeFunctionCode + '\n\n' + mergeSortBottomUpFunctionCode
