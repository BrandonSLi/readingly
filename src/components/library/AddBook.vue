<template>
    <div class="add-book" @click="openFileDialog">
        <input 
            type="file" 
            class="add-book__input"
            ref="input"
            @change="handleFileChange"
        >
        <AddIcon class="add-book__icon" />
    </div>
</template>

<script>
import AddIcon from 'vue-material-design-icons/Plus'
import { mapActions } from 'vuex'

export default {
    name: 'AddBook',
    components: {
        AddIcon
    },
    methods: {
        ...mapActions('library', ['addBook']),
        openFileDialog() {
            this.$refs.input.click()
        },
        handleFileChange(event) {
            const file = event.target.files[0]
            this.$refs.input.value = ''

            if (file.type != 'application/epub+zip') {
                return this.$emit('error', 'Invalid book format')
            }

            this.addBook(file)
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-book {    
        cursor: pointer;

        &__input {
            display: none;
        }

        &__icon {
            display: flex;
        }
    }
</style>