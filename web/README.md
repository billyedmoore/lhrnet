# The Web-App

The LHR-Net website is a `React` webapp created with `npx create vite@latest`.
`Tailwind` is used for styling and the `ONNX` runtime for machine learning inference.
Aircraft positions are fetched from `/data`, which is served by the [proxy](../proxy/README.md).

## Running locally

You need Node 22 and Python 3 (the `dev` and `build` scripts run a small Python script that
copies `config.json` into the app).

```bash
cd proxy && make && ./opensky_proxy   # terminal 1
cd web && npm ci && npm run dev       # terminal 2
```

The Vite dev server forwards `/data` to the proxy on `127.0.0.1:8080`.

## Deployment

The site is hosted on a VPS at [lhr.billyedmoore.com](https://lhr.billyedmoore.com) and
deployed by a GitHub Action on pushes to `main`. See the [deploy README](../deploy/README.md).
