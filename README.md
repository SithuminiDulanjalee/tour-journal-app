**[📦 Download the APK](../../releases/latest)**

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
"# tour-journal-app"

<div align="center">

# ✈️ VoyaLink

### Your travels, remembered.

*A cross-platform travel journal app*

![Platform](https://img.shields.io/badge/platform-Android-3DDC84?logo=android&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-Coursework-lightgrey)

**[📦 Download the APK](../../releases/latest)** · **[🐛 Report an issue](../../issues)** · **[📖 Jump to setup](#-getting-started)**

</div>

---

## 📱 About

VoyaLink is a personal travel diary. Log a trip, search for or pin the
exact place it happened, attach photos and the app automatically captures
the weather at that moment — then browse every trip you've ever logged on
one interactive map. Every entry is private to the account that created
it.

<table>
<tr>
<td width="50%" valign="top">

### ✨ Highlights
- 🔐 Email/password authentication with persistent sessions
- 📓 Full Create · Read · Update · Delete on trip entries
- 🔍 Live search across trip titles and locations
- 📷 Multi-photo upload with individual removal
- 📍 Search a place by name **or** use your live GPS position
- ☁️ Automatic weather lookup for the pinned location
- 🗺️ All trips visualized as pins on one interactive map
- 🗓️ Retroactive date logging with a native date picker

</td>
<td width="50%" valign="top">

### 🧱 Built With
- **React Native** + **Expo Router** (file-based routing)
- **NativeWind** — Tailwind CSS for native styling
- **Firebase** — Authentication + Cloud Firestore
- **Cloudinary** — photo hosting
- **OpenWeatherMap** — live weather data
- **react-native-maps** — Google Maps integration
- **TypeScript** throughout, strict mode

</td>
</tr>
</table>

## 📸 Screenshots

<div align="center">

| Login | My Trips | Add Entry | Map |
|:---:|:---:|:---:|:---:|
| <img width="765" height="1600" alt="260e1ea1-fe5b-421c-8452-ad2813e93bbc" src="https://github.com/user-attachments/assets/8821284e-51af-451f-be40-d86fc13257f9" /> | <img width="770" height="1600" alt="4a20616e-1e5f-42b8-9ac2-baf34148c7c0" src="https://github.com/user-attachments/assets/0f208660-3127-4eae-933e-bde8f9b45126" /> | <img width="766" height="1600" alt="1a75564f-bee0-4e1d-b146-8f1c94c5a699" src="https://github.com/user-attachments/assets/b7349d9f-a7aa-4847-9bd6-b1dae5e48f95" /> | <img width="764" height="1600" alt="7a8785e3-b5a0-4316-85b0-daecf6b7bcba" src="https://github.com/user-attachments/assets/482d2327-d550-4ea5-8d28-b89baf7247c1" /> |

</div>

## 🏗️ Architecture

```
app/_layout.tsx                    (root — providers + Slot)
   └── app/index.tsx                (auth gate → /login or /home)
         ├── app/(auth)/            login · register            [Stack]
         └── app/(dashboard)/       [Tabs: Trips · Map · Profile]
               └── home/            index → add → [id]           [nested Stack]

Screens → hooks (useAuth, useTravel) → context → service/ → Firebase · Cloudinary · OpenWeatherMap
```

Screens never talk to Firebase or Cloudinary directly — every request flows
through a Context hook into a plain-function service. This keeps each
layer independently testable, and it's why most fixes during development
only ever touched `service/` files, never the screens themselves.

<details>
<summary><strong>📂 Full project structure</strong></summary>

```
tour-journal-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (dashboard)/
│       ├── _layout.tsx
│       ├── home/
│       │   ├── _layout.tsx
│       │   ├── index.tsx        # Trip list + search
│       │   ├── add.tsx          # Add/Edit — photos, location, weather, date
│       │   └── [id].tsx         # Trip detail — map, edit, delete
│       ├── map.tsx              # All trips pinned on one map
│       ├── map.web.tsx          # Web fallback (react-native-maps is native-only)
│       └── profile.tsx
├── context/
│   ├── LoaderContext.tsx
│   ├── AuthContext.tsx
│   └── TravelContext.tsx
├── hooks/
│   ├── useLoader.ts
│   ├── useAuth.ts
│   └── useTravel.ts
├── service/
│   ├── firebase.ts
│   ├── authService.ts
│   ├── travelService.ts         # Firestore CRUD + Cloudinary photo upload
│   └── weatherService.ts
├── types/
│   └── index.ts
├── firestore.rules
├── eas.json
├── app.json
└── .env.example
```

</details>

## 🚀 Getting Started

### Prerequisites

| Requirement | Notes |
|---|---|
| Node.js LTS (v20+) | https://nodejs.org |
| [Expo Go](https://expo.dev/go) app | for testing on your phone |
| [Firebase](https://console.firebase.google.com) project | free tier |
| [Cloudinary](https://cloudinary.com/users/register/free) account | free tier, no card required |
| [OpenWeatherMap](https://openweathermap.org/api) API key | free tier |
| [Google Maps API key](https://console.cloud.google.com) | free tier, required for the Map tab in a real build |

### 1️⃣ Clone & install

```bash
git clone <this-repo-url>
cd tour-journal-app
npm install
```

### 2️⃣ Set up Firebase

1. Firebase Console → **Add project**
2. **Build → Authentication → Sign-in method → Email/Password → Enable**
3. **Build → Firestore Database → Create database → Start in test mode**
4. **Project Settings → Your apps → Add app → Web app** → copy the config values

> ⚠️ **Enabling Authentication does not create your Firestore Database automatically** — it's a separate step. Skipping it produces an error that looks like a network problem but isn't.

### 3️⃣ Apply Firestore security rules

Copy `firestore.rules` from this repo into **Firestore Database → Rules** in the console and click **Publish**. These rules ensure a user can only ever read or write their own trip entries.

### 4️⃣ Create the required Firestore index

**Firestore Database → Indexes → Add Index:**

| Field | Order |
|---|---|
| `userId` | Ascending |
| `date` | Descending |

Collection ID: `travelEntries` · Query scope: Collection. Wait for status **Enabled** before testing.

### 5️⃣ Set up Cloudinary

1. Sign up → note your **Cloud Name** from the Dashboard
2. **Settings → Upload → Add upload preset** → **Signing Mode: Unsigned** → save, noting the preset name

### 6️⃣ Set up Google Maps (for the Map tab)

1. Google Cloud Console → same project as Firebase → **APIs & Services → Library** → enable **Maps SDK for Android**
2. **APIs & Services → Credentials → Create Credentials → API Key**
3. Paste it into `app.json` → `android.config.googleMaps.apiKey`

### 7️⃣ Environment variables

```bash
cp .env.example .env
```
Fill in your Firebase, Cloudinary, and OpenWeatherMap values. `.env` is git-ignored — never commit real keys.

### 8️⃣ Run it

```bash
npx expo start -c
```
Scan the QR code with Expo Go. The `-c` flag clears the Metro cache — needed the first time you add or change `.env` values.

### 9️⃣ Build an installable APK

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

> 💡 A standalone build reads environment variables differently than local development — see [`eas env:create`](https://docs.expo.dev/eas/environment-variables/) if your built APK can't reach Firebase even though it works fine in Expo Go.

## 🗃️ Data Model

```
travelEntries (Firestore collection)
└── {entryId}
      userId        string
      title         string
      description   string
      location      { name, latitude, longitude }
      date          string (ISO)
      photos        string[]   ← Cloudinary secure_url values
      weather       { temp, condition }
      createdAt     server timestamp
      updatedAt     server timestamp
```

Every query and every security rule scopes access by `userId` — users only ever see their own trips.

## ✅ Rubric Coverage

| Criterion | Weight | Where it's satisfied |
|---|:---:|---|
| Functionality | 15% | Full CRUD, Auth, Firestore integration, live search |
| UI/UX | 10% | Consistent NativeWind styling, `FlatList` rendering, loading/empty/error states |
| State Management & Auth | 10% | `AuthContext` + `TravelContext`, async loading/error handling, per-user Firestore rules |
| Android Build | 10% | EAS-built APK, attached under [Releases](../../releases) |
| Git Commit History | 5% | Incremental, feature-scoped commits |
| Documentation & README | 5% | You're reading it |
| Creativity & Innovation | 5% | Location search + current-position tagging, live weather, multi-photo upload with removal |
| Viva/Presentation | 40% | Layered architecture designed to be explained end-to-end |

## 🧩 Known Limitations

- Single user role by design — no admin role, since every user only manages their own private trips
- Firestore rules, the composite index, and the Google Maps key are one-time manual console/config steps, not automated by the app itself
- No offline caching yet — requires an active connection to load or save trips

## 📄 License

Sithumini Dulanjalee ITS 2127 — Advanced Mobile Developer. IJSE
