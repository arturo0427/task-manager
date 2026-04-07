import { useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../services/api/auth.service.js";
import { getCurrentUserRequest } from "../services/api/user.service.js";
import { extractErrorMessage } from "../utils/api.js";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/auth-storage.js";
import { AuthContext } from "./auth-context.js";

const initialToken = getStoredToken();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      if (!initialToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const { data } = await getCurrentUserRequest();

        if (!isMounted) {
          return;
        }

        setUser(data);
      } catch {
        clearStoredToken();

        if (!isMounted) {
          return;
        }

        setToken("");
        setUser(null);
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function authenticate(request, payload, fallbackMessage) {
    setIsSubmitting(true);

    try {
      const { data } = await request(payload);

      setStoredToken(data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);

      return { ok: true };
    } catch (error) {
      clearStoredToken();
      setToken("");
      setUser(null);

      return {
        ok: false,
        message: extractErrorMessage(error, fallbackMessage),
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function login(credentials) {
    return authenticate(
      loginRequest,
      credentials,
      "No se pudo iniciar sesion.",
    );
  }

  async function register(payload) {
    return authenticate(
      registerRequest,
      payload,
      "No se pudo crear la cuenta.",
    );
  }

  function logout() {
    clearStoredToken();
    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isBootstrapping,
        isSubmitting,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
