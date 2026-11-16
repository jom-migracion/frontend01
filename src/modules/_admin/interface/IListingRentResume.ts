export interface IListingRentResumeResponse {
  listingRentId: number
  name: string
  description: string
  property: Property
  price: Price
}

export interface Property {
  latitude: number
  longitude: number
  address: any
  type: any
  distanceMeters: number
}

export interface Price {
  priceNightly: number
  securityDepositPrice: number
  currency: any
  currencyCode: any
  tlListingDiscountForRates: any
  specialDatePrices: any
}
