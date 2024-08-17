import { createContext, useContext, useEffect, useState } from "react";
import { KeycloakUser } from "../interfaces";
import { toast } from "sonner";
import {
  getRecords,
  getRecord,
  deleteRecord,
  getUsersCount,
} from "../lib/api/keycloak";
import { useCookies } from "react-cookie";
import { KeycloakGroup } from "../interfaces/keycloak";

export const UsersContext = createContext({});

export const useUsersContext: {
  (): {
    users: KeycloakUser[];
    groups: KeycloakGroup[];
    page: number;
    pageSize: number;
    totalRecords: number;
    setUsers: React.Dispatch<React.SetStateAction<KeycloakUser[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    fetchUsers: (currentPage: number) => Promise<void>;
    fetchUser: (id: string) => Promise<KeycloakUser>;
    fetchGroups: () => Promise<void>;
    deleteUsers: (ids: string[]) => Promise<void>;
    nextPage: () => Promise<void>;
    prevPage: () => Promise<void>;
  };
} = () => useContext(UsersContext as React.Context<any>);

export const UsersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<KeycloakUser[]>([] as KeycloakUser[]);
  const [groups, setGroups] = useState<KeycloakGroup[]>([] as KeycloakGroup[]);
  const [cookies] = useCookies(["kc_session"]);
  // implement pagination for users, since keycloak can have 100000 users or more
  // here's an example of a URL with params to control number of records returned + where to start from
  // http://127.0.0.1:8080/admin/realms/master/users?first=99&max=200
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchUsers = async (currentPage: number) => {
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch users. Please login and try again."
        );
      }
      const first = currentPage * pageSize - pageSize;

      const response = await getRecords(`users?first=${first}&max=${pageSize}`);
      console.log(response);
      if (currentPage === 1) {
        setUsers(response);
        return;
      } else {
        setUsers((prevUsers) => {
          const newUsers = response.filter(
            (newUser: KeycloakUser) =>
              !prevUsers.some((user) => user.id === newUser.id)
          );

          if (newUsers.length === 0) return prevUsers;

          return [...prevUsers, ...newUsers];
        });
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const fetchUser = async (id: string) => {
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch users. Please login and try again."
        );
      }
      console.log("fetching user with id:", id);
      const response = await getRecord("users", id);
      return response;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const fetchUsersCount = async () => {
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch users. Please login and try again."
        );
      }
      const response = await getUsersCount();
      setTotalRecords(response);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const fetchGroups = async () => {
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch groups. Please login and try again."
        );
      }
      const response = await getRecords("groups");
      setGroups((prevGroups) => {
        const newGroups = response.filter(
          (newUser: KeycloakGroup) =>
            !prevGroups.some((group) => group.id === newUser.id)
        );

        if (newGroups.length === 0) return prevGroups;

        return [...prevGroups, ...newGroups];
      });
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  };

  const nextPage = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchUsers(nextPage);
  };

  const prevPage = async () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      await fetchUsers(prevPage);
    }
  };

  const deleteUsers = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to delete users. Please login and try again."
        );
      }

      await Promise.all(ids.map((id) => deleteRecord("users", id)));
      setPage(1); // Reset to first page
      setUsers([]); // Clear existing users
      await fetchUsers(1); // Fetch first page of users
    } catch (error: any) {
      console.error("Error deleting users:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!cookies?.kc_session) return;
    fetchUsers(page)
      .then(() => {
        // toast.success('Users fetched');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [cookies?.kc_session, page, pageSize]);

  useEffect(() => {
    if (!cookies?.kc_session) return;
    // fetch users
    fetchUsersCount()
      .then(() => {
        // toast.success('Total users count fetched');
      })
      .catch((error) => {
        toast.error(error.message);
      });

    // fetch groups
    fetchGroups()
      .then(() => {
        // toast.success('Groups fetched');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [cookies?.kc_session, users]);

  return (
    <UsersContext.Provider
      value={{
        users,
        groups,
        page,
        pageSize,
        totalRecords,
        setUsers,
        setPage,
        setPageSize,
        fetchUsers,
        fetchUser,
        fetchGroups,
        deleteUsers,
        nextPage,
        prevPage,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
