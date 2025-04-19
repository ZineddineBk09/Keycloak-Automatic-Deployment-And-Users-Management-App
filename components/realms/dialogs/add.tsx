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
import { createUser } from "../../../lib/api/keycloak";
import { toast } from "sonner";
import { useUsersContext } from "../../../context/users";
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
import { useRealmsContext } from "../../../context/realms";
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

const formSchemaRealm = z.object({
  realm: z.string().min(1, "Realm name is required"),
  enabled: z.boolean(),
  accessTokenLifespan: z.number().min(1, "Must be greater than 0"),
  sslRequired: z.enum(["none", "external", "all"], {
    errorMap: () => ({ message: "SSL required is required" }),
  }),
});

export function AddRealmDialog() {
  const { addRealm, fetchRealms } = useRealmsContext();
  const form = useForm<z.infer<typeof formSchemaRealm>>({
    resolver: zodResolver(formSchemaRealm),
    defaultValues: {
      realm: "",
      enabled: true,
      accessTokenLifespan: 300,
      sslRequired: "external",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchemaRealm>) => {
    await addRealm(data)
      .then(() => {
        toast.success("Realm created successfully");
        fetchRealms(1); // Refresh realms list
      })
      .catch((error: any) => {
        toast.error("Error creating realm");
        console.error(error);
      })
      .finally(() => {
        document.getElementById("close")?.click();
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon className="mr-2" />
          Add Realm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Realm</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new realm.
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
                            Is HTTPS required? &apos;None&apos; means HTTPS is
                            not required for any client IP address.
                            &apos;External requests&apos; means localhost and
                            private IP addresses can access without HTTPS.
                            &apos;All requests&apos; means HTTPS is required for
                            all IP addresses.
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
              Submit
            </Button>
          </form>
        </Form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
