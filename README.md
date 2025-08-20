

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
  react@18.3.1 react-native@0.77.1 \
  @react-navigation/native@^7.0.14 @react-navigation/native-stack@^7.2.0 \
  react-i18next@^15.5.1 i18next@^25.0.1 \
  @react-native-google-signin/google-signin@^13.2.0 @invertase/react-native-apple-authentication@^2.4.0 \
  react-native-fast-image@^8.6.3 react-native-gradients@^2.1.1 \
  react-native-reanimated@^3.17.1 react-native-heroicons@^4.0.0 \
  axios@^1.8.1 react-native-localize@^3.5.2 \
  @dr.pogodin/react-native-fs@^2.21.0 \
  @react-native-async-storage/async-storage@^1.19.0 \
  @react-native-community/checkbox@^0.5.20 \
  i18next-async-storage-backend2@^2.1.0 \
  i18next-chained-backend@^4.6.2 \
  i18next-http-backend@^3.0.2
```

**Önemli Notlar:**

*   `react-native-reanimated` için Babel yapılandırması gereklidir. `babel.config.js` dosyanıza `plugins: ['react-native-reanimated/plugin']` eklediğinizden emin olun.
*   iOS projeleri için `cd ios && pod install` komutunu çalıştırmanız gerekebilir.


