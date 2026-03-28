import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [roadmap, setRoadmap] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});

  function toggleStep(stepId) {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  }

  return (
    <AppContext.Provider value={{ user, setUser, profile, setProfile, roadmap, setRoadmap, completedSteps, toggleStep }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
