//
//  RNJudo.m
//  JudoPay
//
//  Copyright (c) 2020 Alternative Payments Ltd
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.

#import "RNJudo.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <JudoKitObjC/JudoKitObjC.h>

@implementation RNJudo

RCT_EXPORT_MODULE();

//----------------------------------------------
// MARK: - Bitmask mappings
//----------------------------------------------

NS_OPTIONS(NSUInteger, IOSPaymentMethod) {
    IOSPaymentMethodCard = 1 << 0,
    IOSPaymentMethodApplePay = 1 << 1,
    IOSPaymentMethodIDEAL = 1 << 2,
    IOSPaymentMethodAll = 1 << 3,
};

NS_OPTIONS(NSUInteger, IOSCardNetwork) {
    IOSCardNetworkVisa = 1 << 0,
    IOSCardNetworkMastercard = 1 << 1,
    IOSCardNetworkMaestro = 1 << 2,
    IOSCardNetworkAmex = 1 << 3,
    IOSCardNetworkChinaUnionPay = 1 << 4,
    IOSCardNetworkJCB = 1 << 5,
    IOSCardNetworkDiscover = 1 << 6,
    IOSCardNetworkDinersClub = 1 << 7,
    IOSCardNetworkAll = 1 << 8,
};

//----------------------------------------------
// MARK: - SDK Methods
//----------------------------------------------

RCT_REMAP_METHOD(invokeTransaction,
                 properties:(NSDictionary *)properties
                 invokePaymentWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

  JudoKit *judoKit = [self judoSessionFromProperties:properties];
  TransactionType type = [self transactionTypeFromProperties:properties];
  JPConfiguration *configuration = [self configurationFromProperties:properties];

  [judoKit invokeTransactionWithType:type
                       configuration:configuration
                          completion:^(JPResponse *response, NSError *error) {
    if (error) {
      reject(@"JUDO_ERROR", @"Transaction failed", error);
      return;
    }
    resolve(response);
  }];
}

RCT_REMAP_METHOD(invokePaymentMethodScreen,
                 properties:(NSDictionary *)properties
                 invokePaymentMethodScreenWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

  JudoKit *judoKit = [self judoSessionFromProperties:properties];
  TransactionMode mode = [self transactionModeFromProperties:properties];
  JPConfiguration *configuration = [self configurationFromProperties:properties];

    [judoKit invokePaymentMethodScreenWithMode:mode
                                 configuration:configuration
                                    completion:^(JPResponse *response, NSError *error) {
      if (error) {
        reject(@"JUDO_ERROR", @"Transaction failed", error);
        return;
      }
      resolve(response);
    }];
}

//----------------------------------------------
// MARK: - Getters
//----------------------------------------------

- (JudoKit *)judoSessionFromProperties:(NSDictionary *)properties {
  NSString *token = [RCTConvert NSString:properties[@"token"]];
  NSString *secret = [RCTConvert NSString:properties[@"secret"]];
  BOOL isSandboxed = [RCTConvert BOOL:properties[@"sandboxed"]];

  JudoKit *judoKit = [[JudoKit alloc] initWithToken:token secret:secret];
  judoKit.isSandboxed = isSandboxed;

  return judoKit;
}

- (TransactionType)transactionTypeFromProperties:(NSDictionary *)properties {

    int intType = [RCTConvert int:properties[@"transactionType"]];

    NSArray<NSNumber *> *availableTypes = @[
        @(TransactionTypePayment),
        @(TransactionTypePreAuth),
        @(TransactionTypeRegisterCard),
        @(TransactionTypeCheckCard),
        @(TransactionTypeSaveCard)
    ];

    return availableTypes[intType].intValue;
}

- (TransactionMode)transactionModeFromProperties:(NSDictionary *)properties {
    int intType = [RCTConvert int:properties[@"transactionMode"]];
    return intType == 0 ? TransactionModePayment : TransactionModePreAuth;
}

- (JPAmount *)amountFromConfiguration:(NSDictionary *)configuration {
  NSDictionary *amountDictionary = [RCTConvert NSDictionary:configuration[@"amount"]];
  NSString *amount = amountDictionary[@"value"];
  NSString *currency = amountDictionary[@"currency"];
  return [JPAmount amount:amount currency:currency];
}

- (JPReference *)referenceFromConfiguration:(NSDictionary *)configuration {
  NSDictionary *referenceDictionary = [RCTConvert NSDictionary:configuration[@"reference"]];
  NSString *consumerReference = referenceDictionary[@"consumerReference"];
  NSString *paymentReference = referenceDictionary[@"paymentReference"];
  NSDictionary *metadata = referenceDictionary[@"metadata"];

  JPReference *reference = [[JPReference alloc] initWithConsumerReference:consumerReference
                                                 paymentReference:paymentReference];
  reference.metaData = metadata;
  return reference;
}

