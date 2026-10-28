# Private configuration

Credentials were removed from the `problems` branch source on 2026-10-28. This historical branch uses `MONGO`, `AUTHTOKEN`, `ACCOUNTSID` and `TWILIONUMBER` for database and Twilio configuration, alongside `PORT` and `CORS_ORIGIN`. Supply the required values in the runtime environment before starting the application. The tracked `.env` leaves sensitive fields empty; existing dotenv loading remains unchanged.

The application may be unavailable until configuration is supplied. Old values may remain in Git history, forks and local clones; current-source cleanup does not revoke them. Rotate exposed credentials with their providers. No live credentials were tested or services accessed during this change.
