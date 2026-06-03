package com.samsungremote

import android.content.Context
import android.hardware.ConsumerIrManager
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = IRBlasterModule.NAME)
class IRBlasterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "IRBlasterModule"
    }

    private val irManager: ConsumerIrManager? by lazy {
        reactApplicationContext.getSystemService(Context.CONSUMER_IR_SERVICE) as? ConsumerIrManager
    }

    override fun getName(): String = NAME

    /**
     * Check whether the device has an IR blaster
     */
    @ReactMethod
    fun hasIRBlaster(promise: Promise) {
        try {
            val available = irManager?.hasIrEmitter() ?: false
            promise.resolve(available)
        } catch (e: Exception) {
            promise.reject("IR_ERROR", "Failed to check IR blaster: ${e.message}", e)
        }
    }

    /**
     * Transmit a Samsung IR command
     * @param frequency  Carrier frequency in Hz (Samsung uses 38000)
     * @param pattern    Array of ON/OFF durations in microseconds
     */
    @ReactMethod
    fun transmit(frequency: Int, pattern: ReadableArray, promise: Promise) {
        try {
            val ir = irManager
                ?: return promise.reject("IR_UNAVAILABLE", "ConsumerIrManager not available on this device")

            if (!ir.hasIrEmitter()) {
                return promise.reject("IR_UNAVAILABLE", "This device does not have an IR blaster")
            }

            val patternArray = IntArray(pattern.size()) { i -> pattern.getInt(i) }
            ir.transmit(frequency, patternArray)
            promise.resolve(true)
        } catch (e: SecurityException) {
            promise.reject("IR_PERMISSION", "Missing TRANSMIT_IR permission: ${e.message}", e)
        } catch (e: Exception) {
            promise.reject("IR_ERROR", "Failed to transmit IR signal: ${e.message}", e)
        }
    }

    /**
     * Get supported carrier frequencies
     */
    @ReactMethod
    fun getCarrierFrequencies(promise: Promise) {
        try {
            val ir = irManager
                ?: return promise.reject("IR_UNAVAILABLE", "ConsumerIrManager not available")

            val ranges = ir.carrierFrequencies
            val result = WritableNativeArray()

            ranges?.forEach { range ->
                val rangeMap = WritableNativeMap()
                rangeMap.putInt("minFrequency", range.minFrequency)
                rangeMap.putInt("maxFrequency", range.maxFrequency)
                result.pushMap(rangeMap)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("IR_ERROR", "Failed to get carrier frequencies: ${e.message}", e)
        }
    }
}
