Router
.add("lamps", r_lamps)
.add("lamp/add", r_lampAdd)
.add("lamp/([0-9]+)", r_lampEdit)
.add("lamp/([0-9]+)/sync", r_lampSync)
.add("lamp/([0-9]+)/delete", r_lampDelete)

function r_lamps(){
    UI.actions([{url:`/lamp/add`,icon:"add"}]);
    UI.title("Lamps",{icon:"lightbulb_outline"});
    UI.renderContent(`<div class="lamps">${UI.card(undefined,r_overview("/lamp",Data.list("Lamps")))}</div>`);
}

function r_lampAdd(id){
    const discover = `
    <form id="subnetSearch" class="ip-input">
        <b>Subnet IP</b>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-1" placeholder="192">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-2" placeholder="168">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-3" placeholder="2">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" value="1-255" id="ip-4" disabled>
        </div>
        <b>Timeout</b>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,2})(\.)?([0-9]{0,2})" id="timeout" placeholder="5">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>s
    </br>
        <button type="submit" id="startScan" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent mt-3" data-upgraded=",MaterialButton,MaterialRipple">
            <i class="material-icons">sync</i> Start Scan
        </button>
    </form>

    <div id="scan" class="hidden">
        <span id="subnetLabel" class="text-secondary"></span>
        <div id="scanBar">
            <div id="progress" style="width: 0%"></div>
            <div id="progressPerc">0</div>
        </div>

        <h4>Discovered Lamps</h4>
        <ul id="discovered" class="mdl-list"></ul>
    </div>
    `;
    const addManually = `
    <form id="ipLamp" class="ip-input">
        <b>Enter IP of Lamp</b>
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-1" placeholder="192">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-2" placeholder="168">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-3" placeholder="2">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        .
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" pattern="([0-9]{1,3})" id="ip-4" placeholder="1">
            <span class="mdl-textfield__error">Invalid input!</span>
        </div>
        <button type="submit" id="startScan" class="
        mdl-button mdl-js-button mdl-js-ripple-effect  mdl-button--raised mdl-button--accent mt-3" data-upgraded=",MaterialButton,MaterialRipple">
            <i class="material-icons">add</i> Add Lamp
        </button>
    </form>
    `;
    UI.actions();
    UI.title("Connect new lamp",{icon:"arrow_back", url:"/lamps"});
    UI.renderContent(
        UI.card("Search in Network",discover)
      + UI.card("Add manually",addManually)
    );

    // SCRIPT
    function saveLamp(ipAdress, timeout, callback){
        // TODO - communicate with IP to get Data of Lamp
        ajax( "http://" + ipAdress + ":80/getconfig", {   
            onload: r => {
                    if(!r){
                        return UI.toast({message: 'Failed to add Lamp'});
                    }
                    r = JSON.parse(r);
                    const lampId = Data.set("Lamps", undefined, {
                        ip: ipAdress,
                        hostName: (r.hostname || undefined),
                        name: (r.name || null),
                        colorMode: (r.colorMode || "RGB"), 
                        savedModes: (r.savedModes || []), 
                        turnedOn: (r.turnedOn || false),
                        last: (r.last || {color: undefined, mode: undefined})
                    })
                    if(!callback){ Router.navigate("/lamp/"+lampId); }
                    else{ callback(lampId); }
                }, 
            onerror: _ => {UI.toast({message: "Can't connect to lamp"});},
            onabort: _ => {UI.toast({message: "Can't connect to lamp"});},
            timeout: timeout,
            ontimeout: _ => {UI.toast({message: 'Connection to Lamp timed out'});}
        });
    }
    function scanSubnetwork(subnet, maxOpenConn, timeout, cb) {
        const scanbar = document.getElementById("scanBar");
        scanbar.getElementById("progress").style.width = "0%";
        scanbar.getElementById("progressPerc").innerHTML = "0";
        var ipCurrent = +1, numOpenConn = 0, scannedIps = 0, devices = [];
        var ipBase = subnet + ".";

        const fail = function (){
            --numOpenConn;
            scannedIps++;
            next();
        }
        function tryOne(ip) {
            ++numOpenConn;
            var address = "http://" + ip + ":80/ping";

            // CLIENT SHOULD RESPONSE WITH OWN IP
            ajax( "http://" + ip + "", {
                onload: function (r,url){
                            ip = url.replace("http://","").replace(":80","").replace("/ping","");
                            saveLamp(ip, undefined, lampId => {
                                lamp = Data.get("Lamps", lampId);
                                // TODO: MAKE ITEM CLICKABLE && MATERIAL LIST
                                document.getElementById("discovered").innerHTML += `
                                  <a href="/lamp/${lampId}"><li class="mdl-list__item">
                                    <span class="mdl-list__item-primary-content">
                                      ${lamp.hostname || lamp.ip || lamp.name}
                                    </span>
                                  </li></a>
                                `;
                            })
                            devices.push(ip);
                            --numOpenConn;
                            scannedIps++;
                            next();
                        }, 
                onerror: _ => { fail(); },
                onabort: _ => { fail(); },
                timeout: timeout,
                ontimeout: _ => { fail(); }
            });
        }
        
        function next() {
            let progress = Math.round((scannedIps / 2.55));
            scanbar.getElementById("progress").style.width = progress+"%";
            scanbar.getElementById("progressPerc").innerHTML = progress;
            while (ipCurrent < 255 && numOpenConn < maxOpenConn) {
                tryOne(ipBase + ipCurrent++);
            }
            // if we get here and there are no requests in flight, then
            // we must be done
            if (numOpenConn === 0) {
                cb(devices);
            }
        }
        next();
    }
    function scanNetwork(subnet, timeout){
        $("#subnetLabel").html("Search in "+subnet+".xxx");
        $("#startScan").attr("disabled","disabled");
        $("#scan").removeClass("hidden");
        scanSubnetwork(subnet, 5, timeout, e => {
            console.log("Devices",e); 
            $("#startScan").removeAttr("disabled");
        } );

        /*
        $("#subnetSearch").addClass("hidden");
        $("#scan").removeClass("hidden");
        */
    }
    // SCAN
    $("#subnetSearch").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        const subnet = ($("#subnetSearch #ip-1").val()||"192") + "."
                 + ($("#subnetSearch #ip-2").val()||"168") + "."
                 + ($("#subnetSearch #ip-3").val()||"2");
        scanNetwork(subnet, parseFloat($("#subnetSearch #timeout").val()||5)*1000);
    });
    // MANUALLY
    $("#ipLamp").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        const ipAdress = ($("#ipLamp #ip-1").val()||"192") + "."
                 + ($("#ipLamp #ip-2").val()||"168") + "."
                 + ($("#ipLamp #ip-3").val()||"2") + "."
                 + ($("#ipLamp #ip-4").val()||"1")
        saveLamp(ipAdress);
    });
}