- (NSArray<JPPaymentMethod *> *)paymentMethodsFromConfiguration:(NSDictionary *)configuration {

    NSMutableArray<JPPaymentMethod *> *paymentMethods = [NSMutableArray new];

    int paymentMethodsBitmask = [RCTConvert int:configuration[@"paymentMethods"]];

    if (paymentMethodsBitmask & IOSPaymentMethodAll) {
        return @[JPPaymentMethod.card, JPPaymentMethod.applePay, JPPaymentMethod.iDeal];
    }

    if (paymentMethodsBitmask & IOSPaymentMethodCard) {
        [paymentMethods addObject:JPPaymentMethod.card];
    }

    if (paymentMethodsBitmask & IOSPaymentMethodApplePay) {
        [paymentMethods addObject:JPPaymentMethod.applePay];
    }

    if (paymentMethodsBitmask & IOSPaymentMethodIDEAL) {
        [paymentMethods addObject:JPPaymentMethod.iDeal];
    }

    return paymentMethods;
}

- (CardNetwork)cardNetworksFromConfiguration:(NSDictionary *)configuration {

    CardNetwork supportedCardNetworks = CardNetworkUnknown;

    int supportedNetworksBitmask = [RCTConvert int:configuration[@"supportedCardNetworks"]];

    if (supportedNetworksBitmask & IOSCardNetworkAll) {
        return CardNetworksAll;
    }

    if (supportedNetworksBitmask & IOSCardNetworkVisa) {
        RCTLog(@"ADDING VISA");
        supportedCardNetworks |= CardNetworkVisa;
    }

    if (supportedNetworksBitmask & IOSCardNetworkMastercard) {
        RCTLog(@"ADDING MASTERCARD");
        supportedCardNetworks |= CardNetworkMasterCard;
    }

    if (supportedNetworksBitmask & IOSCardNetworkMaestro) {
        supportedCardNetworks |= CardNetworkMaestro;
    }

    if (supportedNetworksBitmask & IOSCardNetworkAmex) {
        RCTLog(@"ADDING AMEX");
        supportedCardNetworks |= CardNetworkAMEX;
    }

    if (supportedNetworksBitmask & IOSCardNetworkChinaUnionPay) {
        supportedCardNetworks |= CardNetworkChinaUnionPay;
    }

    if (supportedNetworksBitmask & IOSCardNetworkJCB) {
        supportedCardNetworks |= CardNetworkJCB;
    }

    if (supportedNetworksBitmask & IOSCardNetworkDiscover) {
        supportedCardNetworks |= CardNetworkDiscover;
    }

    if (supportedNetworksBitmask & IOSCardNetworkDinersClub) {
        supportedCardNetworks |= CardNetworkDinersClub;
    }

    return supportedCardNetworks;
}

- (JPAddress *)cardAddressFromConfiguration:(NSDictionary *)configuration {
    NSDictionary *addressDictionary = configuration[@"cardAddress"];
    return [[JPAddress alloc] initWithDictionary:addressDictionary];
}

- (JPUIConfiguration *)uiConfigurationFromConfiguration:(NSDictionary *)configuration {
  NSDictionary *uiConfigurationDictionary = configuration[@"uiConfiguration"];
  JPUIConfiguration *uiConfiguration = [JPUIConfiguration new];

  uiConfiguration.isAVSEnabled = [RCTConvert BOOL:uiConfigurationDictionary[@"isAVSEnabled"]];
  uiConfiguration.shouldDisplayAmount = [RCTConvert BOOL:uiConfigurationDictionary[@"shouldDisplayAmount"]];
  uiConfiguration.theme = [self themeFromUIConfiguration:uiConfigurationDictionary];

  return uiConfiguration;
}

- (JPTheme *)themeFromUIConfiguration:(NSDictionary *)uiConfiguration {
  //TODO: Add theming configuration
  return [JPTheme new];
}

- (JPPrimaryAccountDetails *)accountDetailsFromConfiguration:(NSDictionary *)configuration {
    NSDictionary *accountDetailsDictionary = configuration[@"primaryAccountDetails"];
    return [JPPrimaryAccountDetails detailsFromDictionary:accountDetailsDictionary];
}

- (JPConfiguration *)configurationFromProperties:(NSDictionary *)properties {

  NSDictionary *configurationDict = properties[@"configuration"];

  NSString *judoId = [RCTConvert NSString:configurationDict[@"judoId"]];
  JPAmount *amount = [self amountFromConfiguration:configurationDict];
  JPReference *reference = [self referenceFromConfiguration:configurationDict];

  JPConfiguration *configuration = [[JPConfiguration alloc] initWithJudoID:judoId
                                                                    amount:amount
                                                                 reference:reference];

  configuration.siteId = [RCTConvert NSString:configurationDict[@"siteId"]];
  configuration.uiConfiguration = [self uiConfigurationFromConfiguration:configurationDict];
  configuration.supportedCardNetworks = [self cardNetworksFromConfiguration:configurationDict];
  configuration.primaryAccountDetails = [self accountDetailsFromConfiguration:configurationDict];
  configuration.cardAddress = [self cardAddressFromConfiguration:configurationDict];
  configuration.paymentMethods = [self paymentMethodsFromConfiguration:configurationDict];

  //TODO: Map apple pay

  return configuration;
}

//----------------------------------------------
// MARK: - React Native methods
//----------------------------------------------

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
