<template>
    <div class="sort-list" v-if="sortList && Array.isArray(sortList) && sortList.length > 0">
        <el-collapse>
            <el-collapse-item title="Sort">
                <div class="list">
                    <div class="item" v-for="(sort, index) in sortList" @click="onSortClick(index)" :key="index" :class="{'active': sort.selected}">
                        <span>{{ sort.title }}</span>
                        <div class="up-down" v-if="sort.items">
                            <i class="el-icon-caret-top" v-if="(sort.items[0] && sort.items[0]['order'] === 'asc') || (sort.items[1] && sort.items[1]['order'] === 'asc')"></i>
                            <i class="el-icon-caret-bottom" v-if="(sort.items[0] && sort.items[0]['order'] === 'desc') || (sort.items[1] && sort.items[1]['order'] === 'desc')"></i>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    name: "sort-list",
    props: {
        sortList: {
            type: [Array, Object],
            default() {
                return null
            }
        }
    },
    methods: {
        onSortClick(sortIndex) {
            // for (let sort of this.sortList) {
            //     sort.selected = false;
            //     if(sort.title === item.title) {
            //         sort.selected = true;
            //     }
            // }
            this.$emit("onSortChange", {sortIndex, event:true});
        }
    }
}
</script>

<style scoped lang="scss">
.list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        border: 1px solid #CCC;
        padding: 5px 8px;
        span {
            cursor: pointer;
            &:hover {
                color: #FF4000;
            }
        }
        &.active {
            border-color: #FF4000;
            color: #FF4000;
        }
        .up-down {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 8px;
            i {
                cursor: pointer;
                &.active {
                    color: #FF4000;
                }
                &:hover {
                    color: #FF4000;
                }
            }
        }
    }
}
</style>