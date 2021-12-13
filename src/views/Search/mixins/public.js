import SourceMap from "../../../assets/js/source_map";
import bus from "@/assets/js/bus";
import { getFileFromBase64 } from "../../../assets/js/utils";
function getBase64(url) {
    return new Promise((resolve, reject) => {
        var Img = new Image()
        var dataURL = ''
        Img.setAttribute('crossOrigin', 'Anonymous')
        Img.src = url + '?v=' + Math.random()
        Img.onload = function () {
            // 要先确保图片完整获取到，这是个异步事件
            var canvas = document.createElement('canvas') // 创建canvas元素
            var width = Img.width // 确保canvas的尺寸和图片一样
            var height = Img.height
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
            dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
            resolve(dataURL)
        }
    })
}
const publicData = {
    data() {
        return {
            // search_text: '',
            // // 当前搜索模式 [image | text]
            // searchType: 'image',
            // // 用来显示的主图链接，有时为网络图片，有时为base64
            // originalImageUrl: '',
            // // 保留的初次搜索图片参数值 [imageId | filename | imageAddress]
            // main_imageAddress: '',
            // 当前搜索图片参数值 [imageId | filename | imageAddress]
			// TBD：应该统一使用store里面的imageAddress
            // imageAddress: '',
            // 商品分类列表
            categoryList: {},
            // 筛选列表
            filterList: [],
            // 商品结果列表
            results: [],
            // 搜索结果相关信息 pageNum等
            resultInfo: {},
            // 官方接口返回的数据
            sourceResult: {},
            // 当前搜索页码
            page: 1,
			// 搜索后获取的总页码
			totalPage: 1,
            // 当前已选分类ID
            cid: null,
            //1688或1688跨境切图所需
            yoloCropRegion: '',
            region: '',
            //1688筛选所需参数和每次搜索接口返回的sessionId
            location: '',
            tags: '',
			//1688, 1688global, 1688overseas首次图搜和文字搜索接口调用返回，作为后续分页请求的必选参数
            sessionId: '',
            requestId: '',
            // 当前数据源
            // source_id: 1,
        }
    },
    created() {
        console.log('public.js created');
        this.$store.commit('getAppSetting');
        this.$store.commit('resetUploadState');
        this.$store.commit('resetSearchState');
    },
    beforeDestroy() {
        bus.$off('loadmore');
    },
    watch: {
        source_type() {
            this.page = 1;
        }
    },
    computed: {
        source_type() {
            return this.$store.state.searchType;
        }
    },
    methods: {
        /**
         * @description 点击主图上的删除图标时触发
         */
        onClickClear() {
			this.$store.commit('dumpAll',"before onClickClear");
            this.initSearchResult();
			this.initConditions();
			this.clearSearchParams();
            // this.imageAddress = '';
            this.$store.commit('resetAll');
			this.$store.commit('dumpAll',"after onClickClear");
        },
		clearSearchParams() {
			this.cid = null;
			this.yoloCropRegion = '';
			this.region = '';
			this.location = '';
            this.color= 0;
			this.tags = '';
			this.sessionId= '';
			this.requestId= '';
		},
        initConditions(){
            this.categoryList = {};
            this.filterList = [];
        },
        initSearchResult() {
            // this.categoryList = {};
            this.results = [];
            this.resultInfo = {};
            // this.filterList = [];
            this.page = 1;
            this.totalPage = 1;
        },
        /**
         * @description 切换数据源时触发
         */
        async onSourceItemClick(source_id) {
			console.log("onSourceItemClick");
            if (source_id === this.$store.state.source_id) return;

			// 切换站点要复用当前的searchType，和搜索参数（图片或者关键词），清空其它一切状态
            // this.$store.commit('setSearchState', 'none');
			this.initSearchResult();
			this.initConditions();
			this.clearSearchParams();
			// this.imageAddress = '';
			this.$store.commit('resetUploadState');
			this.$store.commit('resetSearchState');
			this.$store.commit('setSourceId', source_id);
            console.log('当前数据源ID：', this.$store.state.source_id);
        },
        onSelectImage() {
			console.log("onSelectImage");
			let that = this;
			// let timer = window.setInterval(function() {
			// 	if (window.localStorage.getItem('upload-file') !== null) {
			// 		window.clearInterval(timer);
					//TBD：新上传图片（插件或本地文件）发起新搜索，清空之前所有搜索参数和搜索状态，暂时不支持图片+上次搜索参数组合
					//TBD: 新上传原图，需要把之前的原图对应的切图状态都清空，并且调用onClickClear（）清除全部缓存
					that.$refs['image_operation'].onClickCropResult();
					that.onClickClear();
					that.$store.commit('setSearchType', 'image');
					//TBD: 需要增加upload-file图片是否正常的鲁棒性检查
					that.$store.commit('setOriginImage', window.localStorage.getItem('upload-file'))
					// 从window缓存拿到插件或者本地文件上传的图片后，需要清除upload-file状态，否则下次页面刷新还会发起旧图的搜索
					that.$store.commit('clearWindowStorageUploadFile');
					that.$store.commit('setMainImage', that.$store.state.originImage);
					that.imageSearch(that.$store.state.mainImage, true);
			// 	}
			// },1000);
        },
        /**
         * @description 点击裁剪区域某个图片时触发
         */
        onClickLocalItem(item) {
			console.log("onClickLocalItem")
			let reUpload = true;
			if(item.cover==this.$store.state.mainImage && this.$store.state.imageAddress && this.$store.state.imageUploadState == 'uploaded') {
				reUpload = false;
			}else {
				this.$store.commit('resetUploadState');
			};
			console.log("reUpload:", reUpload);
			let originImage = this.$store.state.originImage;
			//TBD：新上传图片（插件或本地文件）发起新搜索，清空之前所有搜索参数和搜索状态，暂时不支持图片+上次搜索参数组合
			this.initSearchResult();
			this.initConditions();
			this.clearSearchParams();
			this.$store.commit('resetSearchState');
			// this.onClickClear();
			
            console.log(item);
			console.log(item.cover);
			// 1688的时候item里面会携带region
			if(item.region) {
			    this.region = item.region;
			}
			this.$store.commit('setSearchType', 'image');
            this.$store.commit('setMainImage', item.cover);
            this.imageSearch(this.$store.state.mainImage, reUpload);
        },
        /**
         * @description 点击主图时触发
         */
        onClickMainImage() {
			console.log("onClickMainImage");
			let reUpload = true;
			if(this.$store.state.originImage==this.$store.state.mainImage && this.$store.state.imageAddress && this.$store.state.imageUploadState == 'uploaded') {
				reUpload = false;
			}else {
				this.$store.commit('resetUploadState');
			};
			console.log("reUpload:", reUpload);
			//TBD：新上传图片（插件或本地文件）发起新搜索，清空之前所有搜索参数和搜索状态，暂时不支持图片+上次搜索参数组合
			this.initSearchResult();
			this.initConditions();
			this.clearSearchParams();
			this.$store.commit('resetSearchState');
			// this.onClickClear();
			this.$store.commit('setSearchType', 'image');
            this.$store.commit('setMainImage', this.$store.state.originImage);
            this.imageSearch(this.$store.state.mainImage, reUpload);
        },

		// 统一处理商品分类、筛选条件的选项变更状态
        handleOptions(filter, itemIndex, event){
            if(filter.selectUIType === 'radio'){
                filter.items.forEach(element=>{
                    element.selected = false;
                })
            }
            filter.items[itemIndex].selected = event;
        }
    }
}

export default publicData;