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
            search_text: '',
            // 当前搜索模式 [image | text]
            searchType: 'image',
            // 用来显示的主图链接，有时为网络图片，有时为base64
            originalImageUrl: '',
            // 保留的初次搜索图片参数值 [imageId | filename | imageAddress]
            main_imageAddress: '',
            // 当前搜索图片参数值 [imageId | filename | imageAddress]
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
            // 当前数据源
            // source_id: 1,
            // 搜索后获取的总页码
            totalPage: 1
        }
    },
    beforeDestroy() {
        bus.$off('loadmore');
    },
    methods: {
        /**
         * @description 点击主图上的删除图标时触发
         */
        onClickClear() {
            this.originalImageUrl = '';
            this.main_imageAddress = '';
            this.imageAddress = '';
            this.categoryList = {};
            this.results = [];
            this.resultInfo = {};
            this.filterList = [];
            this.page = 1;
            this.cid = null;
            window.localStorage.removeItem('upload-file');
        },
        /**
         * @description 切换数据源时触发
         */
        async onSourceItemClick(source_id) {
            try {
                if (source_id === this.$store.state.source_id) return;
                this.$store.state.source_id = source_id;
                console.log('当前数据源ID：', this.$store.state.source_id);
                // this.$store.state.continueSearchParams.continueSearch = false;
                // if (this.originalImageUrl || this.search_text) {
                //     this.$store.state.continueSearchParams.continueSearch = true;
                //     if (this.searchType == 'image') {
                //         this.$store.state.continueSearchParams.continueSearchType = 'image';
                //         if (this.originalImageUrl.indexOf('https') != -1 || this.originalImageUrl.indexOf('http') != -1) {
                //             this.$store.state.continueSearchParams.continueSearchImage = await this.urlOrBase64ToFile({ url: this.originalImageUrl });
                //         } else {
                //             this.$store.state.continueSearchParams.continueSearchImage = await this.urlOrBase64ToFile({ base64: this.originalImageUrl });
                //         }
                //     } else if (this.searchType == 'text') {
                //         this.$store.state.continueSearchParams.continueSearchType = 'text';
                //         this.$store.state.continueSearchParams.continueSearchText = this.search_text;
                //     }
                // }else {
                //     this.$store.state.continueSearchParams.continueSearch = false;
                //     this.$store.state.continueSearchParams.continueSearchType = 'image';
                //     this.$store.state.continueSearchParams.continueSearchText = null;
                //     this.$store.state.continueSearchParams.continueSearchImage = null;
                // }
                switch (source_id) {
                    case SourceMap['alibaba']['id']:
                        this.$router.push('/view-alibaba');
                        break;
                    case SourceMap['yiwugo']['id']:
                        this.$router.push('/view-yiwugo');
                        break;
                    case SourceMap['aliexpress']['id']:
                        this.$router.push('/view-aliexpress');
                        break;
                    case SourceMap['1688']['id']:
                        this.$router.push('/view-1688');
                        break;
                    case SourceMap['1688global']['id']:
                        this.$router.push('/view-1688global');
                        break;
                    case SourceMap['dhgate']['id']:
                        this.$router.push('/view-dhgate');
                        break;
                    default:
                        this.$message.error('未知的数据源ID');
                }
            } catch (e) {
                console.error(e);
            }
        },
        onSelectImage() {
            this.searchType = 'image';
            this.originalImageUrl = window.localStorage.getItem('upload-file');
            this.main_imageAddress = this.originalImageUrl;
            this.imageSearch(this.originalImageUrl);
        },
        /**
         * @description 点击裁剪区域某个图片时触发
         */
        onClickLocalItem(item) {
            this.searchType = 'image';
            this.originalImageUrl = item.cover;
            this.imageSearch(this.originalImageUrl);
        },
        /**
         * @description 点击主图时触发
         */
        onClickMainImage() {
            this.searchType = 'image';
            this.originalImageUrl = this.main_imageAddress;
            this.imageSearch(this.originalImageUrl);
        },
    }
}

export default publicData;