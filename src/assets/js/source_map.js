const SourceMap = {
    'alibaba': {
        id: 1,
        loginPageUrl: 'https://passport.alibaba.com/icbu_login.htm?spm=a2700.8293689.scGlobalHomeHeader.6.2ce267afQnDloI&tracelog=hd_signin',
        needCookie: false,
        logo: require('@/assets/img/source/alibaba.png'),
        name: 'Alibaba'
    },
    '1688': {
        id: 2,
        loginPageUrl: 'https://login.taobao.com/?redirect_url=https%3A%2F%2Flogin.1688.com%2Fmember%2Fjump.htm%3Ftarget%3Dhttps%253A%252F%252Flogin.1688.com%252Fmember%252FmarketSigninJump.htm%253FDone%253D%25252F%25252Fwww.1688.com%25252F&style=tao_custom&from=1688web',
        needCookie: true,
        logo: require('@/assets/img/source/1688.png'),
        name: "1688"
    },
    '1688global': {
        id: 3,
        loginPageUrl: 'https://login.taobao.com/?redirect_url=https://global.1688.com/',
        needCookie: true,
        logo: require('@/assets/img/source/1688global.png'),
        name: '1688跨境专供'
    },
    'aliexpress': {
        id: 4,
        loginPageUrl: 'https://www.aliexpress.com/',
        needCookie: true,
        logo: require('@/assets/img/source/aliexpress.png'),
        name: "AliExpress"
    },
    'yiwugo': {
        id: 5,
        loginPageUrl: 'https://cas.yiwugo.com/cas/login?service=http%3A%2F%2Fwork.yiwugo.com%2Findex.htm%3Fspm%3Dd3d3Lnlpd3Vnby5jb20v',
        needCookie: false,
        logo: require('@/assets/img/source/yiwugo.png'),
        name: '义乌购'
    },
    'dhgate': {
        id: 6,
        loginPageUrl: 'https://secure.dhgate.com/passport/login?service=http%3A%2F%2Fseller.dhgate.com%2Fmerchant%2Flogin%2Fssologin.do%3FreturnUrl%3DaHR0cDovL3NlbGxlci5kaGdhdGUuY29tL21lcmNoYW50L2xvZ2luL2xvZ2luc2lnbi5kbw..#hp-head-1',
        needCookie: false,
        logo: require('@/assets/img/source/dhgate.png'),
        name: 'DHGate'
    },
    'mic': {
        id: 7,
        loginPageUrl: 'https://secure.dhgate.com/passport/login?service=http%3A%2F%2Fseller.dhgate.com%2Fmerchant%2Flogin%2Fssologin.do%3FreturnUrl%3DaHR0cDovL3NlbGxlci5kaGdhdGUuY29tL21lcmNoYW50L2xvZ2luL2xvZ2luc2lnbi5kbw..#hp-head-1',
        needCookie: false,
        logo: require('@/assets/img/source/dhgate.png'),
        name: 'Made-in-China'
    },
}

export default SourceMap;
