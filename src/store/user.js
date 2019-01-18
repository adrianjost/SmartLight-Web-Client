
const getters = {
	api_token: (state) => { return state.data.api_token; }
};

export default {
	firestorePath: 'users/{userId}',
	firestoreRefType: 'docs',
	statePropName: 'data',
	moduleName: 'user',
	namespaced: true,
	getters,
};