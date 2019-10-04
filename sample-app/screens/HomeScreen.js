// @flow
import React from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from "react-native";
import { showMessage } from "../utils";
import {
  RNJudo,
  type JudoOptions,
  type JudoApplePayOptions,
  type JudoGooglePayOptions
} from "judo-react-native";

type Props = {};
type State = {
  canUseApplePay: boolean,
  canUseGooglePay: boolean
};
var requireNativeComponent = require('requireNativeComponent')
const NativePayButton = requireNativeComponent(
      'RNNativePayButton',
    );
const judoOptions: JudoOptions = {
  token: "Izx9omsBR15LatAl",
  secret: "b5787124845533d8e68d12a586fa3713871b876b528600ebfdc037afec880cd6",
  judoId: "100915867",
  isSandbox: true,
  amount: "0.01",
  currency: "GBP",
  consumerReference: "myCustomerReference"
};

const ApplePayTransactionType = {
  Payment: 0,
  PreAuth: 1,
  Refund: 2,
  RegisterCard: 3,
  SaveCard: 4
};

const ApplePayPaymentShippingType = {
  Shipping: 0,
  Delivery: 1,
  StorePickup: 2,
  ServicePickup: 3
};

const ApplePayPaymentSummaryItemType = {
  Final: 0,
  Pending: 1
};

const applePayShippingMethod: ApplePayShippingMethod = {
  identifier: "identifier for shiping method",
  detail: "shipping method description",
  label: "shipping method label",
  amount: "10.0",
  paymentSummaryItemType: ApplePayPaymentSummaryItemType.Final
}

const applePayOptions: JudoApplePayOptions = {
  merchantId: "<MERCHANT_ID>",
  countryCode: "GB",
  summaryLabel: "<MERCHANT_NAME>",
  transactionType: ApplePayTransactionType.Payment,
  paymentShippingType: ApplePayPaymentShippingType.Delivery,
  paymentSummaryItems: [{label: "Purchased Item name", amount: "102.4"}],
  paymentShippingMethods: [applePayShippingMethod]
};

const googlePayOptions: JudoGooglePayOptions = {
  googlePayTestEnvironment: false,
  countryCode: "GB",
  merchantId: "<MERCHANT_ID>",
  isPayment: false // pre-auth
};

