<template>
	<div>
		<div class="product-list mt20" v-if="offer_list && offer_list.length > 0">
			<div class="product-item" v-for="(item, i) in offer_list" :key="item.product.displayTitle + Math.random()">
                <div class="product-item_content">
                    <div class="banner" @click="openHref(item.product.productUrl)">
                        <img :src="item.product.media.coverImageUrl" alt="">
                    </div>
                    <div class="message">
                        <div class="product">
                            <a class="name" :href="item.product.productUrl" target="_blank" v-html="item.product.displayTitle"></a>
                            <h2 class="price one-line" v-if="item.product.tradePrice && item.product.tradePrice.length > 0">
                                <template v-for="price in item.product.tradePrice">
                                    <!-- 正常价 -->
                                    <div class="sale" v-if="price.type === 'wholesale' || price.type === 'sale'">
                                        <i>{{ price.priceText ? price.priceText: $t('label.negotiable')}}</i> <span v-if="item.product.tradePrice[0].unit"> / {{item.product.tradePrice[0].unit}}</span>
                                    </div>
                                    <!-- 划线价 -->
                                    <div class="retail" v-if="price.type === 'retail' && price.priceText">
                                        <del>{{ price.priceText }}</del>
                                    </div>
                                </template>
                            </h2>
                            <!--Min.Order-->
                            <p class="min-order" v-if="item.product.tradePrice[0].minOrder">{{item.product.tradePrice[0].minOrder}} (Min.Order)</p>
                            <!--评分和销量-->
                            <div class="star_sale" v-if="item.product.rating || item.product.salesHistory">
                                <div class="star" v-if="item.product.rating && item.product.rating.score && item.product.rating.score > 0">
                                    <el-rate v-model="item.product.rating.score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                                </div>
                                <div class="sale_count one-line" v-if="item.product.salesHistory">
                                    <span>{{item.product.salesHistory.totalSalesAmountText}}</span>
                                </div>
                                <div v-else style="height: 20px;"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 鲁棒性检查seller.homeUrl是否为NULL再增加点击事件 -->
                    <div class="bottom" v-if="showSeller && item.seller">
                        <!-- 如果卖家节点和年份都不存在时，就不渲染此div模块-->
                        <div class="supplier">
                            <div class="year_name">
                                <div class="year" v-if="item.seller && item.seller.years">
                                    <span>{{item.seller.years}} YRS</span>
                                </div>
                                <!-- 鲁棒性检查seller.homeUrl是否为NULL再增加点击事件 -->
                                <div class="supplier-name" v-if="item.seller && item.seller.name && item.seller.homeUrl " @click="openHref(item.seller.homeUrl)" :title="item.seller.name">{{item.seller.name}}</div>
                                <div class="supplier-name" v-else-if="item.seller && item.seller.name" :title="item.seller.name">{{item.seller.name}}</div>
                            </div>
                            <div class="credentials" v-if="item.seller.credentials && item.seller.credentials.length > 0">
                                <div class="cre" v-for="(cre, cre_i) in item.seller.credentials" :key="cre_i">
                                    <div class="cre_image" v-if="cre.displayType === 'image' && cre.icon">
                                        <template v-if="cre.icon.type === 'url'">
                                            <img :src="cre.icon.value" alt="">
                                        </template>
                                        <template v-if="cre.icon.type === 'font'">
                                            <i :style="{'color': cre.icon.value.color}" class="iconfont2" :class="true ? 'icon-' + cre.icon.value.fontLabel : ''" v-for="icon in cre.icon.value.repeatCount"></i>
                                        </template>
                                    </div>
                                    <div class="cre_text" v-if="cre.displayType === 'text' && cre.text">{{cre.text}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
			<!--<div class="clear"></div>-->
		</div>
        <div class="no-result" v-if="$store.state.searchState === 'null'">
            <p>{{$t('message.no_result_found')}}</p>
        </div>
		<!--&lt;!&ndash; TBD：如果搜索错误，也在页面底部显示错误提示。错误提示=具体接口请求返回的错误信息，暂时写死&ndash;&gt;-->
		<div class="no-result" v-if="$store.state.searchState === 'error' || $store.state.imageUploadState === 'error'">
		   <p>{{$store.state.api_error_msg}}</p>
		   <!-- <p>错误了</p> -->
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
        margin-left: -10px;
        margin-right: -10px;
    }
	.product-item {
        width: 25%;
        flex: 0 0 25%;
		margin-bottom: 12px;
		transition: all .2s;
        padding: 10px;
        border-radius: 10px;
        .product-item_content {
            background-color: #FFFFFF;
            border-radius: 10px;
        }
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
				transition: all .2s;
			}

			&:hover {
			    img {
			        transform: scale(1.05);
			    }
			}
		}

		.message {
            width: 100%;
			padding: 10px;
			//border-bottom: 1px solid $line_color;

			.name {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: $regular_text_size;
                line-height: 21px;
				margin-bottom: 10px;
				color: #000;
				letter-spacing: 1px;
				text-decoration: none;
                height: 45px;
				&:visited {
					color: $regular_text_color;
				}

				&:hover {
					color: $hover_color;
				}
			}

			.tags {
				margin-bottom: 10px;

				.el-tag {
					margin-right: 10px;
				}
			}

			.price {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                .sale{
                    i {
                        font-size: $primary_text_size;
                        color: $primary_color;
                        font-style: normal;
                    }
                    span {
                        font-size: $secondary_text_size;
                    }
                }

                .retail {
                    margin-left: 10px;
                    del {
                        color: $secondary_text_color;
                        font-size: $secondary_text_size;
                    }
                }
			}

            .min-order {
                font-size: $secondary_text_size;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin-bottom: 10px;
            }

            .star_sale {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                .star {
                    height: 20px;
                    ::v-deep .el-rate__text {
                        display: inline-block;
                        margin-top: 2px;
                    }
                }
                .sale_count {
                    font-size: $secondary_text_size;
                }
            }

		}

		.bottom {
            width: 100%;
			font-size: $secondary_text_size;
			padding: 10px;
			color: $regular_text_color;
            border-top: 1px solid $line_color;
            .supplier {
                .year_name {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .year {
                        background-color: $radio_label_bgcolor;
                        border-radius: 3px;
                        margin-right: 10px;
                        padding: 2px 6px;
                        white-space: nowrap;
                        font-size: $placeholder_text_size;
                    }

                    .supplier-name {
                        cursor: pointer;
                        font-size: $secondary_text_size;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .credentials {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    .cre {
                        margin-right: 10px;
                        .cre_image {
                            img {
                                max-width: 42px;
                                max-height: 42px;
                            }
                        }
                    }
                }
            }
		}
	}
    .no-result {
        text-align: center;
        margin: 40px 0;
    }

    ::v-deep .el-rate {
        .el-rate__item {
            .el-rate__icon, .el-rate__text {
                font-size: $secondary_text_size;
            }
            .el-rate__icon {
                margin-right: 3px;
            }
        }
    }
</style>
