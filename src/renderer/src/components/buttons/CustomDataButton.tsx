import { Button } from '@renderer/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/Dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@renderer/components/ui/Form'
import { Input } from '@renderer/components/ui/Input'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'
import useCustomDataForm from '@renderer/hooks/useCustomDataForm'
import { Plus, X } from 'lucide-react'

export default function CustomDataButton() {
  const { form, onSubmit, fields, remove, insert } = useCustomDataForm()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Custom Data</Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-3/6 min-h-64 w-1/6 min-w-fit flex-col"
        onOpenAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Custom Data</DialogTitle>
          <DialogDescription>Set custom data.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-auto flex-col"
          >
            <ScrollArea className="h-0 flex-auto">
              <div className="flex flex-col space-y-2 pr-5">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`numbers.${index}.number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center gap-2">
                            <Input
                              className="w-2/3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              type="number"
                              placeholder="number"
                              {...field}
                            />
                            <Button
                              asChild
                              variant="outline"
                              className="p-0"
                              onClick={() => insert(index + 1, { number: 0 })}
                            >
                              <Plus />
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="p-0"
                              onClick={() => fields.length > 5 && remove(index)}
                            >
                              <X />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-2">
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
