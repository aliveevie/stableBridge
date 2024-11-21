"use client";

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("/api/tokens")
        const data = await response.json()
        setTokens(data || [])
      } catch (error) {
        console.error('Error fetching tokens:', error)
        setError('Failed to fetch tokens. Please try again later.')
      } 
    }
    fetchTokens()
  }, [])


  return (
    <UserContext.Provider value={{ userData, setUserData, tokens, setTokens }}>
      {children}
    </UserContext.Provider>
  );
};
