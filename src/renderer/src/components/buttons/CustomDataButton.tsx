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
        className="flex h-3/6 min-h-64 w-96 flex-col"
        onCloseAutoFocus={() => form.reset()}
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
              <div className="flex flex-col space-y-2 p-1 pr-5">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`numbers.${index}.number`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex min-h-10 items-center justify-between gap-2">
                          <div className="flex items-end gap-2">
                            <p className="w-8">{index + 1}.</p>
                            <FormControl>
                              <Input
                                className="w-16 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                type="number"
                                placeholder="number"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                          <div className="flex justify-center gap-2">
                            <Button
                              asChild
                              variant="outline"
                              className="p-0"
                              onClick={() =>
                                insert(index + 1, {
                                  number: Math.floor(Math.random() * 51 + 1),
                                })
                              }
                            >
                              <Plus />
                            </Button>
                            {fields.length > 1 && (
                              <Button
                                asChild
                                variant="outline"
                                className="p-0"
                                onClick={() =>
                                  fields.length > 1 && remove(index)
                                }
                              >
                                <X />
                              </Button>
                            )}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-2 sm:justify-between">
              <FormField
                control={form.control}
                name={`numbers`}
                render={() => (
                  <FormItem>
                    {(fields.length < 5 || fields.length > 100) && (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" variant="outline">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
