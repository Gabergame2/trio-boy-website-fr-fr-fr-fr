import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

/**
 * Simplified AuthProvider — no Base44 dependency.
 * Provides a no-op auth context so components using useAuth() don't throw.
 */
export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authError: null,
        authChecked: true,
        appPublicSettings: null,
        logout: () => {},
        navigateToLogin: () => {},
        checkUserAuth: async () => {},
        checkAppState: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
