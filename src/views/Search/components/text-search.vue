<template>
    <div class="text-search mt40">
        <div class="input-box">
            <i class="el-icon-search"></i>
            <el-select v-model="index_area" placeholder="请选择" v-if="options && options.length > 0">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <input type="text" class="input" placeholder="请输入关键词" v-model="input" autocomplete="off" @keypress="onKeyPress">
            <!-- <i class="el-icon-circle-close" v-show="input" @click="onClickCloseButton"></i> -->
            <i class="el-icon-camera" @click="onClickCamera"></i>
        </div>
        <div class="sbtn" @click="onClickSearchButton">搜索</div>

        <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :http-request="onUploadImage"
            :before-upload="beforeAvatarUpload"
            style="display:none;">
            <i slot="trigger" id='uploadButton'></i>
        </el-upload>
    </div>
</template>

<script>
import {alibaba, yiwugo, aliexpress, _1688, _1688global} from "@/assets/js/apis";
import SourceMap from "@/assets/js/source_map";
import {getBase64} from "@/assets/js/utils.js";
export default {
    name: 'text-search',
    data() {
        return {
            input: '',
            isFocus: false,
            // alibaba
            index_area: '',
            indexAareaOptions_alibaba: [{label: 'Products', value: 'product_en'}, {label: 'Suppliers', value: 'company_en'}],
            // yiwugo
            options_yiwugo: [{label: 'Products', value: 'Products'}],
            options: []
        }
    },
    computed: {
        getSourceId() {
            switch (this.$store.state.source_id) {
                case 1:
                    this.options = this.indexAareaOptions_alibaba;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    this.options = this.options_yiwugo;
                    break;
                default:
                    break;
            }
            if(this.options && this.options.length > 0) {
                this.index_area = this.options[0].value;
            }
            return this.$store.state.source_id;
        }
    },
    watch: {
        getSourceId() {
            console.log(this.options);
        }
    },
    methods: {
        onClickCloseButton() {
            this.input = '';
        },
        onClickSearchButton() {
            if(!this.input.trim()) {
                this.$message.info('搜索内容不能为空！');
                return;
            }
            this.$emit('onClickSearchButton', {search_text: this.input, index_area: this.index_area});
        },
        onClickCamera() {
            document.getElementById('uploadButton').click();
        },
        handleAvatarSuccess(res, file) {
            console.log('success', res);
            this.$emit('onImageUploadedSuccess', res);
        },
        handleAvatarError(err) {
            console.log('error', res);
            this.$message.error('上传图片错误！');
            this.$emit('onImageUploadedError', err);
        },
        onUploadImage(params) {
            console.log(params);
            switch (this.$store.state.source_id) {
                case SourceMap['alibaba']:
                    alibaba.uploadPic(params.file).then(res=>{
                        if(!res.data) {
                        	return $message.error(res.msg);
                        }
                        params.onSuccess({imgUrl: res.data.domain + res.data.imageAddress, imageAddress: res.data.imageAddress})
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
                case SourceMap['1688']:
					_1688.uploadPicH5(params.file).then(res=>{
					    if(!res.data) {
					    	return; this.$message.error(res.msg);
					    }
						getBase64(params.file, (u) => {
							params.onSuccess({imgUrl: u, imageAddress: res.data.imageId})
						});
					}).catch(e=>{
					    console.log(e);
					})
                    break;
                case SourceMap['1688global']:
                    _1688global.uploadPic(params.file).then(res=>{
                        if(!res.data) return this.$message.error(res.msg);
                        params.onSuccess({imgUrl: res.data.imgUrl, imageAddress: res.data.imgUrl})
                    }).catch(e=>{ console.log(e);})
                    break;
                case SourceMap['aliexpress']:
					aliexpress.uploadPic(params.file).then(res=>{
						if(!res.data) {
							return this.$message.error(res.msg);
						}
						params.onSuccess({imgUrl: res.data.url, imageAddress: res.data.filename})
					}).catch(e=>{
						console.log(e);
					})
                    break;
                case SourceMap['yiwugo']:
                    yiwugo.uploadPic(params.file).then(res=>{
                        if(!res.data) {
                        	return this.$message.error(res.msg);
                        }
                        params.onSuccess({imgUrl: res.data.url, imageAddress: res.data.url})
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
            }
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        onKeyPress(e) {
            if(e.keyCode === 13)  {
                this.onClickSearchButton();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.text-search {
    display: flex;
    align-items: center;
    width: 850px;
    height: 40px;
    margin: auto;
}
.input-box {
    position: relative;
    display: flex;
    align-items: center;
    border: 2px solid #ff4000;
    border-radius: 5px 0 0 5px;
    width: 100%;
    height: 100%;
    background-color: #FFF;
    i {
        display: block;
        text-align: center;
        width: 40px;
        &:last-child {
            position: absolute;
            right: 0;
            cursor: pointer;
            font-size: 18px;
        }
    }
}
.input {
    width: 100%;
    height: 100%;
    border: none;
    margin: 10px 0;
}
.input:focus{   
	border:none;
}
.input:focus-visible {
    outline: none;
}
.sbtn {
    width: 118px;
    height: 100%;
    color: #fff;
    text-align: center;
    background-image: linear-gradient(90deg, #FF7E3E 0%, #FF4000 100%);
    border-radius: 0 6px 6px 0;
    font: 16.5px/2.4 Tahoma,Arial,"\5b8b\4f53",sans-serif;
    font-weight: 600;
    letter-spacing: 5px;
    margin-left: -5px;
    cursor: pointer;
}

::v-deep .el-input__inner {
    border: none;
    height: 35px;
    line-height: 35px;
    width: 115px;
}
</style>