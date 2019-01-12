const defaultState = {
	appBarTop: ({user, title}) => {
		const user_avatar = {
			user_avatar: {
				src: user.photoURL,
				alt: "user avatar",
				event: "logout"
			}
		};
		const logoutIconButton = {
			actions: [
				{
					icon: "exit_to_app",
					event: "logout"
				}
			]
		}
		const logoutButton = (user.photoURL) ? user_avatar : logoutIconButton;
		return {
			visible: true,
			title: {
				text: title
			},
			...logoutButton
		}
	},
	bottomNav: (activeIndex) => {
		const state = {
			visible: true,
			fab: {
				icon: "add",
				event: "add",
				actions: [

				],
			},
			actions: [
				{
					icon: "settings_remote",
					name: "Control",
					to: "/control",
				},
				{
					icon: "settings",
					name: "Settings",
					to: "/settings"
				},
			]
		};
		state.actions[activeIndex].active = true;
		return state;
	},
}

const nestedDefaultState = {
	appBarTop: (title) => {
		return {
			visible: true,
			back_action: {
				icon: "arrow_back"
			},
			title: {
				text: title
			},
		}
	},
	bottomNav: (activeIndex) => {
		return Object.assign(defaultState.bottomNav(activeIndex), {
			fab: {
				icon: "check",
				event: "check"
			},
		})
	},
}

export {
	defaultState as UIStateDefault,
	nestedDefaultState as UIStateNestedDefault
}