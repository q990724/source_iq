<template>
    <div id="app" v-infinite-scroll="load" infinite-scroll-immediate="false">
        <router-view :key="key"></router-view>
    </div>
</template>

<script>
import bus from "@/assets/js/bus";
import {getQueryVariable, findKey} from "@/assets/js/utils.js";
import SoureMap from "@/assets/js/source_map.js";

export default {
    created() {
		console.log('app.vue created');
    },
	mounted() {
		console.log('app.vue mounted');
	},
    methods: {
        load() {
            console.log('app 收到loadmore事件');
            bus.$emit("loadmore");
        },
    },
    computed: {
        source_id() {
            return this.$store.state.source_id;
        },
        key() {
            return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
        }
    },
    watch: {
        source_id() {
			console.log("app.vue watch source_id",this.$store.state.source_id);
            let current_path = this.$route.path;
            switch (this.$store.state.source_id) {
                case SoureMap['alibaba']['id']:
                    if (current_path === '/view-alibaba') return;
                    this.$router.push('/view-alibaba');
                    break;
                case SoureMap['1688']['id']:
                    if (current_path === '/view-1688') return;
                    this.$router.push('/view-1688');
                    break;
                case SoureMap['1688global']['id']:
                    if (current_path === '/view-1688global') return;
                    this.$router.push('/view-1688global');
                    break;
                case SoureMap['aliexpress']['id']:
                    if (current_path === '/view-aliexpress') return;
                    this.$router.push('/view-aliexpress');
                    break;
                case SoureMap['yiwugo']['id']:
                    if (current_path === '/view-yiwugo') return;
                    this.$router.push('/view-yiwugo');
                    break;
                case SoureMap['dhgate']['id']:
                    if (current_path === '/view-dhgate') return;
                    this.$router.push('/view-dhgate');
                    break;
                case SoureMap['mic']['id']:
                    if (current_path === '/view-mic') return;
                    this.$router.push('/view-mic');
                    break;
                case SoureMap['cjds']['id']:
                    if (current_path === '/view-cjds') return;
                    this.$router.push('/view-cjds');
                    break;
                case SoureMap['litbox']['id']:
                    if (current_path === '/view-litbox') return;
                    this.$router.push('/view-litbox');
                    break;
                case SoureMap['1688overseas']['id']:
                    if (current_path === '/view-1688overseas') return;
                    this.$router.push('/view-1688overseas');
                    break;
                case SoureMap['banggood']['id']:
                    if (current_path === '/view-banggood') return;
                    this.$router.push('/view-banggood');
                    break;
                case SoureMap['chinabrands']['id']:
                    if (current_path === '/view-chinabrands') return;
                    this.$router.push('/view-chinabrands');
                    break;
                case SoureMap['globalres']['id']:
                    if (current_path === '/view-globalres') return;
                    this.$router.push('/view-globalres');
                    break;
            }
        }
    }
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB,
    "\5B8B\4F53", sans-serif;
    color: #6a6c6f;
    font-size: 16px;
    background-color: #efeff4;
}

#app {
    overflow-y: auto;
    height: 100vh;
}

.scrollable::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
.scrollable::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
.scrollable::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
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
