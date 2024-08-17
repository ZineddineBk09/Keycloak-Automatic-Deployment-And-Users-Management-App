"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeycloakUser } from "../../../interfaces";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { useUsersContext } from "../../../context/users";
import { getRecord, updateRecord } from "../../../lib/api/keycloak";
import { useCookies } from "react-cookie";

export default function UserPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const userId = params.userId;
  const [cookies] = useCookies(["kc_session"]);
  const { fetchUsers,fetchUser } = useUsersContext();
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [fields, setFields] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (userId) {
      fetchUser(userId as string)
        .then((userData) => {
          setUser(userData);
          setFields({
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          });
        })
        .catch((error) => {
          toast.error("Error fetching user details");
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleUpdate = async () => {
    await updateRecord("users", fields, userId as string)
      .then(() => {
        toast.success("User updated successfully");
        fetchUsers(1);
        router.push("/users");
      })
      .catch((error) => {
        toast.error("Error updating user");
        console.error(error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-10">Edit User</h1>
      <div className="grid gap-4 py-4">
        {["username", "firstName", "lastName", "email"].map((field) => {
          return (
            <div className="grid grid-cols-4 items-center gap-4" key={field}>
              <Label htmlFor={field} className="text-right">
                {field.charAt(0).toUpperCase() +
                  field
                    .slice(1)
                    .split(/(?=[A-Z])/)
                    .join(" ")}
              </Label>
              <Input
                id={field}
                value={fields[field as keyof typeof fields]}
                onChange={
                  // disable onchange for username
                  field === "username"
                    ? () => {}
                    : (event) => {
                        setFields((prev) => ({
                          ...prev,
                          [field]: event.target.value,
                        }));
                      }
                }
                disabled={field === "username"}
                className="col-span-3"
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Close
        </Button>
        <Button type="submit" onClick={handleUpdate}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
