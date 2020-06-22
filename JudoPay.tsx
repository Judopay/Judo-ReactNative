import { NativeModules } from 'react-native';

import {
    JudoConfiguration,
    JudoResponse,
    JudoTransactionMode,
    JudoTransactionType
} from './types/JudoTypes';

export {
    JudoTransactionType,
    JudoTransactionMode,
    JudoPaymentMethod,
    JudoCardNetwork
} from './types/JudoTypes';

export type {
    JudoAmount,
    JudoReference,
    JudoAddress,
    JudoUIConfiguration,
    JudoAccountDetails,
    JudoTheme,
    JudoResponse,
    JudoConfiguration
} from './types/JudoTypes';

export {
    JudoPaymentSummaryItemType,
    JudoMerchantCapability,
    JudoContactField,
    JudoShippingType,
    JudoReturnedInfo
} from './types/JudoApplePayTypes';

export type {
    JudoApplePayConfiguration,
    JudoPaymentSummaryItem,
    JudoShippingMethod
} from './types/JudoApplePayTypes';

export {
    JudoAddressFormat,
    JudoGooglePayEnvironment
} from './types/JudoGooglePayTypes';

export type {
    JudoGooglePayConfiguration,
    JudoBillingAddressParameters,
    JudoShippingAddressParameters
} from './types/JudoGooglePayTypes';

export type { JudoPBBAConfiguration } from './types/JudoPBBATypes';

class JudoPay {
    public isSandboxed: boolean = true;

    private readonly token: string;
    private readonly secret: string;

    constructor(token: string, secret: string) {
        this.token = token;
        this.secret = secret;
    }

    public async invokeTransaction(
        type: JudoTransactionType,
        configuration: JudoConfiguration
    ): Promise<JudoResponse> {
        const params = this.generateTransactionTypeParameters(
            type,
            configuration
        );
        return await NativeModules.RNJudo.invokeTransaction(params);
    }

    public async invokeApplePay(
        mode: JudoTransactionMode,
        configuration: JudoConfiguration
    ): Promise<JudoResponse> {
        const params = this.generateTransactionModeParameters(
            mode,
            configuration
        );
        return await NativeModules.RNJudo.invokeApplePay(params);
    }

    public async invokeGooglePay(
        mode: JudoTransactionMode,
        configuration: JudoConfiguration
    ): Promise<JudoResponse> {
        const params = this.generateTransactionModeParameters(
            mode,
            configuration
        );
        return await NativeModules.RNJudo.invokeGooglePay(params);
    }

    public async invokePaymentMethodScreen(
        mode: JudoTransactionMode,
        configuration: JudoConfiguration
    ): Promise<JudoResponse> {
        const params = this.generateTransactionModeParameters(
            mode,
            configuration
        );
        return await NativeModules.RNJudo.invokePaymentMethodScreen(params);
    }

    private generateTransactionTypeParameters = (
        type: JudoTransactionType,
        configuration: JudoConfiguration
    ): Record<string, any> => {
        return {
            token: this.token,
            secret: this.secret,
            sandboxed: this.isSandboxed,
            transactionType: type,
            configuration: configuration
        };
    };

    private generateTransactionModeParameters = (
        mode: JudoTransactionMode,
        configuration: JudoConfiguration
    ): Record<string, any> => {
        return {
            token: this.token,
            secret: this.secret,
            sandboxed: this.isSandboxed,
            transactionMode: mode,
            configuration: configuration
        };
    };
}

export default JudoPay;
