<template>
    <div class="search-result-container" :style="$store.state.firstSearchState === 'success' ? 'margin-bottom:300px;' : ''">
        <div class="container">
            <div class="main-container">
                <text-search ref="text_search" @onClickSearchButton="onClickSearchButton"
                             @onSelectImage="onSelectImage"></text-search>
                <div class="filter-container mt20">
                    <source-list @onSourceItemClick="onSourceItemClick"></source-list>
                </div>
                <!--  图片处理区域  -->
                <image-operation ref="image_operation" @onClickLocalItem="onClickLocalItem"
                                 @onClickMainImage="onClickMainImage" @onClickSearchText="onClickSearchText" @onClickClear="onClickClear"></image-operation>
                <!--  筛选区域  -->
                <!-- v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0) || $store.state.searchState !== 'none' || $store.state.mainImage || $store.state.searchText" -->
                <div class="filter-container mt20" :style="(filterList && filterList.length > (collapseFilterGroupCount+1)) ? 'padding-bottom: 20px;' : 'padding-bottom:0;'" v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0)">
                    <!-- v-show="$store.state.searchState !== 'none' || $store.state.mainImage || $store.state.searchText" -->
<!--                    <source-list @onSourceItemClick="onSourceItemClick"></source-list> -->
                    <!-- 商品分类 -->
                    <product-class v-if="categoryList && categoryList.items" :class_list="categoryList"
                                   @onClassChange="onClassChange"></product-class>
                    <!--<my-collapse title="标题">-->
                    <!--    <div class="item"></div>-->
                    <!--</my-collapse>-->
                    <!--  筛选区域  -->
                    <group-filter v-if="filterList && filterList.length > 0" :filterList="filterList"
                                  @onFilterChange="onFilterChange" :collapse-filter-group="isCollapseFilterGroup" :collapse-filter-group-count="collapseFilterGroupCount"></group-filter>
                    <div class="collapse" v-if="(filterList && filterList.length > (collapseFilterGroupCount+1))">
                        <span @click="onChangeCollapse(true)" v-if="!isCollapseFilterGroup">{{ $t('label.pack_more') }} <i class="el-icon-arrow-up"></i></span>
                        <span @click="onChangeCollapse(false)" v-else>{{ $t('label.spread_more') }} <i class="el-icon-arrow-down"></i></span>
                    </div>
                </div>
                <!--expr和排序-->
                <div class="filter-container mt20" v-if="(exprList && exprList.length > 0) || (sortList && sortList.length > 0)">
                    <!--  表达式区域  -->
                    <expr-list v-if="exprList && exprList.length > 0" :expr-list="exprList"
                               @onExprChange="onExprChange" :collapse-filter-group="isCollapseFilterGroup" :collapse-filter-group-count="collapseFilterGroupCount"></expr-list>
                    <sort-list v-if="sortList && sortList.length > 0" :sort-list="sortList"
                               @onSortChange="onSortChange" :collapse-filter-group="isCollapseFilterGroup" :collapse-filter-group-count="collapseFilterGroupCount"></sort-list>
                </div>
                <!--商品高级筛选-->
                <!--<high-filtration></high-filtration>-->
                <h2 class="mt20" v-if="results && results.length > 0">{{ $t('message.findSource') }}</h2>
                <!--  商品列表  -->
                <product-list :offer_list="results" ref="product-list" :show-seller="!(resultInfo.showSeller !== undefined && resultInfo.showSeller == false)"></product-list>
                <support-source-list v-show="$store.state.searchState === 'none' && !$store.state.searchParams.mainImage && !$store.state.searchParams.searchText"></support-source-list>
            </div>
        </div>

        <language-popup ref="language_popup" @onSave="onLanguagePopupSave"></language-popup>
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
import ExprListComponent from "../components/expr-list";
import SortListComponent from "../components/sort-list";
import MyCollapseComponent from '@/components/my-collapse';
import LanguagePopupComponent from "@/components/language-popup";
import bus from "@/assets/js/bus";
import {getBase64FromCropImage, handleResponse, getFileFromBase64, debounce} from "@/assets/js/utils.js";
import publicData from "../mixins/public.js";
import SourceMap from "@/assets/js/source_map.js";

