export default {
  methods: {
    textColor(backgroundHexColor){
      if(backgroundHexColor.length !== 7){return "black"; }
      const rgb = getRgb(backgroundHexColor);
      return (Math.sqrt(Math.pow(rgb.r,2)*0.299 + Math.pow(rgb.g,2)*0.587 + Math.pow(rgb.b,2)*0.114) > 186)?"black":"white";
    }
  },
};

function getRgb(hex) {
  let result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return result ? {
    r: Math.round(parseInt(result[1], 16)),
    g: Math.round(parseInt(result[2], 16)),
    b: Math.round(parseInt(result[3], 16)),
  } : null;
}
