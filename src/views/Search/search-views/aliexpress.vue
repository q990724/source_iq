<template>
	<div class="search-result-container scrollable">
		<source-list @onSourceItemClick="onSourceItemClick"></source-list>
		<div class="container">
			<div class="main-container">
				<text-search @onClickSearchButton="onClickSearchButton" @onImageUploadedSuccess="onImageUploadedSuccess" @onImageUploadedError="onImageUploadedError"></text-search>
				<!--  图片处理区域  -->
				<image-operation ref="image_operation" :original_image_url="originalImageUrl"
					@onClickLocalItem="onClickLocalItem"
					@onClickMainImage="onClickMainImage" @onClickClear="onClickClear">
				</image-operation>
				<!--  筛选区域  -->
				<div class="filter-container mt40" v-if="(categoryList && categoryList.items) || (filterList && filterList.length > 0)">
					<!-- 商品分类 -->
					<product-class :class_list="categoryList" @onClassChange="onClassChange"></product-class>
					<!--  筛选区域  -->
					<group-filter :filterList="filterList" @onFilterChange="onFilterChange"></group-filter>
					<!-- 价格区间 -->
					<!-- 地区 -->
				</div>
				<!--商品高级筛选-->
				<!--<high-filtration></high-filtration>-->
				<h2 class="mt40" v-if="results && results.length > 0">{{ $t('message.findSource') }}</h2>
				<!--  筛选区域  -->
				<!--<filtration></filtration>-->
				<!--  商品列表  -->
				<product-list :offer_list="results" ref="product-list"></product-list>
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
	import { aliexpress } from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import { handleResponse } from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
	export default {
		name: "view-aliexpress",
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
					search_text: ''
				}
			}
		},
		mounted() {
			// 加载更多 aliexpress图片搜索暂无加载更多
			bus.$on('loadmore', () => {
				console.log('触底事件触发');
			})
		},
		methods: {
            /**
             * @description 图片上传成功后的回调函数
             */
			onImageUploadedSuccess(res) {
				this.searchTextParams = {
					search_text: ''
				}
				this.cid = null;
				this.searchType = 'image';
				this.originalImageUrl = res.imgUrl;
				this.imageAddress = res.imageAddress;
				this.main_imageAddress = res.imageAddress;
				this.getDataFromImage(false);
			},
            /**
             * @description 点击裁剪区域某个图片时触发
             */
			onClickLocalItem(parmas) {
				this.imageAddress = parmas.imageAddress;
				this.getDataFromImage(false);
			},
            /**
             * @description 点击主图时触发
             */
			onClickMainImage() {
				this.imageAddress = this.main_imageAddress;
				this.getDataFromImage(false);
			},
            /**
             * @description 切换商品分类时触发
             */
			onClassChange({id}) {
				this.cid = id;
				this.page = 1;
				this.getDataFromImage(false);
			},
			onClickSearchButton(params) {
				this.searchType = 'text';
				this.onClickClear();
				this.searchTextParams = {
					search_text: params.search_text
				}
				this.search_text = params.search_text;
				this.getDataFromText(false);
			},
			onFilterChange({e,o,title}) {

			},
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
			async getDataFromImage(loadmore) {
				this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = await aliexpress.searchGoodsByPic(this.imageAddress, this.cid);
					console.log(result);
					this.categoryList = result.data.categoryList ? result.data.categoryList : null;
					this.resultInfo = result.data.resultInfo;
					this.totalPage = this.resultInfo.totalPages || 1;
					if (result.data.results) {
						handleResponse(result);
					} else {
						this.$refs['product-list'].changeShowNoList(true);
					}
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
				} catch (e) {
					this.$message.error(this.$t('message.serach_result_from_image_error') + e);
				}
			},
			async getDataFromText(loadmore) {
				try {
					console.log(this.searchTextParams);
					let result = await aliexpress.searchGoodsByText({ ...this.searchTextParams,page: this.page });
					if(!result || !result.data) return this.$message.error(this.$t('message.get_result_error'));
					this.categoryList = result.data.categoryList;
					this.filterList = result.data.filterList;
					this.resultInfo = result.data.resultInfo;
					handleResponse(result);
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
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
