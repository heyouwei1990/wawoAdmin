<template>
	<div class="courseDetails container">
    <el-form ref="form" :model="form" :rules="rules" label-width="96px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="课程种类" prop="c_category_id">
            <el-select v-model="form.c_category_id" placeholder="课程种类">
              <el-option v-if="lessonCategory" v-for="(item,index) in lessonCategory" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入课程标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报名人数限制" label-width="106px" prop="limit_amount">
            <el-input v-model="form.limit_amount" placeholder="请输入报名人数限制"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开课时间" prop="start_time">
            <el-date-picker
              v-model="lessonTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报名时间" prop="deadline_time">
            <el-date-picker
              v-model="signInTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item label="签到方式">
            <el-select v-model="form" placeholder="请选择签到方式">
              <el-option v-for="item in sign_type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item label="免费" prop="is_free">
            <el-checkbox v-model="form.is_free"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程原价" prop="orig_price" >
            <el-input v-model="form.orig_price" placeholder="请输入课程原价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程现价" prop="price" >
            <el-input v-model="form.price" placeholder="请输入课程现价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员价" prop="vip_price" >
            <el-input v-model="form.vip_price" placeholder="请输入课程会员价" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐" prop="is_popular">
            <el-select v-model="form.is_popular " placeholder="推荐">
              <el-option label="不推荐" :value="0"></el-option>
              <el-option label="课程推荐" :value="1"></el-option>
              <!--<el-option label="首页推荐" :value="2"></el-option>
              <el-option label="首页、课程推荐" :value="3"></el-option>-->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推送">
            <el-select v-model="form.is_push " placeholder="推送">
              <el-option label="请选择" value=""></el-option>
              <el-option label="不推送" :value="0"></el-option>
              <el-option label="仅对报名人推送" :value="1"></el-option>
              <el-option label="对所有人推送" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课程地点" prop="specificsite">
            <el-input v-model="form.specificsite" resize="none" type="textarea" placeholder="请输入课程地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课程简介" label-width="90px" prop="summary">
            <el-input v-model="form.summary" resize="none"  type="textarea" placeholder="请输入课程简介"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程封面" prop="thumbnail">
            <uploader :fileName="coverFolder" :image="form.thumbnail"  @success="fileCover" @remove="removeCover"></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程二维码">
            <img class="qrcode" :src="form.qrcode" alt="">
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0px">
            <vue-neditor-wrap v-model="form.content" :config="myConfig" :destroy="false"></vue-neditor-wrap>
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
	import tool from '@/util/tool'
  import Uploader from '@/components/uploader'
  import VueNeditorWrap from 'vue-neditor-wrap'
  import {mapState} from 'vuex'
	export default {
	  components:{
      Uploader,
      VueNeditorWrap
    },
		data() {
      var validatePrice=(rule,value,callback)=>{
        if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value)){
          return callback(new Error('请输入数字，最多可保留2位小数'));
        }
        callback();
      };
      var validateAmount=(rule,value,callback)=>{
        if(!/^[1-9]\d*$/.test(value)){
          return callback(new Error('请输入正整数！'));
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
        validatePrice:validatePrice,
        coverFolder: 'lessonCover',
        pkid:'',
        lessonTime:'',
        signInTime:'',
				form: {
          c_category_id:'',
					title: '',
          status: '',
          limit_amount: '',
          orig_price: '',
          price: '',
          vip_price:'',
          specificsite:'',
          qrcode:'',
          start_time:'',
          end_time:'',
          start_signup_time:'',
          deadline_time:'',
          thumbnail:'',
          summary:'',
          is_free:0,
          is_popular:0,
          is_push:'',
          content:''
        },
        rules:{
          c_category_id:[{required:true,message:'请选择分类',trigger:'change'}],
          title:[{required:true,message:'请输入课程标题',trigger:'blur'}],
          status:[{required:true,message:'请选择课程状态',trigger:'change'}],
          limit_amount:[{required:true,message:'请输入限制报名人数',trigger:'blur'},{validator:validateAmount,trigger:'blur'}],
          orig_price:[{required:true,message:'请输入课程原价',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
          price:[{required:true,message:'请输入课程现价',trigger:'blur'},{validator:validatePrice,trigger:'blur'},{validator:validateNotFree,trigger:'blur'}],
          vip_price:[{required:true,message:'请输入课程会员价',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
          specificsite:[{required:true,message:'请输入开课地点',trigger:'blur'}],
          start_time:[{required:true,message:'请输入开课时间',trigger:'blur'}],
          deadline_time:[{required:true,message:'请输入报名时间',trigger:'blur'}],
          qrcode:[{required:true,message:'请上传二维码',trigger:'blur'}],
          thumbnail:[{required:true,message:'请上传封面',trigger:'blur'}],
          summary:[{required:true,message:'请输入课程简介',trigger:'blur'}],
          is_free:[{required:true,message:'请选择是否免费',trigger:'change'}],
          content:[{required:true,message:'内容不能为空',trigger:'blur'}],
        },
        myConfig:{
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
          serverUrl: window.URLCONFIG.baseUrl+'/api/img/insertImage?folder=lessonDetail',
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
    created(){
      this.pkid=this.$route.query.id;
      if(this.pkid){
        this.init();
      }
      this.getLessonCategory();
    },
    watch:{
      lessonTime(newVal){
        if(newVal){
          this.form.start_time=newVal[0];
          this.form.end_time=newVal[1];
        }
      },
      signInTime(newVal){
        if(newVal){
          this.form.start_signup_time=newVal[0];
          this.form.deadline_time=newVal[1];
        }
      },
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
        lessonCategory:state=>state.lessonCategory
      }),
    },
		methods: {
	    //初始化
			init(){
			  this.$http('/admin/course/getCourseById',{
			    id:this.pkid
        }).then(r=>{
          if(r.code==0){
            for(var i in this.form){
              if(i in r.data){
                this.form[i]=r.data[i];
              }
            }
            this.form.is_free=r.data.is_free==1?true:false;
            this.lessonTime=[this.form.start_time,this.form.end_time];
            this.signInTime=[this.form.start_signup_time,this.form.deadline_time];
          }
        })
      },
      //获取分类列表
      getLessonCategory(){
			  this.$store.dispatch('getLessonCategory');
      },
      //上传缩略图
      fileCover(data){
        this.form.thumbnail=data;
      },
      //删除缩略图
      removeCover(){
        this.form.thumbnail='';
      },
      //提交
      submit(){
			  this.$refs['form'].validate(valid=>{
          var params={...this.form};
			    if(valid){
			      var params={...this.form};
            params.is_free=this.form.is_free?1:0;
			      this.$http('/admin/course/insertOrUpdateCourse',{
			        id:this.pkid,
              ...params
            }).then(r=>{
              if(r.code==0){
                this.$message.success('保存成功！');
                this.$router.replace({path:'/offlineCourses'});
              }
            })
          }
        })
      },
		}
	}
</script>

<style lang="scss">
	.courseDetails {
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
    .qrcode{
      width: 120px;
      height: 120px;
    }
	}
</style>
