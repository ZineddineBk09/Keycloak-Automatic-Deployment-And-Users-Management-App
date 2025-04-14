"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { KeycloakUser, Realm } from "../../interfaces";
import { deleteRealm } from "../../lib/api/keycloak";
import { toast } from "sonner";
import { EditRealmDialog } from "./dialogs/edit";
import DeleteDialog from "../../app/shared/dialogs/delete";
import { timeDisplay } from "../../utils";

export const columns: ColumnDef<Realm>[] = [
  {
    accessorKey: "realm",
    header: "Realm Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "accessTokenLifespan",
    header: "Access Token Lifespan (s)",
    cell: (info) => timeDisplay(Number(info.getValue() as number)),
  },
  {
    accessorKey: "sslRequired",
    header: "SSL Required",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const realm = row.original;

      return (
        <div className="flex items-center gap-x-5">
          <EditRealmDialog realm={realm} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(realm.id);
                  toast.success("Realm ID copied to clipboard");
                }}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild={true}>
                <DeleteDialog
                  data={realm}
                  deleteRow={async () => {
                    await deleteRealm(realm.realm)
                      .then(() => toast.success("Realm deleted successfully"))
                      .catch(() => toast.error("Error deleting realm"));
                  }}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
