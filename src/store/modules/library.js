import db from '@/db'
import { getBookData } from '@/services/book.service'

export default {
    namespaced: true, 
    
    state: {
        books: null,
        bookIsUploading: false
    },

    mutations: {
        pushBook({ books }, book) {
            books.unshift(book)
        },
        setBooks(state, books) {
            state.books = books
        },
        setBookIsUploading(state, value) {
            state.bookIsUploading = value
        }
    },

    actions: {
        async addBook({ commit }, book) {
            commit('setBookIsUploading', true)

            const newBook = {
                file: book,
                ...(await getBookData(book)),
                highlights: []
            }
            await db.books.add(newBook)

            commit('pushBook', newBook)

            commit('setBookIsUploading', false)
        },
        async getBooks({ commit }) {
            const books = await db.books.orderBy('id').reverse().toArray()

            commit('setBooks', books)
        },
        async removeBook({ state, commit }, id) {
            const books = state.books.filter(book => book.id !== id)
            commit('setBooks', books)

            await db.books.delete(id)
        },
        async updateBook({ state, commit }, { id, newBook }) {
            const books = state.books.map(book => ({
                ...book,
                ...(book.id === id ? newBook : {})
            }))

            commit('setBooks', books)

            await db.books.update(id, newBook)
        }
    }
}