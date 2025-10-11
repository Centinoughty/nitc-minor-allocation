import { AuthProvider, HttpError } from "react-admin";
import { BASE_URL } from "./constants";
import axios from "axios";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {

    try {
      const resp = await axios.post(`${BASE_URL}/auth/admin-login`, {
        username: username,
        password: password
      })

      const data = resp.data;

      console.log("Data",data);

      if(data.success){
        localStorage.setItem("accessToken", data.token);   
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        return Promise.resolve();
      }

      return Promise.reject(
        new HttpError("Unauthorized", 401, {
          message: "Invalid username or password",
        }),
      );
    } catch (e) {
      console.log("Errorrr",e)
    }
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("accessToken") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("accessToken");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
