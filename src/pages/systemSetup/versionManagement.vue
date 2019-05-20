<template>
  <div class="versionManagement container">
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="new_version" label="版本号"></el-table-column>
      <el-table-column prop="android_size" label="安卓大小"></el-table-column>
      <el-table-column prop="ios_size" label="IOS大小"></el-table-column>
      <el-table-column prop="android_link" label="安卓链接"></el-table-column>
      <el-table-column prop="ios_link" label="IOS链接"></el-table-column>
      <el-table-column prop="info" label="版本说明"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline"  @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改弹出框-->
    <el-dialog title="修改版本信息" :visible.sync="addAccountDialog">
      <el-form :model="form" :label-position="labelPosition" ref="form" :rules="rules">
        <el-form-item label="版本号" :label-width="formLabelWidth" prop="new_version">
          <el-input v-model="form.new_version" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="安卓链接" :label-width="formLabelWidth" prop="android_link">
          <uploader :image="form.android_link" type="file" :fileName="androidFolder" @success="androidFile" @remove="removeAndroid" @size="androidSize"></uploader>
        </el-form-item>
        <el-form-item label="IOS链接" :label-width="formLabelWidth" prop="ios_link">
          <uploader :image="form.ios_link" type="file" :fileName="iosFolder" @success="iosFile" @remove="removeIos" @size="iosSize"></uploader>
        </el-form-item>
        <el-form-item label="版本说明" :label-width="formLabelWidth" prop="info">
          <el-input type="textarea" v-model="form.info " placeholder="请输入版本说明" :rows="4" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="是否更新" :label-width="formLabelWidth">
          <el-checkbox v-model="checked" @change="changeUpdate"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import uploader from '@/components/uploader'
  export default {
    components: {
      uploader,
    },
    data() {
      return {
        androidFolder:'androidLink',
        iosFolder:'iosLink',
        addAccountDialog: false,
        pageSize: 10,
        pageNum: 1,
        total: 0,
        tableData:[],
        labelPosition: 'left',
        formLabelWidth: '120px',
        checked:false,
        form: {
          new_version: '',
          android_link: '',
          ios_link: '',
          info: '',
          android_size:'',
          ios_size:'',
          update:'',
        },
        rules:{
          new_version:[{required:true,message:'请输入版本号',trigger:'blur'}],
          android_link:[{required:true,message:'请输入安卓链接',trigger:'change'}],
          ios_link:[{required:true,message:'请输入IOS链接',trigger:'change'}],
          info:[{required:true,message:'请输入版本说明',trigger:'blur'}],
        }
      }
    },
    created() {
      this.getSystem();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取版本信息
      getSystem() {
        this.$http('/admin/setting/versionInfo').then(res => {
          if (res.code == 0) {
            this.tableData = res.data
          }
        })
      },
      //修改版本信息
      edit(item) {
        if(item){
          this.form.new_version = item.new_version
          this.form.android_link = item.android_link
          this.form.ios_link = item.ios_link
          this.form.info = item.info
          this.form.update = item.update
        }
        this.addAccountDialog = true
        this.form.update = "0"
        this.checked = false
      },
      //保存修改
      save(){
        this.$refs['form'].validate(valid=> {
          if (valid) {
            this.$http('/admin/setting/updateClient',{...this.form}).then(res=>{
              if (res.code == 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
              this.addAccountDialog = false
              this.getSystem()
            })
          }
        })
      },
      //改变是否更新状态
      changeUpdate(){
        if(this.checked == false){
          this.form.update = "0"
        }else{
          this.form.update = "1"
        }
      },
      //上传安卓
      androidFile(data){
        this.form.android_link=data.split('?')[0];
      },
      //删除安卓
      removeAndroid(){
        this.form.android_link='';
      },
      //上传IOS
      iosFile(data){
        this.form.ios_link=data.split('?')[0];
      },
      //删除IOS
      removeIos(){
        this.form.ios_link='';
      },
      //获取安卓size
      androidSize(data){
        this.form.android_size = data
      },
      //获取ios size
      iosSize(data){
        this.form.ios_size = data
      }
    }
  }
</script>

<style lang='scss'>
  .versionManagement {
    .info {
      font-size: 16px;
      box-sizing: border-box;
      line-height: 24px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 30px;
      padding-bottom: 20px;
    }
    section{
      margin-bottom: 30px;
      .el-row{
        margin-bottom: 20px;
      }
      .el-checkbox{
        margin-bottom: 10px;
      }
    }
    .btn-group{
      text-align: center;
    }
    .sec-hd {
      overflow: hidden;
      margin-bottom: 20px;
      .title{
        font-size: 16px;
        color: #333;
        float: left;
        line-height: 24px;
        font-weight: 400;
      }
      .el-checkbox{
        float: right;
      }
    }
  }
</style>
