<template>
    <div class="suppor-sourcec-list mt20">
        <transition name="el-zoom-in-bottom">
            <div class="no-list">
                <h4>{{$t('label.slogan')}}</h4>
                <div class="list">
                    <div class="item" v-for="item in list" :key="item.name">
                        <div class="item_content">
                            <img :src="item.logo" :alt="item.name" :title="item.name">
                            <span class="soon" v-if="item.comingSoon">Soon</span>
                        </div>
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
                name: item.name,
                comingSoon: !!item.comingSoon
            });
        }
    },
}
</script>

<style scoped lang="scss">
.no-list {
    color: $regular_text_color;
    font-size: $regular_text_size;
    //border-radius: 5px;
    //background-color: #FFF;
    padding: 50px 0 0 0;

    h4 {
        margin-bottom: 15px;
        text-align: center;
        font-size: 30px;
        line-height: 30px;
        font-weight: 500;
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 50px;
        .item {
            flex: 0 0 25%;
            margin-bottom: 15px;
            padding: 0 8px;
            .item_content {
                position: relative;
                border: solid 1px $line_color;
                border-radius: 5px;
                background-color: #FFFFFF;
                display: flex;
                align-items: center;
                height: 100px;
                text-align: center;
                img {
                    max-width: 60%;
                    max-height: 60%;
                    display: inline-block;
                    margin: 0 auto;
                }
                .soon {
                    position: absolute;
                    right: 0;
                    top: 0;
                    background-color: $primary_color;
                    color: #FFF;
                    padding: 5px;
                    border-top-right-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
            }
        }
    }
}
</style>