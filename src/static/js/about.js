Router
.add("about", r_about)

function r_about(){
    UI.actions();
    //r_overview
    UI.title("About",{icon:"arrow_back", url:"/settings"});
    UI.renderContent(UI.card("",`<p>This project was created because Philips Hue is way to expensive for students like us.</p> </br> <p>© Adrian Jost & Till Lehmann</p>`));
}