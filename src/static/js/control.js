Router
.add("control", r_control)
.add("control/room/([0-9]+)", r_ControlRoom)
.add("control/lamp/([0-9]+)", r_ControlLamp)

// COLOR HANDLER ###################################################################
function getColorPicker(){
    return '<div class="wheel" id="ColorPicker"></div>';
}
function lampColorHandler(color, id){
    // send color to ESP & save color
    console.log("lampColorHandler:", color.rgb, id);
    Data.patch("Lamps", [id, "last", "color"], color.hexString);
}
function roomColorHandler(color, id){
    // send color to ESP & save color
    console.log("roomColorHandler:", color.hexString, id);
    Data.patch("Rooms", [id, "last", "color"], color.hexString);
}

// Mode HANDLER  ###################################################################
function getModePicker(){
    return r_optionList(Data.list("Modes"),"ModeList");
}
function lampModeHandler(mode, id){
    // send color to ESP & save color
    console.log("lampModeHandler:",mode, id);
    Data.patch("Lamps", [id, "last", "mode"], mode);
}
function roomModeHandler(mode, id){
    // send color to ESP & save color
    console.log("roomModeHandler:",mode, id);
    Data.patch("Rooms", [id, "last", "mode"], mode);
}
// Scene HANDLER ###################################################################
function getScenePicker(room_id){
    return r_optionList(Data.find("Scenes", ["roomId"], room_id),"SceneList");
}
function roomSceneHandler(scene, id){
    // send color to ESP & save color
    console.log("roomSceneHandler:",scene, id);
    Data.patch("Rooms", [id, "last", "scene"], scene);
}

// RENDERING     ###################################################################
function r_control(){
    UI.actions();
    //r_overview
    UI.title("Control");
    UI.renderContent(`<div class="control">
        ${UI.card("Rooms",r_overview("/control/room",Data.list("Rooms")))}
        ${UI.card("Lamps",r_overview("/control/lamp",Data.list("Lamps")))}
    </div>`);
}
function r_ControlRoom(id){
    console.log("Control Room",id);
    UI.title("Control Room",{icon:"arrow_back", url:"/control"});
    UI.renderContent(UI.card("Choose a Mode",UI.tabView({
        color: {
            title: "COLOR",
            content: getColorPicker(),
            active:true
        },
        modes: {
            title: "MODE",
            content: getModePicker(),
        },
        scene: {
            title: "SCENE",
            content: getScenePicker(id),
        }
    })));
    Picker.initColorPicker  ("#ColorPicker",Data.get("Rooms",id).last.color,function(e){roomColorHandler(e,id);});
    Picker.initOptionPicker ("#ModeList",   Data.get("Rooms",id).last.mode, function(e){roomModeHandler(e,id);});
    Picker.initOptionPicker ("#SceneList",  Data.get("Rooms",id).last.scene,function(e){roomSceneHandler(e,id);});
    UI.setTab("color");
}
function r_ControlLamp(id){
    console.log("Control Lamp",id);
    UI.title("Control Lamp",{icon:"arrow_back", url:"/control"});
    UI.renderContent(UI.card("Choose a Mode",UI.tabView({
        color: {
            title: "COLOR",
            content: getColorPicker(),
            active:true
        },
        modes: {
            title: "MODE",
            content: getModePicker(),
        }
    })));
    Picker.initColorPicker("#ColorPicker",  Data.get("Lamps",id).last.color,function(e){lampColorHandler(e,id);});
    Picker.initOptionPicker ("#ModeList",   Data.get("Lamps",id).last.mode, function(e){lampModeHandler(e,id);});
    UI.setTab("color");
}
function r_optionList(optionsList, name){
    let options = '';
    optionsList.forEach(o => {
        options += `
        <label class="mdl-list__item" for="option-${name}-${o.id}">
            <div class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar optionListButton">radio_button_unchecked</i>
                <input type="radio" id="option-${name}-${o.id}" class="hidden" name="${name}" value="${o.id}">
                <span>${o.name}</span>
            </div>
        </label>`;
    });
    return `<form id="${name}" class="mdl-list">${options}</form>`;
}
Router.navigate("/control");