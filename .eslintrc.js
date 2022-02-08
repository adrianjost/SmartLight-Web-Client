module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@babel/eslint-parser",
		sourceType: "module",
	},
	extends: [
		// https://github.com/vuejs/eslint-plugin-vue#bulb-rules
		"plugin:vue/recommended",
		// https://github.com/prettier/eslint-config-prettier
		"prettier",
	],
	rules: {
		// Only allow debugger in development
		"no-debugger":
			process.env.NODE_ENV === "production" || process.env.PRE_COMMIT
				? "error"
				: "off",
		// Only allow `console.log` in development
		"no-console":
			process.env.NODE_ENV === "production" || process.env.PRE_COMMIT
				? [
						"error",
						{
							allow: ["warn", "error"],
						},
				  ]
				: "off",
		"vue/component-name-in-template-casing": [
			"error",
			"PascalCase",
			{
				ignores: [
					"component",
					"template",
					"transition",
					"transition-group",
					"keep-alive",
					"slot",
				],
			},
		],
		"vue/no-mutating-props": "off", // TODO: fix and enable no-mutating-props rule
	},
};
