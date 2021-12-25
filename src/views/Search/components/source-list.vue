<template>
    <div class="source-list">
        <div class="content" @click="onItemClick">
            <my-collapse>
                <div class="item" :class="{'active': $store.state.source_id === 1}">
                    <span data-name="alibaba">Alibaba</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 2}">
                    <span data-name="1688">1688</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 15}">
                    <span data-name="1688rapid">1688Rapid</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 3}">
                    <span data-name="1688global">1688Global</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 10}">
                    <span data-name="1688overseas">1688overseas</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 4}">
                    <span data-name="aliexpressDS">Aliexpress DS</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 14}">
                    <span data-name="aliexpressZapieX">Aliexpress ZapieX</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 5}">
                    <span data-name="yiwugo">Yiwugo</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 6}">
                    <span data-name="dhgate">DHgate</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 8}">
                    <span data-name="cjds">CJdropshipping</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 7}">
                    <span data-name="mic">Made-in-China</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 9}">
                    <span data-name="litbox">LightInTheBox</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 11}">
                    <span data-name="banggood">Banggood</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 12}">
                    <span data-name="chinabrands">Chinabrands</span>
                </div>
                <div class="item" :class="{'active': $store.state.source_id === 13}">
                    <span data-name="globalres">Globalres</span>
                </div>
            </my-collapse>
        </div>
    </div>
</template>

<script>
import SourceMap from "@/assets/js/source_map";
import MyCollapse from "@/components/my-collapse";
export default {
    name: "source-list",
    components: {
        MyCollapse
    },
    methods: {
        onItemClick(e) {
            if(e.target.nodeName == "SPAN") {
                let name = e.target.dataset.name,
                    source_id = SourceMap[name]['id'];
                this.$store.state.sourceName = source_id;
                this.$emit('onSourceItemClick', source_id);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.source-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #FFF;
    .content {
        flex: 1;
        width: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item {
            font-size: $regular_text_size;
            margin-right: 20px;
            //padding: 5px 0;
            font-weight: bold;
            &.active {
                color: #FF4000;
            }
            span {
                cursor: pointer;
                &:hover {
                    color: #FF4000;
                }
            }
        }
    }
}
</style>
