import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
  userEmail: string;
  userFullName: string;
  userLoggedIn: boolean;
  userRole: string;
  setLoggedIn: (email: string, fullName: string, role: string, rememberMe: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    if (token && isLoggedIn) {
      setUserLoggedIn(true);
      setUserEmail(sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || '');
      setUserFullName(sessionStorage.getItem('userFullName') || localStorage.getItem('userFullName') || '');
      setUserRole(sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || '');
    }
  }, []);

  const logout = () => {
    setUserEmail(''); setUserFullName(''); setUserLoggedIn(false); setUserRole('');
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userRole');
  };

  const setLoggedIn = (email: string, fullName: string, role: string, rememberMe: boolean) => {
    setUserEmail(email); setUserFullName(fullName); setUserLoggedIn(true); setUserRole(role);
    sessionStorage.setItem('userLoggedIn', 'true');
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userFullName', fullName);
    sessionStorage.setItem('userRole', role);
    if (rememberMe) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userFullName', fullName);
      localStorage.setItem('userRole', role);
    }
  };

  return (
    <AuthContext.Provider value={{ userEmail, userFullName, userLoggedIn, userRole, setLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}