# threeVRMwithBVH

## 初期設定

`yarn`をインストール

```bash
npm i yarn
yarn init
```

[TypeScript](https://www.typescriptlang.org)、[webpack](https://webpack.js.org)、[@pixiv/three-vrm](https://github.com/pixiv/three-vrm)をインストール

```bash
yarn add typescript
yarn add --dev ts-loader webpack webpack-cli webpack-dev-server
yarn add three three @pixiv/three-vrm
```

ソース用のディレクトリ`src`と、書き出し用のディレクトリ`dist`を作成

```bash
mkdir src
mkdir dist
```

## 参考

[pixiv/three-vrm: Use VRM on Three.js](https://github.com/pixiv/three-vrm)
[最新版 TypeScript+webpack 5 の環境構築まとめ(React, Vue.js, Three.js のサンプル付き) - ICS MEDIA](https://ics.media/entry/16329/)
