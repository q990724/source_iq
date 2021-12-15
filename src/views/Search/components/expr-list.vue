<template>
    <div class="expr-list"  v-if="exprList && exprList.length > 0">
        <el-collapse>
            <el-collapse-item :title="expr.title" v-for="(expr, index) in exprList" :key="expr.title">
                <div class="list" v-if="expr.items && expr.items.length > 0">
                    <div class="item" v-for="(item, i) in expr.items" :key="item.id + item.name">
                        <!--type=bool-->
                        <div class="bool" v-if="item.exprType === 'bool'">
                            <el-checkbox v-model="item.selected" @change="onBoolChange($event, item)">{{ item.name }}</el-checkbox>
                        </div>
                        <!--type=range-->
                        <div class="range" v-if="item.exprType === 'range'">
                            <!--<span class="range_title">Price</span>-->
                            <el-input style="width: 60px;margin-left: 8px;" placeholder="min"></el-input>
                            <i style="margin: 0 5px;" v-if="item.params[0]['needInput']">-</i>
                            <el-input style="width: 60px;margin-right: 8px;" placeholder="max"></el-input>
                            <el-button size="small">OK</el-button>
                        </div>
                        <div class="gt" v-if="item.exprType === 'gt'">
                            <!--<span class="gt_title">Min. Order</span>-->
                            <el-input style="width: 110px;margin: 0 8px" placeholder="greater than"></el-input>
                            <el-button size="small">OK</el-button>
                        </div>
                        <div class="lt" v-if="item.exprType === 'lt'">
                            <!--<span class="gt_title">Min. Order</span>-->
                            <el-input style="width: 60px;margin: 0 8px" placeholder="less than"></el-input>
                            <el-button size="small">OK</el-button>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    name: "expr-list",
    props: {
        exprList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        onBoolChange(e, item) {
            console.log(e,item);
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
        margin-right: 20px;
        .range {
            .range_title {

            }
        }
    }
}
</style>