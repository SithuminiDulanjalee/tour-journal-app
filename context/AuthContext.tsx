import { useLoader } from '@/hooks/useLoader';
import { auth } from '@/service/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showLoader, hideLoader } = useLoader();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    showLoader();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setInitializing(false);
      hideLoader();
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: initializing }}>
      {children}
    </AuthContext.Provider>
  );
};