<template>
	<div class="search-result-container scrollable">
		<source-list @onSourceItemClick="onSourceItemClick"></source-list>
		<div class="container">
			<div class="main-container">
				<!--  图片处理区域  -->
				<image-operation ref="image_operation" :original_image_url="originalImageUrl"
					@onImageUploadedSuccess="onImageUploadedSuccess"
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
	import SourceListComponent from "../components/source-list";
	import ImageOperationComponent from "../components/image-operation";
	import ProductClassComponent from "../components/product-class";
	import FiltrationComponent from "../components/filtration";
	import ProductListComponent from "../components/product-list";
	import HighFiltration from "../components/high-filtration";
	import { yiwugo } from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import publicData from "../mixins/public.js";
    import { handleResponse } from "@/assets/js/utils.js";

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
        mixins: [publicData],
		data() {
			return {

			}
		},
		mounted() {
			// 加载更多
			bus.$on('loadmore', () => {
				console.log('触底事件触发');
				this.page++;
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
			onClassChange(id) {
				this.cid = id;
				this.page = 1;
				this.getDataFromImage(false);
			},
			async getDataFromImage(loadmore) {
				this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = result = await yiwugo.searchGoodsByPic(this.imageAddress, this.page);
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
