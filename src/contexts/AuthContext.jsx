import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Dev mode: hardcode user and token
    const devUser = { name: "Karim", role: "superadmin" };
    const devToken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1aC9sb2dpbiIsImlhdCI6MTc1NTA5NjA3OSwibmJmIjoxNzU1MDk2MDc5LCJqdGkiOiJMR1hHTElYc1pFMmo1QTdwIiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.7J1dXwsgS_yN9MqfNQQhDJT_2KZhYs_2Ox5YvoIVFM0";

    setUser(devUser);
    setToken(devToken);
  }, []);

  return (
      <AuthContext.Provider value={{ user, token, setUser, setToken }}>
        {children}
      </AuthContext.Provider>
  );
};
