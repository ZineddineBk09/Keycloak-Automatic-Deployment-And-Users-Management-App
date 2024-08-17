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
    const response = await axios.get(`/${admin}/realms/${realm}/${endpoint}`, {
      baseURL: domain,
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRecord = async (endpoint: string, id: string) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error fetching record. Please check if the server is running. and try again."
    );
  }

  try {
    const response = await axios.get(
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
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user: User | any) => {
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

    // if (response.status === 201) {
    // toast.success(`User ${user.username} created`);
    // }
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

// return users count : http://127.0.0.1:8080/admin/realms/master/users/count
// response will be a number: 100
export const getUsersCount = async () => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error fetching users count. Please check if the server is running. and try again."
    );
  }

  try {
    const response = await axios.get(`/${admin}/realms/${realm}/users/count`, {
      baseURL: domain,
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

// Reset password a user password
// first the admin needs to have role "admin" to be able to reset password
// ex: decoded token
/**
 * .....
 * "realm_access": {
    "roles": [
      "create-realm",
      "default-roles-master",
      "offline_access",
      "admin", // this is the role we need to check for
      "uma_authorization"
    ]
  },
  .....
 */
// we need to check for "admin" role first (decoded the access token) before we can reset password
// if role present, we can reset password with a put request to the user endpoint
// ex endpoint: http://10.0.0.95/admin/realms/master/users/7d8e81a7-551a-4085-b101-21ce4c8dbb9e/reset-password
// ex body: { "type": "password", "temporary": false, "value": "password" }
export const resetUserPassword = async (userId: string, password: string) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error resetting password. Please check if the server is running. and try again."
    );
  }

  // check if the user has the "admin" role
  const decoded = jwtDecode(kcSession) as any;
  const roles = decoded.realm_access.roles;
  if (!roles.includes("admin")) {
    console.log(
      "You need to have the admin role to reset a user's password. Please contact your administrator.",
      roles
    );
    throw new Error(
      "You need to have the admin role to reset a user's password. Please contact your administrator."
    );
  }

  try {
    const response = await axios.put(
      `/${admin}/realms/${realm}/users/${userId}/reset-password`,
      {
        type: "password",
        temporary: false,
        value: password,
      },
      {
        baseURL: domain,
        headers: {
          Authorization: `Bearer ${kcSession}`,
        },
      }
    );
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
