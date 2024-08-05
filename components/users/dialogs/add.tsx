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
import { Label } from "../../ui/label";
import { useState } from "react";
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
import { FieldType, User } from "../../../interfaces";
import { Switch } from "../../ui/switch";
import {
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../../ui/multi-select";

const formSchema = z.object({
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  enabled: z.boolean(),
  credentials: z.array(z.object({})),
  groups: z.array(z.string()),
  requiredActions: z.array(z.string()),
});

function AddDialog() {
  const { fetchUsers, page } = useUsersContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      emailVerified: false,
      enabled: false,
      credentials: [],
      groups: [],
    },
  });
 

  const onSubmit = async () => {
    await createUser(form.getValues() as User)
      .then(() => {
        toast.success("User updated successfully");
        fetchUsers(1);
      })
      .catch((error) => {
        toast.error("Error updating user");
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
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add a new user to the Keycloak server.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5"
          >
            {/* {fields.map(({ id, name, options, type }: FieldType) => (
              <FormField
                key={id}
                control={form.control}
                // @ts-ignore
                name={id}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{name}</FormLabel>
                    <FormControl>
                    {type === "switch" ? (
                        <Switch {...field} />
                      ) : type === "select" ? (
                        <MultiSelector
                          values={value}
                          onValuesChange={setValue}
                          loop={false}
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select your framework" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {options.map((option, i) => (
                                <MultiSelectorItem key={i} value={option.value}>
                                  {option.label}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      ) : (
                        <Input placeholder={name} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))} */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription>should be unique</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailVerified"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Verified</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enabled</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credentials</FormLabel>
                  <FormControl>
                    <Input placeholder="Credentials" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groups</FormLabel>
                  <FormControl>
                    <MultiSelectorInput
                      placeholder="Select group"
                      name={field.name}
                      value={field.value}
                      onSelect={(value) => {
                        field.onChange([...field.value, value]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requiredActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Actions</FormLabel>
                  <FormControl>
                    <MultiSelectorInput
                      placeholder="Select required actions"
                      name={field.name}
                      value={field.value}
                      onSelect={(value) => {
                        field.onChange([...field.value, value]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <DialogFooter className="">
          <DialogClose>
            <Button variant="outline" id="close">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDialog;
