<template>
    <el-container>
        <el-header height="40px">
            <page-header></page-header>
        </el-header>
        <el-container>
            <el-aside width="12%" class="left-content"></el-aside>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
            <el-aside width="12%" class="right-content">
                <page-right-container></page-right-container>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script>
import pageHeader from '@/components/page-header';
import pageRightContainer from "@/components/page-right-container";
export default {
    name: "layout",
    components: {
        pageHeader,pageRightContainer
    }
}
</script>

<style scoped lang="scss">
.el-header {
    background-color: #FFFFFF;
    padding: 0;
}
.el-main {
    min-height: calc(100vh - 40px);
}
.right-content {
    position: relative;
}
</style>