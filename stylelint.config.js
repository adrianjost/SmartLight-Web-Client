module.exports = {
	customSyntax: "postcss-html",
	extends: [
		"stylelint-config-recommended",
		"stylelint-8-point-grid", // https://github.com/dcrtantuco/stylelint-8-point-grid
		// Enforce a standard order for CSS properties
		// https://github.com/stormwarning/stylelint-config-recess-order
		"stylelint-config-recess-order",
	],
	plugins: [
		"stylelint-a11y", // https://github.com/YozhikM/stylelint-a11y
		"stylelint-declaration-block-no-ignored-properties", // https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties
		"stylelint-high-performance-animation", // https://github.com/kristerkari/stylelint-high-performance-animation
		"stylelint-selector-no-empty", // https://github.com/ssivanatarajan/stylelint-selector-no-empty
		"stylelint-selector-tag-no-without-class", // https://github.com/Moxio/stylelint-selector-tag-no-without-class
	],
	rules: {
		// https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
		"color-named": "never",
		"color-no-hex": null,
		"shorthand-property-no-redundant-values": true,
		"value-no-vendor-prefix": true,
		"color-hex-case": "lower",
		"color-hex-length": "short", // https://youtu.be/Sd14d1t5vbQ?t=888
		"function-name-case": "lower",
		"length-zero-no-unit": true,
		"unit-case": "lower",
		"value-keyword-case": "lower",
		"value-list-comma-space-before": "never",
		"property-case": "lower",
		// ...
		"no-empty-source": null,
		// ...
		"no-eol-whitespace": true,
		"no-missing-end-of-source-newline": true,
		"no-empty-first-line": true,

		"plugin/8-point-grid": {
			base: 4,
			allowlist: ["2px", "1px"],
			ignorelist: [
				"width",
				"height",
				"min-width",
				"min-height",
				"max-width",
				"max-height",
			],
		},

		// FIX: ignores /* styleling-disable */
		//"a11y/content-property-no-static-value": [true, { "severity": "warning" }],
		//"a11y/font-size-is-readable": [true, { "severity": "warning" }],
		//"a11y/media-prefers-reduced-motion": true, // autofix makes code unmaintainable and unreadable
		//"a11y/media-prefers-color-scheme": [true, { "severity": "warning" }], // autofix makes code unmaintainable and unreadable
		"a11y/no-display-none": [
			true,
			{
				severity: "warning",
			},
		],
		"a11y/no-obsolete-attribute": [
			true,
			{
				severity: "warning",
			},
		],
		"a11y/no-obsolete-element": [
			true,
			{
				severity: "warning",
			},
		],
		"a11y/no-spread-text": [
			true,
			{
				severity: "warning",
			},
		],
		"a11y/no-outline-none": true,
		"a11y/no-text-align-justify": [
			true,
			{
				severity: "warning",
			},
		],
		"a11y/selector-pseudo-class-focus": true,

		"plugin/declaration-block-no-ignored-properties": true,

		/*
		"scale-unlimited/declaration-strict-value": ["/color/", { // consider including font-size
			ignoreVariables: true,
			ignoreFunctions: false,
			ignoreKeywords: {
				"/color/": ["currentColor", "inherit", "transparent", "initial"]
			}
		}],
		*/

		"plugin/no-low-performance-animation-properties": [
			true,
			{
				ignore: "paint-properties",
				ignoreProperties: ["color", "background-color"],
			},
		],

		"plugin/stylelint-selector-no-empty": true,

		"plugin/selector-tag-no-without-class": ["div", "span"],

		/*
		"csstools/value-no-unknown-custom-properties": [true, {
			"importFrom": [
				"./src/styles/variables.scss"
			]
		}],
		*/
	},
};
