<template>
    <div class="product-class" v-if="class_list && class_list.items && class_list.items.length > 0">
        <!--<div class="title">{{ class_list.title || $t('label.productClass') }}</div>-->
        <!--<div class="more" @click="onMoreClick">-->
        <!--    <span>{{ $t('button.more') }}</span>-->
        <!--    <img src="@/assets/img/down-arrow.png" alt="">-->
        <!--</div>-->
        <!--<div class="list" :style="listStyle" v-if="class_list.items">-->
        <!--    <div class="item" v-for="(item,itemIndex) in class_list.items" :key="item.name + item.id" :class="{'active': item.selected}" @click="onItemClick(itemIndex, $event)">-->
        <!--        <span>{{ item.name }}</span>-->
        <!--    </div>-->
        <!--</div>-->
        <!--<div class="clear"></div>-->

        <my-collapse :title="class_list.title || $t('label.productClass')" :list="class_list.items">
            <div class="item radio" v-for="(item,itemIndex) in class_list.items" :key="item.name + item.id" :class="{'active': item.selected}" @click="onItemClick(itemIndex, $event)">
                <span>{{ item.name }}</span>
            </div>
        </my-collapse>
    </div>
</template>

<script>
import MyCollapse from "@/components/my-collapse";
export default {
    name: "product-class",
    data() {
        return {
            more_status: false,
            listStyle: {
                'max-height': '30px'
            }
        }
    },
    components: {
        MyCollapse
    },
    props: {
        class_list: {
            type: Object,
            default: () => null
        }
    },
    methods: {
        onMoreClick() {
            this.more_status = !this.more_status;
            if(this.more_status) {
                this.listStyle["max-height"] = `${Math.ceil(this.class_list.items.length / 12) * 30}px`;
            }else {
                this.listStyle["max-height"] = `30px`;
            }
        },
        onItemClick(itemIndex, event) {
            console.log(itemIndex, event);
            this.$emit('onClassChange', {itemIndex, event});
        },
        // onCollapseItemClick({list, item, itemIndex, event}) {
        //     this.$emit('onClassChange', {itemIndex, event});
        // }
    }
}
</script>

<style scoped lang="scss">
.product-class {
    margin-bottom: 10px;
    //.title {
    //    float: left;
    //    font-weight: bold;
    //    line-height: 1.5;
    //    padding: 4px 0;
    //}
    //.list {
    //    font-size: 14px;
    //    //margin: 0 110px;
    //    max-height: 30px;
    //    overflow: hidden;
    //    transition: all ease .3s;
    //    line-height: 1.5;
    //    .item {
    //        display: inline-block;
    //        float: left;
    //        //width: 92px;
    //        line-height: 1.5;
    //        color: #666666;
    //        padding: 6px 10px;
    //        white-space: nowrap;
    //        overflow: hidden;
    //        text-overflow: ellipsis;
    //        cursor: pointer;
    //        transition: color .4s;
    //        &:hover {
    //            color: #FF4000;
    //        }
    //        &.active {
    //            color: #FF4000;
    //        }
    //    }
    //}
    //.more {
    //    line-height: 1.5;
    //    float: right;
    //    border: 1px solid #DEDEDE;
    //    padding: 5px 4px;
    //    border-radius: 5px;
    //    display: flex;
    //    align-items: center;
    //    cursor: pointer;
    //    transition: border-color .2s;
    //    font-size: 12px;
    //    &:hover {
    //        border-color: #FF4000;
    //    }
    //    img {
    //        width: 16px;
    //        height: 16px;
    //    }
    //}
}
</style>
