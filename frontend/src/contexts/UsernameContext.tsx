import { createContext, PropsWithChildren, useContext, useState } from "react";

interface UsernameContext {
  username: string | null;

  login: (username: string) => void;
  logout: () => void;
}

const usernameContext = createContext<UsernameContext>({} as UsernameContext);

const UsernameProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);

  const login = async (username: string) => {
    setUsername(username);
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <usernameContext.Provider value={{ username, login, logout }}>
      {children}
    </usernameContext.Provider>
  );
};

export default UsernameProvider;

export const useUsername = () => useContext(usernameContext);
