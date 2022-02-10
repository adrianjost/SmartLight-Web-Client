module.exports = {
	pwa: {
		name: "SmartLight",
		themeColor: "#191919",
		msTileColor: "#191919",
		appleMobileWebAppCapable: "yes",
		appleMobileWebAppStatusBarStyle: "black",
		iconPaths: {
			favicon16: "img/logo/SmartLight-16.png",
			favicon32: "img/logo/SmartLight-32.png",
			appleTouchIcon: "img/logo/SmartLight-152.png",
			msTileImage: "img/logo/SmartLight-142.png",
		},
		manifestPath: "manifest.webmanifest",
		manifestOptions: {
			lang: "en-US",
			icons: [
				{
					src: "/img/logo/SmartLight-16.png",
					sizes: "16x16",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-32.png",
					sizes: "32x32",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-36.png",
					sizes: "36x36",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-40.png",
					sizes: "40x40",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-48.png",
					sizes: "48x48",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-58.png",
					sizes: "58x58",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-60.png",
					sizes: "60x60",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-64.png",
					sizes: "64x64",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-70.png",
					sizes: "70x70",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-72.png",
					sizes: "72x72",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-76.png",
					sizes: "76x76",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-80.png",
					sizes: "80x80",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-87.png",
					sizes: "87x87",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-96.png",
					sizes: "96x96",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-120.png",
					sizes: "120x120",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-128.png",
					sizes: "128x128",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-144.png",
					sizes: "144x144",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-150.png",
					sizes: "150x150",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-152.png",
					sizes: "152x152",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-167.png",
					sizes: "167x167",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-180.png",
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-256.png",
					sizes: "256x256",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-310.png",
					sizes: "310x310",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-512.png",
					sizes: "512x512",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-1024.png",
					sizes: "1024x1024",
					type: "image/png",
				},
				{
					src: "/img/logo/SmartLight-2048.png",
					sizes: "2048x2048",
					type: "image/png",
				},
			],
			start_url: "/?homescreen=true",
			display: "standalone",
			background_color: "#333",
			theme_color: "#191919",
		},
		workboxOptions: {
			exclude: [".htaccess", "CNAME", "robots.txt"],
		},
	},

	publicPath: undefined,
	outputDir: undefined,
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: undefined,
	parallel: undefined,

	css: {
		sourceMap: true,
		extract: false,
	},

	lintOnSave: true,
};
