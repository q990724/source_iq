<template>
    <div class="expr-list" v-if="exprList && exprList.length > 0">
        <el-collapse>
            <el-collapse-item :title="expr.title" v-for="(expr, index) in exprList" :key="expr.title">
                <div class="list" v-if="expr.items && expr.items.length > 0">
                    <div class="item" v-for="(item, i) in expr.items" :key="i">
                        <!--type=bool-->
                        <div class="bool" v-if="item.exprType === 'bool'">
                            <el-checkbox v-model="item.selected" @change="onBoolChange($event, item)">{{ item.name }}</el-checkbox>
                        </div>
                        <!--type=range-->
                        <div class="range" v-if="item.exprType === 'range'">
                            <!--<span class="range_title">Price</span>-->
                            <el-input style="width: 110px;margin-left: 8px;" clearable placeholder="min" v-if="item.params[0]['needInput']" v-model="item.params[0]['inputValue']"></el-input>
                            <i style="margin: 0 5px;" v-if="item.params[0]['needInput']">-</i>
                            <el-input style="width: 110px;margin-right: 8px;" clearable placeholder="max" v-if="item.params[1]['needInput']" v-model="item.params[1]['inputValue']"></el-input>
                            <el-button size="small" @click="onRangeSubmit(item)">OK</el-button>
                        </div>
                        <div class="gt" v-if="item.exprType === 'gt'">
                            <!--<span class="gt_title">Min. Order</span>-->
                            <el-input style="width: 130px;margin: 0 8px" clearable placeholder="greater than" v-model="item.params[0]['inputValue']"></el-input>
                            <el-button size="small" @click="onGtSubmit(item)">OK</el-button>
                        </div>
                        <div class="lt" v-if="item.exprType === 'lt'">
                            <!--<span class="gt_title">Min. Order</span>-->
                            <el-input style="width: 130px;margin: 0 8px" clearable placeholder="less than" clearable v-model="item.params[0]['inputValue']"></el-input>
                            <el-button size="small" @click="onLtSubmit(item)">OK</el-button>
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
        onBoolChange(status, item) {
            let paramName = item.params[0].paramName,
                paramValue = item.params[0].paramValue;
            console.log(status,paramName, paramValue);
        },
        onRangeSubmit(item) {
            let min = item.params[0].inputValue,
                max = item.params[1].inputValue,
                minParamName = item.params[0].paramName,
                maxParamName = item.params[1].paramName;
            console.log(min, max, minParamName, maxParamName);
        },
        onGtSubmit(item) {
            console.log(item);
        },
        onLtSubmit(item) {
            console.log(item);
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