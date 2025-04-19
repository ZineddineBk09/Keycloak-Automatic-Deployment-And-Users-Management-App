"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyIcon } from "lucide-react";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { ClientSession } from "../../interfaces";

const formSchema = z.object({
  clientId: z
    .string({
      required_error: "Please enter a client ID",
    })
    .min(1),
  clientSecret: z
    .string({
      required_error: "Please enter a client secret",
    })
    .min(1),
  realmId: z
    .string({
      required_error: "Please enter a realm ID",
    })
    .min(1),
  authProtocol: z
    .string({
      required_error: "Please enter an authentication protocol",
    })
    .min(1),
  adminUser: z
    .string({
      required_error: "Please enter an admin user",
    })
    .min(1),
  serverUrl: z
    .string({
      required_error: "Please enter a server URL",
    })
    .min(1),
});

interface FieldType {
  id: string;
  name: string;
  placeholder: string;
  type: "input" | "select";
  options: { value: string; label: string; disabled?: boolean }[];
}

export function ClientRegisterForm() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["kc_session"]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      realmId: "master",
      authProtocol: "openid-connect",
      adminUser: "admin",
      serverUrl: "https://auth.ahscen.cloud.cerist.dz",
    },
  });

  const fields: FieldType[] = [
    {
      id: "clientId",
      name: "Client ID",
      type: "input",
      options: [],
      placeholder: "The public identifier for your client.",
    },
    {
      id: "clientSecret",
      name: "Client Secret",
      type: "input",
      options: [],
      placeholder: "The secret key for your client.",
    },
    {
      id: "realmId",
      name: "Realm",
      type: "input",
      options: [],
      placeholder: "The realm identifier.",
    },
    {
      id: "authProtocol",
      name: "Authentication Protocol",
      type: "select",
      options: [
        { value: "openid-connect", label: "OpenID Connect" },
        { value: "saml", label: "SAML", disabled: true },
      ],
      placeholder:
        "The authentication protocol. e.g. openid-connect, saml, etc.",
    },
    {
      id: "adminUser",
      name: "Admin User",
      type: "input",
      options: [],
      placeholder: "The admin user. e.g. admin, root, etc.",
    },
    {
      id: "serverUrl",
      name: "Server URL",
      type: "input",
      options: [],
      placeholder: "The IA server URL.",
    },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send a post request with values to /api/client/register
    const response = await fetch("/api/client/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        // trim serverUrl to remove trailing slash if any
        serverUrl: values?.serverUrl.replace(/\/$/, ""),
      }),
    });

    if (response.ok) {
      const { data }: { data: ClientSession } = await response.json();

      if (!data?.access_token) {
        toast.error("Failed to register: access_token not found");
        return;
      }

      // save session to cookie
      setCookie("kc_session", data?.access_token, {
        path: "/",
        maxAge: data?.expires_in,
      });

      toast.success("Successfully registered and logged in");
      router.push("/users");
    } else {
      const { data } = await response.json();
      const msg =
        typeof data === "string" ? data : data?.message || "Unknown error";
      toast.error("Failed to register: " + msg);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <KeyIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">
          Register New Client
        </CardTitle>
        <CardDescription className="text-center">
          Create a new client with the required credentials
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {fields.map(
              ({ id, name, placeholder, type, options }: FieldType) => (
                <FormField
                  key={id}
                  control={form.control}
                  //@ts-ignore
                  name={id}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{name}</FormLabel>
                      <FormControl>
                        {type === "input" ? (
                          <Input
                            placeholder={placeholder}
                            type={id === "clientSecret" ? "password" : "text"}
                            {...field}
                          />
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map(({ value, label, disabled }) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  disabled={disabled}
                                >
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Register Client
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
