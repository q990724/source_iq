<template>
    <div class="page-right-container">
        <!--返回顶部-->
        <div class="go-top" @click="onGoTop" v-show="$store.state.showRightFixed">
            <i class="el-icon-top"></i>
        </div>
        <!--留言-->
        <div class="feedback" @click="onFeedback">
            <i class="el-icon-edit-outline"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "page-right-container",
    methods: {
        onGoTop() {
            $(window).scrollTop(0);
        },
        onFeedback() {
            window.$openFeedback();
        }
    }
}
</script>

<style scoped lang="scss">
.page-right-container {
    position: fixed;
    right: 6%;
    bottom: 10%;
    transform: translate(50%, 0);
    div {
        text-align: center;
        margin-bottom: 20px;
        box-sizing: content-box;
        border-radius: 4px;
        cursor: pointer;
        background: rgba(0, 0, 0, .5);
        padding: 12px;
        &:hover {
            background: rgba(0, 0, 0, .3);
        }
    }

    i {
        font-size: 26px;
        color: #FFFFFF;
    }
}
</style>