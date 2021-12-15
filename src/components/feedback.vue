<template>
    <div class="feedback" v-show="dialogVisible">
        <el-dialog title="留言" :visible.sync="dialogVisible" append-to-body modal-append-to-body>
            <el-form label-position="right" :model="feedbackForm" :rules="feedbackFormRules" ref="feedback-form">
                <el-form-item label="留言内容" prop="content">
                    <el-input type="textarea" v-model="feedbackForm.content"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="feedbackForm.contact"></el-input>
                </el-form-item>
                <el-form-item>
                    <p>截图</p>
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        multiple
                        :limit="5"
                        :on-change="onUploadChange"
                        :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                                      <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="onFeedbackCancel">取 消</el-button>
                    <el-button type="primary" @click="onFeedbackSubmit">提 交</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import {publicAPI} from "@/assets/js/apis";

export default {
    name: "feedback",
    data() {
        return {
            feedbackForm: {
                content: '',
                contact: '',
            },
            fileList: [],
            feedbackFormRules: {
                content: [{required: true, message: '留言信息不能为空！'}]
            },
            dialogVisible: false,
        }
    },
    methods: {
        open() {
            this.dialogVisible = true;
        },
        close() {
            this.onFeedbackCancel();
        },
        async onFeedbackSubmit() {
            if(!this.feedbackForm.content || !this.feedbackForm.content.trim()) return this.$message.error('留言内容不能为空！');
            let image_json = '';
            if(this.fileList && Array.isArray(this.fileList) && this.fileList.length > 0) {
                await publicAPI.uploadFeedbackImage(this.fileList).then(res=>{
                    if(res.data.retcode == 200) {
                        image_json = JSON.stringify(res.data.data);
                    }
                }).catch(e=>{
                    console.log(e);
                })
            }
            let result = await publicAPI.submitFeedback({
                content: this.feedbackForm.content,
                contact: this.feedbackForm.contact || null,
                img_path: image_json || null
            });
            if(result.data.status == 200) {
                this.$message.success('反馈成功！');
                this.close();
            }else {
                this.$message.error(result.data.message);
            }
        },
        onFeedbackCancel() {
            this.dialogVisible = false;
            this.$refs['feedback-form'].resetFields();
            this.fileList = [];
        },
        handleRemove(file) {
            for (let i = 0; i < this.fileList.length; i++) {
                let item = this.fileList[i];
                if(file.uid === item.uid) {
                    this.fileList.splice(i, 1);
                }
            }
        },
        onUploadChange(file, filelist) {
            this.fileList = filelist;
        },
    }
}
</script>

<style scoped>

</style>