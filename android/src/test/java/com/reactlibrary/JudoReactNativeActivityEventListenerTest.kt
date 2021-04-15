package com.reactlibrary

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.judopay.judokit.android.JUDO_ERROR
import com.judopay.judokit.android.JUDO_RESULT
import com.judopay.judokit.android.PAYMENT_ERROR
import com.judopay.judokit.android.PAYMENT_SUCCESS
import com.judopay.judokit.android.model.JudoError
import com.judopay.judokit.android.model.JudoResult
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkClass
import io.mockk.mockkStatic
import io.mockk.spyk
import io.mockk.verify
import junit.framework.TestCase.assertNotNull
import junit.framework.TestCase.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

@DisplayName("Testing JudoReactNativeActivityEventListener")
class JudoReactNativeActivityEventListenerTest {

    private val promiseMock = spyk<Promise>()
    private val dataMock = mockkClass(Intent::class)
    private val activityMock = mockkClass(Activity::class)
    private val judoErrorMock = mockkClass(JudoError::class)
    private val judoResultMock = mockk<JudoResult>(relaxed = true)
    private val mappedJudoResultMock = mockk<WritableMap>(relaxed = true)

    private val sut = JudoReactNativeActivityEventListener()

    @BeforeEach
    fun setUp() {
        mockkStatic("com.reactlibrary.HelpersKt")
        every { judoErrorMock.message } returns "Message"
        every { dataMock.getParcelableExtra<JudoError>(eq(JUDO_ERROR)) } returns judoErrorMock
        every { dataMock.getParcelableExtra<JudoResult>(eq(JUDO_RESULT)) } returns judoResultMock
        every { getMappedResult(judoResultMock) } returns mappedJudoResultMock
    }

    @Nested
    @DisplayName("Given onActivityResult is invoked")
    inner class OnActivityResultIsInvoked {

        @Test
        @DisplayName("when request code is different than JUDO_PAYMENT_WIDGET_REQUEST_CODE then nothing should happen")
        fun nothingShouldHappenWhenRequestCodeDifferentThanJudoPaymentWidgetRequestCode() {
            sut.transactionPromise = promiseMock
            sut.onActivityResult(activityMock, 100, 100, dataMock)

            verify { promiseMock wasNot Called }
            assertNotNull(sut.transactionPromise)
        }

        @Test
        @DisplayName("when requestCode is JUDO_PAYMENT_WIDGET_REQUEST_CODE and resultCode is PAYMENT_ERROR then promise should reject")
        fun rejectPromiseWhenRequestCodeIsJudoPaymentWidgetRequestCodeAndResultCodeIsPaymentError() {
            sut.transactionPromise = promiseMock
            sut.onActivityResult(activityMock, JUDO_PAYMENT_WIDGET_REQUEST_CODE, PAYMENT_ERROR, dataMock)

            verify { promiseMock.reject(eq(JUDO_PROMISE_REJECTION_CODE), "Message") }
            assertNull(sut.transactionPromise)
        }

        @Test
        @DisplayName("when requestCode is JUDO_PAYMENT_WIDGET_REQUEST_CODE and resultCode is PAYMENT_SUCCESS then promise should resolve with result object")
        fun resolvePromiseWithResultObjectWhenRequestCodeIsJudoPaymentWidgetRequestCodeAndResultCodeIsPaymentSuccess() {
            sut.transactionPromise = promiseMock
            sut.onActivityResult(activityMock, JUDO_PAYMENT_WIDGET_REQUEST_CODE, PAYMENT_SUCCESS, dataMock)

            verify { promiseMock.resolve(mappedJudoResultMock) }
            assertNull(sut.transactionPromise)
        }
    }
}
