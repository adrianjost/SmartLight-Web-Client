var Data = {
    vars: {},    
    uid: function(service, length){
        let id = "";
        const base = "0123456789";
        do{
            for (var i = 0; i < (length?length:8); i++)
            id += base.charAt(Math.floor(Math.random() * base.length));
        }while(Data.get(service,id));
        return id;
    },

    setAll: function(service,data){
        this.vars[service] = data;
        localStorage.setItem(service, JSON.stringify(data));
    },
    set: function(service, id, value) {
        if(!id){
            id = this.uid(service,4);
        }
        let tmp = this.getAll(service);
        tmp[id] = value;
        this.setAll(service, tmp);
        return id;
    },
    patch: function (service, path, value) {
        this.setAll(service, this._patchObj(this.getAll(service), path, value));
    },
    _patchObj: function (obj, path, value) {
        if(path.length == 1){
            obj[path[0]] = value;
            return obj;
        }
        obj[path[0]] = this._patchObj(obj[path[0]], path.slice(1), value);
        return obj;
    },
    delAll: function(service){
        delete this.vars[service];
        localStorage.removeItem(service);
    },
    del: function(service,id){
        delete this.vars[service][id];
        localStorage.setItem(service, JSON.stringify(this.vars[service]));
    },
    getAll: function(service){
        if(this.vars[service]){
            return this.vars[service];
        }else{
            temp = localStorage.getItem(service);
            if(temp){
                this.vars[service] = JSON.parse(localStorage.getItem(service));
                return this.vars[service];
            }else{
               return undefined;
            }
        }
    },
    get: function(service, id){
        const tmp = this.getAll(service);
        if(tmp && tmp[id]){ tmp[id].id = id; }
        return (tmp)?tmp[id]:undefined;
    },
    find: function(service, search, value){
        let data = this.list(service);
        return data.filter(e => {
            let tmp = e[search[0]];
            for (var i=1; i<search.length; i++) {
                tmp = tmp[search[i]];
            }
            return (value.isArray) ? (value.includes(tmp)) : (tmp == value);
        });
    },
    list: function(service){
        raw = this.getAll(service);
        data = []
        for (var key in raw){
            tmp = raw[key];
            tmp["id"] = key;
            data.push(tmp);
        }
        return data;
    },
    exists: function(service){
        return ((this.vars[service] != undefined)||(!(localStorage.getItem(service) === null)));
    }
}