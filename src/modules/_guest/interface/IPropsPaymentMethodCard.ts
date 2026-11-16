export interface IPropsPaymentMethodCardResponse {
  priceCalculationId: string;
  calculationCode: string;
  bookId: any;
  amount: number;
  currencyCode: string;
  calculationDetails: string;
  creationDate: string;
  expirationDate: string;
  calculationStatue: string;
  ipAddress: any;
  userAgent: any;
  methodOfPaymentId: any;
  paymentProviderId: any;
  paymentTransactionId: any;
  guestResume: GuestResume;
}

export interface AdditionalCharges {
  extraGuestFee: number;
  petFee: number;
  cleaningFee: number;
  otherFees: number;
}

export interface Accommodation {
  nightsCount: number;
  weekend_NightsCount: number;
  ratePerNight: number;
  baseAmount: number;
  weekend_RatePerNight: number;
  weekend_BaseAmount: number;
  totalBaseAmount: number;
  appliedDiscount: number;
  discountedAmount: number;
}

export interface GuestResume {
  accommodation: Accommodation;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  guestCommission: number;
  guestCommissionPercent: number;
  total: number;
  currencyCode: string;
  hostResume: any | null;
}

export interface IPropsPaymentMethodCard {
  onNext: (payMethod?: string, formData?: any) => void;
  isExpanded: boolean;
  onToggle: any;
  calculationCode: string;
  bookId: string;
  onPaymentRequestData?: (commission: number) => void;
}

export interface IPaymentRequest {
  calculationCode: string;
  amount: number;
  currencyCode: string;
  orderCode: string;
  stan: string;
  methodOfPaymentId: number;
  paymentProviderId: number;
  countryId: number;
  paymentData: string;
  transactionData: string;
}
