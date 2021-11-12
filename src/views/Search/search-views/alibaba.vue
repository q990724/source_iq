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
					<product-class :class_list="categoryList" @onClassChange="onClassChange" style="margin-bottom:10px;"></product-class>
					<!--  筛选区域  -->
					<div class="filter" v-if="filterList">
						<template v-for="(fil, index) in filterList">
							<div class="filter-item" v-if="fil.items && fil.items.length > 0" :key='index'>
								<div class="filter-item_title">
									<span>{{fil.title}}</span>
								</div>
								<div class="filter-item_options">
									<div class="filter-item_option" v-for="o in fil.items" :key="o.id">
										<el-checkbox v-model="o.selected" @change="onFilterChange($event, o, fil.title)">{{o.name}}</el-checkbox>
									</div>
								</div>
							</div>
						</template>
					</div>
					<!-- 价格区间 -->
					<!-- 地区 -->
				</div>
				<!--商品高级筛选-->
				<!-- <high-filtration></high-filtration> -->
				<h2 class="mt40" v-if="results && results.length > 0">{{ $t('message.findSource') }}</h2>
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
	import { alibaba } from "@/assets/js/apis";
	import bus from "@/assets/js/bus";
    import { handleResponse } from "@/assets/js/utils.js";
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
			// 加载更多
			bus.$on('loadmore', () => {
				console.log('触底事件触发');
				this.page++;
                if(this.page > 99) {
                    this.page = 99;
                    return;
                }
				if(this.searchType === 'image') {
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
			onClassChange(id) {
				this.cid = id;
				this.searchTextParams.Category = id;
				this.page = 1;
				this.searchType === 'image' ? this.getDataFromImage(false) : this.getDataFromText(false);
			},
			/**
			 * @description 点击文字搜索时触发
			 * @param {Object} params {search_text: 'apple', index_area: 'product_en'}
			 */
			onClickSearchButton(params) {
				this.searchType = 'text';
				this.onClickClear();
				this.searchTextParams = {
					search_text: params.search_text,
					index_area: params.index_area
				}
				this.getDataFromText(false);
			},
			onFilterChange(e, o, title) {
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
				console.log(this.searchTextParams);
				this.getDataFromText(false);
			},
            /**
             * @description 根据图片搜索获取数据
             * @param {Boolean} loadmore 本次搜索是否为加载更多
             */
			async getDataFromImage(loadmore) {
				this.$refs['product-list'].changeShowNoList(false);
				try {
					let result = await alibaba.searchGoodsByPic(this.imageAddress, this.page, this.cid);
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
			},
			/**
			 * @description 根据文字搜索获取数据
			 * @param {Boolean} loadmore 本次搜索是否为加载更多
			 */
			async getDataFromText(loadmore) {
				try {
					// let result = await alibaba.searchGoodsByText({
					// 	search_text: this.searchTextParams.search_text,
					// 	index_area: this.searchTextParams.index_area,
					// 	page: this.page
					// });
					let result = await alibaba.searchGoodsByText({ ...this.searchTextParams,page: this.page });
					if(!result || !result.data) return this.$message.error('获取失败！');
					this.categoryList = result.data.categoryList;
					this.filterList = result.data.filterList;
					this.resultInfo = result.data.resultInfo;
					handleResponse(result);
					this.results = loadmore ? [...this.results, ...result.data.results] : result.data.results;
					this.searchTextParams.search_text = result.data.searchKeywords;
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