function r_lampMode(index, name){
    return `<li class="mdl-list__item" data-index="${index}">
            <span class="mdl-list__item-primary-content">
                <span class="mdl-list__item-avatar">${index+1}</span>
                <span>${name}</span>
            </span>
            <span class="mdl-list__item-secondary-action text-muted delete-mode"><i class="material-icons">delete</i></span>
        </li>`;
}
function r_lampModes(id){
    let listItems = "";
    const lamp = Data.get("Lamps",id);
    for (i = 0; i < lamp.savedModes.length; i++) {
        listItems += r_lampMode(i,Data.get("Modes",lamp.savedModes[i]).name);
    }
    return `<ul class="mdl-list lampModeList">${listItems}</ul>`;
}
function r_lampEdit(id){
    // TODO - Make list sortable (jQuery UI sort items -> on change get data-index in order, get savedModes[index] and push to new list => save new list as savedModes, rerender ModeList)
    function r_addableModes(id){
        let modes = Data.list("Modes");
        let activeModes = Data.get("Lamps",id).savedModes;
        let ModeList = ""
        for (i = 0; i < modes.length; i++) {
            // mark applied modes
            if(activeModes.includes(modes[i].id)){continue;}
            ModeList += `<li class="mdl-list__item" data-index="${i}">
                    <span class="mdl-list__item-primary-content">
                      ${modes[i].name}
                    </span>
                    <span class="mdl-list__item-secondary-action">
                      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-${i}">
                        <input type="checkbox" name="addModes" id="list-checkbox-${i}" value="${modes[i].id}" class="mdl-checkbox__input" ${(modes[i].active)?"checked":""}/>
                      </label>
                    </span>
                  </li>`;
        }
        return ModeList;
    }
    const Modal = `<div id="dialog" title="Add Mode">    
        <form>
            <ul class="mdl-list" id="addableModes"></ul>
          <!-- Allow form submission with keyboard without duplicating the dialog button -->
          <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
        </form>
    </div>`;

    UI.title(Data.get("Lamps", id).name,{icon:"arrow_back", url:"/lamps"}); 
    UI.actions([{url:`/lamp/${id}/delete`,icon:"delete"}]);
    UI.renderContent(UI.card(undefined,`
    <div id="mode-title" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="lamp-name" value="${Data.get("Lamps",id).name}">
        <label class="mdl-textfield__label" for="lamp-name">Name...</label>
    </div>

    <h4>Modes</h4>${r_lampModes(id)}
    <button id="addMode" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent float-right"><i class="material-icons">add</i> Add Mode</button>
    ${Modal}`, [{url:`lamp/${id}/sync`,icon:"sync"}]));
    
    // SCRIPT
    function addMode() {
        let lamp = Data.get("Lamps",id);
        $("input[name=addModes]:checked").map(function(){return this.value;}).get().forEach(e => {
            lamp.savedModes.push(e);
        })
        Data.set("Lamps", id, lamp);
        $(".lampModeList").html(r_lampModes(id));
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
        "Add": addMode
      },
      open: function( event, ui ) {
        document.getElementById("addableModes").innerHTML = r_addableModes(id);
        let evt = document.createEvent('Event');  
        evt.initEvent('load', false, false);  
        window.dispatchEvent(evt);
      }
    });    
    $("#addMode").on("click", function(){
        dialog.dialog("open");        
    });
    function applyDeleteHandler(){
        $(".delete-mode").off().on("click", function(){
            const index = this.parentNode.getAttribute("data-index");
            let lamp = Data.get("Lamps",id);
            lamp.savedModes.splice(index,1);
            Data.set("Lamps", id, lamp);
            $(".lampModeList").html(r_lampModes(id));
            applyDeleteHandler();
        });
    }
    applyDeleteHandler();
    $("#lamp-name").on("input change", e => {
        Data.patch("Lamps", [id, "name"], e.currentTarget.value);
        UI.title(e.currentTarget.value,{icon:"arrow_back", url:"/lamps"});
    });
}
function r_lampSync(id){
    // TODO - Send applied modes to ESP8266
    Router.navigate("/lamp/"+id);
}
function r_lampDelete(id){
    Data.del("Lamps", id);
    Router.navigate("/lamps");
}