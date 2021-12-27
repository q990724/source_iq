<template>
    <!-- :style="{'align-items': isShowCollapse ? 'flex-start' : 'center'}"-->
    <div class="my-collapse">
        <el-tooltip placement="top">
            <div slot="content">Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit.<br/> Aperiam asperiores<br/>consequuntur deleniti fugit ipsa molestias</div>
            <div class="title" v-if="title">{{ title }}</div>
        </el-tooltip>
        <!--<div class="options" v-if="list">-->
        <div class="options">
            <div class="list" ref="list" :style="{'max-height': previewRow * rowHeight + 'px'}">
                <div class="items" ref="items">
                    <slot></slot>
                </div>
            </div>
            <div class="btns" v-if="isShowCollapse">
				<!-- TBD：展开/收起改成图标，不用文字 -->
                <span class="open" @click="open" v-if="useStoreStatus ? !$store.state.myCollapseStatus : !collapseStatus"> <i class="el-icon-arrow-down"></i> </span>
                <span class="close" @click="close" v-if="useStoreStatus ? $store.state.myCollapseStatus : collapseStatus"> <i class="el-icon-arrow-up"></i> </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "my-collapse",
    data() {
        return {
            isShowCollapse: false,
            collapseStatus: false,
            rowHeight: 0,
            items: [
                'Lorem ipsum dolor sit amet', 'consectetur adipisicing elit', 'Delectus', 'adipisicing elit', 'Delectus', 'dolor sit amet', 'consectetur adipisicing',
                'consectetur adipisicing'
            ]
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        list: {
            type: [Array, Object],
            default() {
                return null;
            }
        },
        previewRow: {
            type: Number,
            default() {
                return 1
            }
        },
        useStoreStatus: {
            type: Boolean,
            default() {
                return false
            }
        }
    },
    mounted() {
        let $items = $(this.$refs['items']);
        let children = [];
        // $(this.$refs['items']).children('.item')
        if($items.children('.el-radio-group').length > 0) {
            children = $($items.children('.el-radio-group')[0]).children('.item');
        }else {
            children = $items.children('.item');
        }
        if(children && children.length > 0) {
            let maxHeight = $(children[0]).outerHeight(true);
            for (let i=1; i < children.length; i++) {
                let c = $(children[i]);
                if(maxHeight < c.outerHeight(true)) {
                    maxHeight = c.outerHeight(true);
                }
            }
            this.rowHeight = maxHeight;
        }
        // console.log(this.rowHeight, children.length);
        let rowCount = Math.ceil($(this.$refs['items']).height() / this.rowHeight);
        if(rowCount > this.previewRow) {
            this.isShowCollapse = true;
        }

        this.$nextTick(() => {
            // 如果Store中myCollapseStatus = true，自动展开
            if(this.$store.state.myCollapseStatus && this.useStoreStatus) {
                this.open();
            }else {
                this.close();
            }
        })

    },
    methods: {
        open() {
            if(this.useStoreStatus) {
                this.$store.state.myCollapseStatus = true;
            }else {
                this.collapseStatus = true;
            }
            $(this.$refs['list']).css('max-height', 'initial');
            $(this.$refs['list']).css('overflow', 'visible');
        },
        close() {
            if(this.useStoreStatus) {
                this.$store.state.myCollapseStatus = false;
            }else {
                this.collapseStatus = false;
            }
            $(this.$refs['list']).css('max-height', `${this.previewRow * this.rowHeight}px`);
            $(this.$refs['list']).css('overflow', 'hidden');
        },
        onItemClick(list, item, itemIndex, event) {
            this.$emit('onCollapseItemClick', {list, item, itemIndex, event});
        }
    }
}
</script>

<style scoped lang="scss">
.my-collapse {
    display: flex;
    //align-items: flex-start;
    .title {
        width: 150px;
        word-break: break-all;
        font-size: $secondary_text_size;
        font-weight: bold;
        margin-right: 20px;
    }
    .options {
        flex: 1;
        display: flex;
        align-items: flex-start;
        .list {
            flex: 1;
            overflow: hidden;
            font-size: $secondary_text_size;
            .items {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                flex: 1;
            }
            ::v-deep .el-radio-group {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                flex: 1;
                font-size: $regular_text_size;
                .item {
                    line-height: 1.5;
                    color: #666666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    transition: color .4s;
                    margin: 0 5px 10px;
                    &:hover {
                        color: $hover_color;
                    }
                    &.active {
                        color: $active_color;
                    }
                }
            }
            .item {
                line-height: 1.5;
                color: #666666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                transition: color .4s;
                margin: 0 5px 10px;
                border: 1px solid transparent;
                &:hover {
                    color: $hover_color;
                }
                &.active {
                    color: $active_color;
                }
                &.radio {
                    background-color: $radio_label_bgcolor;
                    padding: 4px 18px;
                    border-radius: 3px;
                    font-size: $secondary_text_size;
                    &:hover {
                        color: $hover_color;
                        background-color: #FFF;
                        border-color: $hover_color;
                    }
                }
            }
        }
        .btns {
            span {
                display: inline-block;
                font-size: $regular_text_size;
                cursor: pointer;
            }
        }
    }
}
</style>