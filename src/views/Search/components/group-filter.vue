<template>
    <div class="group-filter" v-if="filterList && filterList.length > 0">

        <template v-for="(filter, filterIndex) in filterList">
            <template v-if="filter.selectUIType === 'checkbox'">
                <template v-if="filter.items && filter.items.length > 0">
                    <div class="filter-item" :key="filterIndex" v-if="!(collapseFilterGroup && filterIndex >= collapseFilterGroupCount)">
                        <my-collapse :title="filter.title">
                            <div class="item" v-for="(item,itemIndex) in filter.items" :key="item.id + item.name">
                                <el-checkbox v-model="item.selected"
                                             @change="onFilterChange(filterIndex, itemIndex, $event)">
                                    {{ item.name }}
                                </el-checkbox>
                            </div>
                        </my-collapse>
                    </div>
                </template>
            </template>
            <template v-if="filter.selectUIType === 'radio'">
                <template v-if="filter.items && filter.items.length > 0">
                    <div class="filter-item" :key="filterIndex" v-if="!(collapseFilterGroup && filterIndex >= collapseFilterGroupCount)">
                        <my-collapse :title="filter.title">
                            <!-- radioValue在public.js做了预处理，没有理解其必要性 -->
                            <div class="item radio" v-for="(item,itemIndex) in filter.items" :key="item.id + item.name" @click="onFilterChange(filterIndex, itemIndex, $event)">
                                <span>{{item.name}}</span>
                            </div>
                            <!--<el-radio-group v-model="filter.radioValue" >-->
                            <!--    <div class="item radio" v-for="(item,itemIndex) in filter.items" :key="item.id + item.name">-->
                            <!--        <el-radio :label="item.name" class="filter-item_option" @change="onFilterChange(filterIndex, itemIndex, $event)">-->
                            <!--            {{item.name}}-->
                            <!--        </el-radio>-->
                            <!--    </div>-->
                            <!--</el-radio-group>-->
                        </my-collapse>
                    </div>
                </template>
            </template>
        </template>

    </div>
</template>

<script>
import MyCollapse from "@/components/my-collapse";
export default {
    name: "group-filter",
    props: {
        filterList: {
            type: Array,
            default: () => [],
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
        MyCollapse
    },
    data() {
        return {
            radio: '',
        }
    },
    methods: {
        onFilterChange(filterIndex, itemIndex, event) {
            if(this.filterList[filterIndex]['selectUIType'] === 'radio') {
                for (let item of this.filterList[filterIndex]['items']) {
                    item.selected = false;
                }
                this.filterList[filterIndex]['items'][itemIndex]['selected'] = true;
            }
            this.$emit("onFilterChange", {filterIndex, itemIndex, event});
        },
        // onRadioGroupChange(paramValue, paramName) {
        //     console.log(paramValue, paramName);
        // }
    },
};
</script>

<style lang='scss' scoped>
::v-deep .el-collapse {
    border-top: none;
}
.group-filter {
    .filter-item {
        margin-bottom: 10px;

        .filter-item_title {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .filter-item_options {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .filter-item_option {
                margin-right: 10px;
                margin-bottom: 10px;
            }
        }
    }
}
</style>