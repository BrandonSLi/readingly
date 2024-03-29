<template>
    <div class="epub">
        <ClipLoader
            class="epub__loading"
            v-show="loading"
            color="var(--theme-text-color)"
            size="75px"
        />

        <div id="epub__viewer" />

        <div 
            v-show="selection && selectedText" 
            class="menu" 
            ref="menu"
        >
            <TranslateIcon @click="translateSelectedText" />
            <CopyIcon @click="copySelectedText" />
            <MarkerIcon @click="highlightSelectedText" />
        </div>
    </div>
</template>

<script>
import { Book } from 'epubjs'
import { mapState, mapMutations, mapActions } from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import when from 'when-key-events'
import isMobile from 'ismobilejs'
import TranslateIcon from 'vue-material-design-icons/Translate'
import CopyIcon from 'vue-material-design-icons/ContentCopy'
import MarkerIcon from 'vue-material-design-icons/Marker'
import copy from 'copy-text-to-clipboard'

export default {
    name: 'EpubViewer',
    components: {
        ClipLoader,
        TranslateIcon,
        CopyIcon,
        MarkerIcon
    },
    data() {
        return {
            rendition: null,
            book: null,
            loading: true,
            selection: null,
            selectedText: '',
            selectionLocation: '',
        }
    },
    async mounted() {
        this.book = new Book(this.currentBook.file, { openAs: 'binary' })

        this.rendition = this.book.renderTo('epub__viewer', {
            manager: 'continuous',
            flow: 'paginated',
            width: '100%',
            height: '100%',
            stylesheet: '/fonts.css',
            snap: true
        })

        this.setupThemes()
    
        if (this.currentBook.location) {
            this.rendition.display(this.currentBook.location)
        } else {
            this.rendition.display()
        }

        await this.book.ready
        this.book.locations.generate(1000)

        this.currentBook.highlights.forEach(({ location }) => {
            this.rendition.annotations.highlight(location)
        })

        this.rendition.on('relocated', this.onRelocated)
        this.rendition.on('rendered', this.onRendered)
        this.rendition.on('selected', this.onSelected)

        when('arrow_left').Execute(() => this.rendition.prev())
        when('arrow_right').Execute(() => this.rendition.next())
    },
    computed: mapState('reader', [
        'currentBook',
        'fontSize', 
        'theme', 
        'progress', 
        'font'
    ]),
    methods: {
        ...mapMutations('reader', ['setProgress']),
        ...mapActions('library', ['updateBook']),
        onRelocated(location) {
            this.updateBook({
                id: this.currentBook.id,
                newBook: {
                    location: location.start.cfi
                }
            })

            const progress = this.book.locations.percentageFromCfi(location.start.cfi)
            this.setProgress(progress * 100)
        },
        onSelected(cfiRange) {
            this.selectionLocation = cfiRange
        },
        highlightSelectedText() {
            this.rendition.annotations.highlight(this.selectionLocation)

            this.currentBook.highlights.push({ 
                text: this.selectedText, 
                location: this.selectionLocation 
            })
            this.updateBook({
                id: this.currentBook.id,
                newBook: this.currentBook
            })

            this.clearSelection()
        },
        onRendered() {
            this.loading = false

            this.rendition.getContents().forEach(content => {
                content.content.onclick = () => {
                    if (this.selectedText) {
                        return
                    }

                    const selection = content.window.getSelection()
                
                    selection.modify('extend', 'backward', 'word')       
                    const b = selection.toString()

                    selection.modify('extend', 'forward', 'word')
                    const a = selection.toString()
                    selection.modify('move','forward','character')
                    
                    if (/\w+/.test(b + a)) {
                        this.$emit('text-select', b + a)
                    }
                }

                content.document.onselectionchange = (e) => {
                    this.selection = e.target.getSelection()
                    this.selectedText = this.selection.toString()

                    const { top } = this.selection.getRangeAt(0).getBoundingClientRect()
                    
                    this.$refs.menu.style.top = `calc(${ top }px - 1em)`
                }

                content.document.oncontextmenu = (e) => {
                    e.preventDefault()
                }
            })

            this.changeFont(this.font)
        },
        translateSelectedText() {
            this.$emit('text-select', this.selectedText)
            this.clearSelection()
        },
        copySelectedText() {
            copy(this.selectedText)
            this.clearSelection()
        },
        clearSelection() {
            this.selection.removeAllRanges()
            this.selectedText = ''
            this.selection = null
        },
        setupThemes() {
            this.rendition.themes.default({ '::selection': { background: '#f7b3374d' } })
            this.rendition.themes.register('white', { body: { background: '#f9f9f9', color: '#333' }})
            this.rendition.themes.register('black', { body: { background: '#333', color: '#e7e7e7' }})
            this.rendition.themes.register('sepia', { body: { background: '#fbf0d9', color: '#5f4b32' }})

            this.rendition.themes.fontSize(this.fontSize + '%')
            this.rendition.themes.select(this.theme)
        },
        changeFont(font) {
            this.rendition.getContents().forEach(content => {
                content.documentElement.querySelector('#epubjs-inserted-css-').innerHTML = `
                    * { 
                        font-family: ${this.font}, serif !important;
                        ${!isMobile(window.navigator).any && 'cursor: pointer;'}
                    }
                `
            })
        }
    },
    watch: {
        fontSize(newFontSize) {
            this.rendition.themes.fontSize(newFontSize + '%')
        },
        theme(newTheme) {
            this.rendition.getContents().forEach(content => {
                content.documentElement.querySelector('#epubjs-inserted-css-white')?.remove()
                content.documentElement.querySelector('#epubjs-inserted-css-black')?.remove()
                content.documentElement.querySelector('#epubjs-inserted-css-sepia')?.remove()
            })
            
            this.rendition.themes.update(newTheme)
        },
        font() {
            this.changeFont(this.font)
        },
        currentBook() {
            this.rendition.display(this.currentBook.location)
        }
    }
}
</script>

<style scoped>
    #epub__viewer {
        height: calc(100vh - 32px);
        background: var(--theme-bg-color);
    }

    .epub__loading {
        position: fixed;
        height: calc(100% - 32px);
        width: 100%;
        top: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--theme-bg-color);
        color: var(--theme-text-color);
    }

    .menu {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background: var(--theme-text-color);
        color: var(--theme-bg-color);
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        padding: 0.5em;
        border-radius: 4px;
        font-weight: 600;
        display: flex;
        gap: 1em;
        height: 24px;
    }
</style>

<style>
    .epub-container {
        margin: auto;
    }

    .epubjs-hl {
        fill: #f7b337;
    }
</style>