/*========== AJAX-REQUEST ==========*/
//function ajax(url,callback){var xobj=new XMLHttpRequest();xobj.overrideMimeType("application/json");xobj.open('GET',exturl,true);xobj.onreadystatechange=function(){if(xobj.readyState==4&&xobj.status=="200"){callback(xobj.responseText);}}}

var UI = {
    title: function(titleText, navButton){
        document.getElementById("navTitle").innerHTML = titleText;
        if(!navButton){
            navButton = {icon:"lightbulb_outline", url:"/"};
        }
        document.getElementById("navIcon").setAttribute('href', navButton.url?navButton.url:"#");
        document.getElementById("navIcon").innerHTML = `<i class="material-icons">${navButton.icon}</i>`;
    },
    actions: function(items){
        /*[{
            icon: '<i class="material-icons">settings</i>',
            callback:function(e){console.log(e);}
        }]*/
        if(items){
            // render action icons
            $("header .actions").html(function(){
                let out = ""
                items.forEach((item, index) => {
                    out += `<li id="action-${item.icon}">
                        <a href="${item.url}">
                            <i class="material-icons">${item.icon}</i>
                        </a>
                    </li>`;
                });
                return out;
            });
        }else{
            $("header .actions").html("");  
        }
    },
    renderContent: function(code){
        document.getElementById("app-content").innerHTML = code;
    },
    renderHead: function(code){
        document.getElementById("app-head").innerHTML = code;
    },
    card: function(title, content, headActions, footActions){
        let headActionButtons = "";
        let footActionButtons = "";
        if(headActions){
            headActions.forEach(action => {
                headActionButtons += `<a href="${action.url}" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple">
                    <i class="material-icons">${action.icon}</i>
                <span class="mdl-button__ripple-container"><span class="mdl-ripple"></span></span></a>`;
            });
        }
        if(footActions){
            footActionButtons = '<div class="mdl-card__actions mdl-card--border">';
            footActions.forEach(action => {
                footActionButtons += `<a href="${action.url}" class="mdl-button mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple">${action.text}</a>`;
            });
            footActionButtons += '</div>';
        }
        return `<div class="card">
            <div class="card-block">
                ${(title)?('<h4 class="card-title">'+title+'</h4>'):''}
                <div>${content}</div>
            </div>
            <div class="mdl-card__menu">${headActionButtons}</div>
            ${footActionButtons}</div>
        </div></div>`;
    },
    tabView: function(json){
        let navItems = '';
        let tabPane = '';
        for (var k in json){
            navItems += `<a href="#${k}" class="col" data-toggle="tab"><li class="nav-item ${(json[k].active)?"active":""}">${json[k].title.toUpperCase()}</li></a>`;
            tabPane += `<div id="${k}" class="tab-pane ${(json[k].active)?"active":""}">${json[k].content}</div>`;
        }
        let navTabs = `<ul class="nav nav-tabs row text-center">${navItems}</ul>`;
        let tabContent = `<div class="tab-content">${tabPane}</div>`;
        return navTabs+tabContent;
    },
    setTab: function(id){
        //window.location.hash = id;
        $(".nav-item.active").removeClass("active");
        $(".tab-pane.active").removeClass("active");
        $('a[href="#'+id+'"] .nav-item').addClass("active");
        $('#'+id).addClass("active");
    },
    snackbarContainer: document.getElementById('snackbar'),
    toast: function(config){
        this.snackbarContainer.MaterialSnackbar.showSnackbar(config);
    }
}

$(".bottom-nav a").on("click",function(e){
    $(".bottom-nav a.active").removeClass("active");
    this.classList.toggle("active");
});

$("body").on("click",".nav-item",function(e){
    UI.setTab(this.parentNode.getAttribute("href").substr(1));
});

