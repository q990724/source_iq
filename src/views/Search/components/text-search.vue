<template>
    <div class="text-search mt40">
        <div class="input-box">
            <i class="el-icon-search"></i>
            <el-select v-model="index_area" placeholder="请选择">
                <el-option v-for="item in indexAareaOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <input type="text" class="input" placeholder="请输入关键词" v-model="input" autocomplete="off">
            <!-- <i class="el-icon-circle-close" v-show="input" @click="onClickCloseButton"></i> -->
            <i class="el-icon-camera" @click="onClickCamera"></i>
        </div>
        <div class="sbtn" @click="onClickSearchButton">搜索</div>
    </div>
</template>

<script>
export default {
    name: 'text-search',
    data() {
        return {
            input: '',
            isFocus: false,
            index_area: 'product_en',
            indexAareaOptions: [{label: 'Products', value: 'product_en'}, {label: 'Suppliers', value: 'company_en'}]
        }
    },
    methods: {
        onClickCloseButton() {
            this.input = '';
        },
        onClickSearchButton() {
            this.$emit('onClickSearchButton', {search_text: this.input, index_area: this.index_area});
        },
        onClickCamera() {

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