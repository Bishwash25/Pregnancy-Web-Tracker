import { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Set persistence to session only so user needs to login every time
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user data in localStorage for compatibility with existing code
      localStorage.setItem('user', JSON.stringify({
        name: user.displayName || 'User',
        email: user.email,
        provider: 'google',
        uid: user.uid
      }));



      return user;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Oopsie! Tap again!",

        variant: "destructive",
        duration: 1500, // 1.5 seconds
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
     ;
    } catch (error: any) {
      console.error('Sign-out error:', error);
      toast({
        title: "Sign-out failed",
        description: error.message || "Failed to sign out",
        variant: "destructive",
        duration: 1500, // 1.5 seconds
      });
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  };
}
