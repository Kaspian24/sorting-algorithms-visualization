import AlgorithmsVisibilityButton from '@renderer/components/buttons/AgorithmsVisibilityButton'
import CustomDataButton from '@renderer/components/buttons/CustomDataButton'
import ExampleDataButton from '@renderer/components/buttons/ExampleDataButton'
import LocaleToggleButton from '@renderer/components/buttons/LocaleToggleButton'
import ThemeToggleButton from '@renderer/components/buttons/ThemeToggleButton'

export default function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b">
      <div className="flex flex-1">
        <ThemeToggleButton />
        <LocaleToggleButton />
      </div>
      <div className="flex gap-x-2">
        <CustomDataButton />
        <ExampleDataButton />
      </div>
      <div className="flex flex-1 justify-end">
        <AlgorithmsVisibilityButton />
      </div>
    </header>
  )
}
