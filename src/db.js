import Dexie from 'dexie'

const db = new Dexie("readingly")

db.version(1).stores({
    books: `
        ++id, 
        title, 
        cover, 
        file, 
        highlights, 
        tableOfContents,
        location
    `
})

export default db