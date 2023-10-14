<div align="center">
	<img src="./public/favicon.svg" style="width: 160px;"/>
	<h1>Soybean Admin</h1>
</div>

This project is forded from [Soybean Admin](https://github.com/honghuangdc/soybean-admin). And we migrate this project from Vite to Farm reusing Vite plugins, after migrate to Farm, this project is 5 times faster than vite in dev and 10 times faster than Vite in prod.

```bash
npm run dev:farm # start with Farm
npm run build:farm # build with Farm

npm run dev # start with Vite
npm run build # build with Vite
```

Performance Compare:
||Cold Start(Server Ready + Page Rendered)|Build|Compare|
|---|---|---|---|---|
|Farm| | | 7.6s | |
|Vite| 9.4s | 25.2s | |
