<template>
    <div class="text-search mt40">
        <div class="input-box">
            <i class="el-icon-search"></i>
            <el-select v-model="index_area" :placeholder="$t('label.select')" v-if="options && options.length > 0">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <input type="text" class="input" :placeholder="$t('label.input_placeholder')" v-model="input" autocomplete="off" @keypress="onKeyPress">
            <!-- <i class="el-icon-circle-close" v-show="input" @click="onClickCloseButton"></i> -->
            <i class="el-icon-camera" @click="onClickCamera"></i>
        </div>
        <div class="sbtn" @click="onClickSearchButton">{{$t('button.search')}}</div>

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
import {alibaba, yiwugo, dhgate, aliexpress, _1688, _1688global} from "@/assets/js/apis";
import SourceMap from "@/assets/js/source_map";
import {getBase64, getFileFromBase64} from "@/assets/js/utils.js";
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
    created() {
        if(window.localStorage.getItem('upload-file')) {
            this.onUploadImage();
        }
        if(window.localStorage.getItem('search-text')) {
            this.input = window.localStorage.getItem('search-text');
            this.onClickSearchButton();
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
            window.localStorage.setItem('search-text', this.input.trim());
            window.localStorage.removeItem('upload-file');
            this.$emit('onClickSearchButton', {search_text: this.input, index_area: this.index_area});
        },
        onClickCamera() {
            document.getElementById('uploadButton').click();
        },
        handleAvatarSuccess(res, file) {
            console.log('success', res);
            window.localStorage.removeItem('search-text');
            this.$emit('onImageUploadedSuccess', res);
        },
        handleAvatarError(err) {
            console.log('error', res);
            this.$message.error('上传图片错误！');
            this.$emit('onImageUploadedError', err);
        },
        onUploadImage() {
            let base64 = window.localStorage.getItem('upload-file');
            let file = getFileFromBase64(base64);
            switch (this.$store.state.source_id) {
                case SourceMap['alibaba']['id']:
                    alibaba.uploadPic(file).then(res=>{
                        if(!res.data) { return $message.error(res.msg); }
                        this.handleAvatarSuccess({imgUrl: res.data.domain + res.data.imageAddress, imageAddress: res.data.imageAddress});
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
                case SourceMap['1688']['id']:
					_1688.uploadPicH5(file).then(res=>{
					    if(!res.data) return this.$message.error(res.msg);
                        this.handleAvatarSuccess({imgUrl: base64, imageAddress: res.data.imageId})
					}).catch(e=>{
					    console.log(e);
					})
                    break;
                case SourceMap['1688global']['id']:
                    _1688global.uploadPic(file).then(res=>{
                        if(!res.data) return this.$message.error(res.msg);
                        this.handleAvatarSuccess({imgUrl: res.data.imgUrl, imageAddress: res.data.imgUrl})
                    }).catch(e=>{ console.log(e);})
                    break;
                case SourceMap['aliexpress']['id']:
					aliexpress.uploadPic(file).then(res=>{
						if(!res.data) return this.$message.error(res.msg);
                        this.handleAvatarSuccess({imgUrl: res.data.url, imageAddress: res.data.filename})
					}).catch(e=>{
						console.log(e);
					})
                    break;
                case SourceMap['yiwugo']['id']:
                    yiwugo.uploadPic(file).then(res=>{
                        if(!res.data) return this.$message.error(res.msg);
                        this.handleAvatarSuccess({imgUrl: res.data.url, imageAddress: res.data.url})
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
                case SourceMap['dhgate']['id']:
                    dhgate.uploadPic(file).then(res=>{
                        if(!res.data) return this.$message.error(res.msg);
                        this.handleAvatarSuccess({imgUrl: res.sourceResult.data.data.imgUrl, imageAddress: res.sourceResult.data.data.imgUrl})
                    }).catch(e=>{
                        console.log(e);
                    })
                    break;
            }
        },
        async beforeAvatarUpload(file) {
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // return isLt2M;
            let base64 = await getBase64(file);
            window.localStorage.setItem('upload-file', base64);
            return true;
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
    letter-spacing: 1px;
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