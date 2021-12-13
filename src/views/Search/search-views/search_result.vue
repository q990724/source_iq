<template>
    <div class="search-result-container scrollable">
        <div class="container">
            <div class="main-container">
                <text-search ref="text_search" @onClickSearchButton="onClickSearchButton" @onSelectImage="onSelectImage"></text-search>
                <!--  图片处理区域  -->
                <image-operation ref="image_operation" @onClickLocalItem="onClickLocalItem" @onClickMainImage="onClickMainImage" @onClickClear="onClickClear"></image-operation>
                <!--  筛选区域  -->
				<!-- v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0) || $store.state.searchState !== 'none' || $store.state.mainImage || $store.state.searchText" -->
                <div class="filter-container mt40">
					<!-- v-show="$store.state.searchState !== 'none' || $store.state.mainImage || $store.state.searchText" -->
					<source-list @onSourceItemClick="onSourceItemClick"></source-list>
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
<!--                <support-source-list v-show="$store.state.searchState === 'none' && !$store.state.mainImage && !$store.state.searchText"></support-source-list> -->
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
    import bus from "@/assets/js/bus";
    import { getBase64FromCropImage, handleResponse, getFileFromBase64 } from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
    import { getSource } from "@/assets/js/source_map.js";

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
            console.log('search_result.vue mounted');
			console.log(this.$store.state.source_id);
            // 加载更多
            bus.$on('loadmore', this.loadmore.bind(this))
			console.log(window.localStorage.getItem('upload-file'));
            if(window.localStorage.getItem('upload-file')) {
				// TBD：此处有2种可能：1）有插件或本地上传图片，但没等content图片投递完成；2）没有插件或本地上传图片
				console.log("mounted->onSelectImage");
                this.onSelectImage();
            }else if(this.$store.state.mainImage && this.$store.state.searchType === 'image') {
				// //TBD：新上传图片（插件或本地文件）发起新搜索，清空之前所有搜索参数和搜索状态，暂时不支持图片+上次搜索参数组合
				// this.onClickClear();
				// this.$store.commit('setSearchType', 'image');
				console.log("mounted->imageSearch");
                this.imageSearch(this.$store.state.mainImage, true);
            }else if(this.$store.state.searchText && this.$store.state.searchType === 'text') {
				console.log("mounted->onClickSearchButton");
                this.onClickSearchButton({search_text: this.$store.state.searchText});
            }
        },
        methods: {
            onScroll(e) {
                console.log(e);
            },
            /**
             * @description 切换商品分类时触发
             */
            onClassChange({e, options, item_index}) {
                this.handleOptions(e, this.categoryList,item_index);
                this.$store.commit('resetSearchState');
                this.cid = options.paramValue;
                this.searchTextParams.category = options.paramValue;
                this.page = 1;
                if(this.$store.state.searchType === 'image') {
					// 切换商品分类，不需要重新发起图片上传
					this.imageSearch(this.$store.state.mainImage, false);
                }else if(this.$store.state.searchType === 'text') {
                    this.getDataFromText(false);
                }
            },
            /**
             * @description 点击文字搜索时触发
             * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
             */
            onClickSearchButton(params) {
				this.onClickClear();	
                this.$store.commit('setSearchType', 'text');
                this.$store.commit('setSearchText', params.search_text);
                this.searchTextParams = {
                    search_text: params.search_text,
                }
                this.getDataFromText(false);
            },

            onFilterChange({e, fil_index, item_index}) {
                this.handleOptions(e, this.filterList[fil_index], item_index);
                this.initSearchResult();
                // this.clearSearchParams();
				this.$store.commit('resetSearchState');
                this.$store.dispatch('filterChange',{e:e, self:this, filterItem:this.filterList[fil_index], options:this.filterList[fil_index].items[item_index]})
                if(this.$store.state.searchType === 'image') {
					// 切换筛选条件，不需要重新发起图片上传
                    this.imageSearch(this.$store.state.mainImage, false);
                }else if(this.$store.state.searchType === 'text') {
                    this.getDataFromText(false);
                }
            },
            async loadmore() {
				this.$store.commit('dumpAll', "发起分页请求loadmore前：");
                if(this.$store.state.firstSearchState === 'success') {
                    console.log('触底事件触发');
					console.log("page", this.page);
					console.log("totalPage:", this.totalPage);
					// this.page++;
                    if(this.page > this.totalPage) {
						this.$store.commit('setSearchState', 'null');
						return;						  
                    }
                    if(this.$store.state.searchType === 'image' && this.$store.state.imageUploadState === 'uploaded') {
                        this.getDataFromImage(this.$store.state.mainImage, true);
                    }else if(this.$store.state.searchType === 'text') {
                        this.getDataFromText(true);
                    }else {
                        //TBD: 应该做异常处理
                        console.log("loadmore状态未知");
                    }
                }
            },
			// reUpload：true 需要重新上传图片；false 不需要重新上传图片，可以复用当前的imageAddress
            async imageSearch(base64, reUpload = true) {
				// 如果当前站点接口配置不支持图片搜索，就直接提示用户并返回
                let source = getSource(this.$store.state.source_id);
                if (source.hasSearchPic == false) {
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
					if (source.hasUpload !== false && this.$store.state.imageUploadState !== 'uploaded') {
						console.log('hasUpload');
						let file = getFileFromBase64(base64);
						let uploadImageResult = await this.$store.dispatch('uploadPic', file);
						console.log(uploadImageResult);
						//TBD：需要对上传图片异常（错误代码或者data=null，或者imageId=“0”等容错处理）
						if(uploadImageResult.data && uploadImageResult.data.imageAddress && uploadImageResult.data.imageAddress !== '0') {
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
					if (!source.hasUpload || this.$store.state.imageUploadState == 'uploaded')
						this.getDataFromImage(base64,false);
					
				} catch (e) {
					console.log(e);
					this.$store.commit('setSearchState', 'error');
					this.$store.commit('setImageUploadState', 'error');
					throw e;
				}

            },
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
            async getDataFromImage(base64,loadmore) {
				// console.log(this);
                // this.$refs['product-list'].changeShowNoList(false);
                try {
					let source = getSource(this.$store.state.source_id);
					let imageAddr = null;
					if (source.hasUpload == false && this.$store.state.imageUploadState !== 'uploaded') {
						imageAddr = base64;
					} else {
						imageAddr = this.$store.state.imageAddress;
					}
					//TBD: 切换筛选发起搜索时没有传参
                    let result = null;
                    if(!loadmore && source.hasFirstSearchPic === true){
                        result = await this.$store.dispatch('firstSearchPic',{imageAddress: imageAddr, yoloRegionSelected: this.yoloCropRegion && this.region, yoloCropRegion: this.yoloCropRegion || null, region: this.region || null, cid: this.cid,});
                    }else{
                        result = await this.$store.dispatch('searchPic',{imageAddress: imageAddr, page: this.page, yoloCropRegion: this.yoloCropRegion, region: this.region, cid: this.cid, location: this.location, tags: (this.tags && Array.isArray(this.tags)) ? this.tags.join(',') : null, requestId: this.requestId, sessionId: this.sessionId, color: this.color});
                    }
                    if (!source.hasUpload&&!loadmore) {
						if (result.data && result.data.searchImage && result.data.searchImage.imageAddress) {
							this.$store.commit('setImageAddress',result.data.searchImage.imageAddress);
							this.$store.commit('setImageUploadState', 'uploaded');
						} else {
							// throw e;
							this.$store.commit('setImageUploadState', 'error');
							this.$store.commit('setSearchState', 'error');
							// if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
						}
					}
                    console.log(result);
                    if(result && result.data) {
						// 如果是首次搜索，保存接口返回的商品分类、筛选和排序条件
						if(!loadmore) {	//this.$store.state.firstSearchState == 'none'
							if(JSON.stringify(this.categoryList) == '{}') {
								this.categoryList = result.data.categoryList;
							};
							if(this.filterList == undefined || this.filterList.length <= 0) {
								this.filterList = result.data.filterList;
							};
							// this.categoryList = result.data.categoryList || null;
							// this.filterList = result.data.filterList || null;
							// this.sortList = result.data.sortList || null;
							if(result.data && result.data.resultInfo && result.data.resultInfo.totalPages) {
								this.resultInfo = result.data.resultInfo;
								this.totalPage = this.resultInfo.totalPages || 1;
							}
                            if (result.data.searchImage && result.data.searchImage.yoloCropRegion) {
                                this.yoloCropRegion = result.data.searchImage.yoloCropRegion;
                                this.region = result.data.searchImage.region;
                                let regionList = result.data.searchImage.yoloCropRegion.split(';');
                                let r = await getBase64FromCropImage(this.$store.state.mainImage, regionList);
                                this.$refs['image_operation'].setLocalImageList(r);
                            }
                            if(result.sourceResult && result.sourceResult.data && result.sourceResult.data.window && result.sourceResult.data.window.data && result.sourceResult.data.window.data.pageMessage && result.sourceResult.data.window.data.pageConfigData && result.sourceResult.data.window.data.pageConfigData.data) {
                                this.sessionId = result.sourceResult.data.window.data.pageMessage.sessionId;
                                this.requestId = result.sourceResult.data.window.data.pageConfigData.data.requestId;
                                console.log(this.sessionId)
                                console.log(this.requestId)
                            }
						}

                        // this.resultInfo = result.data.resultInfo;
                        // this.totalPage = this.resultInfo.totalPages || 1;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            if(!loadmore) {this.$store.commit('setFirstSearchState', 'success')}
							this.$store.commit('setSearchState', 'success');
							// 只要搜索成功，页码就++（原站如果有单独的首次搜索接口，分页请求页码从2开始）
							// if(loadmore || (!loadmore&&source.hasFirstSearchPic === false)) 
							this.page++;
							this.$store.commit('dumpAll', "发起getDataFromImage后：");
                            return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                        } else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_image_error'));
                        this.$store.commit('setSearchState', 'error');
                        if(!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
                    }
                    this.results = loadmore ? [...this.results, ...[]] : [];
                } catch (e) {
                    let source = getSource(this.$store.state.source_id);
                    if(!source.hasUpload&&!loadmore) {this.$store.commit('setImageUploadState', 'error')};
                    this.$store.commit('setSearchState', 'error');
					if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
                    this.$message.error(this.$t('message.serach_result_from_image_error') + e);
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
                    console.log(this.searchTextParams);
					let source = getSource(this.$store.state.source_id);
                    let result = null;

                    if(!loadmore && source.hasFirstSearchText === true){
                        result = await this.$store.dispatch('firstSearchText', { searchTextParams: this.searchTextParams, page: this.page });
                    }else{
                        result = await this.$store.dispatch('searchText', { searchTextParams: this.searchTextParams, page: this.page, requestId: this.requestId, sessionId: this.sessionId});
                    }
					
					console.log(result);
                    if(result && result.data) {
						// 如果是首次搜索，保存接口返回的商品分类、筛选和排序条件
						if(!loadmore) {	//this.$store.state.firstSearchState == 'none'
							if(JSON.stringify(this.categoryList) == '{}') {
								this.categoryList = result.data.categoryList;
							};
							if(this.filterList == undefined || this.filterList.length <= 0) {
								this.filterList = result.data.filterList;
							};
							// this.categoryList = result.data.categoryList || null;
							// this.filterList = result.data.filterList || null;
							// this.sortList = result.data.sortList || null;
							if(result.data && result.data.resultInfo && result.data.resultInfo.totalPages) {
								this.resultInfo = result.data.resultInfo;
								this.totalPage = this.resultInfo.totalPages || 1;
							}
							
                            if(result.sourceResult && result.sourceResult.data && result.sourceResult.data.window && result.sourceResult.data.window.data && result.sourceResult.data.window.data.pageMessage && result.sourceResult.data.window.data.requestData && result.sourceResult.data.window.data.requestData.data && result.sourceResult.data.window.data.requestData.data.params) {
                                this.sessionId = result.sourceResult.data.window.data.pageMessage.sessionId;
                                this.requestId = result.sourceResult.data.window.data.requestData.data.params.requestId;
                                console.log(this.sessionId)
                                console.log(this.requestId)
                            }
						}
                        // this.resultInfo = result.data.resultInfo || null;
                        // if(this.resultInfo && this.resultInfo.totalResults && this.resultInfo.pageSize) {
                        //     this.totalPage = this.resultInfo.totalPages
                        // }
                        if(result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            if(!loadmore) {this.$store.commit('setFirstSearchState', 'success')};
							this.$store.commit('setSearchState', 'success');
							// 只要搜索成功，页码就++（原站如果有单独的首次搜索接口，分页请求页码从2开始）
							// if(loadmore || (!loadmore&&source.hasFirstSearchText === false)) 
							this.page++;
							this.$store.commit('dumpAll', "发起getDataFromText后：");
                            return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                        }else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_text_error'));
                        this.$store.commit('setSearchState', 'error');
						if(!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
                    }
                    this.results = loadmore ? [...this.results, ...[]] : [];
                } catch (error) {
					// let source = getSource(this.$store.state.source_id);
					// if(!source.hasUpload&&!loadmore) {this.$store.commit('setImageUploadState', 'error')};
					this.$store.commit('setSearchState', 'error');
					if (!loadmore) {this.$store.commit('setFirstSearchState', 'error')};
					this.$message.error(this.$t('message.serach_result_from_image_error') + e);
                }
				this.$store.commit('dumpAll', "发起getDataFromText后：");
            },

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
