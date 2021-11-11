<template>
    <div id="app" v-infinite-scroll="load" infinite-scroll-immediate="false" style="overflow:auto;height: 100vh;">
        <router-view/>
    </div>
</template>

<script>
import bus from "@/assets/js/bus";
import {getQueryVariable} from "@/assets/js/utils.js";
export default {
    created() {
        console.log("插件接收到的图片地址：" + getQueryVariable('imageAddress'));
        this.$store.state.imageAddress = getQueryVariable('imageAddress') || null;
        if(this.$router.path !== '/view-alibaba') {
            this.$router.replace('/view-alibaba');
        }
    },
    methods: {
        load() {
            bus.$emit('loadmore');
        }
    },
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
    color: #6a6c6f;
    font-size: 16px;
    background-color: #EFEFF4;
}


.scrollable::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
.scrollable::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
.scrollable::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
    );
}
</style>
