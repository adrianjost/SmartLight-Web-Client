import { getColorForChannels } from "@adrianjost/two-channel-picker/dist/helpers/channelColor.js";

import { hex2rgb } from "@/mixins/colorConversion.js";

const getVisibleWhite = (color) => {
	const orgRGB = hex2rgb(color);
	const channels = [orgRGB.r / 255, orgRGB.b / 255];
	return getColorForChannels(channels, "#fd9", "#9df");
};

const getVisibleColor = (type = "RGB", color) => {
	try {
		switch (type || "RGB") {
			case "RGB": {
				return color;
			}
			case "WWCW": {
				return getVisibleWhite(color);
			}
		}
	} catch (error) {
		console.error(error);
		return color;
	}
};

export default {
	methods: {
		addBackground(lamp, options = {}) {
			const { linear } = options;
			if (!lamp.state) {
				return lamp;
			}
			let background = "";
			if (lamp.state.color) {
				background = getVisibleColor(lamp.lamptype, lamp.state.color);
			}
			if (lamp.state.gradient) {
				if (linear) {
					background = "linear-gradient(90deg,";
				} else {
					background = "conic-gradient(";
				}
				const maxTime =
					lamp.state.gradient.transitionTimes[
						lamp.state.gradient.transitionTimes.length - 1
					];
				lamp.state.gradient.colors
					.map((c) => getVisibleColor(lamp.lamptype, c))
					.forEach((color, index) => {
						background += `${color} ${
							(lamp.state.gradient.transitionTimes[index] / maxTime) * 100
						}%`;
						if (index < lamp.state.gradient.colors.length - 1) {
							background += ", ";
						}
					});
				background += `)`;
			}
			this.$set(lamp, "background", background);
			return lamp;
		},
	},
};
