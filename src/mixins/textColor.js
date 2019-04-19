import colorConversion from "@/mixins/colorConversion.js";

export default {
	mixins: [colorConversion],
	methods: {
		textColor(backgroundHexColor) {
			if (!backgroundHexColor || backgroundHexColor.length !== 7) {
				return "black";
			}
			const rgb = this.hex2rgb(backgroundHexColor);
			return Math.sqrt(
				Math.pow(rgb.r, 2) * 0.299 +
					Math.pow(rgb.g, 2) * 0.587 +
					Math.pow(rgb.b, 2) * 0.114
			) > 186
				? "black"
				: "white";
		},
	},
};
