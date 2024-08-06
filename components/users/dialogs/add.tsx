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
import { Switch } from "../../ui/switch";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

const formSchema = z.object({
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  enabled: z.boolean(),
  password: z.string().min(1),
  groups: z.array(z.string()),
  requiredActions: z.array(z.string()),
});

function AddDialog() {
  const requiredActions = [
    "VERIFY_EMAIL",
    "UPDATE_PROFILE",
    "CONFIGURE_TOTP",
    "CONFIGURE_RECOVERY_AUTHN_CODES",
    "UPDATE_PASSWORD",
    "TERMS_AND_CONDITIONS",
    "VERIFY_PROFILE",
    "UPDATE_EMAIL",
  ];

  const { groups, fetchUsers, fetchGroups, page } = useUsersContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      emailVerified: false,
      enabled: false,
      password: "",
      groups: [],
      requiredActions: [],
    },
  });

  const onSubmit = async () => {
    // get all fields except password
    const { password, ...fields } = form.getValues();

    await createUser({
      ...fields,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    })
      .then(() => {
        toast.success("User created successfully");
        fetchUsers(1);
      })
      .catch((error) => {
        toast.error("Error creating user");
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
                <FormItem className="flex items-center gap-x-4">
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
                <FormItem className="flex items-center gap-x-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
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
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-start"
                        >
                          Select Groups
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 max-h-96 overflow-y-auto">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Groups</h4>
                            <p className="text-sm text-muted-foreground">
                              Groups to assign the user to.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {groups.map((group, i) => (
                              <div className="w-full flex justify-between items-center gap-4">
                                <Label htmlFor={group.name}>{group.name}</Label>
                                <Switch
                                  id={group.name}
                                  checked={field.value.includes(group.name)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...field.value,
                                        group.name,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (a) => a !== group.name
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-start"
                        >
                          Select Required Actions
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Actions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Actions for the user to perform on login.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {requiredActions.map((action, i) => (
                              <div className="w-full flex justify-between items-center gap-4">
                                <Label htmlFor={action}>{action}</Label>
                                <Switch
                                  id={action}
                                  checked={field.value.includes(action)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, action]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((a) => a !== action)
                                      );
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
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
          {/* <DialogClose>
            <Button variant="outline" id="close">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit}>
            Save changes
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDialog;
