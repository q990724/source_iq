<template>
    <div class="image-operation mt40" v-if="$store.state.originImage">
        <div class="left">
            <div class="item main-item" :class="{'active': mainImageActive}">
                <img :src="$store.state.originImage" alt="" class="img" @click="onClickMainImage">
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
                    <img :src="$store.state.originImage" alt="">
                </div>
                <div class="foot">
                    <span @click="confirmCropBox">确定</span>
                    <span @click="closeCropBox">取消</span>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="reset" @click="onClickClear">清空搜索</div>
        </div>
    </div>
</template>

<script>
import {alibaba, yiwugo, aliexpress, _1688, _1688global} from "@/assets/js/apis";
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
            mainImageActive: true
        }
    },
    methods: {
        chooseImageBox() {
			if(cropObject) {
				cropObject.setImage($('#cropBox > .image-container > img').attr('src'));
				this.cropBoxStatus = true;
			}else {
				cropObject = new MyCrop({
				    selector: '#cropBox > .image-container > img',
				    imgPath: $('#cropBox > .image-container > img').attr('src'),
				    onSuccess: (res) =>{
						console.log(res);
				        this.cropResult = res;
				    }
				})
				this.cropBoxStatus = true;
			}            
        },
        closeCropBox() {
            this.cropBoxStatus = false;
            this.cropResult = null;
			cropObject.jcropApi.release();
        },
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
            this.$emit('onClickLocalItem', item);
        },
        onClickMainImage() {
            this.localCropImageList.forEach(e=>{
                e.selected = false;
            })
            this.mainImageActive = true;
            this.$emit('onClickMainImage');
        },
        onClickClear() {
            this.cropBoxStatus = false
            this.cropResult = null
            this.localCropImageList = [];
            this.mainImageActive = false;
            cropObject = null;
			// 暂时注释调父节点的onClickClear事件，避免1）死循环（父节点要清除截图数据）；2）避免清空父节点的其它搜索参数
            // this.$emit('onClickClear');
        },
        onClickLocalItemClear(item, index) {
            this.localCropImageList.splice(index, 1);
        },
		setLocalImageList(list) {
			this.localCropImageList = list;
		}
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
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    .left {
        flex: 1;
        display: flex;
        align-items: flex-end;
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
                border-color: #FF4000;
            }
            &.active {
                border: 1px solid #FF4000;
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
                border-color: #FF4000 #FF4000 transparent transparent;
                color: #FF4000;
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
            width: 100%;
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
                background-color: #FF4000;
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
                    color: #FF4000;
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
            border: 1px solid #DDD;
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
        &:hover {
            color: #FF4000;
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
            width: 100%;
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
                background-color: #FF4000;
            }
            &:last-child {
                color: #000;
                background-color: #EFEFF4;
            }
        }
    }
}

</style>
