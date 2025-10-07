import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('fasalsaathi_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('fasalsaathi_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check against registered users
    const users = JSON.parse(localStorage.getItem('fasalsaathi_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('fasalsaathi_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('fasalsaathi_users') || '[]');
    
    // Check if user already exists
    if (users.some((u: any) => u.email === data.email)) {
      return false;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      location: data.location,
    };

    users.push(newUser);
    localStorage.setItem('fasalsaathi_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('fasalsaathi_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fasalsaathi_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('fasalsaathi_user', JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('fasalsaathi_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('fasalsaathi_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
