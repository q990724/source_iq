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
	import { _1688 } from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import { handleResponse } from "@/assets/js/utils.js";
    import publicData from "../mixins/public.js";
    import { getBase64FromCropImage } from "@/assets/js/utils.js";
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
			// 加载更多 aliexpress图片搜索暂无加载更多
			bus.$on('loadmore', () => {
				console.log('触底事件触发');
                if(this.page > this.totalPage) {
					this.page = this.totalPage;
					return;
				};
				this.page++;
				if(this.searchType === 'image') {
					console.log(111);
					this.getDataFromImage(true);
				}else {
					this.getDataFromText(true);
				}
			})
		},
		methods: {
            /**
             * @description 图片上传成功后的回调函数
             */
			onImageUploadedSuccess(res) {
				this.originalImageUrl = res.imgUrl;
				this.imageAddress = res.imageAddress;
				this.main_imageAddress = res.imageAddress;
				this.getDataFromImage(false);
			},
            /**
             * @description 图片上传失败后的回调函数
             */
			onImageUploadedError(e) {
				this.$message.error('图片上传失败！');
			},
            /**
             * @description 点击裁剪区域某个图片时触发
             */
			onClickLocalItem(parmas) {
				console.log(parmas);
				this.imageAddress = this.main_imageAddress;
				this.activeLocalItemIndex = parmas.index;
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
			/**
			 * @description 监听文字搜索按钮点击
			 */
			onClickSearchButton(params) {
				this.searchType = 'text';
				this.onClickClear();
				this.searchTextParams = {
					keyword: params.search_text,
					type: 1
				}
				this.getDataFromText(false);
			},
			onFilterChange({e, o, title}){

			},
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
			async getDataFromImage(loadmore) {
				this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = null;
                    if(this.page === 1) {
                        result = await _1688.searchGoodsByPicFirst(this.imageAddress);
						this.page = 2;
						if(result && result.data && result.data.searchImage) {
							this.yoloCropRegion = result.data.searchImage.yoloCropRegion;
							let regionList = result.data.searchImage.yoloCropRegion.split(';');
							getBase64FromCropImage(this.originalImageUrl ,regionList).then(res=>{
								console.log(res);
								this.$refs['image_operation'].setLocalImageList(res);
							}).catch(e=>{
								console.log(e);
							})
						}
                    }else {
						this.region = this.yoloCropRegion.split(';')[this.activeLocalItemIndex];
						console.log(this.yoloCropRegion, this.region);
						result = await _1688.searchGoodsByPic({
							imageId: this.imageAddress,
							page: this.page,
							yoloCropRegion: this.yoloCropRegion,
							region: this.region
						});
					}
					console.log(result);
					if(!result) {
						this.$message.error('图片搜索出错');
					}
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
					this.$message.error('图片搜索出错' + e);
				}
			},
			async getDataFromText(loadmore) {
				let result = null;
				try {
					if(!loadmore) {
						result = await _1688.searchGoodsFirst({ ...this.searchTextParams,page: this.page });
						if(result && result.data) {
							this.categoryList = result.data.categoryList || null;
							this.filterList = result.data.filterList || null;
						}						
					}else {
						result = await _1688.searchGoods({ ...this.searchTextParams,page: this.page });
					}
					if(!result || !result.data) return this.$message.error('获取失败！');
					this.resultInfo = result.data.resultInfo;
					handleResponse(result);
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
				} catch (error) {
					console.log(error);
				}
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
