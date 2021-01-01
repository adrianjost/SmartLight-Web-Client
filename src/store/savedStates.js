import { getColorForChannels } from "@adrianjost/two-channel-picker/dist/helpers/channelColor.js";

const sortByCreatedAt = (a, b) => {
	return a.created_at - b.created_at;
};
const getters = {
	list: (state) => {
		return Object.values(state.data).sort(sortByCreatedAt);
	},
	"list-whitetones": (state) => {
		return Object.values(state.data)
			.sort(sortByCreatedAt)
			.filter((mode) => {
				return mode.type === "whitetone";
			})
			.map((state) => {
				state.background = getColorForChannels(state.channels, "#fd9", "#9df");
				return state;
			});
	},
	"list-colors": (state) => {
		return Object.values(state.data)
			.sort(sortByCreatedAt)
			.filter((mode) => {
				return mode.type === "color";
			})
			.map((color) => {
				color.background = color.color;
				return color;
			});
	},
	"list-gradients": (state) => {
		return Object.values(state.data)
			.sort(sortByCreatedAt)
			.filter((mode) => {
				return mode.type === "gradient";
			})
			.map((gradient) => {
				// generate background pattern
				gradient.background = "linear-gradient(90deg, ";
				const maxTime =
					gradient.transitionTimes[gradient.transitionTimes.length - 1];
				gradient.colors.forEach((color, index) => {
					gradient.background += `${color} ${
						(gradient.transitionTimes[index] / maxTime) * 100
					}%`;
					if (index < gradient.colors.length - 1) {
						gradient.background += ", ";
					}
				});
				gradient.background += `)`;

				return gradient;
			});
	},
};

const where = [
	// an array of arrays
	["allowedUsers", "array-contains", "{userId}"],
];
const orderBy = []; // an array of strings

export default {
	firestorePath: "states/",
	firestoreRefType: "collection",
	statePropName: "data",
	moduleName: "savedStates",
	sync: {
		where,
		orderBy,
		insertHook: function (updateFirestore, doc, store) {
			const uid = store.getters["auth/get"].uid;
			if (!Array.isArray(doc.allowedUsers)) {
				doc.allowedUsers = [];
			}
			if (!doc.allowedUsers.includes(uid)) {
				doc.allowedUsers.push(uid);
			}
			return updateFirestore(doc);
		},
	},
	namespaced: true,
	getters,
};
