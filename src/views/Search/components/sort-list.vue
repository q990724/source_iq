<template>
    <div class="sort-list">
        <my-collapse :title="'Sort'">
            <div class="item" v-for="(sort, index) in sortList" :key="index">
                <span @click="onClickItem(index, 'text')" :class="{'active': sort.selected}">{{ sort.title }}</span>
                <div class="up-down" v-if="sort.items">
                    <i @click="onClickItem(index, 'asc')" :class="{'active': sort.items[0].selected}" class="el-icon-caret-top" v-if="sort.items[0] && sort.items[0]['order'] === 'asc'"></i>
                    <i @click="onClickItem(index, 'desc')" :class="{'active': sort.items[1].selected}" class="el-icon-caret-bottom" v-if="sort.items[1] && sort.items[1]['order'] === 'desc'"></i>
                </div>
            </div>
        </my-collapse>
        <!--<el-collapse>-->
        <!--    <el-collapse-item title="Sort">-->
        <!--        <div class="list">-->
        <!--            <div class="item" v-for="(sort, index) in sortList" @click="onSortClick(index)" :key="index" :class="{'active': sort.selected}">-->
        <!--                <span>{{ sort.title }}</span>-->
        <!--                <div class="up-down" v-if="sort.items">-->
        <!--                    <i class="el-icon-caret-top" v-if="(sort.items[0] && sort.items[0]['order'] === 'asc') || (sort.items[1] && sort.items[1]['order'] === 'asc')"></i>-->
        <!--                    <i class="el-icon-caret-bottom" v-if="(sort.items[0] && sort.items[0]['order'] === 'desc') || (sort.items[1] && sort.items[1]['order'] === 'desc')"></i>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--    </el-collapse-item>-->
        <!--</el-collapse>-->
    </div>
</template>

<script>
import MyCollapseCompntent from "@/components/my-collapse";
export default {
    name: "sort-list",
    props: {
        sortList: {
            type: [Array, Object],
            default() {
                return null
            }
        },
        collapseFilterGroup: {
            type: Boolean,
            default: true
        },
        collapseFilterGroupCount: {
            type: Number,
            default: 1
        }
    },
    components: {
        MyCollapse: MyCollapseCompntent
    },
    methods: {
        // type=text/asc/desc
        onClickItem(sortIndex, type) {
            this.$emit("onSortChange", {sortIndex, type, event:true});
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
        &:hover {
            color: inherit !important;
        }

        & > span {
            cursor: pointer;
            &:hover {
                color: #FF4000;
            }
            &.active {
                color: #FF4000;
            }
        }

        .up-down {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 8px;
            i {
                cursor: pointer;
                font-size: 12px;
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