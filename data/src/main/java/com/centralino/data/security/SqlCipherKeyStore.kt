package com.centralino.data.security

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import java.security.SecureRandom

object SqlCipherKeyStore {
    private const val FILE = "secret_prefs"
    private const val KEY = "sqlcipher_passphrase"

    fun getOrCreateKey(context: Context): ByteArray {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        val prefs = EncryptedSharedPreferences.create(
            context, FILE, masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

        val base64 = prefs.getString(KEY, null)
        if (base64 != null) return android.util.Base64.decode(base64, android.util.Base64.DEFAULT)

        val buf = ByteArray(32).also { SecureRandom().nextBytes(it) }
        prefs.edit().putString(KEY, android.util.Base64.encodeToString(buf, android.util.Base64.DEFAULT)).apply()
        return buf
    }
}