# How to Install on Your Physical Android Phone

To run the app on your actual phone instead of an emulator, follow these steps:

## 1. Enable Developer Mode on Your Phone
1.  Open **Settings** on your Android phone.
2.  Scroll down to **About Phone**.
3.  Find **Build Number** (usually at the bottom).
4.  **Tap it 7 times** rapidly until you see a message "You are now a developer!".

## 2. Enable USB Debugging
1.  Go back to **Settings** > **System** > **Developer Options**.
2.  Scroll down and enable **USB Debugging**.
3.  (Optional) Enable "Install via USB" if you see it.

## 3. Connect to Computer
1.  Plug your phone into your computer via USB cable.
2.  Look at your phone screen: a prompt should appear asking "Allow USB debugging?".
3.  Check "Always allow from this computer" and tap **Allow**.

## 4. Run from Android Studio
1.  In Android Studio (top toolbar), look at the device dropdown menu (where it might say "Pixel_3a_API...").
2.  Click it and select **Your Phone's Name** (e.g., "Samsung SM-G991U").
3.  Click the Green **Play Button**.
4.  The app will build and install directly onto your phone.

---

## Alternative: Build an APK File
If you prefer to just copy a file to your phone:

1.  In Android Studio, go to menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2.  Wait for the notification "APK(s) generated successfully".
3.  Click **locate** in that notification (or go to `android/app/build/outputs/apk/debug/`).
4.  Copy the `app-debug.apk` file to your phone (via USB, Google Drive, or email).
5.  Open the file on your phone to install it.
