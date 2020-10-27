export enum HomeListType {
  Payment,
  PreAuth,
  RegisterCard,
  CheckCard,
  SaveCard,
  TokenPayments,
  ApplePay,
  ApplePreAuth,
  GooglePay,
  GooglePreAuth,
  PayByBankApp,
  PaymentMethods,
  PreAuthMethods,
  ServerToServer,
  TransactionDetails,
}

export type HomeListItem = {
  title: string,
  subtitle: string,
  type: HomeListType,
}
