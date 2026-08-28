

# rn-login-kit

Reusable React Native Login Kit with Social Authentication.

## Kurulum (Installation)

Bu paketi projenize eklemek için aşağıdaki adımları takip edin:

### Adım 1: npm'i GitHub Packages için Yapılandırın

Paketiniz GitHub Packages'ta barındırıldığı için, npm'in bu kayıt defterinden paketleri indirebilmesi için yapılandırılması gerekir. Projenizin kök dizininde `.npmrc` adında bir dosya oluşturun ve aşağıdaki içeriği ekleyin:

```
@machineco-arge:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT_OR_GH_TOKEN
```

*   `YOUR_GITHUB_PAT_OR_GH_TOKEN` yerine, GitHub hesabınızdan oluşturduğunuz ve `read:packages` kapsamına sahip bir Kişisel Erişim Belirteci (PAT) kullanın. CI/CD ortamlarında `GITHUB_TOKEN` da kullanılabilir.

### Adım 2: Paketi Kurun

Paketi projenize bağımlılık olarak ekleyin:

```bash
npm install @machineco-arge/rn-login-kit
# veya
yarn add @machineco-arge/rn-login-kit
```

### Adım 3: Peer Dependencies (Eş Bağımlılıkları) Kurun

Bu paket, düzgün çalışabilmesi için aşağıdaki eş bağımlılıklara ihtiyaç duyar. Lütfen projenizde bu paketlerin uyumlu sürümlerinin kurulu olduğundan emin olun. Eksik olanları veya uyumsuz olanları kurmak/güncellemek için aşağıdaki komutu kullanabilirsiniz:

```bash
npm install \
  react@19.2.3 react-native@0.86.3 \
  @react-navigation/native@7.3.18 \
  react-i18next@15.7.4 i18next@25.10.10 \
  @react-native-google-signin/google-signin@16.1.4 \
  @invertase/react-native-apple-authentication@2.5.1 \
  @d11/react-native-fast-image@8.13.0 \
  @shopify/react-native-skia@2.10.1 \
  react-native-reanimated@4.4.1 react-native-worklets@0.9.2 \
  react-native-gesture-handler@3.1.0 \
  react-native-safe-area-context@5.8.0 react-native-svg@15.15.5 \
  react-native-gradients@2.1.1 react-native-heroicons@4.0.0 \
  react-native-image-crop-picker@0.51.1 \
  react-native-localize@3.7.0 \
  @dr.pogodin/react-native-fs@2.39.2 \
  @react-native-async-storage/async-storage@3.1.1 \
  @react-native-community/checkbox@0.5.20 \
  axios@1.20.0 \
  i18next-async-storage-backend2@2.1.0 \
  i18next-chained-backend@4.6.3 \
  i18next-http-backend@3.0.6
```

**Önemli Notlar:**

- Bu sürüm React Native 0.86 ve React 19 için hazırlanmıştır.
- React Native yeni mimarisi etkin olmalıdır.
- `react-native-worklets/plugin`, uygulamanın `babel.config.js` dosyasındaki eklentiler listesinin sonunda bulunmalıdır.
- Google girişi mevcut herkese açık Google giriş paketini kullanır; Universal giriş sürümü gerekli değildir.
- `react-native-fast-image` yerine `@d11/react-native-fast-image` kullanılmaktadır.
- iOS bağımlılıkları değiştikten sonra `ios` klasöründe Pod kurulumu yeniden yapılmalıdır.

