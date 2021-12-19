<template>
	<div class="search-result-container scrollable">
		<source-list @onSourceItemClick="onSourceItemClick"></source-list>
		<div class="container">
			<div class="main-container">
				<!--  图片处理区域  -->
				<image-operation ref="image_operation" :original_image_url="originalImageUrl"
					@onUploadClick="onUploadClick" @onImageUploadedSuccess="onImageUploadedSuccess"
					@onImageUploadedError="onImageUploadedError" @onClickLocalItem="onClickLocalItem"
					@onClickMainImage="onClickMainImage" @onClickClear="onClickClear">
				</image-operation>
				<!--  商品分类  -->
				<product-class :class_list="categoryList" @onClassChange="onClassChange"></product-class>
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
	import SourceListComponent from "./components/source-list";
	import ImageOperationComponent from "./components/image-operation";
	import ProductClassComponent from "./components/product-class";
	import FiltrationComponent from "./components/filtration";
	import ProductListComponent from "./components/product-list";
	import HighFiltration from "./components/high-filtration";
	import {
		alibaba,
		yiwugo,
		// aliexpress,
		_1688
	} from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
	import SourceMap from "@/assets/js/source_map";
	import {getFileFromBase64, getBase64FromCropImage} from "@/assets/js/utils.js";
	function findKey(obj, value, compare = (a, b) => a === b) {
		return Object.keys(obj).find(k => compare(obj[k], value))
	}

	export default {
		name: "search_result",
		components: {
			SourceList: SourceListComponent,
			ImageOperation: ImageOperationComponent,
			ProductClass: ProductClassComponent,
			Filtration: FiltrationComponent,
			ProductList: ProductListComponent,
			HighFiltration: HighFiltration
		},
		data() {
			return {
				originalImageUrl: '',
				main_imageAddress: '',
				imageAddress: '',
				categoryList: {},
				results: [],
				resultInfo: {},
				page: 1,
				cid: null,
				source_id: 1,
				totalPage: 1
			}
		},
		mounted() {
			// 加载更多
			bus.$on('loadmore', () => {
				console.log('触底事件触发');
				this.page++;
				if(this.source_id == SourceMap['alibaba'] && this.page > 5) return;
				if(this.source_id == SourceMap['aliexpress']) return;
				if(this.page > this.totalPage) {
					this.page = this.totalPage;
					return;
				};
				this.getDataFromImage(true);
			})
		},
		methods: {
			onImageUploadedSuccess(res) {
				this.originalImageUrl = res.imgUrl;
				this.imageAddress = res.imageAddress;
				this.main_imageAddress = res.imageAddress;
				this.getDataFromImage(false);
			},
			onImageUploadedError(e) {
				this.$message.error('图片上传失败！');
			},
			onClickLocalItem(parmas) {
				this.imageAddress = parmas.imageAddress;
				this.getDataFromImage(false);
			},
			onClickMainImage() {
				this.imageAddress = this.main_imageAddress;
				this.getDataFromImage(false);
			},
			onClickClear() {
				this.originalImageUrl = '';
				this.main_imageAddress = '';
				this.imageAddress = '';
				this.categoryList = {};
				this.results = [];
				this.resultInfo = {};
				this.page = 1;
				this.cid = null;
				this.$refs['product-list'].changeShowNoList(false);
			},
			onSourceItemClick(source_id) {
				this.$refs['image_operation'].onClickClear();
				this.source_id = source_id;
				this.$store.state.source_id = source_id;
				console.log(this.source_id);
				this.$refs['product-list'].changeShowNoList(false);
			},
			onClassChange(id) {
				this.cid = id;
				this.page = 1;
				this.getDataFromImage(false);
			},
			onUploadClick() {

			},
			async getDataFromImage(loadmore) {
				this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = null;
					switch (this.source_id) {
						case 1:
							result = await alibaba.searchGoodsByPic(this.imageAddress, this.page, this.cid);
							break;
						case 2:
							if(this.page === 1) {
								result = await _1688.searchGoodsByPicFirst(this.imageAddress);
							}
							if(result && result.data && result.data.searchImage) {
								let regionList = result.data.searchImage.yoloCropRegion.split(';');
								getBase64FromCropImage(this.originalImageUrl ,regionList).then(res=>{
									console.log(res);
									this.$refs['image_operation'].setLocalImageList(res);
								}).catch(e=>{
									console.log(e);
								})
							}
							break;
						case 3:
							break;
						case 4:
							result = await aliexpress.searchGoodsByPic(this.imageAddress, this.cid);
							break;
						case 5:
							result = await yiwugo.searchGoodsByPic(this.imageAddress, this.page);
							break;
						default:
							this.$message.error('错误的源ID！');
							return;
							break;
					}
					console.log(result);
					this.categoryList = result.data.categoryList ? result.data.categoryList : null;
					this.resultInfo = result.data.resultInfo;
					this.totalPage = this.resultInfo.totalPages || 1;
					if (result.data.results) {
						for (let item of result.data.results) {
							if (item.product.media.coverImageUrl && typeof item.product.media.coverImageUrl ==
								'string') {
								if (!item.product.media.coverImageUrl.includes('https')) {
									item.product.media.coverImageUrl = 'https://' + item.product.media.coverImageUrl
								}
							}
							if (item.product.productUrl && typeof item.product.productUrl == 'string') {
								if (!item.product.productUrl.includes('https')) {
									item.product.productUrl = 'https://' + item.product.productUrl
								}
							}
							if (item.seller && item.seller.homeUrl && typeof item.seller.homeUrl == 'string') {
								if (!item.seller.homeUrl.includes('https')) {
									item.seller.homeUrl = 'https://' + item.seller.homeUrl
								}
							}
						}
					} else {
						this.$refs['product-list'].changeShowNoList(true);
					}
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
				} catch (e) {
					this.$message.error('图片搜索出错' + e);
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
</style>
