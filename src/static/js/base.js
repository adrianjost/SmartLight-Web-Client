function setTestData(){
    Data.setAll("Lamps", {
        "001": {
            name:"Lampe 1 (RGB)",
            colorMode:"RGB",
            savedModes:["001", "003", "004"],
            turnedOn:true,
            last: {
                color: "#00ffaa",
                mode: "004",
            }
        },
        "002": {
            name:"Lampe 2 (BRG)",
            colorMode:"RGB",
            savedModes:["001", "002", "003", "004"],
            turnedOn:false,
            last: {
                color: "#aa00ff",
                mode: "004",
            }
        },
        "003": {
            name:"Lampe 3 (RBG)",
            colorMode:"RGB",
            savedModes:["001", "002"],
            turnedOn:true,
            last: {
                color: "#ff00aa",
                mode: "004",
            }
        },
        "004": {
            name:"Lampe 3 (dualChannel)",
            colorMode:"RGB",
            savedModes:[],
            turnedOn:true,
            last: {
                color: "#88ff00",
                mode: "001",
            }
        },
        "005": {
            name:"Lampe 5 (SingleChannel)",
            colorMode:"RGB",
            savedModes:["005"],
            turnedOn:false,
            last: {
                color: "#ff0000",
                mode: "001",
            }
        }
    });
    
    Data.setAll("Rooms", {
        "001": {
            name:"Raum 1",
            lamps:["001", "002", "005"],
            turnedOn:false,
            last: {
                color: "#ffaa00",
                mode: "002",
                scene: "001",
            }
        },
        "002": {
            name:"Raum 2",
            lamps:["003", "004"],
            turnedOn:true,
            last: {
                color: "#00ffaa",
                mode: "004",
                scene: "003",
            }
        }
    });
    
    Data.setAll("Modes", {
        "001": {
            name:"Mode 1",
            colors:["#ff00aa"],
            durations:[100],
            fade:true
        },
        "002": {
            name:"Mode 2",
            colors:["#4A148C", "#E91E63", "#9CCC65"],
            durations:[20, 5, 10],
            fade:true
        },
        "003": {
            name:"Mode 3",
            colors:["#E91E63", "#2196F3"],
            durations:[5, 15],
            fade:true
        },
        "004": {
            name:"Mode 4",
            colors:["#64FFDA", "#4A148C", "#00ccf0", "#FF5722"],
            durations:[120, 120, 120, 10],
            fade:true
        },
        "005": {
            name:"Mode 5",
            colors:["#FF5722", "#9CCC65", "#03A9F4"],
            durations:[3, 3, 3],
            fade:true
        }
    });
    
    Data.setAll("Scenes", {
        "001": {
            name:"Scene 1",
            roomId:"001",
            modes: {
                "001":"004",
                "002":"001",
                "005":"005"
            }
        },
        "002": {
            name:"Scene 2",
            roomId:"001",
            modes: {
                "001":"001",
                "002":"004",
                "005":"003"
            }
        },
        "003": {
            name:"Scene 3",
            roomId:"002",
            modes: {
                "003":"002",
                "004":"002"
            }
        }
    });
    
    
    
}
if( (!Data.exists("Version")) || Data.getAll("Version") != "0.0.1"){
    setTestData();
    Data.setAll("Version", "0.0.1");
}

/*========== AJAX-REQUEST ==========*/
function ajax(url, options) { 
	/* var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open('GET', url, true);*/
    var xhr = createCORSRequest('GET', url);
    if (!xhr) { throw new Error('CORS not supported'); }

    if(options && options.timeout){ xhr.timeout = options.timeout; }
	xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
			if(options && options.onload){ options.onload(xhr.responseText, url); }
		} else if (xhr.readyState == 4) {
            if(options && options.onerror){   xhr.onerror = e => { options.onerror(e);   }; }
        }
	};
    if(options && options.onerror){   xhr.onerror = e => { options.onerror(e);   }; }
    if(options && options.onabort){   xhr.onabort = e => { options.onabort(e);   }; }
    if(options && options.ontimeout){ xhr.ontimeout = e => { options.ontimeout(e); }; }
	xhr.send(null);  
}


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}
/*======== CHAIN getElementById ========*/
Element.prototype.getElementById = function(id) {
    return document.getElementById(id);
}

/*========= RENDER OVERVIEW =========*/
function r_overview(url_prefix,data){
    let entrys = "";
    if(data){
        data.forEach(function(e){
            entrys += `
            <a href="${url_prefix}/${e.id}">
                <div class="mdl-list__item">
                    <span class="mdl-list__item-primary-content">
                        <i class="toggle material-icons mdl-list__item-avatar">${(e.turnedOn)?"highlight":"clear"}</i>
                        <span>${e.name}</span>
                    </span>
                    <span class="mdl-list__item-secondary-action"><i class="material-icons">chevron_right</i></span>
                </div>
            </a>`;
        });
    }
    return `<div class="mdl-list">${entrys}</div>`;
}