import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomCard from '@/components/CustomCard';
import SkeletonCard from '@/components/SkeletonCard';
import Images from '@/assets/Imagens';
import { Listing } from '@/models/interfaces/Listing';

interface FeaturedListingsCardsProps {
  listings?: Listing[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  pageSize: number;
  columns: number;
  favoriteIds: string[];
  onToggleFavorite: (card: Listing) => void;
  handleFavoriteChange: (id: string, makeFav: boolean) => void;
}

const FeaturedListingsCards: React.FC<FeaturedListingsCardsProps> = ({
  listings,
  isLoading,
  isError,
  error,
  pageSize,
  columns,
  favoriteIds,
  onToggleFavorite,
  handleFavoriteChange,
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(300px, 1fr))`,
      gap: 2,
      boxSizing: 'border-box',
    }}
  >
    {isLoading ? (
      Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
    ) : isError ? (
      <Box>Error: {error?.message}</Box>
    ) : Array.isArray(listings) && listings.length > 0 ? (
      listings.map((listing, idx) => (
        <CustomCard
          key={listing.listingRentId}
          images={Images[idx % Images.length]}
          location={
            listing.property?.address?.city?.state ?? listing.property?.address?.city?.city ?? ''
          }
          country={listing.property?.address?.city?.country ?? ''}
          title={listing.name || 'Alojamiento'}
          price={`${listing.price.priceNightly??0}`}
          rating={Math.floor((listing.valoration ?? 0) * 10) / 10}
          refDetail={listing.listingRentId}
          onToggleFavorite={() => onToggleFavorite(listing)}
          isFavorite={favoriteIds.includes(listing.listingRentId.toString())}
          setIsFavorite={(isFav) => handleFavoriteChange(listing.listingRentId.toString(), isFav)}
        />
      ))
    ) : (
      <Typography>No hay hospedajes disponibles</Typography>
    )}
  </Box>
);

export default FeaturedListingsCards;
