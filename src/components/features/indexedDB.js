const createDB = ({database_name,database_id})=>{
    let db;
    const indexedDB = window.indexedDB
    if(!indexedDB){
        return 'indexed db is not supported'
    }

    const Open_DB = window.indexedDB.open(database_name, database_id)

    Open_DB.onerror=(e)=>{
        Notiflix.Notify.failure(e.target.errorCode)
    }
    Open_DB.onsuccess=(e)=>{
        db = e.target.result;
    }
    return db
}

const create_object = ({object_name,key})=>{
    const db = createDB()
    const objectStore = db.createObjectStore(object_name, { keyPath:key });
    return objectStore
}