module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		// https://github.com/vuejs/eslint-plugin-vue#bulb-rules
		"plugin:vue/recommended",
		// https://github.com/prettier/eslint-config-prettier
		"prettier",
		"prettier/standard",
		"prettier/vue",
	],
	rules: {
		"no-console": "off",
		"no-debugger": "off",
		"vue/html-indent": ["error", "tab"],
		"vue/script-indent": ["error", "tab"],
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
	},
	parserOptions: {
		parser: "babel-eslint",
	},
};
