import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface User {
  name: string;
  email: string;
  uid?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          uid: firebaseUser.uid,
          provider: 'google'
        };
        setUser(userData);
        setIsAuthenticated(true);
        // Store in localStorage for compatibility with existing code
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
      // Add a delay before hiding the loading spinner
      setTimeout(() => {
        setLoading(false);
      }, 500); // 0.5 seconds delay
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    // The actual logout is handled by the Firebase auth hook
    // This is just for compatibility with existing code
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth; 