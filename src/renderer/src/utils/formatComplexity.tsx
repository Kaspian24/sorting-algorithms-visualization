export function formatComplexity(text: string) {
  const regex = /\^(\([^)]*\))/g

  const parts = text.split(regex)

  const formattedText = parts.map((part, index) => {
    if (index % 2 !== 0) {
      return <sup key={index}>{part.slice(1, -1)}</sup>
    }
    return part
  })

  return <>{formattedText}</>
}
