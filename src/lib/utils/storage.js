const Storage = {
    set(key, val){
        return localStorage.setItem(key, val);
    },
    get(key){
        return localStorage.getItem(key);
    },
    remove(key){
        return localStorage.removeItem(key);
    },
    clear(){
        return localStorage.clear();
    }
}

export default Storage