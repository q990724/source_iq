<template>
    <div class="high-filtration mt40">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item>
                <template slot="title">
                    <div class="filter-title">
                        <i class="iconfont icon-filter"></i>
                        <span>ADVANCED FILTERS</span>
                    </div>
                </template>
                <div class="list">
                    <div class="item">
                        <div class="title">
                            <span>Sales Year Over Year (%)</span>
                            <el-tooltip class="item" effect="dark" placement="right">
                                <i class="iconfont icon-wenhao"></i>
                                <template slot="content">
                                    <p>哈哈哈哈哈哈哈</p>
                                </template>
                            </el-tooltip>
                        </div>
                        <div class="value section" v-if="true">
                            <div class="input">
                                <el-input v-model="input" placeholder="Min" type="number"></el-input>
                            </div>
                            <div class="fg"> - </div>
                            <div class="input">
                                <el-input v-model="input" placeholder="Max" type="number"></el-input>
                            </div>
                        </div>
                        <div class="value input" v-if="false">
                            <el-input v-model="input" placeholder=""></el-input>
                        </div>
                        <div class="value select" v-if="false">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <span>Sales Year Over Year (%)</span>
                            <el-tooltip class="item" effect="dark" placement="right">
                                <i class="iconfont icon-wenhao"></i>
                                <template slot="content">
                                    <p>哈哈哈哈哈哈哈</p>
                                </template>
                            </el-tooltip>
                        </div>
                        <div class="value section" v-if="false">
                            <div class="input">
                                <el-input v-model="input" placeholder="Min" type="number"></el-input>
                            </div>
                            <div class="fg"> - </div>
                            <div class="input">
                                <el-input v-model="input" placeholder="Max" type="number"></el-input>
                            </div>
                        </div>
                        <div class="value input" v-if="true">
                            <el-input v-model="input" placeholder=""></el-input>
                        </div>
                        <div class="value select" v-if="false" >
                            <el-select v-model="value" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <span>Sales Year Over Year (%)</span>
                            <el-tooltip class="item" effect="dark" placement="right">
                                <i class="iconfont icon-wenhao"></i>
                                <template slot="content">
                                    <p>哈哈哈哈哈哈哈</p>
                                </template>
                            </el-tooltip>
                        </div>
                        <div class="value section" v-if="false">
                            <div class="input">
                                <el-input v-model="input" placeholder="Min" type="number"></el-input>
                            </div>
                            <div class="fg"> - </div>
                            <div class="input">
                                <el-input v-model="input" placeholder="Max" type="number"></el-input>
                            </div>
                        </div>
                        <div class="value input" v-if="false">
                            <el-input v-model="input" placeholder=""></el-input>
                        </div>
                        <div class="value select" v-if="true">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <span>Sales Year Over Year (%)</span>
                            <el-tooltip class="item" effect="dark" placement="right">
                                <i class="iconfont icon-wenhao"></i>
                                <template slot="content">
                                    <p>哈哈哈哈哈哈哈</p>
                                </template>
                            </el-tooltip>
                        </div>
                        <div class="value section" v-if="false">
                            <div class="input">
                                <el-input v-model="input" placeholder="Min" type="number"></el-input>
                            </div>
                            <div class="fg"> - </div>
                            <div class="input">
                                <el-input v-model="input" placeholder="Max" type="number"></el-input>
                            </div>
                        </div>
                        <div class="value input" v-if="false">
                            <el-input v-model="input" placeholder=""></el-input>
                        </div>
                        <div class="value select" v-if="true">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    name: "high-filtration",
    data() {
        return {
            activeNames: ['1'],
            input: '',
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: ''
        };
    },
    methods: {
        handleChange(val) {
            console.log(val);
        }
    }
}
</script>

<style scoped lang="scss">
.high-filtration {
    border: 1px solid #DCDFE6;
    border-radius: 10px;
    background-color: #FFF;
    .filter-title {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 20px 0 20px 5px;
        display: flex;
        align-items: center;
        font-size: 16px;
        i {
            font-size: 18px;
            margin-right: 4px;
        }
    }
    .list {
        padding: 20px 20px 0px 20px;
        border-top: 1px solid #DCDFE6;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .item {
            width: 31%;
            margin-right: 20px;
            margin-bottom: 20px;
            .title {
                display: inline-block;
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 5px;
                max-width: 200px;
                i {
                    margin-left: 5px;
                    font-size: 15px;
                }
            }
            .section {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .fg {
                    margin: 0 10px;
                }
            }
        }
    }
}

::v-deep .el-input__inner {
    border: none;
    border-bottom: 1px solid #DCDFE6;
    border-radius: 0;
}
::v-deep .el-collapse-item__header, ::v-deep .el-collapse-item__wrap {
    background-color: transparent;
}
::v-deep .el-select {
    display: block;
}
</style>
