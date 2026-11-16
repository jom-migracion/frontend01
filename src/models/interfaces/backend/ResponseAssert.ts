interface ResponseAssert<T> {
  conversationId: any;
  pagination: any;
  statusCode: string;
  data: T;
  resultError?: ErrorCommon,
  hasError: boolean
}

interface ErrorCommon {
  code: string;
  correlationId?: string;
  message: string;
  title: string;
}

export default ResponseAssert;