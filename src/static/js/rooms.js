Router
.add("rooms", r_rooms)
.add("room/([0-9]+)", r_roomSettings)
.add("room/([0-9]+)/add", r_roomEdit)
.add("room/([0-9]+)/edit", r_roomEdit)

function r_roomSettings(id){
    UI.title(Data.get("Rooms",id).name,{icon:"arrow_back", url:"/settings"});
    UI.actions([{url:`/room/${id}/edit`,icon:'settings'}]);

    const lamps = Data.get("Rooms",id).lamps.map(e => {
        return Data.get("Lamps",e);
    })
    
    const scenes = Data.find("Scenes", ["roomId"],id);
    
    UI.renderContent(
        UI.card("Scenes", r_overview(`/room/${id}/scene/`,scenes))
      + UI.card("Lamps", r_overview("/lamp",lamps))
    );
}

function r_roomEdit(id){
    UI.title("Rooms",{icon:"arrow_back", url:"/settings"});
    
    UI.renderContent(UI.card("Setup "+Data.get("Rooms", id).name,"LampPicker",[{url:'/room/delete',icon:'delete'}]));
}

function r_rooms(){
    UI.actions();
    //r_overview
    UI.title("Rooms",{icon:"arrow_back", url:"/settings"});
    UI.renderContent(`<div class="rooms">${UI.card("Rooms",r_overview("/room",Data.list("Rooms")),[{url:'/room/add',icon:'add'}])}</div>`);
}