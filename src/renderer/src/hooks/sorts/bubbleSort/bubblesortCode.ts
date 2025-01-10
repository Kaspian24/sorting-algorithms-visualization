export const bubbleSortCode = `
function bubbleSort(arr: number[]) {
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        swapped = true
      }
    }

    if (swapped === false) {
      break
    }
  }
}
`
