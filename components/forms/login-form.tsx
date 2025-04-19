"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LockIcon } from "lucide-react";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { ClientSession, FieldType } from "../../interfaces";

const formSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});

export function ClientLoginForm() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["kc_session"]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
    },
  });

  const fields: FieldType[] = [
    {
      id: "clientId",
      name: "Client ID",
      placeholder: "The public identifier for your client.",
    },
    {
      id: "clientSecret",
      name: "Client Secret",
      placeholder: "The secret key for your client.",
    },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send a post request with values to /api/client/login
    const response = await fetch("/api/client/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const { data }: { data: ClientSession } = await response.json();

      if (!data?.access_token) {
        toast.error("Failed to login: no token found");
        return;
      }

      // save session to cookie
      setCookie("kc_session", data?.access_token, {
        path: "/",
        maxAge: data?.expires_in,
      });

      toast.success("Successfully logged in");
      router.push('/users')
    } else {
      const { data } = await response.json();
      const msg =
        typeof data === "string" ? data : data?.message || "Client login failed";
      toast.error("Failed to login: " + msg);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <LockIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">Login with Client Credentials</CardTitle>
        <CardDescription className="text-center">Enter your client credentials to access your account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {fields.map(({ id, name, placeholder }: FieldType) => (
              <FormField
                key={id}
                control={form.control}
                //@ts-ignore
                name={id}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{name}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={placeholder}
                        type={id === 'clientSecret' ? 'password' : 'text'}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
