import SourceMap from "../../../assets/js/source_map";
import bus from "@/assets/js/bus";
const publicData = {
    data() {
        return {
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
        onSourceItemClick(source_id) {
            if (source_id === this.$store.state.source_id) return;
            this.$store.state.source_id = source_id;
            console.log(this.$store.state.source_id);
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
        },
        /**
             * @description 图片上传失败后的回调函数
             */
        onImageUploadedError(e) {
            this.$message.error(this.$t('message.upload_image_error'));
        },
    }
}

export default publicData;