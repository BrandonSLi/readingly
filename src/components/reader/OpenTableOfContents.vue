<template>
    <div class="open-table-of-contents" @click="$emit('click')">
        <TableOfContentsIcon />
    </div>
</template>

<script>
import TableOfContentsIcon from 'vue-material-design-icons/TableOfContents'

export default {
    name: 'OpenTableOfContents',
    components: {
        TableOfContentsIcon
    }
}
</script>

<style lang="scss" scoped>
    .open-table-of-contents {
        height: 24px;
        cursor: pointer;
    }
</style>