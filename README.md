# MY FIRAT PWA

2017-12-16 ライトニングトーク用のテストアプリ

## PWAとは

Progressive Web Apps

最新のWeb技術を活用し、漸進的 (Progressive) に高度なユーザー体験を提供

### 最新のWeb技術

* HTTP/2 Server Push
* Web Components
* HTML Imports
* Service Worker

### Service Workerとは

Service Worker はブラウザが Web ページとは別にバックグラウンドで実行するスクリプトで、Web ページやユーザのインタラクションを必要としない機能を Web にもたらします。

Service Worker の紹介  |  Web  |  Google Developers
https://developers.google.com/web/fundamentals/primers/service-workers/

### Service Workerのポイント

* DOM に直接アクセスできません。
* プログラム可能なネットワークプロキシです。ページからのネットワークリクエストをコントロールできます。
* 使用されていない間は終了され、必要な時になったら起動します。
* JavaScript の Promises を多用します。

