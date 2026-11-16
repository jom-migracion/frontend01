export interface Conversation {
  conversationId: number
  userIdOne: number
  userIdTwo: number
  statusId: number
  creationDate: string
  isOwner: boolean
  userIdOneNavigation: UserNavigation
  userIdTwoNavigation: UserNavigation
  listingRent: any
}

export interface UserNavigation {
  name: string
  lastName: string
  photoLink: any
  gender: any
  email: any
  documents: any[]
  phones: any[]
  profilePhotos: any[]
}


export interface MessageConversation {
  messageId: number
  userId: number
  body: string
  creationDate: string
  readDate: string
  messageTypeId: number
  bookId: any
  expiryDate: any
  isRead: boolean
  parentMessage: any
  dateExecution: any
  conversationId: number
  ipAddress: any
  additionalData: any
  messageStatusId: number
}
