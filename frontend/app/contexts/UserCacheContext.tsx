import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuthContext, User } from "./AuthContext";

interface UserCacheContextType {
  resetUserCache: () => void;
}

const UserCacheContext = createContext<UserCacheContextType | undefined>(
  undefined
);

export function UserCacheProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuthContext();
  const cacheKey = "user";

  const updateUserCache = useCallback(
    (user: User | null) => {
      if (user) {
        localStorage.setItem(cacheKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(cacheKey);
      }
    },
    [cacheKey]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem(cacheKey);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          updateUserCache(null);
        }
      }
    }
  }, [setUser, updateUserCache]);

  useEffect(() => {
    updateUserCache(user);
  }, [user, updateUserCache]);

  const resetUserCache = useCallback(() => {
    updateUserCache(null);
    setUser(null);
  }, [updateUserCache, setUser]);

  return (
    <UserCacheContext.Provider value={{ resetUserCache }}>
      {children}
    </UserCacheContext.Provider>
  );
}

export function useUserCache() {
  const context = useContext(UserCacheContext);
  if (context === undefined) {
    throw new Error("useUserCache must be used within a UserCacheProvider");
  }
  return context;
}
