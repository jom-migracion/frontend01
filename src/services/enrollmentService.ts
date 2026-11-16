import { RestClient } from './RestClient';

export interface SendOtpEnrollmentResponse {
  data: string | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export interface ValidateOtpEnrollmentRequest {
  email: string;
  otpCode: string;
}

export interface ValidateOtpEnrollmentResponse {
  data: string | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export interface RegisterLocalUserRequest {
  email: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  phone: string;
}

export interface RegisterLocalUserResponse {
  data: string | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export interface RegisterSocialUserRequest {
  platform: string;
  token: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
}

export interface RegisterSocialUserResponse {
  data: string | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export interface AcceptanceTermsConditionsRequest {
  detail: string;
}

export interface AcceptanceTermsConditionsResponse {
  data: string | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export interface GetSocialProviderDataRequest {
  platform: string;
  token: string;
}

export interface GetSocialProviderDataResponse {
  data: any | null;
  statusCode: string;
  hasError: boolean;
  resultError?: {
    code?: string;
    message?: string;
    title?: string;
    correlationId?: string | null;
  };
}

export const sendOtpEnrollment = async (email: string): Promise<SendOtpEnrollmentResponse> => {
  const response = await RestClient.post<SendOtpEnrollmentResponse>(
    `/v2/SendOtpEnrollment`,
    { email }
  );

  return response.data;
};

export const resendOtpEnrollment = async (email: string): Promise<SendOtpEnrollmentResponse> => {
  const response = await RestClient.post<SendOtpEnrollmentResponse>(
    `/v2/ResendOtpEnrollment`,
    { email }
  );

  return response.data;
};

export const validateOtpEnrollment = async (
  payload: ValidateOtpEnrollmentRequest
): Promise<ValidateOtpEnrollmentResponse> => {
  const response = await RestClient.post<ValidateOtpEnrollmentResponse>(
    `/v2/ValidateOtpEnrollment`,
    payload
  );

  return response.data;
};

export const registerLocalUser = async (
  payload: RegisterLocalUserRequest
): Promise<RegisterLocalUserResponse> => {
  const response = await RestClient.post<RegisterLocalUserResponse>(
    `/v2/RegisterLocalUser`,
    payload
  );

  return response.data;
};

export const registerSocialUser = async (
  payload: RegisterSocialUserRequest
): Promise<RegisterSocialUserResponse> => {
  const response = await RestClient.post<RegisterSocialUserResponse>(
    `/v2/RegisterSocialUser`,
    payload,
    {
      headers: {
        Accept: 'text/plain',
      },
    }
  );

  return response.data;
};

export const acceptanceTermsConditions = async (
  payload: AcceptanceTermsConditionsRequest
): Promise<AcceptanceTermsConditionsResponse> => {
  const response = await RestClient.post<AcceptanceTermsConditionsResponse>(
    `/Acceptance/TERMS_CONDITIONS`,
    payload,
    {
      headers: {
        Accept: 'text/plain',
      },
    }
  );

  return response.data;
};

export const getSocialProviderData = async (
  payload: GetSocialProviderDataRequest
): Promise<GetSocialProviderDataResponse> => {
  const response = await RestClient.post<GetSocialProviderDataResponse>(
    `/v2/GetSocialProviderData`,
    payload,
    {
      headers: {
        Accept: 'text/plain',
      },
    }
  );

  return response.data;
};
