import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u) => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }

    if (users.find((u) => u.username === userData.username)) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));

      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { success: true };
    }

    return { success: false, error: 'User not found' };
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
