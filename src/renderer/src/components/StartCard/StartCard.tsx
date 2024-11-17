import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/Card'

export default function StartCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col items-center justify-center p-6 pt-0">
        <div className="flex max-w-2xl flex-col items-center space-y-4 text-center">
          <p>
            To start select visible algorithms by clicking the button in the
            upper right corner or right clicking on empty space in main view.
          </p>
          <p>
            You can change the algorithms order by dragging them or by right
            clicking their cards and moving them left or right.
          </p>
          <p>
            You can change the sorting data using either Custom Data or Example
            Data button at the top in the middle of the screen.
          </p>
          <p>
            You can switch between dark and light theme by clicking the button
            in the top left corner.
          </p>
          <p>
            Control the algorithms steps and speed using controls at the bottom
            of the screen.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
