import { Button } from '@renderer/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/Dialog'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'
import useExampleData from '@renderer/hooks/useExampleData'

export default function ExampleDataButton() {
  const {
    setSmallUnsorted,
    setSmallPartiallySorted,
    setSmallSorted,
    setSmallReversed,
    setSmallDuplicates,

    setMediumUnsorted,
    setMediumPartiallySorted,
    setMediumSorted,
    setMediumReversed,
    setMediumDuplicates,

    setLargeUnsorted,
    setLargePartiallySorted,
    setLargeSorted,
    setLargeReversed,
    setLargeDuplicates,
  } = useExampleData()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Example Data</Button>
      </DialogTrigger>
      <DialogContent className="flex h-3/6 min-h-64 w-96 flex-col">
        <DialogHeader>
          <DialogTitle>Example Data</DialogTitle>
          <DialogDescription>Choose example data.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-0 flex-auto">
          <div className="flex flex-col gap-y-2 pr-5">
            <div className="flex flex-col space-y-2">
              <p>10 numbers</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setSmallUnsorted()}>
                  Unsorted
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSmallPartiallySorted()}
                >
                  Partially sorted
                </Button>
                <Button variant="outline" onClick={() => setSmallSorted()}>
                  Sorted
                </Button>
                <Button variant="outline" onClick={() => setSmallReversed()}>
                  Reversed
                </Button>
                <Button variant="outline" onClick={() => setSmallDuplicates()}>
                  Multiple duplicates
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <p>30 numbers</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setMediumUnsorted()}>
                  Unsorted
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMediumPartiallySorted()}
                >
                  Partially sorted
                </Button>
                <Button variant="outline" onClick={() => setMediumSorted()}>
                  Sorted
                </Button>
                <Button variant="outline" onClick={() => setMediumReversed()}>
                  Reversed
                </Button>
                <Button variant="outline" onClick={() => setMediumDuplicates()}>
                  Multiple duplicates
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <p>100 numbers</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setLargeUnsorted()}>
                  Unsorted
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLargePartiallySorted()}
                >
                  Partially sorted
                </Button>
                <Button variant="outline" onClick={() => setLargeSorted()}>
                  Sorted
                </Button>
                <Button variant="outline" onClick={() => setLargeReversed()}>
                  Reversed
                </Button>
                <Button variant="outline" onClick={() => setLargeDuplicates()}>
                  Multiple duplicates
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
