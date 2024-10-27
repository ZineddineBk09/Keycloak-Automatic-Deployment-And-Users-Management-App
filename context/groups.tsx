import { createContext, useContext, useEffect, useState } from "react";
import { KeycloakGroup, KeycloakUser } from "../interfaces";
import { toast } from "sonner";
import { getRecords, deleteRecord } from "../lib/api/keycloak";
import { useCookies } from "react-cookie";

export const GroupsContext = createContext({});

export const useGroupsContext: {
  (): {
    groups: KeycloakGroup[];
    loading: boolean;
    setGroups: React.Dispatch<React.SetStateAction<KeycloakUser[]>>;
    fetchGroups: () => Promise<void>;
    deleteGroups: (ids: string[]) => Promise<void>;
  };
} = () => useContext(GroupsContext as React.Context<any>);

export const GroupsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [groups, setGroups] = useState<KeycloakUser[]>([] as KeycloakUser[]);
  const [cookies, setCookie, removeCookie] = useCookies(["kc_session"]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGroups = async () => {
    // call the create user API
    try {
      setLoading(true);
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch groups. Please login and try again."
        );
      }

      const response = await getRecords("groups");
      setGroups(response);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroups = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session)
        throw new Error(
          "You need to login first to delete groups. Please login and try again."
        );

      await Promise.all(ids.map((id) => deleteRecord("groups", id)));
      await fetchGroups();
    } catch (error: any) {
      console.error("Error deleting groups:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!cookies?.kc_session) return;
    fetchGroups()
      .then(() => {
        toast.success("Groups fetched");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [cookies?.kc_session]);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        loading,
        setGroups,
        fetchGroups,
        deleteGroups,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
