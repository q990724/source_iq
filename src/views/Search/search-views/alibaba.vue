<template>
	<div class="search-result-container scrollable">
		<div class="container" >
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
	import { alibaba } from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import { handleResponse, getFileFromBase64 } from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
	export default {
		name: "view-alibaba",
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
					index_area: '',
				}
			}
		},
        mounted() {
            console.log('view mounted');
            // 加载更多
            bus.$on('loadmore', this.loadmore.bind(this));
            if(window.localStorage.getItem('upload-file')) {
                this.onSelectImage();
            }else if(this.$store.state.mainImage && this.$store.state.searchType === 'image') {
                this.imageSearch(this.$store.state.mainImage);
            }else if(this.$store.state.searchText && this.$store.state.searchType === 'text') {
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
			onClassChange({id}) {
				this.cid = id;
				this.searchTextParams.Category = id;
				this.page = 1;
                if(this.$store.state.searchType === 'image') {
					this.imageSearch(this.$store.state.mainImage);
                    // this.imageSearch(this.originalImageUrl);
                }else if(this.$store.state.searchType === 'text'){
                    this.getDataFromText(false);
                }
			},
			/**
			 * @description 点击文字搜索时触发
			 * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
			 */
			onClickSearchButton(params) {
				this.initSearchResult();
                this.$store.commit('setSearchType', 'text');
                this.$store.commit('setSearchText', params.search_text);
				this.searchTextParams = {
					search_text: params.search_text,
					index_area: params.index_area
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
					case 'Shipping': 
						handleCheckBoxParams('productTag', ";");
						break;
					case 'Sample Order':
						this.searchTextParams.param_order="IFS-1";
						this.searchTextParams.freeSample = o.id;
						break;
					case 'Management Certification': 
						handleCheckBoxParams('companyAuthTag');
						break;
					case 'Product Certification':
						handleCheckBoxParams('productAuthTag');
						break;
					case 'Supplier Country/Region':
						handleCheckBoxParams('Country');
						break;
					case 'Past Export Countries':
						handleCheckBoxParams('exportCountry');
						break;
					case 'Supplier Types':
						e ? this.searchTextParams[o.param] = o.id : delete this.searchTextParams[o.param];
						break;
					default:
						break;
				}
				this.getDataFromText(false);
			},
            async loadmore() {
			    if(this.$store.state.firstSearchState === 'success') {
                    console.log('触底事件触发');
					//TBD: 分页到底的逻辑还是写死的，应该统一改成按照总页数判断
                    if(this.page >= 5) {
                        this.page = 5;
                        return;
                    }
                    this.page++;
                    if(this.$store.state.searchType === 'image' && this.$store.state.imageUploadState === 'uploaded') {
                        this.getDataFromImage(true);
                    }else if(this.$store.state.searchType === 'text') {
                        this.getDataFromText(true);
                    }else {
						//TBD: 应该做异常处理
						console.log("loadmore状态未知");
					}
                }
            },
            async imageSearch(base64) {
                this.$store.commit('setSearchType', 'image');
                try {
                    this.initSearchResult();
                    let file = getFileFromBase64(base64);
                    let uploadImageResult = await alibaba.uploadPic(file);
                    this.imageAddress = uploadImageResult.data.imageAddress;
                    this.$store.commit('setImageUploadState', 'uploaded');
                    this.getDataFromImage(false);
                }catch (e) {
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
			async getDataFromImage(loadmore) {
				// this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = await alibaba.searchGoodsByPic(this.imageAddress, this.page, this.cid);
					this.$store.commit('setSearchState', 'success');
					if(result && result.data) {
                        this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                        this.resultInfo = result.data.resultInfo;
                        this.totalPage = this.resultInfo.totalPages || 1;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            this.$store.commit('setFirstSearchState', 'success');
                            return this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                        } else {
                            this.$store.commit('setSearchState', 'null');
                        }
                    }else {
                        this.$message.error(this.$t('message.serach_result_from_image_error'));
                        this.$store.commit('setSearchState', 'error');
                        this.$store.commit('setFirstSearchState', 'error');
                    }
                    this.results = loadmore ? [...this.results, ...[]] : [];
				} catch (e) {
                    this.$store.commit('setSearchState', 'error');
                    this.$store.commit('setFirstSearchState', 'error');
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
					let result = await alibaba.searchGoodsByText({ ...this.searchTextParams,page: this.page });
                    this.$store.commit('setSearchState', 'success');
                    if(result && result.data) {
                        this.categoryList = result.data.categoryList || null;
                        this.filterList = result.data.filterList || null;
                        this.resultInfo = result.data.resultInfo || null;
                        if(result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                            this.$store.commit('setFirstSearchState', 'success');
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
