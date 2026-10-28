# Private configuration

Committed credentials were removed from the current source on 2026-10-28. The old values may remain in Git history or other copies; removing them from the latest files does not revoke them.

Set the following values in the runtime environment before starting the application:

- `MONGO`
- `APPLICATIONID`
- `CLIENTID`
- `CLIENTSECRET`
- `AUTHORIZATIONHEADER`
- `SESSION_SECRET`

The existing dotenv loader remains in use. Environment variables supplied by the deployment take precedence over the blank tracked fields. Supply local values privately and do not commit them.

Rotate or revoke exposed service credentials with their providers. Keep encryption-key migration and session invalidation in mind. The application, database access, mail delivery or bot login may remain unavailable until configuration is supplied. No live credentials were tested, and no services were accessed as part of this change.
