# KazaRice
KazaRice, is a food delevery app


# Installation

Atfer git cloning run  
```bash
npm install 
```   
to install all needed dependencies ensure you have installed ionic globally.

# Testing or development

To test/run the application use 
```bash
ionic serve 
```


## Icon and Splash Screen

To change/generate icon & splash screen for Capacitor based projects first run

```bash
sudo npm install -g cordova-res
```

After successfull installation create a folder in the root directory with the name resources.


# Building the application

To 

```bash
ionic build

ionic cap add ios
npx cap add ios

ionic cap add android
npx cap add android
```

After building the android and ios apps run 

```bash
npx cap open android
npx cap open ios
```

to open the in android studio or xcode


# Required files
Add your icon.png (1024x1024 px) and splash.png (2732x2732 px) files to the 'resources' folder under the root of your capacitor based project.

All you have to do then is type :

```bash
npm run resources

cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy

npx cap sync
```
cd ios


```bash
ionic cap sync
npx cap sync
```

# Changes Android

In your android folder make changes to the following 
`android/app/src/main/AndroidManifest.xml`

```xml
    <application
      android:usesCleartextTraffic="true" 
      ...
    >

    ...

    </application>


    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- I added from here -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <!-- ends here -->
```

# Changes for iOS

In your ios folder make changes to the following 
`ios/App/App/Info.plist`

```plist

  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>

    ...
    ...
    ...


    <key>NSCameraUsageDescription</key>
    <string>To capture images</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>To add images</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>To store images</string>
    
  </dict>
  </plist>

```

## capacitor Browser(in app Browser) Setup

In android go to `android/variables.gradle` then add this changes;

```gradle
    androidxBrowserVersion = '1.4.0'
```

no changes for iOS; as iOS, this uses SFSafariViewController and is compliant with leading OAuth service in-app-browser requirements.



## capacitor App

### iOS Changes
For being able to open the app from a custom scheme you need to register the scheme first. You can do it by editing the Info.plist file and adding this lines.

```plist
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.getcapacitor.capacitor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>mycustomscheme</string>
    </array>
  </dict>
</array>
```

### Android Changes
For being able to open the app from a custom scheme you need to register the scheme first. You can do it by adding this lines inside the activity section of the AndroidManifest.xml.

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="@string/custom_url_scheme" />
</intent-filter>
```

custom_url_scheme value is stored in strings.xml. When the Android platform is added, @capacitor/cli adds the app's package name as default value, but can be replaced by editing the strings.xml file.

#

## @capacitor/push-notifications

# iOS
On iOS you must enable the Push Notifications capability. See Setting Capabilities for instructions on how to enable the capability.

After enabling the Push Notifications capability, add the following to your app's AppDelegate.swift:

```swift
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
  NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
}

func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
  NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
}
```

# Android
In android go to `android/variables.gradle` then add this changes;

```gradle
    firebaseMessagingVersion = '23.0.5'
```

The Push Notification API uses Firebase Cloud Messaging SDK for handling notifications. See Set up a Firebase Cloud Messaging client app on Android and follow the instructions for creating a Firebase project and registering your application. There is no need to add the Firebase SDK to your app or edit your app manifest - the Push Notifications provides that for you. All that is required is your Firebase project's google-services.json file added to the module (app-level) directory of your app.





# Capacitor Community Native Market Plugin

iOS Platform: No further action required.

Android Platform: Register the plugin in your main activity:

```
import com.getcapacitor.community.nativemarket.NativeMarket;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(NativeMarket.class);
    }});
  }
}

```
