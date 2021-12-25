<template>
    <!--<div id="app" v-infinite-scroll="load" infinite-scroll-immediate="false">-->
    <div id="app">
        <router-view :key="key"></router-view>
        <feedback ref="feedback"></feedback>
        <cookie-toast></cookie-toast>
    </div>
</template>

<script>
import bus from "@/assets/js/bus";
import SoureMap from "@/assets/js/source_map.js";
import {publicAPI} from "@/assets/js/apis";
import cookieToast from '@/components/cookie-toast';
import feedback from "@/components/feedback";
let appElement = null;
let minAwayBtm = 0;
export default {
    data() {
        return {

        }
    },
    components: {
        feedback, cookieToast
    },
    created() {
        console.log('app.vue created');
    },
    mounted() {
        console.log('app.vue mounted');
        window['$openFeedback'] = () => {
            this.onFeedback();
        }

        $(window).scroll(async (e)=> {
            this.onAppScrollEvent($(window).scrollTop());
            let awayBtm = $(document).height() - $(window).scrollTop() - $(window).height();
            if (awayBtm <= minAwayBtm && this.$store.state.loadmore_busy) {
                this.$store.state.loadmore_busy=false;
                this.load();
            }
        })
    },
    methods: {
        load() {
            console.log('app 收到loadmore事件');
            bus.$emit("loadmore");
        },
        onAppScrollEvent(top) {
            this.$store.state.showRightFixed = top >= 1500;
        },
        onFeedback() {
            this.$refs['feedback'].open();
        },
        async getCountryLangCurrency(path, params) {
            let res = await publicAPI.getCountryLangCurrency(path, params);
            if(res.data) {
                let result = res.data;
                this.$store.state.countryList = result.country;
                this.$store.state.currencyList = result.currency;
                this.$store.state.languageList = result.language;
                if(result.country && result.defaultCountryIndex){
                    this.$store.state.countryCode = this.$store.state.countryList[result.defaultCountryIndex]['code'];
                    this.$store.state.countryName = this.$store.state.countryList[result.defaultCountryIndex]['name'];
                }else{
                    this.$store.state.countryCode = null;
                    this.$store.state.countryName = null;
                }
                if(result.currency && result.defaultCurrencyIndex && result.defaultCurrencyIndex >= 0  || result.currency && result.defaultCurrencyIndex === 0){
                // if(result.currency && result.defaultCurrencyIndex && result.defaultCurrencyIndex !== -1){
                    console.log('货币code',this.$store.state.currencyList[result.defaultCurrencyIndex]['code']);
                    this.$store.state.currencyCode = this.$store.state.currencyList[result.defaultCurrencyIndex]['code'];
                    this.$store.state.currencyName = this.$store.state.currencyList[result.defaultCurrencyIndex]['name'];
                }else{
                    this.$store.state.currencyCode = null;
                    this.$store.state.currencyName = null;
                }
                // if(result.language && result.defaultLanguageIndex && result.defaultLanguageIndex >= 0){
                if(result.language && result.defaultLanguageIndex && result.defaultLanguageIndex >= 0 || result.language && result.defaultLanguageIndex === 0){
                    console.log('语言code',this.$store.state.currencyList[result.defaultLanguageIndex]['code']);
                    this.$store.state.languageCode = this.$store.state.languageList[result.defaultLanguageIndex]['code'];
                    this.$store.state.languageName = this.$store.state.languageList[result.defaultLanguageIndex]['name'];
                }else{
                    this.$store.state.languageCode = null;
                    this.$store.state.languageName = null;
                }
                // console.log(result.defaultCurrencyIndex);
                // console.log('切换站点语言',result.language)
                // console.log('切换站点货币',result.currency)
            }
        }
    },
    computed: {
        source_id() {
            return this.$store.state.source_id;
        },
        key() {
            return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
        }
    },
    watch: {
        //TBD：由于异步进程之间的“竞跑”，这里可能遇到source_id=null，app-setting还没来得及从window获取更新store
        //TBD：如果store->source_id初始化为1而不是null，会导致插件切换source_id=1时，watch不触发，路由不切换产生不一致
        async source_id() {
            console.log("app.vue watch source_id", this.$store.state.source_id);
            let current_path = this.$route.path;
            console.log(current_path);
            switch (this.$store.state.source_id) {
                case SoureMap['alibaba']['id']:
                    // await this.getCountryLangCurrency(SoureMap['alibaba']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-alibaba') return;
                    this.$router.push('/layout/view-alibaba');
                    break;
                case SoureMap['1688']['id']:
                    // await this.getCountryLangCurrency(SoureMap['1688']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-1688') return;
                    this.$router.push('/layout/view-1688');
                    break;
                case SoureMap['1688rapid']['id']:
                    // await this.getCountryLangCurrency(SoureMap['1688rapid']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-1688rapid') return;
                    this.$router.push('/layout/view-1688rapid');
                    break;
                case SoureMap['1688global']['id']:
                    // await this.getCountryLangCurrency(SoureMap['1688global']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-1688global') return;
                    this.$router.push('/layout/view-1688global');
                    break;
                case SoureMap['aliexpressDS']['id']:
                    // await this.getCountryLangCurrency(SoureMap['aliexpressDS']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-aliexpressDS') return;
                    this.$router.push('/layout/view-aliexpressDS');
                    break;
                case SoureMap['aliexpressZapieX']['id']:
                    // await this.getCountryLangCurrency(SoureMap['aliexpressZapieX']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-aliexpressZapieX') return;
                    this.$router.push('/layout/view-aliexpressZapieX');
                    break;
                case SoureMap['yiwugo']['id']:
                    // await this.getCountryLangCurrency(SoureMap['yiwugo']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-yiwugo') return;
                    this.$router.push('/layout/view-yiwugo');
                    break;
                case SoureMap['dhgate']['id']:
                    // await this.getCountryLangCurrency(SoureMap['dhgate']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-dhgate') return;
                    this.$router.push('/layout/view-dhgate');
                    break;
                case SoureMap['mic']['id']:
                    // await this.getCountryLangCurrency(SoureMap['mic']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-mic') return;
                    this.$router.push('/layout/view-mic');
                    break;
                case SoureMap['cjds']['id']:
                    // await this.getCountryLangCurrency(SoureMap['cjds']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-cjds') return;
                    this.$router.push('/layout/view-cjds');
                    break;
                case SoureMap['litbox']['id']:
                    // await this.getCountryLangCurrency(SoureMap['litbox']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-litbox') return;
                    this.$router.push('/layout/view-litbox');
                    break;
                case SoureMap['1688overseas']['id']:
                    // await this.getCountryLangCurrency(SoureMap['1688overseas']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-1688overseas') return;
                    this.$router.push('/layout/view-1688overseas');
                    break;
                case SoureMap['banggood']['id']:
                    // await this.getCountryLangCurrency(SoureMap['banggood']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-banggood') return;
                    this.$router.push('/layout/view-banggood');
                    break;
                case SoureMap['chinabrands']['id']:
                    // await this.getCountryLangCurrency(SoureMap['chinabrands']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-chinabrands') return;
                    this.$router.push('/layout/view-chinabrands');
                    break;
                case SoureMap['globalres']['id']:
                    // await this.getCountryLangCurrency(SoureMap['globalres']['getCountryLangCurrency']);
                    if (current_path === '/layout/view-globalres') return;
                    this.$router.push('/layout/view-globalres');
                    break;
            }
        }
    }
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: $font_family;
    color: $regular_text_color;
    font-size: $regular_text_size;
    background-color: $background_color;
    min-width: $content_width_sm;
}

</style>
