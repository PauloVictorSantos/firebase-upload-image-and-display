# firebase-upload-image-and-display
aplicativo demo em react-native para upload e exibição de imagens usando firebase storage,
baseado no repositório https://github.com/PauloVictorSantos/Firebase-Image-Upload-React-Native.git.
Realizei uma atualização na documentação do repositório. Segue a atualização.


**1. Clone o repositório do projeto**

```
git clone https://github.com/PauloVictorSantos/firebase-upload-image-and-display
```

**2. instale os módulos necessários :**

```
npm install --save react-native-fetch-blob
npm install --save react-native-image-picker
react-native link
```

The extra `react-native-image-picker` is for image picking.

**3. adicione as permissões para o android:**

adicione as informações abaixo no `AndroidManifest.xml`

```
...
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false"/>
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false"/>
...
```

**4. Configure Firebase Storage:**

First we need to create an `images` folder in the root Storage:

![](https://i.gyazo.com/87e49a91d73654d54a430365355a3ff0.png)

By default Firebase forbids read or write to the Storage folder. We need to
open up permission rules.

For this demo app, I will just open up both read and write for the `images`
folder. In real situation, you probably want to tighten the permissions.

![](https://i.gyazo.com/2020fe9aea533b9a534d7d567ee70013.png)

**5. Inicialize o Firebase com base na sua configuração:**

```
const config = {
  apiKey: "<YOUR-API-KEY>",
  authDomain: "<APP-NAME>.firebaseio.com",
  storageBucket: "<APP-NAME>.appspot.com",
}
firebase.initializeApp(config)
```

**6. Enable Blob and XMLHttpRequest polyfills:**

```
const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
```

**7. Implemente função uploadImage :**

```
const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const sessionId = new Date().getTime()
      let uploadBlob = null
      const imageRef = storage.ref('images').child(`${sessionId}`)

      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
```
## Listando as imagens do Firebase Storage:

O componente Itens é usando para listar imagens:
https://github.com/PauloVictorSantos/firebase-upload-image-and-display/blob/master/src/component/Itens.js


**1. Importante ressaltar que a url da imagens no Firebase Storage são salvas no Firebase Database:  **

Conforme implementado na função _pickImage :

```
_pickImage() {
    this.setState({ uploadURL: '' });

    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ uploadURL: url }))
        .then(() => {
          const url = this.state.uploadURL;
          firebase.database().ref(`/images/`).push({ url });
        })
        .catch(error => console.log(error));
    })
  }
```
Dados no Firebase Database:


[![Image from Gyazo](https://i.gyazo.com/73600188d3222c53ccdaad6d4726e5ce.png)](https://gyazo.com/73600188d3222c53ccdaad6d4726e5ce)


Basically it uses Firebase SDK to create a reference to the Storage folder, then
write the binary data from the selected image to it.

For Blob type, I find it most stable to encode the binary data with Base64
first. I hope it will get more stable in future release of `react-native-fetch-blob`

### License 

[MIT License](http://www.opensource.org/licenses/mit-license.php)
