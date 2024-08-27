import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { getRecords, deleteRecord } from "../lib/api/keycloak";
import { useCookies } from "react-cookie";
import { Batch } from "../interfaces/history";
import axios from "axios";

export const HistoryContext = createContext({});

export const useHistoryContext: {
  (): {
    batches: Batch[];
    setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
    fetchBatches: () => Promise<void>;
    deleteBatches: (ids: string[]) => Promise<void>;
  };
} = () => useContext(HistoryContext as React.Context<any>);

export const HistoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [batches, setBatches] = useState<Batch[]>([] as Batch[]);
  const [cookies, setCookie, removeCookie] = useCookies(["kc_session"]);

  const fetchBatches = async () => {
    // call the create user API
    try {
      if (!cookies?.kc_session) {
        throw new Error(
          "You need to login first to fetch batches. Please login and try again."
        );
      }
      // api/history
      const response = await axios.get<{ data: { batches: Batch[] } }>(
        "/api/history"
      );
      console.log(response.data.data);
      setBatches(response.data.data.batches);
    } catch (error: any) {
      console.error("Error fetching batches:", error);
      throw error;
    }
  };

  const deleteBatches = async (ids: string[]) => {
    try {
      if (!cookies?.kc_session)
        throw new Error(
          "You need to login first to delete batches. Please login and try again."
        );

      await Promise.all(ids.map((id) => deleteRecord("batches", id)));
      await fetchBatches();
    } catch (error: any) {
      console.error("Error deleting batches:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!cookies?.kc_session) return;
    fetchBatches()
      .then(() => {
        toast.success("Batches fetched successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [cookies?.kc_session]);

  return (
    <HistoryContext.Provider
      value={{
        batches,
        setBatches,
        fetchBatches,
        deleteBatches,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
