import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../interfaces";
import { useRouter } from "next/navigation";
import { createUser } from "../lib/api/keycloak";
import { History } from "../interfaces/history";
import axios from "axios";
import { toast } from "sonner";

// create an interface that represents user creation, success or failure
interface UserCreation {
  user: User;
  success: boolean;
}

export const UsersContext = createContext({});

export const useUsersContext: {
  (): {
    users: User[];
    progress: number;
    fileName: string;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    uploadToKeycloak: () => void;
    deleteUser: (username: string) => void;
  };
} = () => useContext(UsersContext as React.Context<any>);

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<User[]>([] as User[]);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  const uploadToKeycloak = async () => {
    const localErrors: any[] = [];

    try {
      await Promise.all(
        users.map(async (user) => {
          await createUser(user)
            .then((data) => {
              setProgress(progress + 1);
            })
            .catch((error) => {
              console.error("Error uploading user:", error);

              localErrors.push({
                username: user.username,
                status: "failure",
                error: {
                  message: error?.response?.data.errorMessage || "",
                  code: error?.code || "",
                },
              });
            });
        })
      );

      const batch = {
        batchName: fileName,
        histories: localErrors,
      };

      const response = await axios.post("/api/history", batch).then((res) => {
        toast.info("Errors has been saved to the database, check history");
      });

      // timeout of 2 seconds to allow the progress bar to reach 100%
      setTimeout(() => {
        setUsers([]);
        router.push("/users");
      }, 5000);
    } catch (error: any) {
      console.error("Error uploading users:", error);
    }
  };

  const deleteUser = async (username: string) => {
    setUsers(users.filter((user) => user.username !== username));
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        progress,
        setUsers,
        setFileName,
        uploadToKeycloak,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
