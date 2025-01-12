const pivotMedianOfThreeFunctionCode = `function pivotMedianOfThree(arr: number[], low: number, high: number) {
  const mid = Math.floor((low + high) / 2)

  if (arr[mid] < arr[low]) {
    const temp = arr[low]
    arr[low] = arr[mid]
    arr[mid] = temp
  }

  if (arr[high] < arr[low]) {
    const temp = arr[low]
    arr[low] = arr[high]
    arr[high] = temp
  }

  if (arr[mid] < arr[high]) {
    const temp = arr[mid]
    arr[mid] = arr[high]
    arr[high] = temp
  }

  return high
}`

const partitionLomutoFunctionCode = (
  pivotFunction: string,
) => `function partitionLomuto(arr: number[], low: number, high: number) {
  const pivot = ${pivotFunction}
  let i = low - 1

  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }

  arr[high] = arr[i + 1]
  arr[i + 1] = pivot
  return i + 1
}`

const quickSortLomutoFunctionCode = `function quickSortLomuto(arr: number[], low: number, high: number) {
  if (low < high) {
    const index = partitionLomuto(arr, low, high)

    quickSortLomuto(arr, low, index - 1)
    quickSortLomuto(arr, index + 1, high)
  }
}`

const partitionHoareFunctionCode = (
  pivotFunction: string,
) => `function partitionHoare(arr: number[], low: number, high: number) {
  const pivot = ${pivotFunction}

  let i = low - 1
  let j = high + 1

  while (true) {
    do {
      i++
    } while (arr[i] < pivot)

    do {
      j--
    } while (arr[j] > pivot)

    if (i >= j) {
      return j
    }

    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}`

const quickSortHoareFunctionCode = `function quickSortHoare(arr: number[], low: number, high: number) {
  if (low < high) {
    const index = partitionHoare(arr, low, high)

    quickSortHoare(arr, low, index)
    quickSortHoare(arr, index + 1, high)
  }
}`

export const quickSortLomutoEndCode =
  partitionLomutoFunctionCode(`arr[high]`) +
  '\n\n' +
  quickSortLomutoFunctionCode

export const quickSortLomutoMedianCode =
  pivotMedianOfThreeFunctionCode +
  '\n\n' +
  partitionLomutoFunctionCode(`arr[pivotMedianOfThree(arr, low, high)]`) +
  '\n\n' +
  quickSortLomutoFunctionCode

export const quickSortHoareStartCode =
  partitionHoareFunctionCode(`arr[low]`) + '\n\n' + quickSortHoareFunctionCode

export const quickSortHoareMiddleCode =
  partitionHoareFunctionCode(`arr[Math.floor((low + high) / 2)]`) +
  '\n\n' +
  quickSortHoareFunctionCode
