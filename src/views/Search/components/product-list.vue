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
					<p v-if="item.product.tradePrice[0].minOrder">{{item.product.tradePrice[0].minOrder}} (Min.Order)
					</p>
					<div class="supplier" v-if="item.seller">
						<div class="year">
							<span>{{item.seller.years}}</span>
							<sup>YRS</sup>
						</div>
						<div class="supplier-name" @click="openHref(item.seller.homeUrl)">{{item.seller.name}}</div>
					</div>
				</div>
				<div class="bottom" v-if="item.seller">
					<span @click="openHref(item.seller.homeUrl)">{{item.seller.name}}</span>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		
		<transition name="el-zoom-in-bottom">
			<div class="no-list" v-show="showNoList">
				<p>- 没有找到结果 -</p>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "product-list",
		data() {
			return {
				showNoList: false
			}
		},
		props: {
			offer_list: {
				type: Array,
				default: () => []
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
	.product-item {
		float: left;
		width: 335px;
		min-height: 450px;
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
			padding: 10px 10px 20px 10px;
			border-bottom: 1px solid #DEDEDE;

			.name {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 14px;
				margin-bottom: 10px;
				color: #000;
				letter-spacing: 1px;
				text-decoration: none;

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
				}

				.supplier-name {
					cursor: pointer;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-left: 20px;
				}
			}
		}

		.bottom {
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
	
.no-list {
	margin: 40px;
	color: #666;
	font-size: 16px;
	text-align: center;
}
</style>
