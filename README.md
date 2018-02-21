# PWAs with Angular: Case Study

## Prerequisites

You need a test web server, like ``http-server``:

```
npm i -g http-server
```

You also need a browser supporting service worker as well as background sync (e. g. Chrome or Firefox).

## Build and run

Service Worker are only activated for production builds.

```
npm install
npm run build
cd dist
http-server -o
```

Try to close the web server after loading and to disconnect from the internet. Refresh should work anyway. Change some ratings and reconnect. See that the changes are synced.