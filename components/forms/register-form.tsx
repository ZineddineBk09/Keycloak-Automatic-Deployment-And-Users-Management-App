"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
      serverUrl: "https://keycloak.example.com:8080",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {fields.map(({ id, name, placeholder, type, options }: FieldType) => (
          <FormField
            key={id}
            control={form.control}
            // @ts-ignore
            name={id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                {type === "input" ? (
                  <FormControl>
                    <Input placeholder={name} {...field} />
                  </FormControl>
                ) : (
                  <Select>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map(({ value, label, ...option }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          disabled={option.disabled || false}
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormDescription>{placeholder}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
