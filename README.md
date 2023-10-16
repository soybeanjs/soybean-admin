<div align="center">
	<img src="./public/favicon.svg" style="width: 160px;"/>
	<h1>Soybean Admin</h1>
</div>

This project is forded from [Soybean Admin](https://github.com/honghuangdc/soybean-admin). And we migrate this project from Vite to Farm reusing Vite plugins.

```bash
npm run dev:farm # start with Farm
npm run build:farm # build with Farm

npm run dev # start with Vite
npm run build # build with Vite
```

After migrate to Farm, this project is 2 times faster than Vite in Dev, and 6x times faster in Prod!

Performance Compare:

||Cold Start(Server Ready + Page Rendered)|Cold Build|
|---|---|---|
|Farm| 3.5s | 4s |
|Vite| 7.5s | 24.1s |
|Compare| Farm is 2x faster than Vite| Farm is 6x faster than Vite|

So this means when using Farm, you can get better performance in both dev and prod, and you can avoid a lot of issues of Vite:

- No huge amount of requests in Dev
- Consistency between dev and prod
- Flexible bundling configuration

And it is really easy to migrate your project from Vite to Farm, just move your `plugins` in `vite.config.ts` to `vitePlugins` in `farm.config.ts`
