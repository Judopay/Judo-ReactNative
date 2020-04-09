import {
    JudoApplePayConfiguration,
    JudoPaymentSummaryItem,
    JudoReturnedInfo,
    JudoMerchantCapability,
    JudoContactField,
    JudoShippingMethod,
    JudoShippingType,
    JudoPaymentSummaryItemType
} from 'judo-react-native'

const itemOne: JudoPaymentSummaryItem = {
    label: 'Item 1',
    amount: '0.01',
}

const itemTwo: JudoPaymentSummaryItem = {
    label: 'Item 1',
    amount: '0.02',
}

const total: JudoPaymentSummaryItem = {
    label: 'Tim Apple',
    amount: '0.03',
}

const delivery: JudoShippingMethod = {
    identifier: 'delivery-id',
    label: 'Delivert',
    detail: 'Deliver to your home address',
    amount: '0.01',
    type: JudoPaymentSummaryItemType.Final,
}

export const applePayConfiguration: JudoApplePayConfiguration = {
    merchantId: 'my-merchant-id',
    countryCode: 'my-country-code',
    paymentSummaryItems: [itemOne, itemTwo, total],
    merchantCapabilities: [JudoMerchantCapability.ThreeDS],
    requiredBillingContactFields: JudoContactField.Name | JudoContactField.Email,
    requiredShippingContactFields: JudoContactField.All,
    shippingMethods: [delivery],
    shippingType: JudoShippingType.Delivery,
    returnedInfo: JudoReturnedInfo.All,
}