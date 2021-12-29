<template>
    <div class="image-operation mt20" v-if="$store.state.searchParams.originImage || $store.state.searchParams.searchText">
        <div class="left" v-if="$store.state.searchType === 'image'">
            <div class="item main-item" :class="{'active': $store.state.searchParams.originImage === $store.state.searchParams.mainImage}">
                <img :src="$store.state.searchParams.originImage" alt="" class="img" @click="onClickMainImage">
                <span @click="chooseImageBox"><img src="@/assets/img/kuangxuan.png" alt="">{{ $t('label.chooseBox') }}</span>
            </div>
            <!--本地裁剪图片暂存列表-->
            <div class="local-crop-list" v-if="localCropImageList && localCropImageList.length > 0">
                <div class="scroll scrollable">
                    <div class="item main-item local-item" :class="{'active': item.selected}" v-for="(item,i) in localCropImageList" :key="item.id">
                        <img :src="item.cover" alt="" class="img" @click="onClickLocalImage(item, i)">
                        <i class="clear el-icon-circle-close" @click="onClickLocalItemClear(item, i)"></i>
                    </div>
                </div>
            </div>
            <div id="cropBox" v-show="cropBoxStatus">
                <div class="image-container">
                    <img :src="$store.state.searchParams.originImage" alt="">
                </div>
                <div class="foot">
                    <span @click="confirmCropBox">{{$t('button.confirm')}}</span>
                    <span @click="closeCropBox">{{$t('button.cancel')}}</span>
                </div>
            </div>
        </div>
        <div class="left" v-if="$store.state.searchType === 'text'">
            <div class="text-list">
                <div class="text" @click="onClickSearchText">{{ $store.state.searchParams.searchText }}</div>
            </div>
        </div>
        <div class="right">
            <div class="reset" @click="onClickClear">{{$t('button.clearSearch')}}</div>
        </div>
    </div>
</template>

<script>
// import {alibaba, yiwugo, aliexpress, _1688, _1688global} from "@/assets/js/apis";
import SourceMap from "@/assets/js/source_map";
import {getBase64} from "@/assets/js/utils.js";

let cropObject = null;
export default {
    name: "image-operation",
    data() {
        return {
            cropBoxStatus: false,
            cropResult: null,
            localCropImageList: [],
			// let localItem = {
			// 	id: new Date().getTime(),
			// 	cover: base64,
			// 	file: getFileFromBase64(base64),
			// 	selected: false,
			// 	region: item
			// }
            mainImageActive: true
        }
    },
    methods: {
        chooseImageBox() {
            cropObject = new MyCrop({
                selector: '#cropBox > .image-container > img',
                imgPath: $('#cropBox > .image-container > img').attr('src'),
                onSuccess: (res) =>{
                    console.log(res);
                    this.cropResult = res;
                }
            })
            this.cropBoxStatus = true;
        },
        closeCropBox() {
            this.cropBoxStatus = false;
            this.cropResult = null;
			cropObject.jcropApi.release();
            cropObject.jcropApi.destroy();
        },
		//TBD：1688图搜接口首次调用返回的yoloCropRegion是全部切图的坐标数组，region对应于第一张切图
		//TBD：我们自己的切图也需要返回填充item.region的xywh坐标，跟1688返回的切图机制统一
		//TBD：新增加一张来自同样originImage的截图item，yoloCropRegion数组也需要增加一组坐标；所有切图都来自originImage
		//TBD：选中某张切图发起搜索，要传imageId+切图的region+yoloCropRegion+yoloRegionSelected=true；选中原图发起搜索，要传imageId+yoloCropRegion；如果新截图，要传mageId+region+yoloCropRegion（不传yoloRegionSelected，因为新截图坐标不在yoloCropRegion数组里面
        confirmCropBox() {
            try {
                let localItem = {
                    id: new Date().getTime(),
                    file: this.cropResult.file,
                    cover: '',
                    selected: false
                };
                localItem.cover = this.cropResult.base64;
                this.localCropImageList.push(localItem);
            }catch (e) {
                this.$message.error('截取图片失败！' + e ? e : '');
            }finally {
                this.closeCropBox();
            }
        },
        onClickLocalImage(item, index) {
            this.localCropImageList.forEach(e=>{
                e.selected = false;
            })
            this.mainImageActive = false;
            item.selected = true;
			this.dump();
            this.$emit('onClickLocalItem', item);
        },
        onClickMainImage() {
            this.localCropImageList.forEach(e=>{
                e.selected = false;
            })
            this.mainImageActive = true;
			this.dump();
            this.$emit('onClickMainImage');
        },
		onClickSearchText() {
			console.log("onClickSearchText");
			console.log(this.$store.state.searchParams.searchText);
		    this.$emit('onClickSearchText',{searchText: this.$store.state.searchParams.searchText});
		},
		// 清空本图片组件里面的截图缓存
		onClickCropResult() {
			this.cropBoxStatus = false
			this.cropResult = null
			this.localCropImageList = [];
			this.mainImageActive = false;
			cropObject = null;
		},
		// “清空搜索”按钮触发： 1）先清除所有截图缓存，2）还调父节点的onClickClear（）清除全局缓存
        onClickClear() {
			this.onClickCropResult();
			// 暂时注释调父节点的onClickClear事件，避免1）死循环（父节点要清除截图数据）；2）避免清空父节点的其它搜索参数
            this.$emit('onClickClear');
        },
        onClickLocalItemClear(item, index) {
            this.localCropImageList.splice(index, 1);
        },
		setLocalImageList(list) {
			this.localCropImageList = list;
			this.dump();
		},
		dump() {
			console.log("cropBoxStatus:", this.cropBoxStatus);
			console.log("cropResult:", this.cropResult);
			console.log("mainImageActive:", this.mainImageActive);
			console.log("localCropImageList:", this.localCropImageList);
		},
    }
}
</script>

