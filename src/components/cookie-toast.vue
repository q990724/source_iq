<template>
    <transition name="el-fade-in">
        <div class="cookie-toast" v-show="!cookieToast">
            <div class="row">
                <p>{{ $t('label.cookieToast') }} <a href="http://www.acuteberry.com/Themeparkwaittimes/privacy_policy.html" target="_blank">{{ $t('label.detail') }}</a></p>
                <div class="btn" @click="agree">同意</div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "cookie-toast",
    data() {
        return {
            cookieToast: true
        }
    },
    created() {
        this.cookieToast = window.localStorage.getItem('cookie-toast') || false;
    },
    methods: {
        agree() {
            window.localStorage.setItem('cookie-toast', true);
            this.cookieToast = true;
        }
    }
}
</script>

<style scoped lang="scss">
.cookie-toast {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.85);
    z-index: 999;
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px calc(12% + 20px);
        display: flex;
        font-size: $secondary_text_size;
        color: #FFF;
        p {
            a {
                text-decoration: none;
                &:link, &:visited, &:hover, &:active {
                    color: $link-color;
                }
            }
        }
        .btn {
            display: inline-block;
            background: #e9ecef;
            color: $regular_text_color;
            height: 36px;
            padding: 0 30px;
            line-height: 36px;
            border: 0;
            border-radius: 3px;
            text-decoration: none;
            white-space: nowrap;
            cursor: pointer;
            &:hover {
                background-color: #c9ccce;
            }
        }
    }
}
</style>