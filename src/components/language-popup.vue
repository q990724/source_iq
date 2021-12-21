<template>
    <div class="language-popup" v-show="dialogVisible" append-to-body modal-append-to-body>
        <el-dialog
            :visible.sync="dialogVisible"
            width="30%">
            <div class="form">
                <el-form label-position="top">
                    <el-form-item label="Ship to">
                        <el-select v-model="country" filterable placeholder="请选择" @change="onSelectChange($event, 'country')">
                            <el-option
                                v-for="item in $store.state.countryList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Language">
                        <el-select v-model="language" filterable placeholder="请选择" @change="onSelectChange($event, 'language')">
                            <el-option
                                v-for="item in $store.state.languageList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Currency">
                        <el-select v-model="currency" filterable placeholder="请选择" @change="onSelectChange($event, 'currency')">
                            <el-option
                                v-for="item in $store.state.currencyList"
                                :key="item.code"
                                :label="`${item.code} (${item.name})`"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="save">{{$t('button.save')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "language-popup",
    data() {
        return {
            dialogVisible: false,
            country: '',
            language: '',
            currency: '',
            countryName: '',
            languageName: '',
            currencyName: '',
        }
    },
    methods: {
        open() {
            this.dialogVisible = true;
            this.country = this.$store.state.countryCode;
            this.language = this.$store.state.languageCode;
            this.currency = this.$store.state.currencyCode;
            this.countryName = this.$store.state.countryName;
            this.languageName = this.$store.state.languageName;
            this.currencyName = this.$store.state.currencyName;
        },
        close() {
            this.dialogVisible = false;
        },
        save() {
            this.$store.state.countryCode = this.country;
            this.$store.state.countryName = this.countryName;
            this.$store.state.languageCode = this.language;
            this.$store.state.languageName =  this.languageName;
            this.$store.state.currencyCode = this.currency;
            this.$store.state.currencyName = this.currencyName;
            this.close();
            this.$emit('onSave');
        },
        onSelectChange(event, type) {
            function getName(list, code) {
                for (let item of list) {
                    if(item.code == code) {
                        return item.name;
                    }
                }
                return '';
            }
            switch (type) {
                case 'country':
                    this.country = event;
                    this.countryName = getName(this.$store.state.countryList, event);
                    break;
                case 'language':
                    this.language = event;
                    this.languageName = getName(this.$store.state.languageList, event);
                    break;
                case 'currency':
                    this.currency = event;
                    this.currencyName = getName(this.$store.state.currencyList, event);
                    break;
            }
        }
    }
}
</script>

<style scoped>

</style>