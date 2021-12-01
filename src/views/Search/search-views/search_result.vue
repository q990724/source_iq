<template>
    <div class="search-result-container scrollable">
        <div class="container">
            <div class="main-container">
                <text-search ref="text_search" @onClickSearchButton="onClickSearchButton" @onSelectImage="onSelectImage"></text-search>
                <!--  图片处理区域  -->
                <image-operation ref="image_operation" @onClickLocalItem="onClickLocalItem" @onClickMainImage="onClickMainImage" @onClickClear="onClickClear"></image-operation>
                <!--  筛选区域  -->
                <div class="filter-container mt40" v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0) || $store.state.searchState !== 'none'">
                    <source-list @onSourceItemClick="onSourceItemClick" v-show="$store.state.searchState !== 'none'"></source-list>
                    <!-- 商品分类 -->
                    <product-class v-if="categoryList && categoryList.items" :class_list="categoryList" @onClassChange="onClassChange"></product-class>
                    <!--  筛选区域  -->
                    <group-filter v-if="filterList && filterList.length > 0" :filterList="filterList" @onFilterChange="onFilterChange"></group-filter>
                    <!-- 价格区间 -->
                    <!-- 地区 -->
                </div>
                <!--商品高级筛选-->
                <!-- <high-filtration></high-filtration> -->
                <h2 class="mt40" v-if="results && results.length > 0">{{ $t('message.findSource') }}</h2>
                <!--  商品列表  -->
                <product-list :offer_list="results" ref="product-list"></product-list>
                <support-source-list v-show="$store.state.searchState === 'none'"></support-source-list>
            </div>
        </div>
    </div>
</template>

<script>
    import TextSearchComponent from "../components/text-search.vue";
    import SourceListComponent from "../components/source-list";
    import ImageOperationComponent from "../components/image-operation";
    import ProductClassComponent from "../components/product-class";
    import FiltrationComponent from "../components/filtration";
    import ProductListComponent from "../components/product-list";
    import HighFiltration from "../components/high-filtration";
    import FilterComponent from "../components/group-filter.vue";
    import { dhgate } from "@/assets/js/apis";
    import bus from "@/assets/js/bus";
    import { handleResponse, getFileFromBase64 } from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
    export default {
        name: "view-dhgate",
        components: {
            SourceList: SourceListComponent,
            ImageOperation: ImageOperationComponent,
            ProductClass: ProductClassComponent,
            Filtration: FiltrationComponent,
            ProductList: ProductListComponent,
            HighFiltration: HighFiltration,
            TextSearch: TextSearchComponent,
            GroupFilter: FilterComponent
        },
        mixins: [publicData],
        data() {
            return {
                searchTextParams: {
                    search_text: '',
                }
            }
        },
        mounted() {
            console.log('view mounted');
            // 加载更多
            bus.$on('loadmore', () => {
                console.log('触底事件触发');
                this.page++;
                if(this.page > 99) {
                    this.page = 99;
                    return;
                }
                if(this.$store.state.searchType === 'image') {
                    this.getDataFromImage(true);
                }else {
                    this.getDataFromText(true);
                }

            })
            if(window.localStorage.getItem('upload-file')) {
                this.onSelectImage();
            }else if(this.$store.state.mainImage) {
                this.imageSearch(this.$store.state.mainImage);
            }else if(this.$store.state.searchText) {
                this.onClickSearchButton({search_text: this.$store.state.searchText});
            }
        },
        methods: {
            /**
             * @description 切换商品分类时触发
             */
            onClassChange({id}) {
                this.cid = id;
                this.searchTextParams.category = id;
                this.page = 1;
                if(this.$store.state.searchType === 'image') {
                    this.imageSearch(this.originalImageUrl);
                }else {
                    this.getDataFromText(false)
                }
            },
            /**
             * @description 点击文字搜索时触发
             * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
             */
            onClickSearchButton(params) {
                this.$store.commit('setSearchType', 'text');
                this.$store.commit('setSearchText', params.search_text);
                this.searchTextParams = {
                    search_text: params.search_text,
                }
                this.getDataFromText(false);
            },
            onFilterChange({e, o, title}) {
                let self = this;
                function handleCheckBoxParams(key, s = ",") {
                    if(self.searchTextParams[key]) {
                        arr = self.searchTextParams[key].split(s);
                    }
                    if(e) {
                        arr.push(o.id);
                    }else if(arr.includes(o.id)) {
                        arr.splice(arr.indexOf(o.id), 1);
                    }
                    self.searchTextParams[key] = arr.join(s);
                    if(arr.length <= 0) {
                        delete self.searchTextParams[key];
                    }
                }
                let arr = [];
                switch (title) {
                    case 'Ship from':
                        handleCheckBoxParams('inventoryLocation', ";");
                        break;
                    default:
                        handleCheckBoxParams('at', ',');
                }
                this.getDataFromText(false);
            },
            async imageSearch(base64) {
                this.$store.commit('setSearchType', 'image');
                try {
                    this.initSearchResult();
                    let file = getFileFromBase64(base64);
                    let uploadImageResult = await dhgate.uploadPic(file);
                    this.imageAddress = uploadImageResult.sourceResult.data.data.imgUrl;
                    this.getDataFromImage(false);
                }catch (e) {
                    console.log(e);
                    this.$store.commit('setSearchState', 'error');
                    throw e;
                }
            },
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
            async getDataFromImage(loadmore) {
                this.$refs['product-list'].changeShowNoList(false);
                try {
                    let result = await dhgate.searchGoodsByPic(this.imageAddress, this.page, this.cid);
                    this.$store.commit('setSearchState', 'success');
                    if(result && result.data) {
                        this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                        this.resultInfo = result.data.resultInfo;
                        this.totalPage = this.resultInfo.totalPages || 1;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                        } else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_image_error'));
                        this.$store.commit('setSearchState', 'error');
                    }
                    this.results = loadmore ? [...this.results, ...[]] : [];
                } catch (e) {
                    this.$store.commit('setSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_image_error') + e);
                }
            },
            /**
             * @description 根据文字搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
            async getDataFromText(loadmore) {
                try {
                    console.log(this.searchTextParams);
                    let result = await dhgate.searchGoodsByText({ ...this.searchTextParams,page: this.page });
                    this.$store.commit('setSearchState', 'success');
                    if(result && result.data) {
                        this.categoryList = result.data.categoryList || null;
                        this.filterList = result.data.filterList || null;
                        this.resultInfo = result.data.resultInfo || null;
                        if(result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                        }else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_text_error'));
                        this.$store.commit('setSearchState', 'error');
                    }
                    this.results = loadmore ? [...this.results, ...[]] : [];
                } catch (error) {
                    this.$store.commit('setSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_text_error'));
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .search-result-container {
        .container {
            .main-container {
                min-width: 1390px;
                width: 1390px;
                margin: auto;
            }
        }
    }

    .filter-container {
        border-radius: 10px;
        border: 1px solid #DCDFE6;
        background-color: #FFF;
        padding: 20px 10px;
    }
</style>
