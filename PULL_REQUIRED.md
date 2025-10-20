# ⚠️ GIT PULL RICHIESTO!

## Se vedi l'errore: "minSdkVersion 28 cannot be smaller than version 29"

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

- `minSdk` aumentato da 28 a 29 (Android 10)
- Aggiunta configurazione `packaging` per risolvere conflitti TensorFlow
- Rimossi file duplicati che causavano errori di compilazione

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
