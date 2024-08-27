"use client";

import Link from "next/link";
import { cn } from "../../lib/utils";
import { ThemeSwitch } from "../theme-switch";
import { useCookies } from "react-cookie";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { publicRoutes } from "../../routes";

interface NavLink {
  href: string;
  label: string;
  // condition to render the link
  condition?: boolean;
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const path = usePathname();
  const [cookies, setCookie, removeCookie] = useCookies(["kc_session"]);
  const links: NavLink[] = [
    {
      href: "/users",
      label: "Users",
      condition: cookies?.kc_session,
    },
    {
      href: "/clients",
      label: "Clients",
      condition: cookies?.kc_session,
    },
    {
      href: "/upload",
      label: "Upload",
      condition: cookies?.kc_session,
    },
    {
      href: "/register",
      label: "Register",
      condition: !cookies?.kc_session && path !== "/register",
    },
    {
      href: "/",
      label: "Login",
      condition: !cookies?.kc_session && path !== "/",
    },
    {
      href: "/settings",
      label: "Settings",
      condition: cookies?.kc_session,
    },
    {
      href: "/history",
      label: "History",
      condition: cookies?.kc_session,
    },
  ];

  return (
    <div className="flex h-16 items-center px-4 border-b relative lg:px-16">
      <ThemeSwitch />

      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {links.map(({ href, label, condition }) => {
          if (condition) {
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-2 rounded ${
                  path === href
                    ? "text-primary font-extrabold bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                {label}
              </Link>
            );
          }
        })}
      </nav>

      <div className="absolute right-4">
        {cookies?.kc_session ? <SignOut /> : null}
      </div>
    </div>
  );
}

const SignOut = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["kc_session"]);
  const router = useRouter();

  const signOut = () => {
    removeCookie("kc_session");
    router.push("/");
  };

  return (
    <button
      onClick={signOut}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-2 rounded mr-16"
    >
      Sign Out
    </button>
  );
};
