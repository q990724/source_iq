<template>
    <div class="source-list">
        <div class="content" @click="onItemClick">
			<div class="item" :class="{'active': $store.state.source_id === 1}">
			    <span data-name="alibaba">Alibaba</span>
			</div>
			<div class="item" :class="{'active': $store.state.source_id === 2}">
			    <span data-name="1688">1688</span>
			</div>
            <div class="item" :class="{'active': $store.state.source_id === 3}">
                <span data-name="1688global">1688Global</span>
            </div>
			<div class="item" :class="{'active': $store.state.source_id === 10}">
			    <span data-name="1688overseas">1688overseas</span>
			</div>
            <div class="item" :class="{'active': $store.state.source_id === 4}">
                <span data-name="aliexpress">AliExpress</span>
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
        </div>
    </div>
</template>

<script>
import SourceMap from "@/assets/js/source_map";
export default {
    name: "source-list",
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
    margin-bottom: 10px;
    .content {
        flex: 1;
        width: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item {
            font-size: 20px;
            margin-right: 60px;
            &.active {
                color: #FF4000;
                font-weight: bold;
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
