<template>
    <div class="expr-list" v-if="exprList && exprList.length > 0">
        <template v-for="(expr, index) in exprList">
            <div class="expr-item" :style="exprList.length > 1 ? 'margin-bottom:10px;' : 'margin-bottom:0px;'" :key="expr.title">
                <my-collapse :title="expr.title">
                    <div class="item" v-for="(item, i) in expr.items" :key="i">
                        <!--type=bool-->
                        <div class="bool" v-if="item.exprType === 'bool'">
                            <el-checkbox v-model="item.selected" @change="onBoolChange(index, i, $event)">{{ item.name }}</el-checkbox>
                        </div>
                        <!--type=range-->
                        <div class="range" v-if="item.exprType === 'range'">
                            <span class="range_title">{{ item.name }}</span>
                            <el-input type="number" style="width: 110px;margin-left: 8px;" clearable placeholder="min" v-if="item.params[0]['needInput']" v-model="item.params[0]['paramValue']"></el-input>
                            <i style="margin: 0 5px;" v-if="item.params[0]['needInput']">-</i>
                            <el-input type="number" style="width: 110px;margin-right: 8px;" clearable placeholder="max" v-if="item.params[1]['needInput']" v-model="item.params[1]['paramValue']"></el-input>
                            <el-button @click="onRangeSubmit(index, i)">OK</el-button>
                        </div>
                        <div class="gt" v-if="item.exprType === 'gt'">
                            <span class="gt_title">{{ item.name }}</span>
                            <el-input type="number" style="width: 130px;margin: 0 8px" clearable placeholder="greater than" v-model="item.params[0]['paramValue']"></el-input>
                            <el-button @click="onGtSubmit(index, i)">OK</el-button>
                        </div>
                        <div class="lt" v-if="item.exprType === 'lt'">
                            <span class="gt_title">{{ item.name }}</span>
                            <el-input type="number" style="width: 130px;margin: 0 8px" clearable placeholder="less than" v-model="item.params[0]['paramValue']"></el-input>
                            <el-button @click="onLtSubmit(index, i)">OK</el-button>
                        </div>
                        <div class="lt" v-if="item.exprType === 'le'">
                            <span class="gt_title">{{ item.name }}</span>
                            <el-input type="number" style="width: 130px;margin: 0 8px" clearable placeholder="less than" v-model="item.params[0]['paramValue']"></el-input>
                            <el-button @click="onLtSubmit(index, i)">OK</el-button>
                        </div>
                    </div>
                </my-collapse>
            </div>
        </template>


        <!--<el-collapse>-->
        <!--    <el-collapse-item :title="expr.title" v-for="(expr, index) in exprList" :key="expr.title">-->
        <!--        <div class="list" v-if="expr.items && expr.items.length > 0">-->
        <!--            <div class="item" v-for="(item, i) in expr.items" :key="i">-->
        <!--                &lt;!&ndash;type=bool&ndash;&gt;-->
        <!--                <div class="bool" v-if="item.exprType === 'bool'">-->
        <!--                    <el-checkbox v-model="item.selected" @change="onBoolChange(index, i, $event)">{{ item.name }}</el-checkbox>-->
        <!--                </div>-->
        <!--                &lt;!&ndash;type=range&ndash;&gt;-->
        <!--                <div class="range" v-if="item.exprType === 'range'">-->
        <!--                    <span class="range_title">{{ item.name }}</span>-->
        <!--                    <el-input style="width: 110px;margin-left: 8px;" clearable placeholder="min" v-if="item.params[0]['needInput']" v-model="item.params[0]['paramValue']"></el-input>-->
        <!--                    <i style="margin: 0 5px;" v-if="item.params[0]['needInput']">-</i>-->
        <!--                    <el-input style="width: 110px;margin-right: 8px;" clearable placeholder="max" v-if="item.params[1]['needInput']" v-model="item.params[1]['paramValue']"></el-input>-->
        <!--                    <el-button size="small" @click="onRangeSubmit(index, i)">OK</el-button>-->
        <!--                </div>-->
        <!--                <div class="gt" v-if="item.exprType === 'gt'">-->
        <!--                    <span class="gt_title">{{ item.name }}</span>-->
        <!--                    <el-input style="width: 130px;margin: 0 8px" clearable placeholder="greater than" v-model="item.params[1]['paramValue']"></el-input>-->
        <!--                    <el-button size="small" @click="onGtSubmit(index, i)">OK</el-button>-->
        <!--                </div>-->
        <!--                <div class="lt" v-if="item.exprType === 'lt'">-->
        <!--                    <span class="gt_title">{{ item.name }}</span>-->
        <!--                    <el-input style="width: 130px;margin: 0 8px" clearable placeholder="less than" clearable v-model="item.params[0]['paramValue']"></el-input>-->
        <!--                    <el-button size="small" @click="onLtSubmit(index, i)">OK</el-button>-->
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
    name: "expr-list",
    props: {
        exprList: {
            type: Array,
            default() {
                return []
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
    data() {
        return {

        }
    },
    components: {
        MyCollapse: MyCollapseCompntent
    },
    methods: {
        onBoolChange(exprIndex, itemIndex, event) {
            // let paramName = item.params[0].paramName,
            //     paramValue = item.params[0].paramValue;
            // console.log(status,paramName, paramValue);
            this.$emit("onExprChange", {exprIndex, itemIndex, event});
        },
        onRangeSubmit(exprIndex, itemIndex) {
            // let min = item.params[0].inputValue,
            //     max = item.params[1].inputValue,
            //     minParamName = item.params[0].paramName,
            //     maxParamName = item.params[1].paramName;
            // console.log(min, max, minParamName, maxParamName);
            this.$emit("onExprChange", {exprIndex, itemIndex, event:true});
        },
        onGtSubmit(exprIndex, itemIndex) {
            // console.log(item);
            this.$emit("onExprChange", {exprIndex, itemIndex, event:true});
        },
        onLtSubmit(exprIndex, itemIndex) {
            // console.log(item);
            this.$emit("onExprChange", {exprIndex, itemIndex, event:true});
        }
    }
}
</script>

<style scoped lang="scss">

.expr-list {
    .expr-item {
        margin-bottom: 10px;
    }
}

::v-deep .el-input__inner {
    height: 31px;
    line-height: 31px;
    font-size: $secondary_text_size;
}

::v-deep .el-input__suffix {
    line-height: 31px;
    .el-input__suffix-inner {
        .el-input__icon {
            line-height: 31px;
        }
        .el-icon-circle-close:before {
            content: "\e79d" !important;
        }
    }
}

::v-deep .el-button {
    height: 31px;
    padding: 8px 20px;
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>