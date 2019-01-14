Router
.add("modes", r_modes)
.add("mode/add", r_modeAdd)
.add("mode/([0-9]+)", r_modeEdit)
.add("mode/([0-9]+)/delete", r_modeDelete)

function r_modes(){
    UI.actions([{url:`/mode/add`,icon:"add"}]);
    UI.title("Modes",{icon:"apps"});
    UI.renderContent(`<div class="modes">${UI.card(undefined, r_overview("/mode",Data.list("Modes")))}</div>`);
}

function r_modeAdd(){
    const id = Data.set("Modes",undefined,{
        name:"New Mode",
        colors:[],
        durations:[],
        fade:true
    });
    console.log(id);
    Router.navigate("/mode/"+id);
}

function r_modeBreakpoint(index, color, duration){
    function get_timeString(ds){
        const minutes = Math.floor( ds / 600 );
        return ((minutes)?(minutes + "min "):"") + (ds - (600 * minutes))/10 + "s";
    }
    function get_brightness(hexCode) {
        // strip off any leading #
        hexCode = hexCode.replace('#', '');
        const c_r = parseInt(hexCode.substr(0, 2),16);
        const c_g = parseInt(hexCode.substr(2, 2),16);
        const c_b = parseInt(hexCode.substr(4, 2),16);
        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    }
    return `<li class="mdl-list__item" data-index="${index}">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-list__item-avatar colorDot" style="
                    background-color:${color}; 
                    color: #${(get_brightness(color)>200)?"000":"fff"}
                ">${index+1}</span>
                <span>${get_timeString(duration)}</span>
            </span>
            <span class="mdl-list__item-secondary-action text-muted delete-breakpoint"><i class="material-icons">delete</i></span>
        </li>`;
}
function r_modeBreakpoints(id){
    let listItems = "";
    const mode = Data.get("Modes",id);
    for (i = 0; i < mode.colors.length; i++) {
        listItems += r_modeBreakpoint(i,mode.colors[i],mode.durations[i]);
    }
    return `<ul class="mdl-list modeDetailList">${listItems}</ul>`;
}

function r_modeEdit(id){
    const Modal = `<div id="dialog" title="Add Breakpoint">
        <form>
          <h4><label for="color">Color</label></h4>
          <div class="wheel" id="ColorPicker"></div>
          <input name="color" class="hidden" type="color" value="#ffffff" tabindex="-1">

          <h4>Duration</h4>
          <label for="timeM">Minutes <small id="timeM" class=" class="text-muted">(0 min)</small></label>
          <input name="timeM" class="mdl-slider mdl-js-slider" type="range" min="0" max="30" value="0" tabindex="0">
          <label for="timeS">Seconds <small id="timeS" class=" class="text-muted">(15 s)</small></label>
          <input name="timeS" class="mdl-slider mdl-js-slider" type="range" min="0" max="59.9" value="15" step="0.1" tabindex="0">

          <!-- Allow form submission with keyboard without duplicating the dialog button -->
          <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
        </form>
    </div>`;

    UI.title("Edit " + Data.get("Modes",id).name,{icon:"arrow_back", url:"/modes"});
    UI.actions([{url:`/mode/${id}/delete`,icon:"delete"}]);
    UI.renderContent(UI.card(undefined,`
    <div id="mode-title" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="mode-name" value="${Data.get("Modes",id).name}">
        <label class="mdl-textfield__label" for="mode-name">Name...</label>
    </div>
  
    <h4>Colors</h4>${r_modeBreakpoints(id)}
    <button id="addBreaktpoint" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent float-right"><i class="material-icons">add</i> Add Breakpoint</button>
    ${Modal}`));
    
    // SCRIPT
    function addColorTime() {
        const color = $("input[name=color]").val();
        const duration = $("input[name=timeM]").val()*600 + $("input[name=timeS]").val()*10;
        let mode = Data.get("Modes",id);
        mode.colors.push(color);
        mode.durations.push(duration);
        Data.set("Modes", id, mode);
        $(".modeDetailList").html(r_modeBreakpoints(id));
        applyDeleteHandler();
        dialog.dialog( "close" );
    }
    $("div[role=dialog]").remove();
    let colorPicker = undefined;
    dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
      draggable: false,
      buttons: {
        Cancel: function() {
          dialog.dialog( "close" );
        },
        "Add": addColorTime
      },
      open: function( event, ui ) {
          if(!colorPicker){ colorPicker = Picker.initColorPicker("#ColorPicker","#ffffff",e => {$("input[name=color]").val(e.hexString);}); }
      }
    });    
    $("#addBreaktpoint").on("click", function(){
        dialog.dialog("open");        
    });
    function applyDeleteHandler(){
        $(".delete-breakpoint").off().on("click", function(){
            const index = this.parentNode.getAttribute("data-index");
            let mode = Data.get("Modes",id);
            mode.colors.splice(index, 1);
            mode.durations.splice(index,1);
            Data.set("Modes", id, mode);
            $(".modeDetailList").html(r_modeBreakpoints(id));
            applyDeleteHandler();
        });   
    }
    applyDeleteHandler();
    $("input[name=timeM]").on("input change", e => { 
        document.getElementById("timeM").innerHTML = "("+e.currentTarget.value+" min)";
    });
    $("input[name=timeS]").on("input change", e => { 
        document.getElementById("timeS").innerHTML = "("+e.currentTarget.value+" s)";
    });
    $("#mode-name").on("input change", e => {
        Data.patch("Modes", [id, "name"], e.currentTarget.value);
        UI.title("Edit " + e.currentTarget.value,{icon:"arrow_back", url:"/modes"});
    });
}
function r_modeDelete(id){
    Data.del("Modes", id);
    Router.navigate("/modes");
}