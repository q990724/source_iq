<template>
    <div class="image-operation mt40" v-if="original_image_url">
        <div class="item main-item" :class="{'active': mainImageActive}">
            <img :src="original_image_url" alt="" class="img" @click="onClickMainImage">
            <span @click="chooseImageBox"><img src="@/assets/img/kuangxuan.png" alt="">{{ $t('label.chooseBox') }}</span>
            <i class="clear el-icon-circle-close" @click="onClickClear"></i>
        </div>
        <!-- <div class="item main-item default-item" v-else>
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                accept="image/*"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :http-request="onUploadImage"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div> -->
        <!--本地裁剪图片暂存列表-->
        <div class="local-crop-list" v-if="localCropImageList && localCropImageList.length > 0">
            <div class="scroll scrollable">
                <div class="item main-item local-item" :class="{'active': item.selected}" v-for="(item,i) in localCropImageList" :key="i" @click="onClickLocalItem(item, i)">
                    <img :src="item.cover" alt="" class="img">
                </div>
            </div>
        </div>
        <div id="cropBox" v-show="cropBoxStatus">
            <div class="image-container">
                <img :src="original_image_url" alt="">
            </div>
            <div class="foot">
                <span @click="confirmCropBox">确定</span>
                <span @click="closeCropBox">取消</span>
            </div>
        </div>
    </div>
</template>

<script>
import {alibaba, yiwugo, aliexpress, _1688} from "@/assets/js/apis";
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
            mainImageActive: false
        }
    },
    props: {
        original_image_url: {
            type: String,
            default: ''
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
        onUploadClick() {
            this.$emit('onUploadClick')
        },
        onClickLocalItem(item, index) {
            this.localCropImageList.forEach(e=>{
                e.selected = false;
            })
            this.mainImageActive = false;
            item.selected = true;
            switch (this.$store.state.source_id) {
                case SourceMap['alibaba']:
                    alibaba.uploadPic(item.file).then(res=>{
                        console.log(res);
                        this.$emit('onClickLocalItem',{imgUrl: res.data.domain + res.data.imageAddress, imageAddress: res.data.imageAddress})
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
                case SourceMap['1688']:
					getBase64(item.file, (u) => {
						this.$emit('onClickLocalItem',{imgUrl: u, imageAddress: '', index: index});
					});
                    break;
                case SourceMap['1688global']:
                    break;
                case SourceMap['aliexpress']:
					aliexpress.uploadPic(item.file).then(res=>{
						if(!res.data) {
							return this.$message.error(res.msg);
						}
						this.$emit('onClickLocalItem',{imgUrl: res.data.url, imageAddress: res.data.filename})
					}).catch(e=>{
						console.log(e);
					})
                    break;
				case SourceMap['yiwugo']:
					yiwugo.uploadPic(item.file).then(res=>{
						console.log(res);
						this.$emit('onClickLocalItem',{imgUrl: res.data.url, imageAddress: res.data.url})
					}).catch(e=>{
						console.log(e);
					})
				    break;
            }
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
            this.cropObject = null;
            this.$emit('onClickClear');
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
    align-items: flex-end;
    background-color: #FFF;
    padding: 20px 10px;
    border-radius: 10px;
    border: 1px solid #DCDFE6;
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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
