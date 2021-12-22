<template>
	<div>
		<div class="product-list mt40" v-if="offer_list && offer_list.length > 0">
			<div class="product-item" v-for="(item, i) in offer_list" :key="item.product.displayTitle + Math.random()">
				<div class="banner" @click="openHref(item.product.productUrl)">
					<img :src="item.product.media.coverImageUrl" alt="">
				</div>
				<div class="message">
					<a class="name" :href="item.product.productUrl" target="_blank" v-html="item.product.displayTitle"></a>
					<h2 class="price">
						<i>{{ item.product.tradePrice[0].priceText }}</i> <span v-if="item.product.tradePrice[0].unit">
							/ {{item.product.tradePrice[0].unit}}</span>
					</h2>
					<p v-if="item.product.tradePrice[0].minOrder" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{item.product.tradePrice[0].minOrder}} (Min.Order)</p>
					<!-- 如果卖家节点和年份都不存在时，就不渲染此div模块-->
					<div class="supplier" v-if="showSeller">
						<div class="year" v-if="item.seller && item.seller.years">
							<span>{{item.seller.years}}</span>
							<sup>YRS</sup>
						</div>
						<!-- 鲁棒性检查seller.homeUrl是否为NULL再增加点击事件 -->
						<div class="supplier-name" v-if="item.seller && item.seller.name && item.seller.homeUrl " @click="openHref(item.seller.homeUrl)">{{item.seller.name}}</div>
						<div class="supplier-name" v-else-if="item.seller && item.seller.name">{{item.seller.name}}</div>
					</div>
				</div>
				<!-- 鲁棒性检查seller.homeUrl是否为NULL再增加点击事件 -->
				<div class="bottom" v-if="showSeller && item.seller && item.seller.homeUrl && item.seller.name">
					<span @click="openHref(item.seller.homeUrl)">{{item.seller.name}}</span>
				</div>
				<div class="bottom" v-else-if="showSeller && item.seller">
					<span>{{item.seller.name}}</span>
				</div>
			</div>
			<!--<div class="clear"></div>-->
		</div>
        <div class="no-result" v-if="$store.state.searchState === 'null'">
            <p>{{$t('message.no_result_found')}}</p>
        </div>
		<!-- TBD：如果搜索错误，也在页面底部显示错误提示。错误提示=具体接口请求返回的错误信息，暂时写死-->
		<div class="no-result" v-if="$store.state.searchState === 'error' || $store.state.imageUploadState === 'error'">
		    <p>{{$store.state.api_error_msg}}</p>
		</div>
	</div>
</template>

<script>
    import SourceMap from "@/assets/js/source_map";
	export default {
		name: "product-list",
		data() {
			return {
				showNoList: false,
                list: []
			}
		},
        props: {
			offer_list: {
				type: Array,
				default: () => []
			},
            showSeller: {
                type: [Boolean, undefined],
                default: true
            }
		},
		methods: {
			openHref(href) {
				window.open(href);
			},
			changeShowNoList(state) {
				this.showNoList = state;
			}
		}
	}
</script>

<style scoped lang="scss">
    .product-list {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
	.product-item {
        width: 335px;
        //min-height: 500px;
		background-color: #FFFFFF;
		//box-shadow: 0 0 10px #DDD;
		margin-right: 12px;
		margin-bottom: 12px;
		transition: all .2s;

		&:hover {
			box-shadow: 0 0 10px #DFDFDF;
		}

		.banner {
			height: 220px;
			overflow: hidden;
			cursor: pointer;
			padding: 20px;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				background-color: #FFF;
				transition: all .5s;
			}

			//&:hover {
			//    img {
			//        transform: scale(1.05);
			//    }
			//}
		}

		.message {
            width: 100%;
			padding: 10px 10px 20px 10px;
			border-bottom: 1px solid #DEDEDE;

			.name {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 14px;
                line-height: 21px;
				margin-bottom: 10px;
				color: #000;
				letter-spacing: 1px;
				text-decoration: none;
                height: 45px;
				&:visited {
					color: #333333;
				}

				&:hover {
					color: #FF4000;
				}
			}

			.tags {
				margin-bottom: 10px;

				.el-tag {
					margin-right: 10px;
				}
			}

			.price {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
				span {
					font-size: 14px;
				}

				i {
					color: #FF4000;
					font-size: 16px;
					font-style: normal;
				}
			}

			&>p {
				font-size: 14px;
			}

			.supplier {
				display: flex;
				align-items: center;
				margin-top: 20px;

				.year {
					sup {
						margin-left: 5px;
					}

                    margin-right: 20px;
				}

				.supplier-name {
					cursor: pointer;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.bottom {
            width: 100%;
			font-size: 14px;
			padding: 10px;
			color: #333;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;

			span {
				cursor: pointer;
			}
		}
	}
    .no-result {
        text-align: center;
        margin: 40px 0;
    }
</style>
