# Neumu-Mobile

## Release (Android)

### Gerar AAB (Android App Bundle)

- Guia base [react-native/docs](https://reactnative.dev/docs/signed-apk-android)


1. Crie a keystore e insira os valores abaixo (se o arquivo .keystore já existir na pasta "android/app", pode seguir para o próximo passo).

```
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias androidreleasekey -keyalg RSA -keysize 2048 -validity 10000

    Password: "*****"
    Name: Atos Brasil
    Organizational Unit: AMS
    Organization: Atos
    City: Londrina
    State: Paraná
    State (acronym): PR

    --> TYPE 'yes'
```

2. Crie os as chaves **RELEASE_KEYSTORE_FILE**, **RELEASE_STORE_PASSWORD**, **RELEASE_KEY_ALIAS**, **RELEASE_KEY_PASSWORD** com seus respectivos valores no arquivo gradle.properties:

```
vi ~/.gradle/gradle.properties
or
android/gradle.properties
```

3. Gerando o arquivo .aab

```
cd android/ && ./gradlew clean && cd ..

npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

ENVFILE=.env cd android/ && ./gradlew bundleRelease && cd .. (carrega as variaveis de ambiente do arquivo .env se necessário)
```

- Se informar que há mais de um daemon do Gradle em execução, execute "./gradlew --stop" na pasta android.


* Para consultar as propriedades do gradle.properties execute:

```
cd android/ && ./gradlew -q printProperties && cd ..
```

### Testing Release

```
npx react-native run-android --variant=release
or
yarn android --variant=release
```

---

## Release (iOS)

- coming soon...