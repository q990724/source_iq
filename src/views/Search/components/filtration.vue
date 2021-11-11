<template>
    <div class="filtration mt40">
        <!--排序选项列表-->
        <div class="order-option-list">
            <div class="option">
                <span>{{ $t('label.synthesize') }}</span>
            </div>
            <div class="option active">
                <span>{{ $t('label.volumeOfTransaction') }} <i class="iconfont icon-xiala a"></i></span>
            </div>
            <div class="option">
                <span>{{ $t('label.price') }}</span>
                <div class="col">
                    <i class="iconfont icon-shang"></i>
                    <i class="iconfont icon-xiala"></i>
                </div>
            </div>
        </div>
        <!--  所在地区  -->
        <div class="address" @mouseenter="showAddressList = true" @mouseleave="showAddressList = false">
            <div class="option">
                <span>{{ $t('label.currentAddress') }}</span>
                <img src="@/assets/img/down-arrow.png" alt="">
            </div>
            <div class="address-list" v-show="showAddressList">
                <div class="row title">
                    <span>{{ $t('label.allAddress') }}</span>
                    <div class="slider">
                        <span>{{ $t('label.purchaseFrom') }}</span>
                        <div>
                            <el-slider v-model="value2" :step="1" :max="5" show-stops :format-tooltip="formatTooltip"></el-slider>
                        </div>
                    </div>
                </div>
                <div class="row texts">
                    <div class="text" v-for="i in 12">北京</div>
                    <div class="clear"></div>
                </div>
                <div class="row texts">
                    <div class="text" v-for="i in 30">北京</div>
                    <div class="clear"></div>
                </div>
            </div>
        </div>
        <!--  表单选项  -->
        <div class="form-options">
            <div class="option count">
                <span>{{ $t('label.startCount') }}</span><el-input></el-input><span>{{ $t('label.under') }}</span>
            </div>
            <div class="option checkbox">
                <el-checkbox v-model="checked1">24{{ $t('label.hour') }}{{ $t('label.shipments') }}</el-checkbox>
            </div>
            <div class="option checkbox">
                <el-checkbox v-model="checked1">{{ $t('label.goodMerchant') }}</el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "filtration",
    data() {
        return {
            value2: 0,
            showAddressList: false,
            checked1: false
        }
    },
    methods: {
        formatTooltip(val) {
            switch (val) {
                case 0:
                    return '不限';
                case 1:
                    return '50公里以内的产品';
                case 2:
                    return '100公里以内的产品';
                case 3:
                    return '200公里以内的产品';
                case 4:
                    return '300公里以内的产品';
                case 5:
                    return '不限';
            }
        }
    }
}
</script>

<style scoped lang="scss">
.filtration {
    display: flex;
    align-items: center;
    background-color: #FFF;
    border-radius: 10px;
    padding: 10px;
    border: 1px solid #DCDFE6;
}
.order-option-list {
    display: flex;
    align-items: center;
    .option {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 61px;
        height: 42px;
        font-size: 12px;
        text-align: center;
        line-height: 42px;
        border: 1px solid #DEDEDE;
        margin-left: -1px;
        color: #999;
        cursor: pointer;
        &:nth-child(1) {
            margin-left: 0;
        }
        &.active {
            background-color: #ff7300;
            border-color: #ff7300;
            color: #FFFFFF;
            cursor: default;
        }
        i {
            color: rgba(0, 0, 0, .2);
            font-size: 10px;
            &.a {
                color: #FFFFFF;
            }
        }
        .col {
            margin-left: 5px;
            display: inline-block;
            line-height: 1;
            i {
                display: block;
            }
        }
    }
}
.address {
    position: relative;
    width: 90px;
    height: 42px;
    font-size: 12px;
    margin-left: -1px;
    color: #999;
    .option {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        line-height: 40px;
        border: 1px solid #DEDEDE;
        img {
            transition: all .4s;
            width: 14px;
        }
    }
    .address-list {
        position: absolute;
        top: 42px;
        left: 0;
        width: 500px;
        box-shadow: 0 2px 10px #BBB;
        padding: 0 15px;
        background-color: #FFF;
        .row {
            padding: 15px 0;
            &:nth-child(1),&:nth-child(2) {
                border-bottom: 1px solid #DEDEDE;
            }
        }
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            & > span {
                cursor: pointer;
                &:hover {
                    color: #ff7300;
                }
            }
            .slider {
                width: 200px;
                display: flex;
                align-items: center;
                & > span {
                    width: 60px;
                }
                div {
                    flex: 1;
                }
            }
        }
        .texts {
            .text {
                float: left;
                width: 70px;
                padding: 0 10px 0 10px;
                line-height: 28px;
                cursor: pointer;
                &:hover {
                    color: #ff7300;
                }
            }
        }
    }
    &:hover {
        .option {
            color: #ff7300;
            img {
                transform: rotate(180deg);
            }
        }
    }
}
.form-options {
    display: flex;
    align-items: center;
    .option {
        font-size: 12px;
        padding: 0 15px;
    }
    .count {
        display: flex;
        align-items: center;
        .el-input {
            width: 60px;
            margin: 0 10px;
        }
    }
}
</style>
