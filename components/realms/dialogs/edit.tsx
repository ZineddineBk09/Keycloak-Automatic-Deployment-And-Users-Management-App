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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Realm } from "../../../interfaces";
import { useRealmsContext } from "../../../context/realms";

const formSchemaRealm = z.object({
  realm: z.string().min(1, "Realm name is required"),
  enabled: z.boolean(),
  accessTokenLifespan: z.number().min(1, "Must be greater than 0"),
  sslRequired: z.enum(["none", "external", "all"], {
    errorMap: () => ({ message: "SSL required is required" }),
  }),
});

export function EditRealmDialog({ realm }: { realm: Realm }) {
  const { updateRealm, fetchRealms } = useRealmsContext();
  const form = useForm<z.infer<typeof formSchemaRealm>>({
    resolver: zodResolver(formSchemaRealm),
    defaultValues: {
      realm: realm.realm,
      enabled: realm.enabled,
      accessTokenLifespan: realm.accessTokenLifespan,
      sslRequired: realm.sslRequired,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchemaRealm>) => {
    await updateRealm(realm.id, data)
      .then(() => {
        toast.success("Realm updated successfully");
        fetchRealms(); // Refresh realms list
      })
      .catch((error: any) => {
        toast.error("Error updating realm");
        console.error(error);
      })
      .finally(() => {
        document.getElementById("close")?.click();
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Realm</DialogTitle>
          <DialogDescription>
            Update the details of the selected realm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="realm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Realm Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Realm Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessTokenLifespan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Token Lifespan (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Access Token Lifespan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sslRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      SSL Required
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-muted-foreground">?</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Is HTTPS required? 'None' means HTTPS is not
                            required for any client IP address. 'External
                            requests' means localhost and private IP addresses
                            can access without HTTPS. 'All requests' means HTTPS
                            is required for all IP addresses.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSL Requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

