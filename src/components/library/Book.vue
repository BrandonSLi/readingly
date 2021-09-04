<template>    
    <div class="book">
        <RemoveIcon 
            v-if="removable"
            class="book__remove" 
            @click="removeBook(book.id)" 
            :size="20" 
        />
        
        <img 
            class="book__cover"
            :src="bookCover"
            @click="openBook"
        >
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import RemoveIcon from 'vue-material-design-icons/Close'

export default {
    name: 'Book',
    components: {
        RemoveIcon
    },
    props: {
        book: {
            type: Object,
            required: true,
            default: {}
        },
        removable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        bookCover() {
            return URL.createObjectURL(this.book.cover);
        }
    },
    methods: {
        ...mapActions('library', ['removeBook']),
        ...mapMutations('reader', ['setCurrentBook']),
        openBook() {
            this.setCurrentBook(this.book)
            this.$router.push({ name: 'reader' })
        }
    }
}
</script>

<style lang="scss" scoped>
    .book {
        cursor: pointer;
        position: relative;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        border-radius: 4px;

        &__remove {
            color: #fff;
            border-radius: 50%;
            padding: 2px;
            background: #f7b337;
            position: absolute;
            right: -5px;
            top: -5px;
            display: flex;
        }

        &__cover {
            width: 120px;
            height: 100%;
            border-radius: 4px; 
        }
    }
</style>