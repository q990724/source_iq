<template>
    <div class="my-collapse" :style="{'align-items': isShowCollapse ? 'flex-start' : 'center'}">
        <div class="title" v-if="title">{{ title }}</div>
        <!--<div class="options" v-if="list">-->
        <div class="options">
            <div class="list" ref="list" :style="{'max-height': previewRow * rowHeight + 'px'}">
                <div class="items" ref="items">
                    <slot></slot>
                </div>
            </div>
            <div class="btns" v-if="isShowCollapse">
                <span class="open" @click="open" v-if="!collapseStatus">展开</span>
                <span class="close" @click="close" v-else>收起</span>
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
            default: 1
        },
        rowHeight: {
            type: Number,
            default: 25
        }
    },
    mounted() {
        let rowCount = Math.ceil($(this.$refs['items']).height() / this.rowHeight);
        console.log(rowCount);
        if(rowCount > this.previewRow) {
            this.isShowCollapse = true;
        }
    },
    methods: {
        open() {
            this.collapseStatus = true;
            $(this.$refs['list']).css('max-height', 'initial');
            $(this.$refs['list']).css('overflow', 'visible');
        },
        close() {
            this.collapseStatus = false;
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
        font-size: 18px;
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
                font-size: initial;
                .item {
                    line-height: 1.5;
                    color: #666666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    transition: color .4s;
                    margin-right: 20px;
                    &:hover {
                        color: #FF4000;
                    }
                    &.active {
                        color: #FF4000;
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
                margin-right: 20px;
                &:hover {
                    color: #FF4000;
                }
                &.active {
                    color: #FF4000;
                }
            }
        }
        .btns {
            span {
                display: inline-block;
                padding: 4px 8px;
                border: 1px solid #AAA;
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
}
</style>