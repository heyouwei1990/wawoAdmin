<template>
  <div class="uploader-module">
    <el-upload
      :class="['file-module',{'file-image':type=='image','file-video':type=='video'||type =='file'}]"
      :show-file-list="false"
      :action="uploadUrl"
      :on-error="fail"
      :on-progress="uploading"
      :on-success="handlePreview"
      :on-remove="remove"
      :before-upload="beforeAvatarUpload"
      v-loading="loading"
			:headers="headers"
    >
      <div v-if="type=='image'" class="file-box">
        <div class="file-area"><i class="el-icon-plus"></i></div>
        <img class="picture" v-if="image" :src="image" alt="">
        <i class="el-icon-close" slot="tip" @click="remove" v-if="image"></i>
      </div>
      <div v-if="type=='video'" class="file-box">
        <el-button size="small" type="primary">上传视频</el-button>
        <div class="video" @click.stop="">
          <span v-if="image" class="text">{{image}}</span>
          <i class="el-icon-close" slot="tip" @click="remove" v-if="image"></i>
        </div>
      </div>
      <div v-if="type=='file'" class="file-box">
        <el-button size="small" type="primary">上传文件</el-button>
        <div class="video" @click.stop="">
          <span v-if="image" class="text">{{image}}</span>
          <i class="el-icon-close" slot="tip" @click="remove" v-if="image"></i>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
  import tool from '@/util/tool'
  export default {
    data(){
      return{
        loading:false,
        filePath:'/api/img/insertImage',
				headers:{},
      }
    },
    computed:{
      uploadUrl(){
        var api='/api/img/insertImage';
        if(this.type=='video'){
          api='/api/img/insertVideo';
        }
        return tool.baseUrl+api+'?folder='+this.fileName;
      }
    },
		created() {
			var jwt=sessionStorage.getItem('Jwt');
			this.headers['Jwt']=jwt;
		},
    props:{
      image:{
        type:String,
        default:''
      },
      fileName:{
        type:String,
        default:''
      },
      type:{
        type:String,
        default:'image'
      }
    },
    methods:{
      //上传成功
      handlePreview(res,file){
        this.loading=false;
        if(res.code==0){
          var url=tool.imgBaseUrl+'/'+res.data;
          this.$emit('success',url);
          this.$emit('size',file.size)
          this.$message.success('上传成功');
        }
      },
      //上传失败
      fail(err,file){
        this.loading=false;
        this.$message.error('上传失败');
      },
      //上传时
      uploading(){
        this.loading=true;
      },
      //删除图片
      remove(){
        this.$emit('remove');
      },
      beforeAvatarUpload(file) {
        let isLimit;
        let size;
        if(this.type=='image'){
          size = 2;
        }
        if(this.type=='file'){
          size = 2000;
        }
        if(this.type=='video'){
          size =1000;
        }
        isLimit = file.size / 1024 / 1024 < size;
        if (!isLimit) {
          this.$message.error('上传大小不能超过'+size+'MB!');
        }
        return isLimit;
      },
    }
  }
</script>

<style lang="scss">
  .uploader-module{
    .el-upload--text{
      border: 0;
      overflow: visible;
    }
    .file-image{
      width: 120px;
      height:120px;
      position: relative;
      border: 1px dashed #ccc;
      border-radius: 6px;
      .file-box{
        width: 120px;
        height:120px;
        position: relative;
      }
      .el-icon-close{
        position: absolute;
        right:-8px;
        top:-8px;
        background-color: #f00;
        border-radius: 50%;
        padding:2px;
        z-index: 2;
        color: #fff;
        cursor: pointer;
      }
    }
    .file-video{
      .file-box{
        text-align: left;
      }
      .video{
        line-height: 20px;
      }
      .text{
        word-break: break-all;
        word-wrap: break-word;
      }
      .el-icon-close{
        background-color: #f00;
        border-radius: 50%;
        padding:2px;
        color: #fff;
        cursor: pointer;
      }
    }
    .file-module{
      .picture{
        width: 100%;
        height:100%;
        display: block;
        position: absolute;
        left:0;
        top:0;
      }
      .el-icon-plus{
        position: absolute;
        left:50%;
        top:50%;
        z-index:0;
        font-size:20px;
        color: #999;
        transform: translate(-50%,-50%);
      }

    }
    .el-upload{
      width: 100%;
      height:100%;
    }
    .file-area{
      width: 100%;
      height:100%;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        left:0;
        top:0;
        width: 100%;
        height:100%;
        z-index:0;
        /*border:1px dashed #ccc;*/
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
  }
</style>
