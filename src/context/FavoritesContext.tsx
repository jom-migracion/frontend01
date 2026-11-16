import { createContext, useContext, useState, useEffect } from 'react';
import { FavoriteList } from '@/components/FavoriteListsModal';

const FavoritesContext = createContext<{
  favoritedCardIds: string[];
  setFavoritedCardIds: React.Dispatch<React.SetStateAction<string[]>>;
}>({ favoritedCardIds: [], setFavoritedCardIds: () => {} });

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoritedCardIds, setFavoritedCardIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorite-lists');
    if (saved) {
      try {
        const parsed: FavoriteList[] = JSON.parse(saved);
        const cardIds = Array.from(
          new Set(parsed.flatMap((list) => list.cards.map((card: any) => card.id)))
        );
        setFavoritedCardIds(cardIds);
      } catch (error) {
        console.error('Error loading favorite lists:', error);
        setFavoritedCardIds([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('favorite-lists');
      if (saved) {
        try {
          const parsed: FavoriteList[] = JSON.parse(saved);
          const cardIds = Array.from(
            new Set(parsed.flatMap((list) => list.cards.map((card:any) => card.id)))
          );
          setFavoritedCardIds(cardIds);
        } catch (error) {
          console.error('Error loading favorite lists:', error);
          setFavoritedCardIds([]);
        }
      } else {
        setFavoritedCardIds([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favoritedCardIds, setFavoritedCardIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);