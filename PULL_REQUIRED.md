# ⚠️ GIT PULL RICHIESTO!

## Se vedi uno di questi errori:

- ❌ "minSdkVersion 28 cannot be smaller than version 29"
- ❌ "Compilation error in :domain:compileDebugKotlin"
- ❌ "Redeclaration: NotificationPublisher"
- ❌ "Redeclaration: NotificationActions"
- ❌ "Could not find method android()"
- ❌ "No native library found for os.name=Windows" (Room KAPT error)
- ❌ "Execution failed for task ':data:kaptDebugKotlin'"

Significa che NON hai ancora scaricato gli ultimi aggiornamenti dal repository.

## Come risolvere:

### In Android Studio:

1. Apri il terminale in basso
2. Esegui:
```bash
git pull origin claude/start-mobile-app-011CUJyUVQaeqa2KTYSEQfyY
```

### Oppure tramite GUI:

1. **VCS → Git → Pull...**
2. Clicca **Pull**

---

## Dopo il Pull:

1. **File → Sync Project with Gradle Files**
2. **Build → Clean Project**
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## ✅ Cosa è stato modificato:

- ✅ `minSdk` aumentato da 28 a 29 (Android 10)
- ✅ Aggiunta configurazione `packaging` per risolvere conflitti TensorFlow
- ✅ Rimosso file `app/build.gradle` duplicato e incompleto
- ✅ Rimosso `NotificationPublisher` duplicato da Entities.kt
- ✅ Rimosso `NotificationPublisher.kt` ridondante
- ✅ Rimosso `Notifier.kt` (implementazione vecchia non usata)
- ✅ Rimosso `NotificationIntents.kt` (duplicato di NotificationActions)
- ✅ Aggiunta dipendenza `sqlite-jdbc` per Room KAPT su Windows
- ✅ Configurato Room annotation processor con argomenti corretti

---

## 🔍 Verifica che il Pull abbia funzionato:

Apri `app/build.gradle.kts` e controlla la riga 15:

```kotlin
minSdk = 29  // ← DEVE essere 29!
```

Se vedi ancora `minSdk = 28`, il pull NON ha funzionato.

In quel caso prova:
```bash
git stash
git pull origin claude/start-mobile-app-011CUJyUVQaeqa2KTYSEQfyY
git stash pop
```
