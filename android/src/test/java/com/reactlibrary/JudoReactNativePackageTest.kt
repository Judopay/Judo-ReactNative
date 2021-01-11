package com.reactlibrary

import com.facebook.react.bridge.ReactApplicationContext
import io.mockk.justRun
import io.mockk.mockkClass
import junit.framework.TestCase.assertEquals
import junit.framework.TestCase.assertSame
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

@DisplayName("Testing JudoReactNativePackage class")
class JudoReactNativePackageTest {

    private val reactContextMock: ReactApplicationContext = mockkClass(ReactApplicationContext::class)
    private lateinit var sut: JudoReactNativePackage

    @BeforeEach
    fun setUp() {
        sut = JudoReactNativePackage()
        justRun { reactContextMock.addActivityEventListener(any()) }
    }

    @Nested
    @DisplayName("Given a JudoReactNativePackage instance is created")
    inner class JudoReactNativePackageInstanceCreated {

        @Test
        @DisplayName("when invoking createNativeModules on it then an array containing only one instance of JudoReactNativeModule should be returned")
        fun returnOneInstanceOfJudoReactNativeModuleWhenInvokingCreateNativeModules() {
            val modules = sut.createNativeModules(reactContextMock)

            assertEquals(modules.size, 1)
            assertSame(modules.first()::class.java, JudoReactNativeModule::class.java)
        }

        @Test
        @DisplayName("when invoking createViewManagers on it then an array containing only one instance of JudoReactNativePBBAManager should be returned")
        fun returnOneInstanceOfJudoReactNativePBBAManagerWhenInvokingCreateViewManagers() {
            val managers = sut.createViewManagers(reactContextMock)

            assertEquals(managers.size, 1)
            assertSame(managers.first()::class.java, JudoReactNativePBBAManager::class.java)
        }
    }
}
