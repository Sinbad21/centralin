# Centralino Anti-Spam

Requisiti minimi: Android 13+

Permessi richiesti: READ_CONTACTS, READ_PHONE_STATE, ANSWER_PHONE_CALLS, CALL_SCREENING, POST_NOTIFICATIONS, RECORD_AUDIO (opz.), READ/WRITE_CALL_LOG (opz.).

Configurazione ruolo:
- Impostare l'app come servizio di Call Screening dalle impostazioni di sistema (RoleManager). L'app chiederà il ruolo al primo avvio.

Limitazioni Android:
- Le API non consentono "inoltro" diretto di una chiamata rifiutata; il flusso baseline simula pre-screening con rifiuto e notifica all'utente per richiamare/accettare manualmente. Alcuni OEM limitano auto-answer.
- iOS non consente bot attivo; solo Call Directory per lookup (hook futuro).

Architettura:
- Moduli: app (UI/DI), domain (use case), data (Room + SQLCipher), telephony (CallScreeningService + notifiche), bot (orchestratore IVR), ml (scoring spam).

