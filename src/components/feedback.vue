<template>
    <div class="feedback" v-show="dialogVisible">
        <el-dialog :title="$t('label.leave_a_message')" :visible.sync="dialogVisible" append-to-body modal-append-to-body>
            <el-form label-position="right" :model="feedbackForm" :rules="feedbackFormRules" ref="feedback-form">
                <el-form-item :label="$t('label.message')" prop="content">
                    <el-input type="textarea" v-model="feedbackForm.content"></el-input>
                </el-form-item>
                <el-form-item :label="$t('label.contact')" prop="contact">
                    <el-input v-model="feedbackForm.contact"></el-input>
                </el-form-item>
                <el-form-item>
                    <p>{{$t('label.upload_pic')}}</p>
                    <div class="upload-list">
                        <div class="upload-item" v-for="(fileItem, fileIndex) in fileList" :key="fileIndex">
                            <div class="upload-item_content">
                                <div class="upload-item_content_box">
                                    <img :src="fileItem.cover" alt="">
                                    <div class="upload-item_del" @click="handleRemove(fileIndex)">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-image" v-if="fileList.length < 4">
                            <div class="add-image_content" @click="onClickAdd">
                                <div class="add-image_content_box">
                                    <i class="el-icon-plus"></i>
                                    <input type="file" accept="image/*" style="display: none" @change="onUploadChange" id='upload'>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--<el-upload-->
                    <!--    action="#"-->
                    <!--    list-type="picture-card"-->
                    <!--    multiple-->
                    <!--    :limit="5"-->
                    <!--    :on-change="onUploadChange"-->
                    <!--    :auto-upload="false">-->
                    <!--    <i slot="default" class="el-icon-plus"></i>-->
                    <!--    <template slot="file" slot-scope="{file}">-->
                    <!--        <img class="el-upload-list__item-thumbnail img" :src="file.url" alt="">-->
                    <!--        <span class="el-upload-list__item-actions">-->
                    <!--                <span class="el-upload-list__item-delete" @click="handleRemove(file)">-->
                    <!--                  <i class="el-icon-delete"></i>-->
                    <!--                </span>-->
                    <!--            </span>-->
                    <!--    </template>-->
                    <!--</el-upload>-->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="onFeedbackCancel">{{$t('button.cancel')}}</el-button>
                    <el-button type="primary" @click="onFeedbackSubmit">{{$t('button.submit')}}</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import {publicAPI} from "@/assets/js/apis";
import {getBase64} from "@/assets/js/utils";

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
                content: [{required: true, message: this.$t('message.empty_message_not_allowed')}]
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
            if(!this.feedbackForm.content || !this.feedbackForm.content.trim()) return this.$message.error(this.$t('message.empty_message_not_allowed'));
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
                this.$message.success(this.$t('message.feedback_sent'));
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
        handleRemove(index) {
            this.fileList.splice(index, 1);
        },
        async onUploadChange(e) {
            if(e.target.files && e.target.files.length > 0) {
                let file = e.target.files[0];
                e.target.value = '';
                let base64 = await getBase64(file);
                this.fileList.push({
                    file: file,
                    cover: base64
                })
            }
        },
        onClickAdd() {
            $('#upload').click();
        }
    }
}
</script>

<style scoped lang="scss">
.img {
    object-fit: contain;
}

.upload-list {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0 -10px;
    .upload-item {
        flex: 0 0 25%;
        padding: 10px;
        .upload-item_content {
            border: 1px solid $line_color;
            border-radius: 5px;
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            height: 0;
            .upload-item_content_box {
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                img {
                    max-width: 80%;
                    max-height: 80%;
                }
                &:hover {
                    .upload-item_del {
                        opacity: 1;
                    }
                }
                .upload-item_del {
                    cursor: pointer;
                    opacity: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    background-color: rgba(0,0,0,.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all .3s;
                    color: #FFF;
                    font-size: 24px;
                }
            }
        }
    }
    .add-image {
        flex: 0 0 25%;
        padding: 10px;
        .add-image_content {
            cursor: pointer;
            border: 1px solid $line_color;
            border-radius: 5px;
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            height: 0;
            .add-image_content_box {
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                i {
                    font-size: 24px;
                }
            }
        }
    }
}

::v-deep .el-dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0 !important;
    border-radius: 10px;
    padding: 20px;
    .el-dialog__header, .el-dialog__body, .el-dialog__footer {
        padding: 0;
    }
}
</style>