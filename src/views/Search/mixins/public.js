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
            imageAddress: '',
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
            // 当前已选分类ID
            cid: null,
            //1688或1688跨境切图所需
            yoloCropRegion: '',
            region: '',
            //1688筛选所需参数和每次搜索接口返回的sessionId
            location: '',
            tags: '',
            sessionId: '',
            // 当前数据源
            // source_id: 1,
            // 搜索后获取的总页码
            totalPage: 1
        }
    },
    created() {
        console.log('view created');
        this.$store.commit('getAppSetting');
        this.$store.commit('setImageUploadState', 'none');
        this.$store.commit('setFirstSearchState', 'none');
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
            this.initSearchResult();
            this.imageAddress = '';
            this.$store.commit('resetAll');
        },
        initSearchResult() {
			// this.cid = null;
            this.categoryList = {};
            this.results = [];
            this.resultInfo = {};
            this.filterList = [];
            this.page = 1;
            this.totalPage = 1;
        },
        /**
         * @description 切换数据源时触发
         */
        async onSourceItemClick(source_id) {
            if (source_id === this.$store.state.source_id) return;
            this.$store.commit('setSourceId', source_id);
			// 切换站点无权决定改变setSearchState，只能跟随上一次搜索的setSearchState
            // this.$store.commit('setSearchState', 'none');
            console.log('当前数据源ID：', this.$store.state.source_id);
        },
        onSelectImage() {
			//TBD: 需要增加upload-file图片是否正常的鲁棒性检查
            this.$store.commit('setOriginImage', window.localStorage.getItem('upload-file'))
			// 从window缓存拿到插件或者本地文件上传的图片后，需要清除upload-file状态，否则下次页面刷新还会发起旧图的搜索
			this.$store.commit('clearWindowStorageUploadFile');
            this.$store.commit('setMainImage', this.$store.state.originImage);
            this.imageSearch(this.$store.state.mainImage);
        },
        /**
         * @description 点击裁剪区域某个图片时触发
         */
        onClickLocalItem(item) {
            console.log(item);
            this.$store.commit('setMainImage', item.cover);
            // 1688的时候item里面会携带region
            if(item.region) {
                this.region = item.region;
            }
            this.imageSearch(this.$store.state.mainImage);
        },
        /**
         * @description 点击主图时触发
         */
        onClickMainImage() {
			this.$store.commit('resetSearchState');
            this.$store.commit('setMainImage', this.$store.state.originImage);
            this.imageSearch(this.$store.state.mainImage);
        },
    }
}

export default publicData;