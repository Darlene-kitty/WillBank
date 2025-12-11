# Fix for Network Error during Registration

## Problem
You're experiencing a **Network Error** when trying to register in the mobile app. This error occurs because:

1. **Expo Go doesn't support HTTP cleartext traffic** - Expo Go (the app you scan QR codes with) blocks insecure HTTP requests for security reasons
2. Android (API 28+) requires explicit permission for HTTP traffic
3. The app needs to connect to your local backend at `http://10.0.2.2:8081` (emulator) or `http://192.168.x.x:8081` (physical device)

## Solutions

### Option 1: Use Custom Development Build (RECOMMENDED)

Create a custom development build that allows HTTP traffic:

```powershell
# Navigate to MobileBank directory
cd D:\Projects\WillBank\MobileBank

# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo (create account if needed)
eas login

# Build custom development client for Android
eas build --profile development --platform android

# Or build locally (faster, requires Android Studio)
npx expo run:android
```

After building:
- Install the generated APK on your device/emulator
- The app will now support HTTP cleartext traffic

### Option 2: Use Your Machine's IP Address (QUICK FIX for Physical Devices)

If testing on a **physical device** connected to the same WiFi:

1. Open `MobileBank\config\environment.ts`
2. Find the line: `const USE_PHYSICAL_DEVICE = false;`
3. Change it to: `const USE_PHYSICAL_DEVICE = true;`
4. Make sure the IP address matches your machine: `192.168.43.26` (check with `ipconfig`)
5. Restart the Expo dev server

### Option 3: Test with HTTPS (PRODUCTION-LIKE)

Set up HTTPS locally (more complex but production-ready):
- Configure SSL certificates for your backend
- Update `environment.ts` to use `https://` URLs

### Option 4: Use Android Emulator with Custom Build

If using Android Emulator:

```powershell
# Build and run directly on emulator
cd D:\Projects\WillBank\MobileBank
npx expo run:android
```

This creates a development build with HTTP support enabled.

## Current Configuration Status

✅ **FIXED**: Added `"usesCleartextTraffic": true` to app.json
✅ **FIXED**: Improved error logging in API interceptors
✅ **FIXED**: Fixed unreachable code in environment.ts

## Quick Test Steps

1. **Verify backend is running**:
   ```powershell
   # Check if services are running on ports 8081, 8082, 8083
   Get-NetTCPConnection -LocalPort 8081,8082,8083 -State Listen
   ```

2. **Check your IP address**:
   ```powershell
   ipconfig | Select-String "IPv4"
   ```

3. **Test backend from your machine**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Body '{"email":"test@example.com","password":"Test123!@#"}' -ContentType "application/json"
   ```

## Environment Configuration

Current configuration in `config/environment.ts`:

- **Web**: `http://localhost:8081`
- **Android Emulator**: `http://10.0.2.2:8081`
- **Physical Device**: `http://192.168.43.26:8081` (when USE_PHYSICAL_DEVICE = true)
- **iOS Simulator**: `http://localhost:8081`

## Debugging Tips

When you run the app, check the console logs:
- Look for: "Creating API instance with baseURL: ..."
- For network errors, you'll see detailed logs including the attempted URL

## Next Steps

**RECOMMENDED ACTION**: Build a custom development client

```powershell
cd D:\Projects\WillBank\MobileBank
npx expo run:android
```

This will:
1. Generate a development build with HTTP support
2. Install it on your connected device/emulator
3. Allow you to use the app with your local backend

**NOTE**: After creating the custom build, you won't use Expo Go anymore. Instead, you'll use the custom app that gets installed on your device/emulator.
