import { toast } from "sonner";
import { User } from "../../interfaces";
import axios from "../axios/keycloak";
import { jwtDecode } from "jwt-decode";

export const getRecords = async (endpoint: string) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error fetching records. Please check if the server is running. and try again."
    );
  }

  // get users from keycloak server
  try {
    console.log(
      "fetching records",
      `${domain}/${admin}/realms/${realm}/${endpoint}`,
      kcSession
    );

    const response = await axios.get(`/${admin}/realms/${realm}/${endpoint}`, {
      baseURL: domain,
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    });
    console.log("response", response.data);
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user: User) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error creating user. Please check if the Keycloak server is running. and try again."
    );
  }

  try {
    const response = await axios.post(`/${admin}/realms/${realm}/users`, user, {
      baseURL: domain,
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    });
    const data = await response.data;

    if (response.status === 201) {
      toast.success(`User ${user.username} created`);
    }
    return data;
  } catch (error: any) {
    toast.error(`Failed to create user ${user.username}`);
    throw error;
  }
};

export const deleteRecord = async (endpoint: string, id: string) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error deleting record. Please check if the Keycloak server is running. and try again."
    );
  }

  try {
    const response = await axios.delete(
      `/${admin}/realms/${realm}/${endpoint}/${id}`,
      {
        baseURL: domain,
        headers: {
          Authorization: `Bearer ${kcSession}`,
        },
      }
    );
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const updateRecord = async (
  endpoint: string,
  user: any,
  userId: string
) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error updating record. Please check if the Keycloak server is running. and try again."
    );
  }

  try {
    const response = await axios.put(
      `/${admin}/realms/${realm}/${endpoint}/${userId}`,
      user,
      {
        baseURL: domain,
        headers: {
          Authorization: `Bearer ${kcSession}`,
        },
      }
    );
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const getClient = async (clientId: string) => {
  const response = await fetch(`/api/client?clientId=${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data;
};

export const getClientDomainRealmAdminAndProtocol = async () => {
  const kcSession = getKcSession();
  const decoded = jwtDecode(kcSession) as any;

  // send a request to get the client and return it's serverUrl, /api/client?clientId=${clientId}
  try {
    const response = await getClient(decoded.client_id);
    const { data } = response;
    return {
      domain: data?.client?.serverUrl,
      realm: data?.client?.realmId,
      protocol: data?.client?.authProtocol,
      admin: data?.client?.adminUser,
    };
  } catch (error) {
    throw error;
  }
};

const getKcSession = () => {
  const cookies = document.cookie;
  return cookies
    .split(";")
    .find((cookie) => cookie.includes("kc_session"))
    ?.split("=")[1] as string;
};
