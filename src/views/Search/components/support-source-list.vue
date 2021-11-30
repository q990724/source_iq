<template>
    <div class="suppor-sourcec-list">
        <transition name="el-zoom-in-bottom">
            <div class="no-list">
                <h4>{{$t('label.no_result')}}</h4>
                <div class="list">
                    <div class="item" v-for="item in list" :key="item.name">
                        <img :src="item.logo" :alt="item.name" :title="item.name">
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import SourceMap from "@/assets/js/source_map";
export default {
    name: "support-source-list",
    data() {
        return {
            list: []
        }
    },
    created() {
        for (let key in SourceMap) {
            let item = SourceMap[key];
            this.list.push({
                logo: item.logo,
                name: item.name
            });
        }
    },
}
</script>

<style scoped lang="scss">
.no-list {
    width: 700px;
    color: #666;
    font-size: 16px;
    background: #FFF;
    padding: 60px 30px calc(60px - 15px) 30px;
    margin: 40px auto;
    border-radius: 5px;
    box-shadow: 0 5px 10px #DDD;
    h4 {
        margin-bottom: 15px;
    }
    .list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            width: 30%;
            height: 50px;
            margin-bottom: 15px;
            padding: 10px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                vertical-align: middle;
            }
            border-radius: 5px;
            background: #DDD;
        }
    }
}
</style>