<template>
    <Wrapper class="reader" :brightness="brightness">
        <div class="reader__toolbar">
            <ReturnToLibrary />

            <div class="reader__tools">
                <OpenTableOfContents @click="openTableOfContents" />
                <OpenSettings @click="openSettings" />
            </div>
        </div>

        <EpubViewer @text-select="openDictionary" />

        <slideout-panel />

        <ReadingProgress />
    </Wrapper>
</template>

<script>
import ReturnToLibrary from '@/components/reader/ReturnToLibrary'
import EpubViewer from '@/components/reader/EpubViewer'
import Dictionary from '@/components/reader/Dictionary'
import Settings from '@/components/reader/Settings'
import TableOfContents from '@/components/reader/TableOfContents'
import OpenSettings from '@/components/reader/OpenSettings'
import OpenTableOfContents from '@/components/reader/OpenTableOfContents'
import ReadingProgress from '@/components/reader/ReadingProgress'
import Vue from 'vue'
import { mapState } from 'vuex'
import styled from 'vue-styled-components'

const Wrapper = styled('div', { brightness: Number })`
    filter: brightness(${ props => props.brightness }%);
`

Vue.component('Dictionary', Dictionary)
Vue.component('Settings', Settings)
Vue.component('TableOfContents', TableOfContents)

export default {
    name: 'Reader',
    components: {
        Wrapper,
        ReturnToLibrary,
        OpenSettings,
        OpenTableOfContents,
        EpubViewer,
        ReadingProgress,
    },
    data() {
        return {
            panel: null
        }
    },
    computed: mapState('reader', ['brightness']),
    methods: {
        openDictionary(word) {
            this.panel = this.showPanel('Dictionary', { word })
        },
        openSettings() {
            this.panel = this.showPanel('Settings')
        },
        openTableOfContents() {
            this.panel = this.showPanel('TableOfContents')
        },
        showPanel(component, props) {
            const config = {
                component,
                props,
                openOn: 'bottom',
                height: `${screen.height * 0.5}`
            }

            return this.panel ? this.panel.show(config) : this.$showPanel(config)
        }
    }
}
</script>

<style lang="scss" scoped>
    .reader {
        &__toolbar {
            background: var(--theme-bg-color);
            color: var(--theme-text-color);
            padding: 0 1em;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__tools {
            display: flex;
            gap: 0.5rem;
        }
    }
    
</style>

<style lang="scss">
    .slideout-panel .slideout-wrapper .slideout {
        display: flex;
        justify-content: center;
        background: var(--theme-bg-color) !important;

        & > * {
            width: 100%;
            max-width: 700px;
        }
    }
</style>