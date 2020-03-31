import React from 'react';
import { createStore } from 'redux'

function emptyHook() { }

export let store = createStore(emptyHook)

export const storageKey = "storage_key"

export enum SettingsPickType {
  switch,
  textPicker,
  singlePicker,
  multiPicker,
}

export enum SettingsPickArray {
  currencies,
  cardNetworks,
  payment,
  googlePay,
}

export type SettingsListItem = {
  title: string,
  subtitle: string,
  type: SettingsPickType,
  value: any,
  valueArray?: [string],
  pickItems?: SettingsPickArray
}

export type PickerItem = {
  entry: string,
  value: string
}

export const Currencies = {
  list: [
    {
      "data": [
        { "entry": "AED - United Arab Emirates Dirham", "value": "AED" } as PickerItem,
        { "entry": "AUD - Australia Dollar", "value": "AUD" } as PickerItem,
        { "entry": "BRL - Brazil Real", "value": "BRL" } as PickerItem,
        { "entry": "CZK - Czech Republic Koruna", "value": "CHF" } as PickerItem,
        { "entry": "DKK - Denmark Krone", "value": "DKK" } as PickerItem,
        { "entry": "EUR - Euro Member Countries", "value": "EUR" } as PickerItem,
        { "entry": "GBP - United Kingdom Pound", "value": "GBP" } as PickerItem,
        { "entry": "HKD - Hong Kong Dollar", "value": "HKD" } as PickerItem,
        { "entry": "HUF - Hungary Forint", "value": "HUF" } as PickerItem,
        { "entry": "JPY - Japan Yen", "value": "JPY" } as PickerItem,
        { "entry": "NOK - Norway Krone", "value": "NOK" } as PickerItem,
        { "entry": "NZD - New Zealand Dollar", "value": "NZD" } as PickerItem,
        { "entry": "PLN - Poland Zloty", "value": "PLN" } as PickerItem,
        { "entry": "SEK - Sweden Krona", "value": "SEK" } as PickerItem,
        { "entry": "SGD - Singapore Dollar", "value": "SGD" } as PickerItem,
        { "entry": "QAR - Qatar Riyal", "value": "QAR" } as PickerItem,
        { "entry": "SAR - Saudi Arabia Riyal", "value": "SAR" } as PickerItem,
        { "entry": "USD - United States Dollar", "value": "USD" } as PickerItem,
        { "entry": "ZAR - South Africa Rand", "value": "ZAR" } as PickerItem
      ]
    }
  ]
}

export const CardNetworks = {
  list: [
    {
      "data": [
        { "entry": "Visa", "value": "VISA" } as PickerItem,
        { "entry": "Master Card", "value": "MASTERCARD" } as PickerItem,
        { "entry": "Maestro", "value": "MAESTRO" } as PickerItem,
        { "entry": "AMEX", "value": "AMEX" } as PickerItem,
        { "entry": "China Union Pay", "value": "CHINA_UNION_PAY" } as PickerItem,
        { "entry": "JCB", "value": "JCB" } as PickerItem,
        { "entry": "Discover", "value": "DISCOVER" } as PickerItem,
        { "entry": "Diners Club", "value": "DINERS_CLUB" } as PickerItem,
      ]
    }
  ]
}

export const GooglePayAddress = {
  list: [
    {
      "data": [
        { "entry": "Not required", "value": "NONE" } as PickerItem,
        { "entry": "MIN: Name, country code, and postal code.", "value": "MIN" } as PickerItem,
        {
          "entry": "FULL: Name, street address, locality, region, country code, and postal code.",
          "value": "FULL"
        } as PickerItem
      ]
    }
  ]
}

export const Payments = {
  list: [
    {
      "data": [
        { "entry": "Card", "value": "CARD" } as PickerItem,
        { "entry": "iDeal", "value": "IDEAL" } as PickerItem,
        { "entry": "Google Pay", "value": "GOOGLE_PAY" } as PickerItem,
        { "entry": "Apple Pay", "value": "APPLE_PAY" } as PickerItem
      ]
    }
  ]
}

