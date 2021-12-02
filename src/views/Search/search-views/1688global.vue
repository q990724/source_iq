<template>
	<div class="search-result-container scrollable">
		<div class="container">
			<div class="main-container">
				<text-search ref="text_search" @onClickSearchButton="onClickSearchButton" @onSelectImage="onSelectImage"></text-search>
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
    import {_1688global} from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import {getFileFromBase64, handleResponse} from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
	export default {
		name: "view-1688global",
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
                region: '',
				searchTextParams: {
					keyword: '',
					type: 1
				},
                location: '',
                tags: ''
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
                this.page = 1;
                if(this.$store.state.searchType === 'image') {
                    this.imageSearch(this.originalImageUrl);
                }else {
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
			onFilterChange({e, o, title}){
				console.log(e, o, title);
                switch (title) {
                    case '地区':
                        this.location = e ? o.name : '';
                        break;
                    case '属性':
                        if(e) {
                            if(!Array.isArray(this.tags)) this.tags = [];
                            this.tags.push(o.name);
                        }else {
                            for (let i = 0; i < this.tags.length; i++) {
                                if(this.tags[i] == o.name) {
                                    this.tags.splice(i, 1);
                                }
                            }
                        }
                        break;
                }
                this.getDataFromImage(false);
			},
            async loadmore() {
                if(this.$store.state.firstSearchState === 'success') {
                    let totalPage = 1;
                    if(this.resultInfo) {
                        totalPage = Math.ceil(this.resultInfo.totalResults / this.resultInfo.pageSize);
                    }
                    if(this.page > totalPage) {
                        this.page = totalPage;
                        return;
                    };
                    this.page++;
                    console.log('触底事件触发, 当前页码', this.page);
                    if(this.$store.state.searchType === 'image' && this.$store.state.imageUploadState === 'uploaded') {
                        this.getDataFromImage(true);
                    }else {
                        let res = await this.getDataFromText();
                        this.results = [...this.results, ...res];
                    }
                }
            },
            async imageSearch(base64) {
                this.$store.commit('setSearchType', 'image');
                try {
                    this.initSearchResult();
                    let file = getFileFromBase64(base64);
                    this.$store.commit('setImageUploadState', 'none');
                    let uploadImageResult = await _1688global.uploadPic(file);
                    this.imageAddress = uploadImageResult.data.imgUrl;
                    this.$store.commit('setImageUploadState', 'uploaded');
                    this.getDataFromImage(false);
                }catch (e) {
                    this.$store.commit('setSearchState', 'error');
                    this.$store.commit('setImageUploadState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_image_error'));
                    throw e;
                }
            },
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
			async getDataFromImage(loadmore) {
				try {
					let result = await _1688global.searchGoodsByPic({
                        imgUrl: this.imageAddress,
                        pageNo: this.page,
                        categoryId: this.cid,
                        region: this.region,
                        location: this.location,
                        tags: (this.tags && Array.isArray(this.tags)) ? this.tags.join(',') : null
                    });
                    this.$store.commit('setSearchState', 'success');
					if(result && result.data) {
                        this.filterList = result.data.filterList;
                        this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                        this.resultInfo = result.data.resultInfo;
                        this.region = result.data.searchImage ? result.data.searchImage.region : undefined;
                        this.totalPage = this.resultInfo.totalPages || 1;
                        this.sourceResult = result.sourceResult;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            this.$store.commit('setFirstSearchState', 'success');
                        }else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_image_error'));
                        this.$store.commit('setFirstSearchState', 'error');
                        this.$store.commit('setSearchState', 'error');
                    }
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
				} catch (e) {
                    this.$store.commit('setFirstSearchState', 'error');
                    this.$store.commit('setSearchState', 'error');
					this.$message.error(this.$t('message.serach_result_from_image_error'));
				}
			},
			async getDataFromText() {
				try {
                    let sessionId = null;
                    if(this.sourceResult && this.sourceResult.data && this.sourceResult.data.window && this.sourceResult.data.window.data && this.sourceResult.data.window.data.pageMessage) {
                        sessionId = this.sourceResult.data.window.data.pageMessage.sessionId;
                    }
                    let result = await _1688global.searchGoodsKj({
                        keywords: this.searchTextParams.keyword, beginPage: this.page, sessionId: sessionId
                    });
                    this.$store.commit('setSearchState', 'success');
                    if(result && result.data) {
                        this.resultInfo = result.data.resultInfo;
                        this.sourceResult = result.sourceResult;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            return result.data.results;
                        }else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_text_error'));
                        this.$store.commit('setSearchState', 'error');
                        return [];
                    }
				} catch (error) {
                    this.$store.commit('setSearchState', 'error');
                    this.$message.error(this.$t('message.serach_result_from_text_error'));
					throw error;
				}
			},
            async getDataFromTextFirst() {
                try {
                    let result = await _1688global.searchGoodsFirstKj(this.searchTextParams.keyword);
                    this.$store.commit('setSearchState', 'success');
                    if(result && result.data) {
                        this.categoryList = result.data.categoryList || null;
                        this.filterList = result.data.filterList || null;
                        this.resultInfo = result.data.resultInfo;
                        this.sourceResult = result.sourceResult;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            this.$store.commit('setFirstSearchState', 'success');
                            return result.data.results;
                        }else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_text_error'));
                        this.$store.commit('setFirstSearchState', 'error');
                        this.$store.commit('setSearchState', 'error');
                    }
                    return [];
                }catch (e) {
                    console.log(e);
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
