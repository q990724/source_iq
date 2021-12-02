<template>
    <div class="search-result-container scrollable">
        <div class="container">
            <div class="main-container">
                <text-search ref="text_search" @onClickSearchButton="onClickSearchButton"
                             @onSelectImage="onSelectImage"></text-search>
                <!--  图片处理区域  -->
                <image-operation ref="image_operation" @onClickLocalItem="onClickLocalItem" @onClickMainImage="onClickMainImage" @onClickClear="onClickClear"></image-operation>
                <div class="filter-container mt40" v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0) || $store.state.searchState !== 'none'">
                    <source-list @onSourceItemClick="onSourceItemClick" v-show="$store.state.searchState !== 'none'"></source-list>
                    <!--  商品分类  -->
                    <product-class :class_list="categoryList" @onClassChange="onClassChange"></product-class>
                    <!--  筛选区域  -->
                    <group-filter :filterList="filterList" @onFilterChange="onFilterChange"></group-filter>
                </div>
                <!--商品高级筛选-->
                <!--<high-filtration></high-filtration>-->
                <h2 class="mt40" v-if="results && results.length > 0">{{ $t('message.findSource') }}</h2>
                <!--  筛选区域  -->
                <!--<filtration></filtration>-->
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
import {_1688} from "@/assets/js/apis";
import bus from "@/assets/js/bus";
import {getBase64FromCropImage, getFileFromBase64, handleResponse} from "@/assets/js/utils.js";
import publicData from "../mixins/public.js";

