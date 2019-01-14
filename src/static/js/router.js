var Router = {
    routes: [],
    mode: history,
    root: '',

    getFragment: function() {
        var fragment = '';
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(re, handler) {
        if(typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({ re: re, handler: handler});
        return this;
    },
    remove: function(param) {
        for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
            if(r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1); 
                return this;
            }
        }
        return this;
    },
    check: function(f) {
        var fragment = f || this.getFragment();
        for(var i=0; i<this.routes.length; i++) {
            var match = fragment.match(new RegExp( "^" + this.routes[i].re + "$", "i"));
            if(match) {
                match.shift();
                this.routes[i].handler.apply({}, match);

                //onload Event
                let evt = document.createEvent('Event');  
                evt.initEvent('load', false, false);  
                window.dispatchEvent(evt);

                //reload BottomNav .active
                const current = $('.bottom-nav a[href^="/'+window.location.pathname.split("/")[1]+'"]:not(.active)')
                if(current.length > 0){
                    $('.bottom-nav a.active').removeClass("active");
                    current.addClass("active");
                }
                return this;
            }           
        }
        return this;
    },
    listen: function() {
        self = this;
        window.onpopstate = function(event) {
            if(location.hash == ""){
                self.check(self.getFragment());
            }else{
                event.preventDefault();
                window.setTimeout ( function() {
                    window.scrollTo(0,0); 
               }, 0);
            }
        };
        return this;
    },
    navigate: function(path) {
        path = path ? path : '';
        history.pushState(null, null, "/" + this.root + this.clearSlashes(path));
        this.check()
        return this;
    }
}

// returning the user to the initial state
Router.listen();

$('body').on('click', 'a', function(e) {
    e.preventDefault();
    if(this.getAttribute("href").startsWith("#")){
        window.location.hash = this.getAttribute("href");
    }else{
        Router.navigate(this.getAttribute("href"));
    }
});