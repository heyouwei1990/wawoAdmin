<template>
  <div class="container articleDetails">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="秘籍分类" prop="c_category_id">
            <el-select v-model="form.c_category_id" placeholder="秘籍分类">
              <el-option v-for="(item,index) in esotericaCategory" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="秘籍标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入秘籍标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="副标题">
            <el-input v-model="form.subtitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者">
            <el-input v-model="form.author"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="秘籍状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择秘籍状态">
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="免费" prop="is_free">
            <el-checkbox v-model="form.is_free"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原价" prop="orig_price" >
            <el-input v-model="form.orig_price" placeholder="请输入秘籍原价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="现价" prop="price" >
            <el-input v-model="form.price" placeholder="请输入秘籍现价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员价" prop="vip_price">
            <el-input v-model="form.vip_price" placeholder="请输入秘籍会员价" ></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item label="赠送信用值">
            <el-input v-model="form.gift_value" placeholder="请输入购买赠送信用值"></el-input>
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item label="推荐" prop="is_popular">
            <el-select v-model="form.is_popular " placeholder="推荐">
              <el-option label="不推荐" :value="0"></el-option>
              <el-option label="秘籍推荐" :value="1"></el-option>
              <!--<el-option label="首页推荐" :value="2"></el-option>
              <el-option label="首页、秘籍推荐" :value="3"></el-option>-->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="摘要" prop="summary">
            <el-input v-model="form.summary" resize="none" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="顺序" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入顺序"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="秘籍封面:" prop="thumbnail">
            <uploader :image="form.thumbnail" :fileName="folder" @success="fileCover" @remove="removeCover"></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0px" prop="content">
            <vue-neditor-wrap v-model="form.content" :config="myConfig" :destroy="false" ></vue-neditor-wrap>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-group">
      <el-button  type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
  import VueNeditorWrap from 'vue-neditor-wrap'
  import uploader from '@/components/uploader.vue'
  import {mapState} from 'vuex'
  export default {
    components:{
      VueNeditorWrap,
      uploader
    },
    data() {
      var validatePrice=(rule,value,callback)=>{
        if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value)){
          return callback(new Error('请输入数字，最多可保留2位小数'));
        }
        callback();
      };
      var validateNotFree=(rule,value,callback)=>{
        if(!this.form.is_free && value==0){
          return callback(new Error('未勾选免费，价格不能为0'));
        }
        callback();
      };
      return {
        pkid:'',
        folder:'articleCover',
        form: {
          title: '',
          c_category_id: '',
          orig_price: '',
          price: '',
          vip_price: '',
          thumbnail: '',
          status:'',
          content:'',
          summary:'',
          is_popular:0,
          is_child:0,
          is_free:0,
          author:'',
          subtitle:'',
          c_detail_id:'',
          sort:''
        },
        rules:{
          title:[{required:true,message:'请输入秘籍标题',trigger:'blur'}],
          c_category_id:[{required:true,message:'请选择秘籍分类',trigger:'change'}],
          orig_price:[{required:true,message:'请输入秘籍原价',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
          price:[{required:true,message:'请输入秘籍现价',trigger:'blur'},{validator:validatePrice,trigger:'blur'},{validator:validateNotFree,trigger:'blur'}],
          vip_price:[{required:true,message:'请输入秘籍会员价',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
          status:[{required:true,message:'请选择秘籍状态',trigger:'change'}],
          thumbnail:[{required:true,message:'请上传秘籍封面',trigger:'blur'}],
          summary:[{required:true,message:'请选择秘籍摘要',trigger:'blur'}],
          content:[{required:true,message:'内容不能为空',trigger:'blur'}],
          is_free:[{required:true,message:'请选择是否免费',trigger:'change'}],
          sort:[{required:true,message:'请输入顺序',trigger:'blur'}],
        },
        myConfig:{
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
          serverUrl: window.URLCONFIG.baseUrl+'/api/img/insertImage?folder=esotericaDetail',
          // 你的UEditor资源存放的路径,相对于打包后的index.html
          UEDITOR_HOME_URL: '/static/Neditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 400,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 关闭自动保存
          enableAutoSave: false
        }
      }
    },
    watch:{
      'form.is_free':function(newVal){
        if(newVal){
          this.form.orig_price=0;
          this.form.price=0;
          this.form.vip_price=0;
        }
      }
    },
    computed:{
      ...mapState({
        esotericaCategory:state=>state.esotericaCategory,
      }),
    },
    created(){
      this.pkid=this.$route.query.id;
      this.init();
      this.getEsotericaCategory();
    },
    methods: {
      init(){
        if(!this.pkid){
          return;
        }
        this.$http('/admin/cheats/detail',{
          contentId:this.pkid
        }).then(r=>{
          if(r.code==0){
            for(var i in this.form){
              if(i in r.data){
                this.form[i]=r.data[i];
              }
            }
            this.form['is_free']=r.data.is_free==1?true:false;
          }
        })
      },
      //上传缩略图
      fileCover(data){
        this.form.thumbnail=data;
      },
      //删除缩略图
      removeCover(){
        this.form.thumbnail='';
      },
      //获取分类列表
      getEsotericaCategory(){
        this.$store.dispatch('getEsotericaCategory');
      },
      //提交保存
      submit(){
        this.$refs['form'].validate(valid=>{
          if(valid){
            var params={...this.form};
            params.is_free=this.form.is_free?1:0;
            if(!this.pkid){
              delete params.c_detail_id
            }
            this.$http('/admin/cheats/createCheats',{
              ...params,
              content_id:this.pkid
            }).then(r=>{
              if(r.code==0){
                this.$message.success('保存成功！');
                this.$router.replace({path:'/secretManagement'});
              }
            })
          }
        })
      }
    }

  }
</script>

<style lang="scss">
  .articleDetails{
    .el-select,.el-date-editor{
      width: 100%;
    }
    .btn-group{
      text-align: center;
      margin-top: 40px;
      .el-button{
        width: 120px;
      }
    }
  }
</style>
