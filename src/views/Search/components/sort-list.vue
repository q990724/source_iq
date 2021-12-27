<template>
    <div class="sort-list">
        <my-collapse>
            <div class="item radio" :class="{'is-select': !(!sort.items || (sort.items && sort.items.length <= 2))}" v-for="(sort, index) in sortList" :key="index" :style="index === 0 ? 'margin-left:0' : ''">
                <template v-if="!sort.items || (sort.items && sort.items.length <= 2)">
                    <span @click="onClickItem(index, 'text')" :class="{'active': sort.selected}">{{ sort.title }}</span>
                    <div class="up-down" v-if="sort.items">
                        <i @click="onClickItem(index, 'asc')" :class="{'active': sort.items[0].selected}" class="el-icon-caret-top" v-if="sort.items[0] && sort.items[0]['order'] === 'asc'"></i>
                        <i @click="onClickItem(index, 'desc')" :class="{'active': sort.items[1].selected}" class="el-icon-caret-bottom" v-if="sort.items[1] && sort.items[1]['order'] === 'desc'"></i>
                    </div>
                </template>
                <template v-else>
                    <span>{{sort.title}}</span>
                    <el-select v-model="sort.paramValue" @change="onClickItem(index, 'select')">
                        <el-option v-for="item in sort.items" :key="item.paramValue" :label="item.name" :value="item.paramValue">
                        </el-option>
                    </el-select>
                </template>
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
        // type=text/asc/desc/select
        onClickItem(sortIndex, type) {
            // 当值为select的时候，用户选中的值在sortList[sortIndex]['paramValue']里
            console.log(this.sortList[sortIndex]['paramValue']);
            return;
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
                color: $hover_color;
            }
            &.active {
                color: $active_color;
            }
        }

        .up-down {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 8px;
            i {
                cursor: pointer;
                font-size: $placeholder_text_size;
                line-height: 0.8;
                &.active {
                    color: $active_color;
                }
                &:hover {
                    color: $hover_color;
                }
            }
        }
    }
}

.is-select {
    & > span {
        margin-right: 10px;
    }
}

::v-deep .el-select {
    width: 120px;
    .el-input {
        .el-input__inner {
            height: 21px;
            line-height: 21px;
            font-size: $placeholder_text_size;
        }
        .el-input__icon {
            line-height: 21px;
        }
    }
}
</style>