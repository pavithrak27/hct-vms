import React, { createContext, useContext, useState, useEffect } from 'react';

const CampusContext = createContext();

const DEFAULT_CAMPUSES = [
  'Abu Dhabi Men\'s', 'Abu Dhabi Women\'s', 'Al Ain Men\'s', 'Al Ain Women\'s',
  'Dubai Men\'s', 'Dubai Women\'s', 'Fujairah Men\'s', 'Fujairah Women\'s',
  'Ras Al Khaimah Men\'s', 'Ras Al Khaimah Women\'s', 'Sharjah Men\'s', 'Sharjah Women\'s',
  'Ruwais Men\'s', 'Ruwais Women\'s'
];

export const useCampus = () => useContext(CampusContext);

export const CampusProvider = ({ children }) => {
  const [campuses, setCampuses] = useState(() => {
    const saved = localStorage.getItem('hct-campuses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CAMPUSES;
      }
    }
    return DEFAULT_CAMPUSES;
  });

  const [selectedCampus, setSelectedCampus] = useState(campuses[4]); // Default to Dubai Men's

  useEffect(() => {
    localStorage.setItem('hct-campuses', JSON.stringify(campuses));
  }, [campuses]);

  const addCampus = (campusName) => {
    if (!campusName || campuses.includes(campusName)) return false;
    setCampuses(prev => [...prev, campusName].sort());
    return true;
  };

  return (
    <CampusContext.Provider value={{ campuses, selectedCampus, setSelectedCampus, addCampus }}>
      {children}
    </CampusContext.Provider>
  );
};
