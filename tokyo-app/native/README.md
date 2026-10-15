# 沿線まち図鑑 Android アプリ(Capacitor)

Web アプリ(`../app`)を Android アプリにしたものです。お散歩の位置情報は、**画面を消しても取り続けます**(通知に「お散歩を記録しています」と表示されます)。

## APK をスマホに入れる
1. `dist/ensen-zukan-debug.apk` をスマホに送る(USB、メール、クラウドなど)
2. スマホで開いてインストールする(「提供元不明のアプリ」の許可が求められます)
3. 初回のお散歩で、位置情報(「常に許可」または「アプリの使用中のみ」)と通知を許可する

## 作り直す(Web アプリを変更したあと)
```
cd tokyo-app/native
node sync-web.js            # ../app を www/ に複製
npx cap sync android
cd android
gradlew.bat assembleDebug   # JAVA_HOME は Android Studio の jbr、sdk.dir は local.properties
```
- できあがり: `android/app/build/outputs/apk/debug/app-debug.apk`
- `local.properties` には `sdk.dir=C:/Users/<名前>/AppData/Local/Android/Sdk`(スラッシュ区切り)を書く

## 仕組み
- `capacitor.config.json`: アプリ名・ID(`jp.tomoiks.ensenzukan`)
- プラグイン: `@capacitor-community/background-geolocation`(フォアグラウンドサービスで位置情報を取得)
- Web 側(`../app/index.html`)は、ネイティブで動いているときだけ `BackgroundGeolocation` を使い、ブラウザでは従来の `navigator.geolocation` を使う

## 制約
- 配布用の署名(リリース版)はしていません。デバッグ版の APK です
- iOS 版は、Mac と Xcode が必要なため、ここでは作っていません(`npx cap add ios` で作れます)
- Google ログイン(Firebase 同期)は、アプリ内の WebView では動かない可能性があります
