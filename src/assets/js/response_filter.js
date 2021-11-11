import SourceMap from "@/assets/js/source_map";

function buildRenderData() {
    return {
        retcode: -1, // 响应状态码
        message: '', // 响应文字描述
        data: {
            categoryList: {}, // 分类
            results: [], // 商品列表
            resultInfo: {}, // 相关信息
        }
    }
}

function getRenderedData(original_result, source_id) {
    let renderResult = buildRenderData();
    switch (source_id) {
        case SourceMap['alibaba']:
            break;
        case SourceMap['1688']:
            break;
        case SourceMap['1688global']:
            break;
        case SourceMap['aliexpress']:
            break;
    }
}