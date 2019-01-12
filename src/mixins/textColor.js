function componentToHex(color) {
	var hex = color.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

export default {
	methods: {
		textColor(backgroundHexColor){
			if(!backgroundHexColor || backgroundHexColor.length !== 7){return "black"; }
			const rgb = this.hex2rgb(backgroundHexColor);
			return (Math.sqrt(Math.pow(rgb.r,2)*0.299 + Math.pow(rgb.g,2)*0.587 + Math.pow(rgb.b,2)*0.114) > 186)?"black":"white";
		},
		hex2rgb(hexColor){
			// remove leading #
			if(hexColor.length === 7 || hexColor.length === 4){ hexColor = hexColor.substr(1)}
			// convert 3 digit to 6 digit color
			if(hexColor.length === 3){ hexColor = hexColor[0]+hexColor[0]+hexColor[1]+hexColor[1]+hexColor[2]+hexColor[2]}
			const bigint = parseInt(hexColor, 16);
			const r = (bigint >> 16) & 255;
			const g = (bigint >> 8) & 255;
			const b = bigint & 255;
			return {"r":r,"g":g,"b":b}
		},
		rgb2hex({ r, g, b }) {
				return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}
	},
};