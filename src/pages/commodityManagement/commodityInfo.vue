<template>
	<div class="commodityInfo container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title " placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存数量" prop="stock">
            <el-input v-model="form.stock " placeholder="请输入库存数量"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原产地" prop="place_of_origin">
            <el-input v-model="form.place_of_origin " placeholder="请输入原产地"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮费" prop="postage">
            <el-input v-model="form.postage " placeholder="请输入邮费"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品原价" prop="orig_price">
            <el-input v-model="form.orig_price " placeholder="请输入商品原价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品现价" prop="price">
            <el-input v-model="form.price " placeholder="请输入商品现价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="VIP价" prop="vip_price">
            <el-input v-model="form.vip_price " placeholder="请输入VIP价格"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属分类" prop="c_category_id">
            <el-select v-model="form.c_category_id " placeholder="请选择分类">
              <el-option v-if="goodsCategory.length" :label="item.name" :value="item.id" v-for="(item,index) in goodsCategory" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐" prop="is_popular">
            <el-select v-model="form.is_popular " placeholder="推荐">
              <el-option label="不推荐" :value="0"></el-option>
              <el-option label="商城推荐" :value="1"></el-option>
              <el-option label="首页推荐" :value="2"></el-option>
              <el-option label="首页、商城推荐" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="摘要" prop="summary">
            <el-input class="textarea" resize="none" v-model="form.summary " type="textarea" placeholder="请输入内容摘要"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="顺序" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入顺序"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品封面图" label-width='100px' prop="thumbnail">
            <uploader :fileName="fileName1" @success="fileCover" @remove="removeCover" :image="form.thumbnail"></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label-width="0px">
            <vue-neditor-wrap v-model="form.content" :config="myConfig" :destroy="false" ></vue-neditor-wrap>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--<div id='editor' style='height:300px'></div>-->
    <div class="btn-group">
      <el-button  type="primary" @click="submit">保存</el-button>
    </div>
	</div>
</template>

<script>
	import uploader from '@/components/uploader';
  import tool from '@/util/tool';
	import {mapState,mapActions} from 'vuex'
  import VueNeditorWrap from 'vue-neditor-wrap'
	export default {
		components: {
			uploader,
      VueNeditorWrap,
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
				fileName1: 'articleCover',
				iconUrl:'',
				pkid:'',
				form: {
					stock : '',
					title : '',
					place_of_origin : '',
					summary : '',
					orig_price : '',
					price : '',
					vip_price : '',
					thumbnail :"",
					postage : '',
					c_category_id : '',
					is_popular : 0,
					status :'',
          content:'',
          sort:''
				},
				rules:{
					title:[{required:true,message:'商品名称是必填项',trigger:'blur'}],
					thumbnail:[{required:true,message:'请上传商品封面图',trigger:'change'}],
					stock:[{required:true,message:'库存数量是必填项',trigger:'blur'},{validator:validateAmount,trigger:'blur'}],
					place_of_origin:[{required:true,message:'原产地是必填项',trigger:'blur'}],
					summary:[{required:true,message:'摘要是必填项',trigger:'blur'}],
					orig_price:[{required:true,message:'商品原价是必填项',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
					price:[{required:true,message:'商品现价是必填项',trigger:'blur'},{validator:validatePrice,trigger:'blur'},{validator:validateNotFree,trigger:'blur'}],
					vip_price:[{required:true,message:'VIP价格是必填项',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
					postage:[{required:true,message:'邮费是必填项',trigger:'blur'},{validator:validatePrice,trigger:'blur'}],
					c_category_id:[{required:true,message:'所属分类是必填项',trigger:'change'}],
					is_popular:[{required:true,message:'推荐是必选项',trigger:'change'}],
					status:[{required:true,message:'商品状态是必填项',trigger:'change'}],
          content:[{required:true,message:'请编辑商品详情',trigger:'change'}],
          summary:[{required:true,message:'请编辑摘要',trigger:'change'}],
          sort:[{required:true,message:'请输入顺序',trigger:'blur'}],
				},
        myConfig:{
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
          serverUrl: window.URLCONFIG.baseUrl+'/api/img/insertImage?folder=goodsDetail',
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
    computed:{
      ...mapState({
        goodsCategory:state=>state.goodsCategory
      })
    },
		created() {
			this.pkid=this.$route.query.id;
			this.init();
			this.getGoodsCategory();
		},
		methods: {
		  //初始化
			init(){
        if(!this.pkid){
          return;
        }
				this.$http('/admin/commodity/getCommodityById',{id:this.pkid}).then(res=>{
					if(res.code==0){
						// this.form=res.data;
						for(var i in this.form){
							if(i in res.data.content_commodity){
								this.form[i] = res.data.content_commodity[i]
							}
              if(i in res.data.content){
                this.form[i]=res.data.content[i];
              }
						}
					}
				})
			},
      getGoodsCategory(){
			  this.$store.dispatch('getGoodsCategory');
      },
			 //上传缩略图
			fileCover(data){
			  this.form.thumbnail=data;
			},
			//删除缩略图
			removeCover(){
			  this.form.thumbnail='';
			},
      //获取html
      catchData(data){
			  this.form.content=data;
      },
      //提交
			submit(){
				this.$refs['form'].validate(valid=>{
					if(valid){
						this.$http('/admin/commodity/insertOrUpdateCommodity',{
						  id:this.pkid,
              ...this.form,
            }).then(r=>{
              if(r.code==0){
                this.$message.success('保存成功！');
                this.$router.push({path:'/proprietaryCommodities'});
              }else{
                this.$message.error('保存失败')
              }
            })
					}
				})
			}	
		},

	}
</script>

<style lang="scss">
	.commodityInfo {
		.btn-group{
      text-align: center;
      margin-top: 40px;
      .el-button{
        width: 120px;
      }
    }
    .textarea{
      resize: none;
      min-width:400px;
    }
    .el-select{
      width: 100%;
    }
	}
</style>
