# Router rules

## List of variables relevant for routing user (allowed-disallowed pages)

- user is logged in
- user email is verified
- app is accessible (phase = registration, entry_enabled, or results)
- user is registered into challenge
- user is admin (company coordinator)
- registration phase is active

## List of access types (sets of allowed-disallowed pages)

- login (login, register, confirm email, password)
- verify email (only)
- challenge inactive (only)
- register challenge (register-challenge, register-coordinator)
- app full (home, routes, prizes, results, profile)

| Logged in | Email Verified | App Accessible | Registration Complete | User Admin | Registration Active |            Access             |
| :-------: | :------------: | :------------: | :-------------------: | :--------: | :-----------------: | :---------------------------: |
|     ✗     |       -        |       -        |           -           |     -      |          -          |             login             |
|     ✓     |       ✗        |       -        |           -           |     -      |          -          |         verify email          |
|     ✓     |       ✓        |       ✗        |           -           |     -      |          -          |      challenge inactive       |
|     ✓     |       ✓        |       ✓        |           ✓           |     -      |          -          |           app full            |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✗      |          ✓          |      register challenge       |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✗      |          ✗          |      challenge inactive       |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✓      |          ✓          | app full + register-challenge |
|     ✓     |       ✓        |       ✓        |           ✗           |     ✓      |          ✗          |           app full            |

- User Admin decides on further access inside the full app access (company coordinator), but this is not yet implemented via router rules.
- Access "app full + register-challenge" only allows register-challenge route (not register-coordinator).
