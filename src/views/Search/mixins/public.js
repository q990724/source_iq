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
            source_id: 1,
            // 搜索后获取的总页码
            totalPage: 1
        }
    },
    created() {
        bus.$on('cj_search', res => {
            let imageAddress = res.imageAddress;
            let imgUrl = res.imgUrl;
            console.log(imageAddress, imgUrl);
            if (imageAddress && imgUrl) this.onImageUploadedSuccess({ imageAddress, imgUrl });
        })
    },
    beforeDestroy() {
        bus.$off('loadmore');
        bus.$off('cj_search');
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
            this.page = 1;
            this.cid = null;
        },
        /**
         * @description 切换数据源时触发
         */
        async onSourceItemClick(source_id) {
            try {
                if (source_id === this.$store.state.source_id) return;
                this.$store.state.source_id = source_id;
                console.log('当前数据源ID：', this.$store.state.source_id);
                this.$store.state.continueSearchParams.continueSearch = false;
                if (this.originalImageUrl || this.search_text) {
                    this.$store.state.continueSearchParams.continueSearch = true;
                    if (this.searchType == 'image') {
                        this.$store.state.continueSearchParams.continueSearchType = 'image';
                        if (this.originalImageUrl.indexOf('https') != -1 || this.originalImageUrl.indexOf('http') != -1) {
                            this.$store.state.continueSearchParams.continueSearchImage = await this.urlOrBase64ToFile({ url: this.originalImageUrl });
                        } else {
                            this.$store.state.continueSearchParams.continueSearchImage = await this.urlOrBase64ToFile({ base64: this.originalImageUrl });
                        }
                    } else if (this.searchType == 'text') {
                        this.$store.state.continueSearchParams.continueSearchType = 'text';
                        this.$store.state.continueSearchParams.continueSearchText = this.search_text;
                    }
                }else {
                    this.$store.state.continueSearchParams.continueSearch = false;
                    this.$store.state.continueSearchParams.continueSearchType = 'image';
                    this.$store.state.continueSearchParams.continueSearchText = null;
                    this.$store.state.continueSearchParams.continueSearchImage = null;
                }
                switch (source_id) {
                    case SourceMap['alibaba']:
                        this.$router.push('/view-alibaba');
                        break;
                    case SourceMap['yiwugo']:
                        this.$router.push('/view-yiwugo');
                        break;
                    case SourceMap['aliexpress']:
                        this.$router.push('/view-aliexpress');
                        break;
                    case SourceMap['1688']:
                        this.$router.push('/view-1688');
                        break;
                    case SourceMap['1688global']:
                        this.$router.push('/view-1688global');
                        break;
                    default:
                        this.$message.error('未知的数据源ID');
                }
            } catch (e) {
                console.error(e);
            }
        },
        /**
         * @description 图片上传失败后的回调函数
         */
        onImageUploadedError(e) {
            this.$message.error(this.$t('message.upload_image_error'));
        },
        /**
         * @description 将网络地址或base64地址转为file文件
         */
        urlOrBase64ToFile({ url, base64 }) {
            return new Promise((resolve, reject) => {
                let file = null;
                if (url) {
                    getBase64(url).then(b64 => {
                        file = getFileFromBase64(b64);
                        resolve(file);
                    }).catch(e=>{
                        reject(e);
                    })
                } else if (base64) {
                    file = getFileFromBase64(base64);
                    resolve(file);
                } else {
                    reject(null);
                }
            });

        },
        continueSearch() {
            console.log('页面获取store继续搜索参数', this.$store.state.continueSearchParams);
        }
    }
}

export default publicData;