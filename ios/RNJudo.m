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

#import <JudoKitObjC/JudoKitObjC.h>

#import "RNJudo.h"
#import "RNWrappers.h"
#import "RNApplePayWrappers.h"

static NSString *kJudoPromiseRejectionCode = @"JUDO_ERROR";

typedef NS_ENUM(NSUInteger, JudoSDKInvocationType) {
    JudoSDKInvocationTypeTransaction,
    JudoSDKInvocationTypeApplePay,
    JudoSDKInvocationTypePaymentMethods
};

@implementation RNJudo

RCT_EXPORT_MODULE();

//----------------------------------------------
// MARK: - SDK Methods
//----------------------------------------------

RCT_REMAP_METHOD(invokeTransaction,
                 properties:(NSDictionary *)properties
                 invokePaymentWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [self invokeSDKWithType:JudoSDKInvocationTypeTransaction withProperties:properties resolver:resolve andRejecter:reject];
}

RCT_REMAP_METHOD(invokeApplePay,
                 properties:(NSDictionary *)properties
                 invokeApplePayWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [self invokeSDKWithType:JudoSDKInvocationTypeApplePay withProperties:properties resolver:resolve andRejecter:reject];
}

RCT_REMAP_METHOD(invokePaymentMethodScreen,
                 properties:(NSDictionary *)properties
                 invokePaymentMethodScreenWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [self invokeSDKWithType:JudoSDKInvocationTypePaymentMethods withProperties:properties resolver:resolve andRejecter:reject];
}

- (void)invokeSDKWithType:(JudoSDKInvocationType)invocationType
           withProperties:(NSDictionary *)properties
                 resolver:(RCTPromiseResolveBlock)resolve
              andRejecter:(RCTPromiseRejectBlock)reject {
    @try {
        JudoKit *judoKit = [RNWrappers judoSessionFromProperties:properties];
        JPConfiguration *configuration = [RNWrappers configurationFromProperties:properties];
        JudoCompletionBlock completion = ^(JPResponse *response, NSError *error) {
            if (error) {
                reject(kJudoPromiseRejectionCode, @"Transaction failed",  error);
            } else {
                resolve(response);
            }
        };

        switch (invocationType) {
            case JudoSDKInvocationTypeTransaction: {
                TransactionType type = [RNWrappers transactionTypeFromProperties:properties];
                [judoKit invokeTransactionWithType:type configuration:configuration completion:completion];
                break;
            }
                
            case JudoSDKInvocationTypeApplePay: {
                TransactionMode mode = [RNWrappers transactionModeFromProperties:properties];
                [judoKit invokeApplePayWithMode:mode configuration:configuration completion:completion];
                break;
            }
                
            case JudoSDKInvocationTypePaymentMethods: {
                TransactionMode mode = [RNWrappers transactionModeFromProperties:properties];
                [judoKit invokePaymentMethodScreenWithMode:mode configuration:configuration completion:completion];
                break;
            }
                
            default:
                @throw [NSException exceptionWithName:NSInvalidArgumentException
                                               reason:@"Unsupported invocation type."
                                             userInfo:nil];
        }
    } @catch (NSException *exception) {
        NSString *message = exception.reason;
        reject(kJudoPromiseRejectionCode, message, [NSError judoParameterError]);
    }
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
