import { createContext, useContext, useState } from "react";
import { User } from "../interfaces";
import { useRouter } from "next/navigation";
import { createUser } from "../lib/api/keycloak";

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
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
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
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  const uploadToKeycloak = async () => {
    try {
      await Promise.all(
        users.map(async (user) => {
          await createUser(user)
            .then((data) => {
              setProgress(progress + 1);
            })
            .catch((error) => {
              console.error("Error uploading user:", error);
            });
        })
      );

      // timeout of 2 seconds to allow the progress bar to reach 100%
      setTimeout(() => {
        setUsers([]);
        router.push("/users");
      }, 2000);
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
        uploadToKeycloak,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
