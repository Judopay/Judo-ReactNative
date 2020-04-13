export enum HomeListType {
    Payment,
    PreAuth,
    RegisterCard,
    CheckCard,
    SaveCard,
    ApplePay,
    ApplePreAuth,
    GooglePay,
    GooglePreAuth,
    PaymentMethods,
    PreAuthMethods,
}

export type HomeListItem = {
    title: string,
    subtitle: string,
    type: HomeListType
}