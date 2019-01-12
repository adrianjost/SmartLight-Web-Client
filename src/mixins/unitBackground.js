export default {
	methods: {
		addBackground(lamp, options = {}){
			const { linear } = options;
			if(!lamp.state){return lamp;}
			if(lamp.state.color){
				lamp.background = lamp.state.color;
			}
			if(lamp.state.gradient){
				if(linear){
					lamp.background = "linear-gradient(90deg,";
				}else{
					lamp.background = "conic-gradient(";
				}
				const maxTime = lamp.state.gradient.transitionTimes[lamp.state.gradient.transitionTimes.length - 1];
				lamp.state.gradient.colors.forEach((color, index) => {
					lamp.background += `${color} ${lamp.state.gradient.transitionTimes[index] / maxTime * 100}%`;
					if(index < lamp.state.gradient.colors.length - 1){
						lamp.background += ", "
					}
				})
				lamp.background += `)`
				//lamp.background = lamp.state.gradient.colors[0];
			}
			return lamp;
		}
	}
};