<template>
	<div class="search-result-container scrollable">
		<source-list @onSourceItemClick="onSourceItemClick" v-show="(results && results.length > 0) || (filterList && filterList.length > 0) || (categoryList && categoryList.items && categoryList.items.length > 0)"></source-list>
		<div class="container">
			<div class="main-container">
				<text-search ref="text_search" @onClickSearchButton="onClickSearchButton" @onSelectImage="onSelectImage"></text-search>
				<!--  图片处理区域  -->
				<image-operation ref="image_operation" @onClickLocalItem="onClickLocalItem" @onClickMainImage="onClickMainImage" @onClickClear="onClickClear"></image-operation>
				<div class="filter-container mt40" v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0)">
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
                <support-source-list v-show="!((results && results.length > 0) || (filterList && filterList.length > 0) || (categoryList && categoryList.items && categoryList.items.length > 0))"></support-source-list>
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
    import {aliexpress, yiwugo} from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import publicData from "../mixins/public.js";
    import {getFileFromBase64, handleResponse} from "@/assets/js/utils.js";

	export default {
		name: "view-yiwugo",
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
					index_area: 'Products',
				}
			}
		},
        mounted() {
            // 加载更多
            bus.$on('loadmore', () => {
                console.log('触底事件触发');
                this.page++;
                let totalPage = 1;
                if(this.resultInfo) {
                    totalPage = Math.ceil(this.resultInfo.totalResults / this.resultInfo.pageSize);
                }
                if(this.page > totalPage) {
                    this.page = totalPage;
                    return;
                };
                this.$store.state.searchType === 'image' ? this.getDataFromImage(true) : this.getDataFromText(true);
            })

            if(window.localStorage.getItem('upload-file')) {
                this.onSelectImage();
            }else if(this.$store.state.mainImage) {
                this.imageSearch(this.$store.state.mainImage);
            }else if(this.$store.state.searchText) {
                this.onClickSearchButton({search_text: this.$store.state.searchText, index_area: 'Products'});
            }
        },
		methods: {
			onClassChange({id,name}) {
				this.cid = name;
				this.page = 1;
				this.searchTextParams.category = name;
                this.$store.state.searchType === 'image' ? this.getDataFromImage(false) : this.getDataFromText(false) ;
			},
			onClickSearchButton(params) {
                this.$store.commit('setSearchType', 'text');
                this.$store.commit('setSearchText', params.search_text);
				this.onClickClear();
				this.searchTextParams = {
					search_text: params.search_text,
					index_area: params.index_area
				}
				this.getDataFromText(false);
			},
			onFilterChange({e, o, title}) {
				switch (title) {
					case 'subMarketList':
						e ? this.searchTextParams.sub_market = o.id : delete this.searchTextParams.sub_market;
						break;
					default:
						break;
				}
				this.getDataFromText(false);
			},
            async imageSearch(base64) {
                try {
                    let file = getFileFromBase64(base64);
                    let uploadImageResult = await yiwugo.uploadPic(file);
                    this.imageAddress = uploadImageResult.data.url;
                    this.getDataFromImage(false);
                }catch (e) {
                    console.log(e);
                    throw e;
                }
            },
			async getDataFromImage(loadmore) {
				// this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = await yiwugo.searchGoodsByPic(this.imageAddress, this.page);
					if(result && result.data) {
                        this.categoryList = result.data.categoryList ? result.data.categoryList : null;
                        this.resultInfo = result.data.resultInfo;
                        this.totalPage = this.resultInfo.totalPages || 1;
                        if (result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                        } else {
                            // this.$refs['product-list'].changeShowNoList(true);
                        }
                        this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                    }else {
                        this.$message.error(this.$t('message.get_result_error'));
                    }
				} catch (e) {
					this.$message.error(this.$t('message.serach_result_from_image_error') + e);
				}
			},
			async getDataFromText(loadmore) {
				try {
					let result = null;
					console.log(this.searchTextParams);
					if(this.searchTextParams.index_area === 'Products') {
						result = await yiwugo.searchGoodsByText({ ...this.searchTextParams,page: this.page });
					}else {
						result = await yiwugo.searchShopsByText({...this.searchTextParams, page: this.page});
					}
                    if(result && result.data) {
                        this.categoryList = result.data.categoryList;
                        this.filterList = result.data.filterList;
                        this.resultInfo = result.data.resultInfo;
                        if(result.data.results && result.data.results.length > 0) {
                            handleResponse(result);
                        }else {
                            // this.$refs['product-list'].changeShowNoList(true);
                        }
                        this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
                    }else {
                        this.$message.error(this.$t('message.get_result_error'));
                    }
				} catch (error) {
					console.log(error);
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
