import { createContext, useContext, useState } from 'react';

const JellyContext = createContext(null);

export function JellyProvider({ children }) {
  const [jellyMode, setJellyMode] = useState(false);
  const [score, setScore] = useState(0);

  const activate = () => { setJellyMode(true); setScore(0); };
  const deactivate = () => { setJellyMode(false); setScore(0); };
  const addScore = (pts) => setScore(s => s + pts);

  return (
    <JellyContext.Provider value={{ jellyMode, score, activate, deactivate, addScore }}>
      {children}
    </JellyContext.Provider>
  );
}

export const useJelly = () => useContext(JellyContext);
