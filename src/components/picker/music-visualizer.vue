<template>
  <div>
    <p class="startButton" @click="request">
      click here to start <br/>
      Sadly thats an browser security feature
    </p>
    <div class="colordot" @click="stop" :style="'background-color:'+value"></div>
  </div>
</template>

<script>
export default {
  name: "music-visualizer",
  props: ['value'],
  data(){
    return {
      active: false,
      analyser: undefined,
    }
  },
  beforeDestroy(){
    this.stop()
  },
  methods: {
    request(){
      navigator.getUserMedia({audio:true}, this.start, this.stop);
    },
    start( stream ){
      this.active = true;
      window.persistAudioStream = stream;
      var audioContext = new AudioContext();
      var audioStream = audioContext.createMediaStreamSource( stream );
      this.analyser = audioContext.createAnalyser();
      audioStream.connect(this.analyser);
      this.analyser.fftSize = Math.pow(2,6);
      console.log("STARTED SOUND VISUALIZER");
      this.loop();
    },
    stop(){
      this.active = false;
      console.log("STOPPED SOUND VISUALIZER");
    },
    rainbow(n) {
        // make it a hex color = * 16777215
        //n = Math.floor((n/255) * 16777215);
        //return '#'+n.toString(16);
        const rgb = this.hslToRgb(((n*0.5)+130)%255, 1, 0.3)
        console.log(n,rgb);
        return this.rgb2hex(rgb[0],rgb[1],rgb[2]);

        //return this.rgb2hex(n,0,0);
    },
    rgb2hex(r,g,b){
      return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
    },
    hslToRgb(h, s, l){
      h = h / 255;
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
        var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    loop(){
      if(this.active){
        requestAnimationFrame(this.loop);
      }
      const frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(frequencyArray);
      this.$emit("input", this.rainbow(frequencyArray[0]));
    }
  },
}
</script>
<style>
.colordot{
  width: 80%;
  padding-bottom: 100%;
  border-radius: 50%;
}
</style>