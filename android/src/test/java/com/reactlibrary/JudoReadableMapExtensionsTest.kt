package com.reactlibrary

import com.facebook.react.bridge.ReadableMap
import io.mockk.every
import io.mockk.mockkClass
import junit.framework.TestCase.assertEquals
import junit.framework.TestCase.assertNull
import org.junit.Before
import org.junit.Test

class JudoReadableMapExtensionsTest  {
    private val configMock = mockkClass(ReadableMap::class)
    private val sut = mockkClass(ReadableMap::class)

    private val transactionMode = 1
    private val token = "token"
    private val secret = "secret"
    private val isSandboxed = true
    private val judoId = "judoId"
    private val siteId = "siteId"
    private val cardNetworkValue = 1
    private val paymentMethodValue = 1

    @Before
    fun before() {
        every { configMock.getString("judoId") } returns judoId
        every { configMock.getString("siteId") } returns siteId
        every { configMock.getInt("supportedCardNetworks") } returns cardNetworkValue
        every { configMock.getInt("paymentMethods") } returns paymentMethodValue

        every { sut.getMap("configuration") } returns configMock
        every { sut.getInt("transactionMode") } returns transactionMode
        every { sut.getString("token") } returns token
        every { sut.getString("secret") } returns secret
        every { sut.getBoolean("sandboxed") } returns isSandboxed
    }

    @Test
    fun `Given configuration object contains transactionMode when invoking transactionMode then the transactionMode integer should be returned`() {
        assertEquals(sut.transactionMode, transactionMode)
    }

    @Test
    fun `Given configuration object contains token when invoking token then the token string should be returned`() {
        assertEquals(sut.token, token)
    }

    @Test
    fun `Given configuration object contains secret when invoking secret then the secret string should be returned`() {
        assertEquals(sut.secret, secret)
    }

    @Test
    fun `Given configuration object contains sandboxed when invoking isSandboxed then the sandboxed boolean should be returned`() {
        assertEquals(sut.isSandboxed, isSandboxed)
    }

    @Test
    fun `Given configuration object contains judoId when invoking judoId then the judoId string should be returned`() {
        assertEquals(sut.judoId, judoId)
    }

    @Test
    fun `Given configuration object contains siteId when invoking siteId then the siteId string should be returned`() {
        every { configMock.hasKey("siteId") } returns true

        assertEquals(sut.siteId, siteId)
    }

    @Test
    fun `Given configuration object has no siteId key when invoking siteId then the null should be returned`() {
        every { configMock.hasKey("siteId") } returns false

        assertNull(sut.siteId)
    }

    @Test
    fun `Given configuration object contains supportedCardNetworks when invoking cardNetworkValue then the supportedCardNetworks integer should be returned`() {
        every { configMock.hasKey("supportedCardNetworks") } returns true

        assertEquals(sut.cardNetworkValue, cardNetworkValue)
    }

    @Test
    fun `Given configuration object has no supportedCardNetworks key when invoking cardNetworkValue then null should be returned`() {
        every { configMock.hasKey("supportedCardNetworks") } returns false

        assertNull(sut.cardNetworkValue)
    }
    @Test
    fun `Given configuration object contains paymentMethods when invoking paymentMethodValue then the paymentMethods integer should be returned`() {
        every { configMock.hasKey("paymentMethods") } returns true

        assertEquals(sut.paymentMethodValue, paymentMethodValue)
    }

    @Test
    fun `Given configuration object has no paymentMethods key when invoking paymentMethodValue then null should be returned`() {
        every { configMock.hasKey("paymentMethods") } returns false

        assertNull(sut.paymentMethodValue)
    }
}