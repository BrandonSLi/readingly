import { Book } from 'epubjs'
import { readFile } from '@/utils'

export async function getBookData(file) {
    if (! file) {
        throw new Error('File is not specified')
    }

    file = await readFile(file);

    const book = new Book(file, { openAs: 'binary' })

    const { title } = await book.loaded.metadata
    const cover = await fetch(await book.coverUrl()).then(r => r.blob())

    const tableOfContents = book.navigation.toc.reduce((array, item) => {
        const subitems = item.subitems.map(subitem => ({
            label: subitem.label,
            location: subitem.href
        }))

        return [
            ...array, 
            {
                label: item.label,
                location: item.href
            }, 
            ...subitems
        ];
    }, [])
    
    return {
        title,
        cover,
        tableOfContents
    }
}