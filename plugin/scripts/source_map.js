const SourceMap = [
    {
        sourceName: 'Alibaba',
        // currentPath: '/layout/view-alibaba',
        loginPageUrl: 'https://passport.alibaba.com/icbu_login.htm?spm=a2700.8293689.scGlobalHomeHeader.6.2ce267afQnDloI&tracelog=hd_signin',
        needCookie: false,
        // logo: require('@/assets/img/source/alibaba.png'),
        // name: 'Alibaba',
        hasUploadImage: true,
        hasImageSearch: true,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/alibaba/getCountryLangCurrency',
        uploadImage: 'api/alibaba/uploadImage',
        imageSearch: {method: 'get', path:'api/alibaba/product/imageSearch'},
        keywordSearch: {method: 'get', path: 'api/alibaba/product/keywordSearch'}
    },
    {
        sourceName: '1688',
		hoverText: '1688 domestic wholesalers',
        // currentPath: '/layout/view-1688',
        loginPageUrl: 'https://login.taobao.com/?redirect_url=https%3A%2F%2Flogin.1688.com%2Fmember%2Fjump.htm%3Ftarget%3Dhttps%253A%252F%252Flogin.1688.com%252Fmember%252FmarketSigninJump.htm%253FDone%253D%25252F%25252Fwww.1688.com%25252F&style=tao_custom&from=1688web',
        loginDomain: '1688.com',
        needCookie: false,
        cookieKey: 'cookie-1688',
        // logo: require('@/assets/img/source/1688.png'),
        // name: "1688",
        hasUploadImage: true,
        hasImageSearch: true,
        hasKeywordSearchFirst: true,
        hasImageSearchFirst: true,
        getCountryLangCurrency: 'api/1688/domestic/getCountryLangCurrency',
        uploadImage: 'api/1688/domestic/uploadImage',
        imageSearch: {method: 'get', path:'api/1688/domestic/product/imageSearch'},
        imageSearchFirst: {method: 'get', path:'api/1688/domestic/product/imageSearchFirst'},
        keywordSearch: {method: 'get', path:'api/1688/domestic/product/keywordSearch'},
        keywordSearchFirst: {method: 'get', path:'api/1688/domestic/product/keywordSearchFirst'},
    },
    {
        sourceName: '1688global',
		hoverText: '1688 export wholesalers',
        // currentPath: '/layout/view-1688global',
        loginPageUrl: 'https://login.taobao.com/?redirect_url=https://global.1688.com/',
        loginDomain: 'global.1688.com',
        needCookie: true,
        // logo: require('@/assets/img/source/1688-global.png'),
        cookieKey: 'cookie-1688global',
        // name: '1688Global',
        hasUploadImage: true,
        hasImageSearch: true,
        hasKeywordSearchFirst: true,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/1688/global/getCountryLangCurrency',
        uploadImage: 'api/1688/global/uploadImage',
        imageSearch: {method: 'get', path:'api/1688/global/product/imageSearch'},
        keywordSearch: {method: 'get', path:'api/1688/global/product/keywordSearch'},
        keywordSearchFirst: {method: 'get', path:'api/1688/global/product/keywordSearchFirst'},
    },
    {
        sourceName: 'AliExpress',
        // currentPath: '/layout/view-aliexpressZapieX',
        loginPageUrl: 'https://www.aliexpress.com/',
        needCookie: false,
        // logo: require('@/assets/img/source/aliexpress.png'),
        // name: "Aliexpress ZapieX",
        hasUploadImage: true,
        hasImageSearch: true,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/aliexpress/v2/GetCountryLangCurrency',
        uploadImage: 'api/aliexpress/v2/uploadImage',
        imageSearch: {method: 'get', path:'api/aliexpress/v2/product/imageSearch'},
        keywordSearch: {method: 'get', path:'api/aliexpress/v2/product/keywordSearch'},
    },
    {
        sourceName: 'Yiwugo',
        // currentPath: '/layout/view-yiwugo',
        loginPageUrl: 'https://cas.yiwugo.com/cas/login?service=http%3A%2F%2Fwork.yiwugo.com%2Findex.htm%3Fspm%3Dd3d3Lnlpd3Vnby5jb20v',
        needCookie: false,
        // logo: require('@/assets/img/source/yiwugo-logo.png'),
        // name: 'YiWuGo',
        hasUploadImage: true,
        hasImageSearch: true,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/yiwugo/getCountryLangCurrency',
        uploadImage: 'api/yiwugo/uploadImage',
        imageSearch: {method: 'get', path:'api/yiwugo/product/imageSearch'},
        keywordSearch: {method: 'get', path:'api/yiwugo/product/keywordSearch'},
    },
    {
        sourceName: 'DHgate',
        // currentPath: '/layout/view-dhgate',
        loginPageUrl: 'https://secure.dhgate.com/passport/login?service=http%3A%2F%2Fseller.dhgate.com%2Fmerchant%2Flogin%2Fssologin.do%3FreturnUrl%3DaHR0cDovL3NlbGxlci5kaGdhdGUuY29tL21lcmNoYW50L2xvZ2luL2xvZ2luc2lnbi5kbw..#hp-head-1',
        needCookie: false,
        // logo: require('@/assets/img/source/dhgate.png'),
        // name: 'DHgate',
        hasUploadImage: false,
        hasImageSearch: true,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/dhgate/getCountryLangCurrency',
        imageSearch: {method: 'post', path:'api/dhgate/product/imageSearch'},
        keywordSearch: {method: 'post', path: 'api/dhgate/product/keywordSearch'}
    },
	{
        sourceName: 'CJdropshipping',
        // currentPath: '/layout/view-cjds',
	    loginPageUrl: 'https://cjdropshipping.com/login.html?target=aHR0cHM6Ly9jamRyb3BzaGlwcGluZy5jb20v',
	    needCookie: false,
	    // logo: require('@/assets/img/source/cjds.png'),
	    // name: 'CJdropshipping',
	    hasUploadImage: false,
	    hasImageSearch: true,
	    hasKeywordSearchFirst: false,
	    hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/cjdsapp/getCountryLangCurrency',
        imageSearch: {method: 'post', path:'api/cjds/product/imageSearch'},
        keywordSearch: {method: 'post', path: 'api/cjds/product/keywordSearch'}
	},
    {
        sourceName: 'Made-in-China',
        // currentPath: '/layout/view-mic',
        loginPageUrl: 'https://login.made-in-china.com/sign-in/?baseNextPage=http%3A%2F%2Fwww.made-in-china.com%2F',
        needCookie: false,
        // logo: require('@/assets/img/source/mic.png'),
        // name: 'Made-in-China',
        hasUploadImage: false,
        hasImageSearch: true,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/micapp/getCountryLangCurrency',
        imageSearch: {method: 'post', path:'api/mic/product/imageSearch'},
        keywordSearch: {method: 'get', path: 'api/mic/product/keywordSearch'}
    },
    {
        sourceName: 'LightInTheBox',
		hoverText: 'Image search not available',
        // currentPath: '/layout/view-litbox',
        loginPageUrl: 'https://gw.lightinthebox.com/index.php?main_page=login&src=mainLoginLink&targetUrl=https%3A%2F%2Fgw.lightinthebox.com%2Findex.php%3Fmain_page%3Daccount%26prm%3D1.1.177.0&prm=1.1.74.0&prm=1.1.177.0&_ga=2.43912865.564672115.1638637091-371976819.1635928539',
        needCookie: false,
        // logo: require('@/assets/img/source/litbox.jpg'),
        // name: 'LightInTheBox',
        hasUploadImage: false,
        hasImageSearch: false,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/litbox/getCountryLangCurrency',
        keywordSearch: {method: 'get', path: 'api/litbox/product/keywordSearch'}
    },
    {
        sourceName: 'Banggood',
		hoverText: 'Image search not available',
        // currentPath: '/layout/view-banggood',
        loginPageUrl: 'https://gw.lightinthebox.com/index.php?main_page=login&src=mainLoginLink&targetUrl=https%3A%2F%2Fgw.lightinthebox.com%2Findex.php%3Fmain_page%3Daccount%26prm%3D1.1.177.0&prm=1.1.74.0&prm=1.1.177.0&_ga=2.43912865.564672115.1638637091-371976819.1635928539',
        needCookie: false,
        // logo: require('@/assets/img/source/banggood.png'),
        // name: 'Banggood',
        hasUploadImage: false,
        hasImageSearch: false,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/banggood/getCountryLangCurrency',
        keywordSearch: {method: 'get', path: 'api/banggood/product/keywordSearch'},
        comingSoon: false
    },
    {
        sourceName: 'Chinabrands',
		hoverText: 'Image search not available',
        // currentPath: '/layout/view-chinabrands',
        loginPageUrl: 'https://gw.lightinthebox.com/index.php?main_page=login&src=mainLoginLink&targetUrl=https%3A%2F%2Fgw.lightinthebox.com%2Findex.php%3Fmain_page%3Daccount%26prm%3D1.1.177.0&prm=1.1.74.0&prm=1.1.177.0&_ga=2.43912865.564672115.1638637091-371976819.1635928539',
        needCookie: false,
        // logo: require('@/assets/img/source/chinabrands.png'),
        // name: 'Chinabrands',
        hasUploadImage: false,
        hasImageSearch: false,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/chinabrands/getCountryLangCurrency',
        keywordSearch: {method: 'get', path: 'api/chinabrands/product/keywordSearch'},
        comingSoon: false
    },
    {
        sourceName: 'GlobalResources',
		hoverText: 'Image search not available',
        // currentPath: '/layout/view-globalres',
        loginPageUrl: 'https://gw.lightinthebox.com/index.php?main_page=login&src=mainLoginLink&targetUrl=https%3A%2F%2Fgw.lightinthebox.com%2Findex.php%3Fmain_page%3Daccount%26prm%3D1.1.177.0&prm=1.1.74.0&prm=1.1.177.0&_ga=2.43912865.564672115.1638637091-371976819.1635928539',
        needCookie: false,
        // logo: require('@/assets/img/source/globalsources.jpg'),
        // name: 'Globalres',
        hasUploadImage: false,
        hasImageSearch: false,
        hasKeywordSearchFirst: false,
        hasImageSearchFirst: false,
        getCountryLangCurrency: 'api/globalres/getCountryLangCurrency',
        keywordSearch: {method: 'get', path: 'api/globalres/product/keywordSearch'},
        comingSoon: true
    },
	{
	    sourceName: '1688rapid',
	    // currentPath: '/layout/view-1688rapid',
	    loginPageUrl: 'https://login.taobao.com/?redirect_url=https%3A%2F%2Flogin.1688.com%2Fmember%2Fjump.htm%3Ftarget%3Dhttps%253A%252F%252Flogin.1688.com%252Fmember%252FmarketSigninJump.htm%253FDone%253D%25252F%25252Fwww.1688.com%25252F&style=tao_custom&from=1688web',
	    needCookie: false,
	    // logo: require('@/assets/img/source/1688.png'),
	    // name: "1688 Rapid",
	    hasUploadImage: false,
	    hasImageSearch: true,
	    hasKeywordSearchFirst: false,
	    hasImageSearchFirst: false,
	    getCountryLangCurrency: 'api/1688/domestic/v2/getCountryLangCurrency',
	    imageSearch: {method: 'post', path:'api/1688/domestic/v2/product/imageSearch'},
	    keywordSearch: {method: 'get', path:'api/1688/domestic/v2/product/keywordSearch'},
	},
	{
	    sourceName: '1688overseas',
	    // currentPath: '/layout/view-1688overseas',
	    loginPageUrl: 'https://login.taobao.com/?redirect_url=https%3A%2F%2Flogin.1688.com%2Fmember%2Fjump.htm%3Ftarget%3Dhttps%253A%252F%252Flogin.1688.com%252Fmember%252FmarketSigninJump.htm%253FDone%253D%25252F%25252Fwww.1688.com%25252F&style=tao_custom&from=1688web',
	    needCookie: false,
	    cookieKey: 'cookie-1688',
	    // logo: require('@/assets/img/source/1688.png'),
	    // name: "1688overseas",
	    hasUploadImage: true,
	    hasImageSearch: true,
	    hasKeywordSearchFirst: true,
	    hasImageSearchFirst: true,
	    getCountryLangCurrency: 'api/1688/global/v2/getCountryLangCurrency',
	    uploadImage: 'api/1688/global/v2/uploadImage',
	    imageSearch: {method: 'get', path:'api/1688/global/v2/product/imageSearch'},
	    imageSearchFirst: {method: 'get', path:'api/1688/global/v2/product/imageSearchFirst'},
	    keywordSearch: {method: 'get', path:'api/1688/global/v2/product/keywordSearch'},
	    keywordSearchFirst: {method: 'get', path:'api/1688/global/v2/product/keywordSearchFirst'},
	},
	{
	    sourceName: 'AliExpressDS',
	    // currentPath: '/layout/view-aliexpressDS',
	    loginPageUrl: 'https://www.aliexpress.com/',
	    loginDomain: 'aliexpress.com',
	    needCookie: true,
	    cookieKey: 'cookie-aliexpress',
	    // logo: require('@/assets/img/source/aliexpress.png'),
	    // name: "Aliexpress DS",
	    hasUploadImage: true,
	    hasImageSearch: true,
	    hasKeywordSearchFirst: false,
	    hasImageSearchFirst: false,
	    getCountryLangCurrency: 'api/aliexpress/getCountryLangCurrency',
	    uploadImage: 'api/aliexpress/uploadImage',
	    imageSearch: {method: 'get', path:'api/aliexpress/product/imageSearch'},
	    keywordSearch: {method: 'get', path:'api/aliexpress/product/keywordSearch'},
	},
]

// export default SourceMap;

// export function getSource(sourceId){
//     var res = [];
//     for (let key in SourceMap) {
//         if (SourceMap[key]['id'] === sourceId){
//             res = SourceMap[key];
//         }
//     }
//     return res;
// }