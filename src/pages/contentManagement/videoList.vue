<template>
  <div class="videoList container">
    <el-form :inline="true">
      <el-form-item class="pull-right">
        <el-button @click="edit()">新增视频</el-button>
        <!--<el-button>批量下载</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="title" label="视频标题"></el-table-column>
      <el-table-column prop="desc" label="视频介绍"></el-table-column>
      <el-table-column prop="url" label="视频文件"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-caret-right" @click="play(scope.row.url)">播放</el-button>
          <!--<el-button type="text" icon="el-icon-download" @click="download(scope.row.url)">下载</el-button>-->
          <el-button type="text" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class='page'
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--新增视频弹出框-->
    <el-dialog title="视频信息" :visible.sync="showDialog" width="30%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入视频标题"></el-input>
        </el-form-item>
        <el-form-item label="视频封面" prop="thumbnail">
          <uploader :image="editForm.thumbnail" :fileName="folder" @success="fileCover" @remove="removeCover"></uploader>
        </el-form-item>
        <el-form-item label="视频介绍" prop="desc">
          <el-input type="textarea" v-model="editForm.desc" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="视频地址" prop="url">
          <el-input v-model="editForm.url" placeholder="请输入视频地址"></el-input>
          <!--<uploader :image="editForm.url" type="video" :fileName="videoFolder" @success="fileVideo" @remove="removeVideo"></uploader>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="视频播放" :visible.sync="showVideo" width="80%">
      <div class="video-wrap">
        <video :src="playUrl" autoplay controls></video>
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
        showDialog: false,
        showVideo:false,
        playUrl:'',
        pageSize: 10,
        pageNum: 1,
        total: 0,
        tableData: [],
        editForm: {
          title: '',
          desc:'',
          thumbnail:'',
          url:'',
        },
        rules:{
          title:[{required:true,message:'请输入标题',triangle:'blur'}],
          desc:[{required:true,message:'请输入介绍',triangle:'blur'}],
          thumbnail:[{required:true,message:'请上传封面',triangle:'change'}],
          url:[{required:true,message:'请输入视频地址',triangle:'blur'}],
        },
        editId:'',
        folder:'videoCover',
        videoFolder:'videos',
      }
    },
    created() {
      this.getVideoList();
    },
    methods: {
      //下载视频
      download(url){
        window.location=url;
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.getVideoList()
      },
      handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getVideoList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取视频列表
      getVideoList() {
        this.$http('/admin/video/getVideoList', {
          page: this.pageNum,
          size: this.pageSize,
          contentId: this.$route.query.id
        }).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
      },
      //编辑视频
      edit(item){
        if(item){
          this.editId=item.id;
          for(var i in this.editForm){
            this.editForm[i]=item[i];
          }
        }else{
          this.editId='';
          for(var i in this.editForm){
            this.editForm[i]='';
          }
        }
        this.showDialog=true;
      },
      // 删除视频
      remove(pkid){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var arr=[];
          var ids;
          if(pkid){
            ids=pkid;
          }else{
            for(var i=0;i<this.multipleSelection.length;i++){
              arr.push(this.multipleSelection[i].id);
            }
            ids=arr.join(',');
          }
          if(!ids){
            return;
          }
          this.$http('/admin/video/deletePathByIds',{
            ids:ids,
            contentId: this.$route.query.id
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功！');
              this.getVideoList();
            }
          })
        }).catch(() => {

        });
      },
      play(url){
        this.showVideo=true;
        this.playUrl=url;
      },
      //上传缩略图
      fileCover(data){
        this.editForm.thumbnail=data;
      },
      //删除缩略图
      removeCover(){
        this.editForm.thumbnail='';
      },
      //上传视频
      fileVideo(data){
        this.editForm.url=data;
      },
      //删除视频
      removeVideo(){
        this.editForm.url='';
      },
      submit(){
        this.$refs.editForm.validate(valid=>{
          if(valid){
            var params;
            if(this.editId){
              params={
                ...this.editForm,
                content_id:this.$route.query.id,
                id:this.editId
              }
            }else{
              params={
                ...this.editForm,
                content_id:this.$route.query.id,
              }
            }
            this.$http('/admin/video/createVideoPath',params).then(r=>{
              if(r.code==0){
                this.$message.success('保存成功！');
                this.showDialog=false;
                this.getVideoList();
              }
            })
          }
        })
      },
    }

  }
</script>

<style lang="scss">
  .videoList {
    .video-wrap{
      width: 100%;
      height: 500px;
      video{
        width: 100%;
        height: 500px;
      }
    }
  }
</style>