export var SettingsData = {
  list: [
     {
        "title":"API Configurations",
        "data":[
          {
            "title": "Sandboxed",
            "subtitle": "Use Judopay API sandbox environment",
            "type": SettingsPickType.switch,
            "value": true
          } as SettingsListItem,
          {
            "title":"Judo ID",
            "subtitle":"Your Judo ID",
            "type": SettingsPickType.textPicker,
            "value": ""
          } as SettingsListItem,
          {
            "title":"Site ID",
            "subtitle":"Your Site ID",
            "type": SettingsPickType.textPicker,
            "value": ""
          } as SettingsListItem,
          {
            "title":"Token",
            "subtitle":"Your API authorization token",
            "type": SettingsPickType.textPicker,
            "value": ""
          } as SettingsListItem,
          {
            "title":"Secret",
            "subtitle":"Your API authorization secret",
            "type": SettingsPickType.textPicker,
            "value": ""
          }
        ]
     },
     {
        "title":"Amount",
        "data":[
           {
              "title":"Amount",
              "subtitle":"Your amount",
              "type": SettingsPickType.textPicker,
              "value": "0.15"
           } as SettingsListItem,
           {
              "title":"Currency",
              "subtitle":"EUR - Euro Member Countries",
              "type": SettingsPickType.singlePicker,
              "value":"EUR",
              "pickItems": SettingsPickArray.currencies,
              "valueArray": Array()
           } as SettingsListItem
        ]
     },
     {
        "title":"Google Pay",
        "data":[
           {
              "title":"Production environment",
              "subtitle":"Use Google Pay production environment",
              "type": SettingsPickType.switch,
              "value": false
           } as SettingsListItem,
           {
              "title":"Billing address",
              "subtitle":"Select address",
              "type": SettingsPickType.singlePicker,
              "value":"FULL: Name, street address, locality, region, country code and postal code",
              "pickItems": SettingsPickArray.googlePay,
              "valueArray": Array()
           } as SettingsListItem,
           {
              "title":"Billing address phone number",
              "subtitle":"Turn on to request a billing address phone number",
              "type": SettingsPickType.switch,
              "value": false
           } as SettingsListItem,
           {
              "title":"Shipping address",
              "subtitle":"Turn on to request a full shipping address",
              "type": SettingsPickType.switch,
              "value": false
           } as SettingsListItem,
           {
              "title":"Shipping address phone number",
              "subtitle":"Turn on to request a full shipping address phone number",
              "type": SettingsPickType.switch,
              "value": false
           } as SettingsListItem,
           {
              "title":"Email address",
              "subtitle":"Turn on to request a email address",
              "type": SettingsPickType.switch,
              "value": false
           } as SettingsListItem
        ]
     },
     {
        "title":"Others",
        "data":[
           {
              "title":"Supported card networks",
              "subtitle":"Visa, Master card, Amex, JCB, Discover",
              "type": SettingsPickType.multiPicker,
              "value": "",
              "valueArray": new Array("VISA", "MASTERCARD", "AMEX", "JCB", "DISCOVER"),
              "pickItems": SettingsPickArray.cardNetworks
           } as SettingsListItem,
           {
              "title":"Payment methods",
              "subtitle":"Card, iDeal",
              "type": SettingsPickType.multiPicker,
              "value": "",
              "valueArray": new Array("CARD", "IDEAL"),
              "pickItems": SettingsPickArray.payment
           } as SettingsListItem
        ]
     }
  ]
}

export enum HomeListType {
  cardPay,
  cardPreAuth,
  cardRegister,
  cardCheck,
  cardSave,
  ideal,
  googlePayment,
  googlePreAuth,
  applePayment,
  applePreAuth,
  methods,
  methodsPreAuth
}

export type HomeListItem = {
  title: string,
  subtitle: string,
  type: HomeListType
}

export const HomeScreenData = {
  list: [
     {
        "data":[
          {
            "title": "Pay with card",
            "subtitle": "by entering card details",
            "type": HomeListType.cardPay
          } as HomeListItem,
          {
            "title": "Pre-auth with card",
            "subtitle": "pre-auth by entering card details",
            "type": HomeListType.cardPreAuth
          } as HomeListItem,
          {
            "title": "Register card",
            "subtitle": "to be stored for future transactions",
            "type": HomeListType.cardRegister
          } as HomeListItem,
          {
            "title": "Check card",
            "subtitle": "to validate a card",
            "type": HomeListType.cardCheck
          } as HomeListItem,
          {
            "title": "Save card",
            "subtitle": "to be stored for future transactions",
            "type": HomeListType.cardSave
          } as HomeListItem,
          {
            "title": "Apple Pay payment",
            "subtitle": "with a wallet card",
            "type": HomeListType.applePayment
          } as HomeListItem,
          {
            "title": "Apple Pay pre-auth",
            "subtitle": "pre-auth with a wallet card",
            "type": HomeListType.applePreAuth
          } as HomeListItem,
          {
            "title": "Google Pay payment",
            "subtitle": "with a wallet card",
            "type": HomeListType.googlePayment
          } as HomeListItem,
          {
            "title": "Google Pay pre-auth",
            "subtitle": "pre-auth with a wallet card",
            "type": HomeListType.googlePreAuth
          } as HomeListItem,
          {
            "title": "Payment methods",
            "subtitle": "with default payment methods",
            "type": HomeListType.methods
          } as HomeListItem,
          {
            "title": "Pre-auth payment methods",
            "subtitle": "with default pre-auth payment methods",
            "type": HomeListType.methodsPreAuth
          } as HomeListItem
        ]
      }
    ]
  }
