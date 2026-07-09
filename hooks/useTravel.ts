import { TravelContext } from '@/context/TravelContext';
import { useContext } from 'react';

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error('useTravel must be used within a TravelProvider');
  return context;
};