export default class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Judopay Sample App"
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      canUseApplePay: false,
      canUseGooglePay: false
    };
  }

  async componentDidMount() {
    if (Platform.OS === "ios") {
      const canUseApplePay = await RNJudo.canUseApplePay();
      this.setState({ canUseApplePay });
    } else if (Platform.OS === "android") {
      const canUseGooglePay = await RNJudo.canUseGooglePay(googlePayOptions);
      this.setState({ canUseGooglePay });
    }
  }

  async makePayment() {
    try {
      let response = await RNJudo.makePayment(judoOptions);
      if (response.result === "Success") {
        await showMessage(
          "Payment successful",
          `ReceiptId: ${response.receiptId}`
        );
      } else {
        await showMessage("Payment error", response.result);
      }
    } catch (e) {
      if (e.code === "JUDO_USER_CANCELLED") {
        // do nothing when the user cancels
        return;
      } else if (e.code === "JUDO_ERROR" && e.userInfo.result === "Declined") {
        await showMessage(
          "Payment failed",
          "Card declined. Please try again and make sure the card details are correct."
        );
      } else {
        let message =
          e.message ?? "Something went wrong. Please try again later.";
        await showMessage("Oops...", message);
      }
    }
  }

  async makePreAuth() {
    try {
      let response = await RNJudo.makePreAuth(judoOptions);
      if (response.result === "Success") {
        await showMessage(
          "Pre-auth successful",
          `ReceiptId: ${response.receiptId}`
        );
      } else {
        await showMessage("Pre-auth error", response.result);
      }
    } catch (e) {
      if (e.code === "JUDO_USER_CANCELLED") {
        // do nothing when the user cancels
        return;
      } else if (e.code === "JUDO_ERROR" && e.userInfo.result === "Declined") {
        await showMessage(
          "Pre-auth failed",
          "Card declined. Please try again and make sure the card details are correct."
        );
      } else {
        let message =
          e.message ?? "Something went wrong. Please try again later.";
        await showMessage("Oops...", message);
      }
    }
  }

  async makeApplePayPayment(isPayment: boolean = true) {
    const title = isPayment ? "Apple Pay payment" : "Apple Pay pre-auth";
    applePayOptions.transactionType = isPayment ? ApplePayTransactionType.Payment : ApplePayTransactionType.PreAuth;
    try {
      let response = await RNJudo.makeApplePayPayment(
        Object.assign({}, judoOptions, applePayOptions)
      );
      if (response.result === "Success") {
        await showMessage(
          `${title} successful`,
          `ReceiptId: ${response.receiptId}`
        );
      } else {
        await showMessage(`${title} error`, response.result);
      }
    } catch (e) {
      if (e.code === "JUDO_ERROR" && e.userInfo.result === "Declined") {
        await showMessage(
          `${title} failed`,
          "Card declined. Please try again and make sure the card details are correct."
        );
      } else {
        let message =
          e.message ?? "Something went wrong. Please try again later.";
        await showMessage("Oops...", message);
      }
    }
  }

  async makeNativePayment() {
    try {
      let response = await RNJudo.makeNativePayPayment(
        Object.assign({}, judoOptions, applePayOptions, googlePayOptions)
      );
      if (response.result === "Success") {
        await showMessage(
          `${title} successful`,
          `ReceiptId: ${response.receiptId}`
        );
      } else {
        await showMessage(`${title} error`, response.result);
      }
    } catch (e) {
      if (e.code === "JUDO_ERROR" && e.userInfo.result === "Declined") {
        await showMessage(
          `${title} failed`,
          "Card declined. Please try again and make sure the card details are correct."
        );
      } else {
        let message =
          e.message ?? "Something went wrong. Please try again later.";
        await showMessage("Oops...", message);
      }
    }
  }

  async makeGooglePayPayment(isPayment: boolean = true) {
    const title = isPayment ? "Google Pay payment" : "Google Pay pre-auth";
    try {
      let response = await RNJudo.makeGooglePayPayment(
        Object.assign({}, judoOptions, googlePayOptions, { isPayment })
      );
      if (response && response.result === "Success") {
        await showMessage(
          `${title} successful`,
          `ReceiptId: ${response.receiptId}`
        );
      } else {
        const errorMessage = response
          ? response.result
          : "Something went wrong";
        await showMessage(`${title} error`, errorMessage);
      }
    } catch (e) {
      if (e.code === "JUDO_USER_CANCELLED") {
        // do nothing when the user cancels
        return;
      } else if (
        e.code === "JUDO_ERROR" &&
        e.userInfo &&
        e.userInfo.result === "Declined"
      ) {
        await showMessage(
          `${title} failed`,
          "Card declined. Please try again and make sure the card details are correct."
        );
      } else if (e.code === "JUDO_GOOGLE_PAY_ERROR") {
        // Google Pay error messages are handled on the native side, nothing to do here
      } else {
        let message =
          e.message ?? "Something went wrong. Please try again later.";
        await showMessage("Oops...", message);
      }
    }
  }

  render() {
    const { canUseApplePay, canUseGooglePay } = this.state;
    const isIos = Platform.OS === "ios";

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {`Welcome to the\nJudopay sample app!`}
        </Text>
        <View style={styles.buttons}>
          <Button title="Make payment" onPress={() => this.makePayment()} />
          <View style={styles.spacing} />
          <Button title="Make pre-auth" onPress={() => this.makePreAuth()} />
          <View style={styles.spacing} />
          {isIos ? (
            <Button
              disabled={!canUseApplePay}
              title="Make Apple Pay payment"
              onPress={() => this.makeApplePayPayment()}
            />
          ) : (
            <Button
              disabled={!canUseGooglePay}
              title="Make Google Pay payment"
              onPress={() => this.makeGooglePayPayment()}
            />
          )}
          <View style={styles.spacing} />
          {isIos ? (
            <Button
              disabled={!canUseApplePay}
              title="Make Apple Pay pre-auth"
              onPress={() => this.makeApplePayPayment(false)}
            />
          ) : (
            <Button
              disabled={!canUseGooglePay}
              title="Make Google Pay pre-auth"
              onPress={() => this.makeGooglePayPayment(false)}
            />
          )}
          <View style={styles.spacing} />
          <NativePayButton
            style={styles.payButtonStyle}
            onPayPress={() => this.makeNativePayment()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 16
  },
  buttons: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  payButtonStyle: {
    marginLeft: 40,
    marginRight: 40,
    height: 32
  },
  spacing: {
    height: 16
  }
});
