package com.reactlibrary

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.*
import com.judopay.*
import com.judopay.api.error.ApiError
import com.judopay.api.model.response.Receipt
import com.judopay.model.*
import com.judopay.model.Currency
import com.judopay.model.googlepay.GooglePayAddressFormat
import com.judopay.model.googlepay.GooglePayBillingAddressParameters
import com.judopay.model.googlepay.GooglePayEnvironment
import com.judopay.model.googlepay.GooglePayShippingAddressParameters
import java.lang.Error
import java.lang.Exception
import kotlin.collections.ArrayList
import com.readystatesoftware.chuck.ChuckInterceptor;
import com.judopay.api.factory.JudoApiCallAdapterFactory;
import com.judopay.api.factory.JudoApiServiceFactory;

const val JUDO_PAYMENT_WIDGET_REQUEST_CODE = 1
const val JUDO_PROMISE_REJECTION_CODE = "JUDO_ERROR"

class JudoReactNativeModule internal constructor(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    // ------------------------------------------------------------
    // MARK: Variables
    // ------------------------------------------------------------

    private var transactionPromise: Promise? = null

    private val listener = object : BaseActivityEventListener() {

        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent) {

            if (requestCode != JUDO_PAYMENT_WIDGET_REQUEST_CODE) {
                return
            }

            when (resultCode) {
                PAYMENT_ERROR -> {
                    val error: ApiError? = data.getParcelableExtra(JUDO_ERROR)
                    error?.let {
                        transactionPromise?.reject(error.code.toString(), error.message)
                    }
                }
                PAYMENT_SUCCESS -> {
                    val receipt: Receipt? = data.getParcelableExtra(JUDO_RECEIPT)
                    receipt?.let {
                        transactionPromise?.resolve(receipt)
                    }
                }
            }

            transactionPromise = null
        }
    }

    // ------------------------------------------------------------
    // MARK: Initializer
    // ------------------------------------------------------------

    init {
        context.addActivityEventListener(listener)
        JudoApiServiceFactory.externalInterceptors = (listOf(ChuckInterceptor(context)))
    }

    // ------------------------------------------------------------
    // MARK: SDK Methods
    // ------------------------------------------------------------

    @ReactMethod
    fun invokeTransaction(options: ReadableMap, promise: Promise) {
        try {
            val judo = getTransactionConfiguration(options)
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun invokeGooglePay(options: ReadableMap, promise: Promise) {
        try {
            val judo = getGoogleTransactionConfiguration(options)
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun invokePaymentMethodScreen(options: ReadableMap, promise: Promise) {
        try {
            val judo = getPaymentMethodsConfiguration(options)
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    private fun startJudoActivity(configuration: Judo, promise: Promise) {
        transactionPromise = promise
        val intent = Intent(currentActivity, JudoActivity::class.java)
        intent.putExtra(JUDO_OPTIONS, configuration)
        currentActivity?.startActivityForResult(intent, JUDO_PAYMENT_WIDGET_REQUEST_CODE)
    }

    // ------------------------------------------------------------
    // MARK: Helper methods
    // ------------------------------------------------------------

    private fun getTransactionConfiguration(options: ReadableMap): Judo {
        val widgetType = getWidgetType(options)
        return  getJudoConfiguration(widgetType, options)
    }

    private fun getGoogleTransactionConfiguration(options: ReadableMap): Judo {
        val type = when (options.transactionMode) {
            0 -> PaymentWidgetType.GOOGLE_PAY
            else -> PaymentWidgetType.PRE_AUTH_GOOGLE_PAY
        }
        return  getJudoConfiguration(type, options)
    }

    private fun getPaymentMethodsConfiguration(options: ReadableMap): Judo {
        val type = when (options.transactionMode) {
            0 -> PaymentWidgetType.PAYMENT_METHODS
            else -> PaymentWidgetType.PRE_AUTH_PAYMENT_METHODS
        }
        return getJudoConfiguration(type, options)

    }

    private fun getJudoConfiguration(type: PaymentWidgetType, options: ReadableMap): Judo {
        val amount = getAmount(options)
        val reference = getReference(options)
        val cardNetworks = getCardNetworks(options)
        val paymentMethods = getPaymentMethods(options)
        val uiConfiguration = getUIConfiguration(options)
        val primaryAccountDetails = getPrimaryAccountDetails(options)
        val googlePayConfiguration = getGooglePayConfiguration(options)
        return Judo.Builder(type)
                .setApiToken(options.token)
                .setApiSecret(options.secret)
                .setIsSandboxed(options.isSandboxed)
                .setJudoId(options.judoId)
                .setSiteId(options.siteId)
                .setAmount(amount)
                .setReference(reference)
                .setSupportedCardNetworks(cardNetworks)
                .setPaymentMethods(paymentMethods)
                .setUiConfiguration(uiConfiguration)
                .setPrimaryAccountDetails(primaryAccountDetails)
                .setGooglePayConfiguration(googlePayConfiguration)
                .build()
    }

    private fun getWidgetType(options: ReadableMap) = when (options.getInt("transactionType")) {
        1 -> PaymentWidgetType.PRE_AUTH_CARD_PAYMENT
        2 -> PaymentWidgetType.CREATE_CARD_TOKEN
        3 -> PaymentWidgetType.CHECK_CARD
        4 -> PaymentWidgetType.SAVE_CARD
        else -> PaymentWidgetType.CARD_PAYMENT
    }

    private fun getAmount(options: ReadableMap): Amount {
        val currency = when (val currencyValue = options.currencyValue) {
            null -> Currency.GBP
            else -> Currency.valueOf(currencyValue)
        }
        return Amount.Builder()
                .setAmount(options.amountValue)
                .setCurrency(currency)
                .build()
    }

    private fun getReference(options: ReadableMap): Reference? {

        var builder = Reference.Builder()
                .setConsumerReference(options.consumerReference)
                .setPaymentReference(options.paymentReference)

        val metadataMap = options.metadata
        metadataMap?.let {
            val bundle = Bundle()
            metadataMap.toHashMap().forEach {
                bundle.putString(it.key, it.value.toString())
            }
            builder = builder.setMetaData(bundle)
        }

        return builder.build()
    }

    private fun getCardNetworks(options: ReadableMap): Array<CardNetwork>? {

        val cardVisa = 1
        val cardMastercard = 1 shl 1
        val cardMaestro = 1 shl 2
        val cardAmex = 1 shl 3
        val cardChinaUnionPay = 1 shl 4
        val cardJcb = 1 shl 5
        val cardDiscover = 1 shl 6
        val cardDinersClub = 1 shl 7
        val cardsAll = 1 shl 8

        var supportedNetworks: MutableList<CardNetwork>? = null

        val cardValue = options.cardNetworkValue
        cardValue?.let {

            supportedNetworks = ArrayList()

            if (cardValue and cardVisa == cardVisa) {
                supportedNetworks?.add(CardNetwork.VISA)
            }

            if (cardValue and cardMastercard == cardMastercard) {
                supportedNetworks?.add(CardNetwork.MASTERCARD)
            }

            if (cardValue and cardMaestro == cardMaestro) {
                supportedNetworks?.add(CardNetwork.MAESTRO)
            }

            if (cardValue and cardAmex == cardAmex) {
                supportedNetworks?.add(CardNetwork.AMEX)
            }

            if (cardValue and cardChinaUnionPay == cardChinaUnionPay) {
                supportedNetworks?.add(CardNetwork.CHINA_UNION_PAY)
            }

            if (cardValue and cardJcb == cardJcb) {
                supportedNetworks?.add(CardNetwork.JCB)
            }

            if (cardValue and cardDiscover == cardDiscover) {
                supportedNetworks?.add(CardNetwork.DISCOVER)
            }

            if (cardValue and cardDinersClub == cardDinersClub) {
                supportedNetworks?.add(CardNetwork.DINERS_CLUB)
            }

            if (cardValue and cardsAll == cardsAll) {
                return CardNetwork.values()
            }
        }
        return supportedNetworks?.toTypedArray()
    }

    private fun getPaymentMethods(options: ReadableMap): Array<PaymentMethod>? {

        var paymentMethods: ArrayList<PaymentMethod>? = null

        val cardPaymentValue = 1
        val googlePaymentValue = 1 shl 2
        val idealPaymentValue = 1 shl 3
        val allPaymentValues = 1 shl 4


        val paymentMethodValue = options.paymentMethodValue
        paymentMethodValue?.let {

            paymentMethods = ArrayList()

            if (paymentMethodValue and cardPaymentValue == cardPaymentValue) {
                paymentMethods?.add(PaymentMethod.CARD)
            }

            if (paymentMethodValue and googlePaymentValue == googlePaymentValue) {
                paymentMethods?.add(PaymentMethod.GOOGLE_PAY)
            }

            if (paymentMethodValue and idealPaymentValue == idealPaymentValue) {
                paymentMethods?.add(PaymentMethod.IDEAL)
            }

            if (paymentMethodValue and allPaymentValues == allPaymentValues) {
                return PaymentMethod.values()
            }
        }

        return paymentMethods?.toTypedArray()
    }

    private fun getUIConfiguration(options: ReadableMap): UiConfiguration? {
        return if(options.uiConfiguration != null) {
                UiConfiguration.Builder()
                        .setAvsEnabled(options.isAVSEnabled)
                        .setShouldDisplayAmount(options.shouldDisplayAmount)
                        .build()
            } else {
                null
            }
    }

    private fun getPrimaryAccountDetails(options: ReadableMap): PrimaryAccountDetails? {
        return PrimaryAccountDetails.Builder()
                    .setName(options.name)
                    .setAccountNumber(options.accountName)
                    .setDateOfBirth(options.dateOfBirth)
                    .setPostCode(options.postCode)
                    .build()
    }

    private fun getGooglePayConfiguration(options: ReadableMap): GooglePayConfiguration? {

        val environment = when (options.environmentValue) {
            0 -> GooglePayEnvironment.TEST
            else -> GooglePayEnvironment.PRODUCTION
        }

        val billingParameters = getBillingParameters(options)
        val shippingParameters = getShippingParameters(options)

        return if(options.googlePayConfiguration !=  null) {
                GooglePayConfiguration.Builder()
                        .setTransactionCountryCode(options.countryCode)
                        .setEnvironment(environment)
                        .setIsEmailRequired(options.isEmailRequired)
                        .setIsBillingAddressRequired(options.isBillingAddressRequired)
                        .setBillingAddressParameters(billingParameters)
                        .setIsShippingAddressRequired(options.isShippingAddressRequired)
                        .setShippingAddressParameters(shippingParameters)
                        .build()
            } else {
                null
        }
    }

    private fun getBillingParameters(options: ReadableMap): GooglePayBillingAddressParameters? {
        val addressFormat = when (options.addressFormat) {
            0 -> GooglePayAddressFormat.MIN
            else -> GooglePayAddressFormat.FULL
        }
        return GooglePayBillingAddressParameters(addressFormat, options.isBillingPhoneNumberRequired)
    }

    private fun getShippingParameters(options: ReadableMap): GooglePayShippingAddressParameters? {

        var allowedCountryCodes: Array<String>? = null
        val allowedCountryArray = options.allowedCountryCodeList

        allowedCountryArray?.let {
            val countryList = allowedCountryArray.toArrayList().mapNotNull { it as String }
            allowedCountryCodes = countryList.toTypedArray()
        }

        return GooglePayShippingAddressParameters(allowedCountryCodes, options.isShippingPhoneNumberRequired)
    }

    // ------------------------------------------------------------
    // MARK: Extensions
    // ------------------------------------------------------------

    private val ReadableMap.configuration: ReadableMap?
        get() = getMap("configuration")


    private val ReadableMap.transactionMode: Int?
        get() = getInt("transactionMode")

    private val ReadableMap.token: String?
        get() = getString("token")


    private val ReadableMap.secret: String?
        get() = getString("secret")


    private val ReadableMap.isSandboxed: Boolean?
        get() = getBoolean("sandboxed")


    private val ReadableMap.judoId: String?
        get() = configuration?.getString("judoId")



    private val ReadableMap.siteId: String?
        get() = if(configuration?.hasKey("siteId")!!) {
                configuration?.getString("siteId")
            } else {
                null
            }

    private val ReadableMap.amount: ReadableMap?
        get() = configuration?.getMap("amount")


    private val ReadableMap.amountValue: String?
        get() = amount?.getString("value")

    private val ReadableMap.currencyValue: String?
        get() = amount?.getString("currency")

    private val ReadableMap.reference: ReadableMap?
        get() = configuration?.getMap("reference")

    private val ReadableMap.consumerReference: String?
        get() = reference?.getString("consumerReference")

    private val ReadableMap.paymentReference: String?
        get() = reference?.getString("paymentReference")


    private val ReadableMap.metadata: ReadableMap?
        get() = if (reference?.hasKey("metadata")!!) {
                reference?.getMap("metadata")
            } else {
                null
            }

    private val ReadableMap.cardNetworkValue: Int?
        get() = if(configuration?.hasKey("supportedCardNetworks")!!) {
                configuration?.getInt("supportedCardNetworks")
            } else {
                null
            }

    private val ReadableMap.paymentMethodValue: Int?
        get() = if(configuration?.hasKey("paymentMethods")!!) {
                configuration?.getInt("paymentMethods")
            } else {
                null
            }

    private val ReadableMap.uiConfiguration: ReadableMap?
        get() = if(configuration?.hasKey("uiConfiguration")!!) {
                configuration?.getMap("uiConfiguration")
            } else {
                null
            }

    private val ReadableMap.isAVSEnabled: Boolean?
        get() = uiConfiguration?.getBoolean("isAVSEnabled")


    private val ReadableMap.shouldDisplayAmount: Boolean?
        get() =  uiConfiguration?.getBoolean("shouldDisplayAmount")

    private val ReadableMap.primaryAccountDetails: ReadableMap?
        get() = if(configuration?.hasKey("primaryAccountDetails")!!) {
                configuration?.getMap("primaryAccountDetails")
            } else {
                null
            }

    private val ReadableMap.name: String?
        get() = if(primaryAccountDetails.hasKey("name")!!) {
                primaryAccountDetails?.getString("name")
            } else {
                null
            }

    private val ReadableMap.accountName: String?
        get() = if(primaryAccountDetails?.hasKey("name")!!) {
                primaryAccountDetails?.getString("name")
            } else {
                null
            }

    private val ReadableMap.dateOfBirth: String?
        get() = if(primaryAccountDetails?.hasKey("dateOfBirth")!!) {
                primaryAccountDetails?.getString("dateOfBirth")
            } else {
                null
            }

    private val ReadableMap.postCode: String?
        get() = if(primaryAccountDetails?.hasKey("postCode")!!) {
                primaryAccountDetails?.getString("postCode")
            } else {
                null
            }

    private val ReadableMap.googlePayConfiguration: ReadableMap?
        get() = if(configuration?.hasKey("googlePayConfiguration")!!     ) {
                configuration?.getMap("googlePayConfiguration")
            } else {
                null
            }

    private val ReadableMap.countryCode: String?
        get() = googlePayConfiguration?.getString("countryCode")

    private val ReadableMap.environmentValue: Int?
        get() = googlePayConfiguration?.getInt("environment")


    private val ReadableMap.isEmailRequired: Boolean?
        get() = googlePayConfiguration?.getBoolean("isEmailRequired")

    private val ReadableMap.isBillingAddressRequired: Boolean?
        get() = googlePayConfiguration?.getBoolean("isBillingAddressRequired")

    private val ReadableMap.isShippingAddressRequired: Boolean?
        get() = googlePayConfiguration?.getBoolean("isShippingAddressRequired")

    private val ReadableMap.billingAddressParameters: ReadableMap?
        get() = if(googlePayConfiguration?.hasKey("billingAddressParameters")!!) {
                googlePayConfiguration?.getMap("billingAddressParameters")
            } else {
                null
            }

    private val ReadableMap.shippingAddressParameters: ReadableMap?
        get() = if(googlePayConfiguration?.hasKey("shippingAddressParameters")!!) {
                googlePayConfiguration?.getMap("shippingAddressParameters")
            } else {
                null
            }

    private val ReadableMap.isBillingPhoneNumberRequired: Boolean?
        get() = billingAddressParameters?.getBoolean("isPhoneNumberRequired")

    private val ReadableMap.addressFormat: Int?
        get() = billingAddressParameters?.getInt("addressFormat")


    private val ReadableMap.isShippingPhoneNumberRequired: Boolean?
        get() = shippingAddressParameters?.getBoolean("isPhoneNumberRequired")

    private val ReadableMap.allowedCountryCodeList: ReadableArray?
        get() = if(shippingAddressParameters?.hasKey("allowedCountryCodes")!!) {
                shippingAddressParameters?.getArray("allowedCountryCodes")
            } else {
                null
            }

    // ------------------------------------------------------------
    // MARK: React Native methods
    // ------------------------------------------------------------

    override fun getName(): String {
        return "RNJudo"
    }
}