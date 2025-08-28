# Strava API Calls Overview

## Relevant Files

- **Component**: `src/components/routes/StravaApp.vue`
- **Store**: `src/stores/strava.ts`

## API Calls

### 1. Initial Component Mount (onMounted)

- **API Call**: `GET /strava-account` (via `stravaStore.loadAccount()`)
- **Purpose**: Load existing Strava account data if any
- **Triggered**: When StravaApp component mounts and no account exists in store

### 2. Connect New Account Flow

- **Step 1**: `GET /strava-auth-url?scope={read|read_all}` (via `stravaStore.loadAuthUrl()`)
  - Purpose: Get Strava OAuth authorization URL
  - User clicks "Link to App" button
- **Step 2**: Browser redirects to Strava for OAuth
- **Step 3**: `GET /strava-auth?code={auth_code}` (via `stravaStore.authAccount()`)
  - Purpose: Exchange OAuth code for account connection
  - Triggered when user returns from Strava with code parameter

### 3. Update Existing Account

- **API Call**: `GET /strava-auth?code={valid_code}` (via `stravaStore.authAccount()`)
- **Purpose**: Update existing Strava account connection with new auth code
- **Result**: Updates account data including user info, sync status, hashtags

### 4. Sync Account Data

- **API Call**: `GET /strava-account-sync` (via `stravaStore.syncAccount()`)
- **Purpose**: Sync activities from Strava to local trips
- **Triggered**: User clicks "Sync" button
- **Returns**: Sync results (activities, new/synced trips counts)

### 5. Disconnect Account

- **API Call**: `DELETE /strava-account` (via `stravaStore.disconnectAccount()`)
- **Purpose**: Disconnect Strava account
- **Triggered**: User clicks "Disconnect" button
- **Result**: Removes account data from store
