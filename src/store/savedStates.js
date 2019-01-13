const sortByCreatedAt = (a, b) => { return a.created_at - b.created_at; }
const getters = {
	"list": (state) => {
		return Object.values(state.data).sort(sortByCreatedAt);
	},
	"list-colors": (state) => {
		return Object.values(state.data).sort(sortByCreatedAt).filter((mode) => {
			return mode.type === "color";
		}).map(color => {
			color.background = color.color;
			return color;
		});
	},
	"list-gradients": (state) => {
		return Object.values(state.data).sort(sortByCreatedAt).filter((mode) => {
			return mode.type === "gradient" && !!mode.colors;
		}).map(gradient => {
			// generate background pattern
			gradient.background = "linear-gradient(90deg, "
			const maxTime = gradient.transitionTimes[gradient.transitionTimes.length - 1];
			gradient.colors.forEach((color, index) => {
				gradient.background += `${color} ${gradient.transitionTimes[index] / maxTime * 100}%`;
				if(index < gradient.colors.length - 1){
					gradient.background += ", "
				}
			})
			gradient.background += `)`

			return gradient;
		});
	},
};


const where = [ // an array of arrays
  ['created_by', '==', '{userId}'],
]
const orderBy = [] // an array of strings

export default {
	firestorePath: 'states/',
	firestoreRefType: 'collection',
	statePropName: 'data',
	moduleName: 'savedStates',
	sync: {
    where,
    orderBy
	},
	namespaced: true,
	getters,
};