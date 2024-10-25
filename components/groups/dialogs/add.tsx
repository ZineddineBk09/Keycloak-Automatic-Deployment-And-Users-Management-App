"use client";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useGroupsContext } from "../../../context/groups";
import { createGroup } from "../../../lib/api/keycloak";

const formSchema = z.object({
  name: z.string().min(1),
});

function AddDialog() {
  const { groups, fetchGroups } = useGroupsContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async () => {
    // get all fields except password
    const { ...fields } = form.getValues();

    await createGroup({
      ...fields,
    })
      .then(() => {
        toast.success("Group created successfully");
        fetchGroups();
      })
      .catch((error) => {
        toast.error("Error creating group");
        console.error(error);
      })
      .finally(() => {
        // close the dialog
        document.getElementById("close")?.click();
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-auto">
          <PlusIcon />
          Add Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>
            Add a new group to the Keycloak server.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group Name" {...field} />
                  </FormControl>
                  <FormDescription>should be unique</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="col-span-2" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <DialogFooter className="">
          <DialogClose className="hidden">
            <Button variant="outline" id="close">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDialog;
