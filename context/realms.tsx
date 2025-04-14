import { createContext, useContext, useState, useEffect } from "react";
import { Realm } from "../interfaces";
import {
  getRealms,
  createRealm,
  updateRealm,
  deleteRealm,
} from "../lib/api/keycloak";
import { toast } from "sonner";

export const RealmsContext = createContext({});

export const useRealmsContext = () =>
  useContext(RealmsContext as React.Context<any>);

export const RealmsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRealms = async () => {
    try {
      setLoading(true);
      const data = await getRealms();
      setRealms(data);
    } catch (error) {
      toast.error("Error fetching realms");
    } finally {
      setLoading(false);
    }
  };

  const addRealm = async (realm: Realm) => {
    try {
      await createRealm(realm);
      toast.success("Realm created successfully");
      fetchRealms();
    } catch (error) {
      toast.error("Error creating realm");
    }
  };

  const editRealm = async (realmName: string, realm: Realm) => {
    try {
      await updateRealm(realmName, realm);
      toast.success("Realm updated successfully");
      fetchRealms();
    } catch (error) {
      toast.error("Error updating realm");
    }
  };

  const removeRealm = async (realmName: string) => {
    try {
      await deleteRealm(realmName);
      toast.success("Realm deleted successfully");
      fetchRealms();
    } catch (error) {
      toast.error("Error deleting realm");
    }
  };

  useEffect(() => {
    fetchRealms();
  }, []);

  return (
    <RealmsContext.Provider
      value={{ realms, loading, fetchRealms, addRealm, editRealm, removeRealm }}
    >
      {children}
    </RealmsContext.Provider>
  );
};
