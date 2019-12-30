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
