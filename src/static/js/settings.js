Router
.add("settings", r_settings);

function r_settings(){
    UI.actions();
    //r_overview
    data = [{
        "title":"Room settings",
        "url":"/rooms",
        "icon":"home"
    },{
        "title":"Add Lamp",
        "url":"/lamp/add",
        "icon":"add_circle_outline"
    },{
        "title":"Add Mode",
        "url":"/mode/add",
        "icon":"add_circle_outline"
    },{
        "title":"About",
        "url":"/about",
        "icon":"info_outline"
    }];
        
    let entrys = "";
    data.forEach(function(e){
        entrys += `
        <a href="${e.url}">
            <div class="mdl-list__item">
                <span class="mdl-list__item-primary-content">
                    ${e.title}
                </span>
                <span class="mdl-list__item-secondary-action"><i class="material-icons">${(e.icon)?(e.icon):""}</i></span>
            </div>
        </a>`;
    });
    UI.title("Settings",{icon:"settings", url:"/settings"});
    UI.renderContent(UI.card(undefined,`<div class="mdl-list">${entrys}</div>`));
}