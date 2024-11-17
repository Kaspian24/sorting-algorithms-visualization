import AlgorithmsVisibilityButton from '@renderer/components/buttons/AgorithmsVisibilityButton'
import CustomDataButton from '@renderer/components/buttons/CustomDataButton'
import ExampleDataButton from '@renderer/components/buttons/ExampleDataButton'
import { ModeToggle } from '@renderer/components/ModeToggle/ModeToggle'

export default function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b">
      <div className="flex flex-1">
        <ModeToggle />
      </div>
      <div>
        <CustomDataButton />
        <ExampleDataButton />
      </div>
      <div className="flex flex-1 justify-end">
        <AlgorithmsVisibilityButton />
      </div>
    </header>
  )
}
