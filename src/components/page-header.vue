<template>
    <div class="header">
        <div class="center-container">
            <!--logo-->
            <div class="logo">
                <img src="@/assets/img/logo2.png" alt="logo">
                <span>{{$t('label.projectName')}}</span>
            </div>
            <!--右侧区域-->
            <div class="right-wrap">
                <!--留言/意见反馈-->
                <span class="right-wrap_btn" @click="openFeedback()"> <i class="el-icon-edit-outline"></i> Contact</span>
                <!--国家/语言/货币-->
                <!--<div class="right-wrap_btn tags" @click="onLanguagechange()">-->
                <!--国家-->
                <!--    <span>{{ $store.state.countryName }}</span>-->
                <!--    <i>/</i>-->
                <!--    <span>{{ $store.state.languageName }}</span>-->
                <!--    <i>/</i>-->
                <!--    <span>{{ $store.state.currencyCode }}</span>-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "page-header",
    methods: {
        openFeedback() {
            window.$openFeedback();
        },
    }
}
</script>

<style scoped lang="scss">
.header {
    height: 100%;
    .center-container {
        width: 100%;
        height: 100%;
        padding: 0 calc(12% + 20px);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .logo {
        display: flex;
        align-items: center;
        img {
            width: 30px;
            margin-right: 10px;
        }
        span {
            font-size: $regular_text_size;
            color: $regular_text_color;
        }
    }
    .right-wrap {
        display: flex;
        align-items: center;
        .right-wrap_btn ~ .right-wrap_btn {
            margin-left: 20px;
        }
        .right-wrap_btn {
            cursor: pointer;
            &:hover {
                color: $hover_color;
            }
        }
        .tags {
            span {

            }
            i {
                margin: 0 5px;
                font-style: normal;
            }
        }
    }
}
</style>