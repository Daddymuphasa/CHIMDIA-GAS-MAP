"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    username: string;
    email: string;
    roles: string[];
    token: string;
  } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'gasgrid';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'gasgrid-frontend';

    const kc = new Keycloak({
      url: keycloakUrl,
      realm: realm,
      clientId: clientId,
    });

    kc.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
    })
      .then((authenticated) => {
        setKeycloak(kc);
        setIsAuthenticated(authenticated);
        setIsLoading(false);

        if (authenticated) {
          setUser({
            username: kc.tokenParsed?.preferred_username || '',
            email: kc.tokenParsed?.email || '',
            roles: kc.realmAccess?.roles || [],
            token: kc.token || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to initialize Keycloak', err);
        setIsLoading(false);
      });
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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
