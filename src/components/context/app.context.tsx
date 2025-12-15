import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "@/services/api";

export interface IFetchUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  user: IFetchUser | null;
  setUser: (v: IFetchUser | null) => void;
  isLoading: boolean;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IFetchUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        // 🔐 gọi getMe
        const res = await getMe();
        const account: IFetchUser | undefined = res?.data?.data;

        if (!account) {
          throw new Error("No user data");
        }

        // ❗ Chỉ cho ADMIN vào admin panel
        const isAdmin = account.roles?.includes("ADMIN");
        if (!isAdmin) {
          throw new Error("Not admin");
        }

        setUser(account);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </CurrentAppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const ctx = useContext(CurrentAppContext);

  if (!ctx) {
    throw new Error("useCurrentApp must be used within <AppProvider>");
  }

  return ctx;
};
