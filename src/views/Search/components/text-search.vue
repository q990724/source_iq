<template>
    <div class="text-search mt40">
        <div class="input-box">
            <i class="el-icon-search"></i>
            <el-select v-model="index_area" :placeholder="$t('label.select')" v-if="options && options.length > 0">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <input type="text" class="input" :placeholder="$t('label.input_placeholder')" v-model="input" autocomplete="off" @keypress="onKeyPress">
             <i class="el-icon-circle-close clear" v-show="input" @click="onClickCloseButton"></i>
            <i class="el-icon-camera camera" @click="onClickCamera"></i>
        </div>
        <div class="sbtn" @click="onClickSearchButton">{{$t('button.search')}}</div>
        <input type="file" accept="image/*" style="display: none" @change="selectImage" id='uploadButton'>
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
    computed: {
        getSourceId() {
            switch (this.$store.state.source_id) {
                case 1:
                    this.options = this.indexAareaOptions_alibaba;
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
        },
    },
    created() {
        this.input = this.$store.state.searchText;
    },
    methods: {
        onClickCloseButton() {
            this.input = '';
        },
        onClickSearchButton() {
            if(!this.input.trim()) return this.$message.info(this.$t('message.search_text_not_null'));
            this.$emit('onClickSearchButton', {search_text: this.input, index_area: this.index_area});
        },
        onClickCamera() {
            document.getElementById('uploadButton').click();
        },
        async selectImage(e) {
            console.log(e);
            if(e.target.files && e.target.files.length > 0) {
                let file = e.target.files[0];
                e.target.value = '';
                let base64 = await getBase64(file);
                this.$store.commit('setWindowStorageUploadFile', base64);
                this.$emit('onSelectImage');
            }
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
        &.camera, &.clear {
            position: absolute;
            cursor: pointer;
            font-size: 18px;
        }
        &.camera {
            right: 0;
        }
        &.clear {
            right: 28px;
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