<style scoped lang="scss">
.image-operation {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #FFF;
    padding: 20px 10px;
    border-radius: 5px;
    .left {
        flex: 1;
        display: flex;
        align-items: flex-end;
        .text-list {
            display: flex;
            align-items: center;
            .text {
                margin-right: 10px;
                padding: 5px 8px;
                //border: 1px solid $active_color;
                border-radius: 5px;
                font-size: $regular_text_size;
                background-color: $primary_color;
            }
        }
        .item {
            box-sizing: border-box;
            position: relative;
            width: 90px;
            height: 90px;
            margin-right: 20px;
            cursor: pointer;
            border: 1px solid transparent;
            padding: 5px;
            & > img.img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                background-color: #FFF;
            }
            &:hover {
                border-color: $hover_color;
            }
            &.active {
                border: 1px solid $active_color;
                span.right-top-triangle, img.chose {
                    display: block;
                }
            }
            span.right-top-triangle {
                display: none;
                position: absolute;
                top: 0;
                right: 0;
                width: 0;
                height: 0;
                border-width: 10px;
                border-style: solid;
                border-color: $primary_color $primary_color transparent transparent;
                color: $primary_color;
            }
            img.chose {
                display: none;
                position: absolute;
                top: 3px;
                right: 1.5px;
                transform: scale(1.1);
            }
        }
        .local-crop-list {
            flex: 1;
            overflow: hidden;
            .scroll {
                white-space: nowrap;
                overflow: auto;
            }
            .local-item {
                display: inline-block;
                width: 80px;
                height: 80px;
            }
        }
        .main-item {
            width: 110px;
            height: 110px;
            & > span {
                display: flex;
                align-items: center;
                position: absolute;
                right: 0;
                bottom: 0;
                background-color: $primary_color;
                color: #FFF;
                font-size: 12px;
                padding: 2px 5px;
                img {
                    width: 15px;
                    height: 15px;
                    margin-right: 4px;
                }
            }
            & > i.clear {
                display: none;
                position: absolute;
                top: 0;
                right: 0;
                font-size: 18px;
                &:hover {
                    color: $hover_color;
                }
            }
            &:hover > i.clear {
                display: block;
            }
        }
        .default-item {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid $line_color;
        }
    }
    .right {
        width: 100px;
        padding: 5px 0;
        text-align: center;
        border: 1px solid #DDD;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 20px;
        font-size: $regular_text_size;
        &:hover {
            color: $hover_color;
        }
    }

}

#cropBox {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #FFF;
    box-shadow: 0 0 10px #DDD;
    .image-container {
        padding: 20px;
        img {

        }
    }
    .foot {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-top: 1px solid #EFEFF4;
        padding: 20px;
        span {
            padding: 5px 10px;
            cursor: pointer;
            &:first-child {
                color: #FFF;
                background-color: $primary_color;
            }
            &:last-child {
                color: #000;
                background-color: $primary_color;
            }
        }
    }
}

</style>