export default {
    name: "view-1688",
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
            yoloCropRegion: '',
            region: '',
            activeLocalItemIndex: 0,
            searchTextParams: {
                keyword: '',
                type: 1
            }
        }
    },
    mounted() {
        // 加载更多
        bus.$on('loadmore', this.loadmore.bind(this));
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
            this.searchTextParams.Category = id;
            this.page = 1;
            if (this.$store.state.searchType === 'image') {
                this.getDataFromImage();
            } else {
                this.getDataFromText(false)
            }
        },
        /**
         * @description 监听文字搜索按钮点击
         */
        async onClickSearchButton(params) {
            this.$store.commit('setSearchType', 'text');
            this.$store.commit('setSearchText', params.search_text);
            this.searchTextParams = {
                keyword: params.search_text,
                type: 1
            }
            this.results = await this.getDataFromTextFirst();
        },
        onFilterChange({e, o, title}) {

        },
        async imageSearch(base64) {
            this.$store.commit('setSearchType', 'image');
            try {
                this.initSearchResult();
                let file = getFileFromBase64(base64);
                this.$store.commit('setImageUploadState', 'none');
                let uploadImageResult = await _1688.uploadPicH5(file);
                this.imageAddress = uploadImageResult.data.imageId;
                this.$store.commit('setImageUploadState', 'uploaded');
                this.results = await this.getDataFromImageFirst();
            } catch (e) {
                console.log(e);
                this.$store.commit('setSearchState', 'error');
                this.$store.commit('setImageUploadState', 'error');
                throw e;
            }
        },
        loadmore() {
            console.log('触底事件触发, 当前页码', this.page);
            if(this.$store.state.firstSearchState === 'success') {
                let totalPage = 99;
                if (this.page >= totalPage) {
                    this.page = totalPage;
                    return;
                }
                this.page++;
                if (this.$store.state.searchType === 'image' && this.$store.state.imageUploadState === 'uploaded') {
                    this.getDataFromImage().then(result => {
                        this.results = [...this.results, ...result];
                    })
                } else {
                    this.getDataFromText().then(result => {
                        this.results = [...this.results, ...result];
                    })
                }
            }
        },
        /**
         * @description 根据图片搜索获取数据
         */
        async getDataFromImage() {
            try {
                let result = await _1688.searchGoodsByPic({
                    imageId: this.imageAddress,
                    page: this.page,
                    yoloCropRegion: this.yoloCropRegion,
                    region: this.region,
                    pailitaoCategoryId: this.cid
                });
                this.$store.commit('setSearchState', 'success');
                if(result && result.data) {
                    this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                    this.resultInfo = result.data.resultInfo;
                    this.totalPage = this.resultInfo.totalPages || 1;
                    if (result.data.results && result.data.results.length > 0) {
                        handleResponse(result);
                        return result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                }else {
                    this.$store.commit('setSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_image_error'));
                }
                return [];
            } catch (e) {
                this.$store.commit('setSearchState', 'error');
                this.$message.error(this.$t('message.serach_result_from_image_error') + e);
                return [];
            }
        },
        /**
         * @description 根据图片搜索首次获取数据
         */
        async getDataFromImageFirst() {
            // this.$refs['product-list'].changeShowNoList(false);
            try {
                let result = await _1688.searchGoodsByPicFirst({
                    imageId: this.imageAddress,
                    yoloRegionSelected: this.yoloCropRegion && this.region,
                    yoloCropRegion: this.yoloCropRegion || null,
                    region: this.region || null
                });
                this.$store.commit('setSearchState', 'success');
                if (result && result.data) {
                    if (result.data.searchImage && result.data.searchImage.yoloCropRegion) {
                        this.yoloCropRegion = result.data.searchImage.yoloCropRegion;
                        this.region = result.data.searchImage.region;
                        let regionList = result.data.searchImage.yoloCropRegion.split(';');
                        let r = await getBase64FromCropImage(this.$store.state.mainImage, regionList);
                        this.$refs['image_operation'].setLocalImageList(r);
                        this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                        this.resultInfo = result.data.resultInfo;
                        this.totalPage = this.resultInfo.totalPages || 1;
                    }
                    if (result.data.results && result.data.results.length > 0) {
                        handleResponse(result);
                        this.$store.commit('setFirstSearchState', 'success');
                        return result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                } else {
                    this.$store.commit('setSearchState', 'error');
                    this.$store.commit('setFirstSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_image_error'));
                }
                return [];
            } catch (e) {
                console.log(e);
                this.$store.commit('setSearchState', 'error');
                this.$store.commit('setFirstSearchState', 'error');
                this.$message.error(this.$t('message.serach_result_from_image_error') + e);
                throw e
            }
        },
        /**
         * @description 根据文字搜索获取数据
         */
        async getDataFromText() {
            // this.$refs['product-list'].changeShowNoList(false);
            try {
                let result = await _1688.searchGoods({...this.searchTextParams, page: this.page});
                this.$store.commit('setSearchState', 'success');
                if (result && result.data) {
                    this.categoryList = result.data.categoryList || null;
                    this.filterList = result.data.filterList || null;
                    this.resultInfo = result.data.resultInfo;
                    if (result.data.results && result.data.results.length > 0) {
                        handleResponse(result);
                        return result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                } else {
                    this.$store.commit('setSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_text_error'));
                }
                return [];
            } catch (error) {
                this.$store.commit('setSearchState', 'error');
                this.$message.error(this.$t('message.serach_result_from_text_error'));
                console.log(error);
            }
        },
        /**
         * @description 根据文字搜索首次获取数据
         */
        async getDataFromTextFirst() {
            // this.$refs['product-list'].changeShowNoList(false);
            try {
                let result = await _1688.searchGoodsFirst({...this.searchTextParams, page: this.page});
                this.$store.commit('setSearchState', 'success');
                if (result && result.data) {
                    this.categoryList = result.data.categoryList || null;
                    this.filterList = result.data.filterList || null;
                    this.resultInfo = result.data.resultInfo;
                    if (result.data.results && result.data.results.length > 0) {
                        handleResponse(result);
                        this.$store.commit('setFirstSearchState', 'success');
                        return result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                } else {
                    this.$store.commit('setSearchState', 'error');
                    this.$store.commit('setFirstSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_text_error'));
                }
                return [];
            } catch (e) {
                this.$store.commit('setSearchState', 'error');
                this.$store.commit('setFirstSearchState', 'error');
                this.$message.error(this.$t('message.serach_result_from_text_error'));
                throw e;
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

    .filter {
        .filter-item {
            margin-bottom: 10px;

            .filter-item_title {
                margin-bottom: 10px;
            }

            .filter-item_options {
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                .filter-item_option {
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>