export default {
    name: "view-",
    components: {
        SourceList: SourceListComponent,
        ImageOperation: ImageOperationComponent,
        ProductClass: ProductClassComponent,
        Filtration: FiltrationComponent,
        ProductList: ProductListComponent,
        HighFiltration: HighFiltration,
        TextSearch: TextSearchComponent,
        GroupFilter: FilterComponent,
        ExprList: ExprListComponent,
        SortList: SortListComponent,
        MyCollapse: MyCollapseComponent,
        LanguagePopup: LanguagePopupComponent
    },
    mixins: [publicData],
    data() {
        return {
            // 是否折叠筛选组 false: 展开 true: 收起
            isCollapseFilterGroup: true,
            // 每组显示行数
            collapseFilterGroupCount: 1,
            // 点击view more 时记录当前scrollTop
            collapseScrollTop: 0,
        }
    },
    async mounted() {
        console.log('search_result.vue mounted');
        console.log('source_id:',this.$store.state.source_id);
        // 加载更多
        bus.$on('loadmore', debounce(this.loadmore.bind(this), 500));
        console.log("window.localStorage.upload-file:",window.localStorage.getItem('upload-file'));
        console.log("store.state.searchParams.mainImage:",this.$store.state.searchParams.mainImage);
        if (window.localStorage.getItem('has-upload-file')) {
            console.log("mounted->onSelectImage");
            // TBD：此处有2种可能：1）有插件或本地上传图片，但没等content图片投递完成；2）没有插件或本地上传图片
            let file = await this.awaitGetUploadImage();
            if(file) this.onSelectImage();
        } else if (this.$store.state.searchParams.mainImage && this.$store.state.searchType === 'image') {
            // //TBD：新上传图片（插件或本地文件）发起新搜索，清空之前所有搜索参数和搜索状态，暂时不支持图片+上次搜索参数组合
            // this.onClickClear();
            // this.$store.commit('setSearchType', 'image');
            console.log("mounted->imageSearch");
            this.imageSearch(this.$store.state.searchParams.mainImage, true);
        } else if (this.$store.state.searchParams['searchText'] && this.$store.state.searchType === 'text') {
            console.log("mounted->onClickSearchButton");
            this.onClickSearchButton({searchText: this.$store.state.searchParams['searchText']});
        }



    },
    methods: {
        // 获取缓存查看是否继续搜索或是否为插件带图跳转过来
        awaitGetUploadImage() {
            return new Promise((resolve, reject) => {
                let retryCount = 0;
                // 每隔100ms获取一次upload-file
                let id = setInterval(() => {
                    // 如果10次后还是没有获取到，放弃获取
                    if(retryCount === 10) {
                        clearInterval(id);
                        resolve(null);
                    }
                    retryCount++;
                    let file = window.localStorage.getItem('upload-file');
                    // 如果获取到了，则返回
                    if(file) {
                        clearInterval(id);
                        resolve(file);
                    }
                }, 100);
            });
        },
        onScroll(e) {
            console.log(e);
        },
        onLanguagePopupSave(){
            this.initSearchResult();
			this.initConditions();
            this.$store.commit('resetSearchState');
            // 到store中处理多语言参数
            // this.$store.dispatch('onCountryLangCurrencyChange')

            if (this.$store.state.searchType === 'image') {
                // 切换筛选条件，不需要重新发起图片上传
                this.imageSearch(this.$store.state.searchParams.mainImage, false);
            } else if (this.$store.state.searchType === 'text') {
                this.getDataFromText(false);
            }
        },
        /**
         * @description 切换商品分类时触发
         */
        onClassChange({itemIndex, event}) {
			console.log("onClassChange");
            this.handleOptions(this.categoryList, itemIndex, event);
			this.initSearchResult();
			// this.clearSearchParams();
			this.$store.commit('resetSearchState');
            // this.cid = this.categoryList.items[itemIndex].paramValue;
            // this.searchTextParams.category = this.categoryList.items[itemIndex].paramValue;
			// TBD: 此处代码暂时没有走统一的“onFilterChange”，直接填写《kay，val》到store.searchParams
			// TBD：导致无法处理“多选”的商品分类，因为添加category参数目前直接覆盖原有的，或已经选中的分类
			// this.$store.commit('addSearchParam',{key:this.categoryList.paramName, val: this.categoryList.items[itemIndex].paramValue});
            this.$store.dispatch('onFilterChange', {
                filterItem: this.categoryList,
                option: this.categoryList.items[itemIndex],
                e: event,
				filterType: 'CATEGORY',
            })
            // this.page = 1;
            if (this.$store.state.searchType === 'image') {
                // 切换商品分类，不需要重新发起图片上传
                this.imageSearch(this.$store.state.searchParams.mainImage, false);
            } else if (this.$store.state.searchType === 'text') {
                this.getDataFromText(false);
            }
        },
        /**
         * @description 点击搜索框-》“搜索”或者搜索框-》回车，只保持搜索关键词，清空其它搜索参数和结果，重新发起搜索
         * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
         */
        onClickSearchButton(params) {
			console.log("params:",params);
            this.onClickClear();
            this.$store.commit('setSearchType', 'text');
            this.$store.commit('setSearchText', params.searchText);
            // this.searchTextParams = {
            //     search_text: params.search_text,
            // }
            this.getDataFromText(false);
        },
		/**
		 * @description 点击搜索结果区-》搜索文字，保持全部搜索条件、只清空上次搜索结果，重新发起文字搜索，不清除搜索参数
		 * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
		 */
		onClickSearchText(params) {
			console.log("onClickSearchText");
			this.initSearchResult();
		    this.$store.commit('setSearchType', 'text');
		    this.$store.commit('setSearchText', params.searchText);
		    // this.searchTextParams = {
		    //     search_text: params.search_text,
		    // }
		    this.getDataFromText(false);
		},

        onFilterChange({filterIndex, itemIndex, event}) {
			console.log("onFilterChange");
            // this.handleOptions(this.filterList[filterIndex], itemIndex, event);
            this.initSearchResult();
            // this.clearSearchParams();
            this.$store.commit('resetSearchState');
            this.$store.dispatch('onFilterChange', {
                filterItem: this.filterList[filterIndex],
                option: this.filterList[filterIndex].items[itemIndex],
				e: event,
				filterType: 'FILTER',
            })
            if (this.$store.state.searchType === 'image') {
                // 切换筛选条件，不需要重新发起图片上传
                this.imageSearch(this.$store.state.searchParams.mainImage, false);
            } else if (this.$store.state.searchType === 'text') {
                this.getDataFromText(false);
            }
            // this.getDataFromText(false);
        },
        onExprChange({exprIndex, itemIndex, event}) {
            console.log("onExprChange");
            this.exprList[exprIndex].selectUIType = 'checkbox';
            this.handleOptions(this.exprList[exprIndex], itemIndex, event, 'EXPR');
			// handleOptions与handleExprList的关系？
            this.initSearchResult();
            this.$store.commit('resetSearchState');
            let exprItemClone = JSON.parse(JSON.stringify(this.exprList[exprIndex]));
            for(let i = 0; i < exprItemClone.items[itemIndex].params.length; i++){
                exprItemClone.paramName = exprItemClone.items[itemIndex].params[i].paramName;
                exprItemClone.items[itemIndex].paramValue = exprItemClone.items[itemIndex].params[i].paramValue;
                this.$store.dispatch('onFilterChange', {
                    filterItem: exprItemClone,
                    option: exprItemClone.items[itemIndex],
                    e: event,
					filterType: 'EXPR',
                })
            }
            if (this.$store.state.searchType === 'image') {
                // 切换筛选条件，不需要重新发起图片上传
                this.imageSearch(this.$store.state.searchParams.mainImage, false);
            } else if (this.$store.state.searchType === 'text') {
                this.getDataFromText(false);
            }
            // this.getDataFromText(false);
        },
        onSortChange({sortIndex, itemIndex=0, type, event}) {
            console.log("onSortChange");
            // 如果是倒序，item数组下标为 1
            if(type === 'desc') itemIndex=1;
            this.sortList[sortIndex].selectUIType = 'radio';
            this.handleOptions(this.sortList[sortIndex], itemIndex, event, 'SORT');
            this.initSearchResult();
            this.$store.commit('resetSearchState');
            let sortItemClone = JSON.parse(JSON.stringify(this.sortList[sortIndex]));
            sortItemClone.title = 'sort';
            //如果item不存在，初始化一个子级的paramValue
            if(!sortItemClone.items) sortItemClone.items = [[paramValue=> '']];
            //克隆一份排序，拿到最外层（父级）的传值paramValue
            sortItemClone.items[itemIndex].paramValue = sortItemClone.paramValue;
            console.log(sortItemClone)
            this.$store.dispatch('onFilterChange', {
                filterItem: sortItemClone,
                option: sortItemClone.items[itemIndex],
                e: event,
				filterType: 'SORT',
            })
            // 下拉框不需要这一步
            if(type !== 'select'){
                //克隆一份排序，拿到子级中的paramName
                let sortItemClone2 = JSON.parse(JSON.stringify(this.sortList[sortIndex]));
                sortItemClone2.title = 'sort';
                if(sortItemClone2.items && Array.isArray(sortItemClone2.items) && sortItemClone2.items.length > 0){
                    sortItemClone2.paramName = sortItemClone2.items[itemIndex].paramName;
                    this.$store.dispatch('onFilterChange', {
                        filterItem: sortItemClone2,
                        option: sortItemClone2.items[itemIndex],
                        e: event,
                        filterType: 'SORT',
                    })
                }
            }

            if (this.$store.state.searchType === 'image') {
                // 切换筛选条件，不需要重新发起图片上传
                this.imageSearch(this.$store.state.searchParams.mainImage, false);
            } else if (this.$store.state.searchType === 'text') {
                this.getDataFromText(false);
            }
        },
        async loadmore() {
            this.$store.commit('dumpAll', "发起分页请求loadmore前：");
			// $("#app").scrollTop($(".search-result-container").height() - $('.product-item').height() * 2);
            if (this.$store.state.firstSearchState === 'success') {
                console.log('触底事件触发');
                console.log("page", this.page);
                console.log("totalPage:", this.totalPage);
                // this.page++;
				console.log("resultInfo:",this.resultInfo);
                if ((this.totalPage !== undefined && this.page > this.totalPage) || (this.resultInfo.hasMore !== undefined && this.resultInfo.hasMore === false)) {
                    this.$store.commit('setSearchState', 'null');
                    return;
                }
                if (this.$store.state.searchType === 'image' && this.$store.state.imageUploadState === 'uploaded') {
                    await this.getDataFromImage(this.$store.state.searchParams.mainImage, true);
                } else if (this.$store.state.searchType === 'text') {
                    await this.getDataFromText(true);
                } else {
                    //TBD: 应该做异常处理
                    console.log("loadmore状态未知");
                }
            }
        },
        // reUpload：true 需要重新上传图片；false 不需要重新上传图片，可以复用当前的imageAddress
        async imageSearch(base64, reUpload = true) {
            // 如果当前站点接口配置不支持图片搜索，就直接提示用户并返回
            // let source = getSource(this.$store.state.source_id);
            if (SourceMap[this.$store.state.source_id].hasImageSearch == false) {
                this.$message.error(this.$t('message.no_search_image_api'));
                return;
            }
            // reUpload ? this.$store.commit('setFirstSearchState', 'none') : this.initSearchResult();
            // 如果需要重新上传图片，就重置全部搜索状态和搜索结果；否则只重置搜索结果，搜索参数和搜索状态不变
            // reUpload ? this.onClickClear() : this.initSearchResult();
            // this.$store.commit('setSearchType', 'image');

            this.$store.commit('dumpAll', "发起imageSearch前：");
            try {
                // 如果当前站点有单独的图品上传接口，并且图片当前=没有上传成功状态，就上传图片
                if (SourceMap[this.$store.state.source_id].hasUploadImage !== false && this.$store.state.imageUploadState !== 'uploaded') {
                    console.log('hasUploadImage');
                    let file = getFileFromBase64(base64);
                    let uploadImageResult = await this.$store.dispatch('uploadImage', file);
                    console.log(uploadImageResult);
                    //TBD：需要对上传图片异常（错误代码或者data=null，或者imageId=“0”等容错处理）
                    if (uploadImageResult.data && uploadImageResult.data.imageAddress && uploadImageResult.data.imageAddress !== '0') {
                        this.$store.commit('setImageAddress', uploadImageResult.data.imageAddress);
                        this.$store.commit('setImageUploadState', 'uploaded');
                    } else {
                        // throw e;
                        this.$store.commit('setSearchState', 'error');
                        this.$store.commit('setImageUploadState', 'error');
                    }
                    this.$store.commit('dumpAll', "发起uploadPic后：");
                }
                // 只有图片上传成功，或者原站没有单独的上传图片接口，才会继续调用searchGoods接口
                if (!SourceMap[this.$store.state.source_id].hasUploadImage || this.$store.state.imageUploadState == 'uploaded')
                    this.getDataFromImage(base64, false);

            } catch (e) {
                console.log(e);
                this.$store.commit('setSearchState', 'error');
                this.$store.commit('setImageUploadState', 'error');
                // throw e;
            }

        },
        /**
         * @description 根据图片搜索获取数据
         * @param {Boolean} loadmore 本次搜索是否为加载更多
         */
        async getDataFromImage(base64, loadmore) {
            // console.log(this);
            // this.$refs['product-list'].changeShowNoList(false);
            try {
                // let source = getSource(this.$store.state.source_id);
                // let imageAddr = null;
                // if (source.hasUploadImage == false && this.$store.state.imageUploadState !== 'uploaded') {
                //     imageAddr = base64;
                // } else {
                //     imageAddr = this.$store.state.searchParams.imageAddress;
                // }
                //TBD: 切换筛选发起搜索时没有传参
                let result = null;
                if (!loadmore && SourceMap[this.$store.state.source_id].hasImageSearchFirst === true) {
                    // result = await this.$store.dispatch('firstSearchPic', {
                    //     imageAddress: imageAddr,
                    //     yoloRegionSelected: this.$store.state.yoloCropRegion && this.$store.state.region,
                    //     yoloCropRegion: this.$store.state.yoloCropRegion || null,
                    //     region: this.$store.state.region || null,
                    //     cid: this.cid,
                    // });
                    result = await this.$store.dispatch('imageSearchFirst', {
                        searchPicParams: this.$store.state.searchParams,
						// TBD：是否需要传page，跟文字搜索统一？
                    });
                } else {
                    // result = await this.$store.dispatch('searchPic', {
                    //     imageAddress: imageAddr,
                    //     page: this.page,
                    //     yoloCropRegion: this.$store.state.yoloCropRegion,
                    //     region: this.$store.state.region,
                    //     cid: this.cid,
                    //     location: this.location,
                    //     tags: (this.tags && Array.isArray(this.tags)) ? this.tags.join(',') : null,
                    //     requestId: this.$store.state.session['requestId'],
                    //     sessionId: this.$store.state.session['sessionId'],
                    //     color: this.color
                    // });
                    result = await this.$store.dispatch('imageSearch', {
                        searchPicParams: this.$store.state.searchParams,
                        page: this.page,
                        requestId: this.$store.state.session['requestId'],
                        sessionId: this.$store.state.session['sessionId'],
                    });
                }
                if (!SourceMap[this.$store.state.source_id].hasUploadImage && !loadmore) {
                    if (result.data && result.data.searchImage && result.data.searchImage.imageAddress) {
                        this.$store.commit('setImageAddress', result.data.searchImage.imageAddress);
                        this.$store.commit('setImageUploadState', 'uploaded');
                    } else {
                        // throw e;
                        this.$store.commit('setImageUploadState', 'error');
                        this.$store.commit('setSearchState', 'error');
                        // if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
                    }
                }
                console.log(result);
                if (result && result.data && result.data.results) {
                    // 如果是首次搜索，保存接口返回的商品分类、筛选和排序条件
                    if (!loadmore && result.data.results.length > 0) {	//this.$store.state.firstSearchState == 'none'
                        if (JSON.stringify(this.categoryList) == '{}') {
                            this.categoryList = result.data.categoryList;
                        }
                        if (this.filterList == undefined || this.filterList.length <= 0) {
                            this.filterList = result.data.filterList;
                        }
                        if(this.exprList == undefined || this.exprList.length <= 0) {
                            this.exprList = result.data.exprList;
                            this.handleExprList();
                        }
                        if(this.sortList == undefined || this.sortList.length <= 0) {
                            this.sortList = result.data.sortList;
                        }
                        // this.categoryList = result.data.categoryList || null;
                        // this.filterList = result.data.filterList || null;
                        // this.sortList = result.data.sortList || null;
                        if (result.data && result.data.resultInfo) {	// && result.data.resultInfo.totalPages) {
                            // this.resultInfo = result.data.resultInfo;
                            this.totalPage = result.data.resultInfo.totalPages;	// || 1;
                        }
                        // TBD: 此处只判断了yoloCropRegion不为NULL，没有判断result.data.searchImage.region
                        if (result.data.searchImage && (result.data.searchImage.yoloCropRegion)) {
                            this.$store.commit('setYoloCropRegion', result.data.searchImage.yoloCropRegion);
                            // this.$store.commit('setRegion', result.data.searchImage.region);
                            let regionList = result.data.searchImage.yoloCropRegion.split(';');
                            let r = await getBase64FromCropImage(this.$store.state.searchParams.mainImage, regionList);
                            this.$refs['image_operation'].setLocalImageList(r);
                        }
                        if (result.data && result.data.resultInfo && (result.data.resultInfo.sessionId || result.data.resultInfo.requestId)) {
                            this.$store.commit('setSessionId', result.data.resultInfo.sessionId);
                            this.$store.commit('setRequestId', result.data.resultInfo.requestId);
                        }
                    }

                    this.resultInfo = result.data.resultInfo || null;
                    // this.totalPage = this.resultInfo.totalPages || 1;
                    if (result.data.results && result.data.results.length > 0) {
                        //注释掉前端处理http 的逻辑
                        // handleResponse(result);
                        if (!loadmore) {
                            this.$store.commit('setFirstSearchState', 'success')
                        }
                        this.$store.commit('setSearchState', 'success');
                        // 只要搜索成功，页码就++（原站如果有单独的首次搜索接口，分页请求页码从2开始）
                        // if(loadmore || (!loadmore&&source.hasImageSearchFirst === false))
                        this.page++;
                        this.$store.commit('dumpAll', "发起getDataFromImage后：");
                        return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                } else {
                    this.$message.error(this.$t('message.search_result_from_image_error'));
                    this.$store.commit('setSearchState', 'error');
                    if (!loadmore) {
                        this.$store.commit('setFirstSearchState', 'error')
                    }
                    ;
                }
                this.results = loadmore ? [...this.results, ...[]] : [];
            } catch (e) {
                // let source = getSource(this.$store.state.source_id);
                if (!SourceMap[this.$store.state.source_id].hasUploadImage && !loadmore) { this.$store.commit('setImageUploadState', 'error') }
                this.$store.commit('setSearchState', 'error');
                if (!loadmore) { this.$store.commit('setFirstSearchState', 'error') }
                this.$message.error(this.$t('message.search_result_from_image_error') + e);
            }
            this.$store.commit('dumpAll', "发起getDataFromImage后：");

        },
        /**
         * @description 根据文字搜索获取数据
         * @param {Boolean} loadmore 本次搜索是否为加载更多
         */
        async getDataFromText(loadmore) {
            this.$store.commit('dumpAll', "发起getDataFromText前：");
            try {
                console.log(this.$store.state.searchParams);
                // let source = getSource(this.$store.state.source_id);
                let result = null;

                if (!loadmore && SourceMap[this.$store.state.source_id].hasKeywordSearchFirst === true) {
                    result = await this.$store.dispatch('keywordSearchFirst', {
                        searchTextParams: this.$store.state.searchParams,
                        page: this.page
                    });
                } else {
                    result = await this.$store.dispatch('keywordSearch', {
                        searchTextParams: this.$store.state.searchParams,
                        page: this.page,
                        requestId: this.$store.state.session['requestId'],
                        sessionId: this.$store.state.session['sessionId']
                    });
                }

                console.log(result);
                if (result && result.data && result.data.results) {
                    // 如果是首次搜索，保存接口返回的商品分类、筛选和排序条件
                    if (!loadmore && result.data.results.length > 0) {	//this.$store.state.firstSearchState == 'none'
                        if (JSON.stringify(this.categoryList) == '{}') {
                            this.categoryList = result.data.categoryList;
                        }
                        if (this.filterList == undefined || this.filterList.length <= 0) {
                            this.filterList = result.data.filterList;
                        }
                        if(this.exprList == undefined || this.exprList.length <= 0) {
                            this.exprList = result.data.exprList;
                            this.handleExprList();
                        }
                        if(this.sortList == undefined || this.sortList.length <= 0) {
                            this.sortList = result.data.sortList;
                        }
                        // this.categoryList = result.data.categoryList || null;
                        // this.filterList = result.data.filterList || null;
                        // this.sortList = result.data.sortList || null;
                        if (result.data && result.data.resultInfo) {// && result.data.resultInfo.totalPages) {
                            // this.resultInfo = result.data.resultInfo;
                            this.totalPage = result.data.resultInfo.totalPages;	// || 1;
                            console.log('``````````````````totalPage:', this.totalPage);
                        }

                        if (result.data && result.data.resultInfo && (result.data.resultInfo.sessionId || result.data.resultInfo.requestId)) {
                            this.$store.commit('setSessionId', result.data.resultInfo.sessionId);
                            this.$store.commit('setRequestId', result.data.resultInfo.requestId);
                        }
                    }
                    this.resultInfo = result.data.resultInfo || null;
                    // if(this.resultInfo && this.resultInfo.totalResults && this.resultInfo.pageSize) {
                    //     this.totalPage = this.resultInfo.totalPages
                    // }
                    if (result.data.results && result.data.results.length > 0) {
                        //注释掉前端处理http 的逻辑
                        // handleResponse(result);
                        if (!loadmore) {this.$store.commit('setFirstSearchState', 'success')}
                        this.$store.commit('setSearchState', 'success');
                        // 只要搜索成功，页码就++（原站如果有单独的首次搜索接口，分页请求页码从2开始）
                        // if(loadmore || (!loadmore&&source.hasKeywordSearchFirst === false))
                        this.page++;
                        this.$store.commit('dumpAll', "发起getDataFromText后：");
                        return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                    } else {
                        this.$store.commit('setSearchState', 'null');
                    }
                } else {
                    this.$message.error(this.$t('message.search_result_from_text_error'));
                    this.$store.commit('setSearchState', 'error');
                    if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')}
                }
                this.results = loadmore ? [...this.results, ...[]] : [];
            } catch (error) {
                // let source = getSource(this.$store.state.source_id);
                // if(!source.hasUploadImage&&!loadmore) {this.$store.commit('setImageUploadState', 'error')};
                this.$store.commit('setSearchState', 'error');
                if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')}
                this.$message.error(this.$t('message.search_result_from_image_error') + e);
            }
            this.$store.commit('dumpAll', "发起getDataFromText后：");
        },
        openFeedback() {
            window.$openFeedback();
        },
        onLanguagechange() {
            this.$refs['language_popup'].open();
        },
        onChangeCollapse(state) {
            if(!state) {
                this.collapseScrollTop = $(window).scrollTop();
            }else {
                $(window).scrollTop(this.collapseScrollTop);
            }
            this.isCollapseFilterGroup = state;
        }
    }
}
</script>

<style scoped lang="scss">
.search-result-container {
    //margin-bottom: 300px;
    //padding-right: 40px;
    .container {
        .main-container {
            margin: auto;
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                margin-bottom: 10px;
                border-bottom: 1px solid $line_color;
                .logo {
                    img {
                        width: 50px;
                    }
                }
                .right-wrap {
                    display: flex;
                    align-items: center;
                    .right-wrap_btn ~ .right-wrap_btn {
                        margin-left: 20px;
                    }
                    .right-wrap_btn {
                        cursor: pointer;
                        &:hover {
                            color: $hover_color;
                        }
                    }
                    .tags {
                        span {

                        }
                        i {
                            margin: 0 5px;
                            font-style: normal;
                        }
                    }
                }
            }
        }
    }
}

.filter-container {
    border-radius: 5px;
    background-color: #FFF;
    padding: 20px 20px 10px 20px;
}

.collapse {
    margin-top: 20px;
    span {
        cursor: pointer;
        color: $link_color;
        font-size: $secondary_text_size;
    }
}
</style>
