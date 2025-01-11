import { Button } from '@renderer/components/ui/Button'
import { CardFooter } from '@renderer/components/ui/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ChartCardInfoFooterProps {
  page: number
  lastPage: number
  setPage: (page: number) => void
}

export default function ChartCardFooter({
  page,
  lastPage,
  setPage,
}: ChartCardInfoFooterProps) {
  return (
    <CardFooter className="flex flex-col justify-center">
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page < 1}
          variant="outline"
          className="p-0"
        >
          <ChevronLeft />
        </Button>
        <span>{`${page + 1}/${lastPage + 1}`}</span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page >= lastPage}
          variant="outline"
          className="p-0"
        >
          <ChevronRight />
        </Button>
      </div>
    </CardFooter>
  )
}
