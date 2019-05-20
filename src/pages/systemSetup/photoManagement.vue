<template>
	<div class="photoManagement container">
        <el-form  :inline="true" :model="filterForm">
          <el-form-item>
            <el-select v-model="filterForm.category" @change = 'getBannerList'>
              <el-option label="请选择轮播图类型" value=""></el-option>
              <el-option label="商品首页轮播" value="1"></el-option>
              <el-option label="发现首页轮播" value="2"></el-option>
              <el-option label="学院首页轮播" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="edit()">新增</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="category" label="类型" :formatter="formatType"></el-table-column>
						<el-table-column  label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.bannerurl" width="40" height="40" class="thumbnail" />
              </template>
            </el-table-column>
						<el-table-column prop="bannerurl" label="缩略图地址"></el-table-column>
						<el-table-column prop="sort" label="顺序"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline"  @click="edit(scope.row)">修改</el-button>
								<el-button type="text" icon="el-icon-delete"  @click="del(scope)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
		<!--新增修改轮播图弹出框-->
		<el-dialog :title="editTitle" :visible.sync="addAccount_dialog">
			<el-form :model="editForm" label-width="100px" ref="editForm">
				<el-form-item label="轮播图类型">
					<el-select v-model="editForm.category" placeholder="请选择轮播图类型" @change="getCategory">
            <el-option v-if="categoryDetail.length" :label="item.name" :value="item.id" v-for="(item,index) in categoryDetail" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上传图片">
          <uploader  :fileName="fileName1" @success="fileCover" @remove="removeCover" :image="editForm.bannerurl"></uploader>
				</el-form-item>
        <el-form-item label="跳转类型" >
          <el-select v-model="editForm.type " placeholder="请选择跳转类型" @change="changeType">
            <el-option v-if="typeDetail.length" :label="item.name" :value="item.id" v-for="(item,index) in typeDetail" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块类型">
          <el-select v-model="editForm.module" placeholder="请选择模块类型" :disabled="status" @change="getDetail">
            <el-option v-if="allMoudle.length" :label="item.name" :value="item.id" v-for="(item,index) in allMoudle" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" >
          <el-select v-model="editForm.target" placeholder="请选择标题" :disabled="status" >
            <el-option v-if="moduleDetail.length" :label="item.title" :value="JSON.stringify(item.id)" v-for="(item,index) in moduleDetail" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="editForm.link" :disabled="linkStatus"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="editForm.sort" placeholder="请输入图片顺序"></el-input>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="submit">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import uploader from '@/components/uploader';
  import tool from '@/util/tool';
	export default {
    components: {
      uploader
    },
		data() {
			return {
			  status:false,
        linkStatus:false,
        moduleDetail:[],
        allMoudle:[],
        categoryDetail:[{
			    name:'商品首页轮播',
          id:1
        },{
          name:'发现首页轮播',
          id:2
        },{
          name:'学院首页轮播',
          id:3
        }],
        typeDetail:[{
          name:'不跳转',
          id:0
        },{
			    name:'外网',
          id:1
        },{
          name:'应用内部',
          id:2
        }],
        fileName1:'',
        filterForm:{
          category : '',
        },
				addAccount_dialog: false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
        editTitle:'',
				tableData: [],
        editForm: {
			    link:'',
          category: '',
          type:'',
          module:'',
          target:'',
          sort:'',
          bannerurl:''
				},
        editId:''
			}
		},
    created(){
		  this.getBannerList()
      this.getAllMoudle()
    },
		methods: {
      //改变上传轮播图文件夹名
      getCategory(){
        this.editForm.thumbnail = ''
        if(this.editForm.category == 1 || this.editForm.category == '商品轮播图'){
          this.fileName1 = 'mallBanners'
        }else if(this.editForm.category == 2 || this.editForm.category == '发现轮播图'){
          this.fileName1 = 'findBanners'
        }else if(this.editForm.category ==3 || this.editForm.category == '学院轮播图'){
          this.fileName1 = 'collegeBanners'
        }
      },
      //格式化轮播图类型
      formatType: function(row, column) {
        return row.category === 1 ? '商品首页轮播':row.category === 2?'发现首页轮播':'学院首页轮播'
      },
			handleSizeChange(size) {
        this.pageSize = size;
        this.getBannerList()
			},
			handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getBannerList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      //获取轮播图列表
      getBannerList(){
        this.$http('/admin/course/getBannerList',{
          page: this.pageNum,
          size: this.pageSize,
          category:this.filterForm.category
        }).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
      },
      //上传缩略图
      fileCover(data){
        this.editForm.bannerurl=data
      },
      //删除缩略图
      removeCover(){
        this.editForm.bannerurl='';
      },
      //改变跳转类型状态
      changeType(){
        if(this.editForm.type == 0 || this.editForm.type == '不跳转'){
          this.status = true
          this.linkStatus = true
          this.editForm.module=''
          this.editForm.target=''
          this.editForm.link = ''
        }else if(this.editForm.type == 1 || this.editForm.type == '外网'){
          this.status = true
          this.linkStatus =false
          this.editForm.module=''
          this.editForm.target=''
        }else if(this.editForm.type == 2 || this.editForm.type == '应用内部'){
          this.status = false
          this.linkStatus = true
          this.editForm.link = ''
        }
      },
      //根据模块查询详情的标题
      getDetail(){
        this.editForm.target = ''
        this.$http('/admin/course/getByModule',{
          module:this.editForm.module
        }).then(res=>{
          if(res.code ==0){
            this.moduleDetail = res.data
          }
        })
      },
      //获取所有Moudle类型
      getAllMoudle(){
          this.$http('/admin/course/getAllModule').then(res=>{
            if(res.code == 0){
              this.allMoudle = res.data
            }
          })
      },
      //新增，修改轮播图
      edit(item){
        if(item){
          this.editId=item.id
          this.editTitle = '修改轮播图'
          this.editForm.category =item.category
          this.editForm.bannerurl = item.bannerurl
          this.editForm.sort = item.sort
          this.getCategory()
          this.editForm.type = item.type
          if(this.editForm.type == 1 || this.editForm.type == '外网'){
            this.status = true
            this.linkStatus =false
            this.editForm.link = item.target
            this.editForm.module=''
            this.editForm.target=''
          }else if(this.editForm.type == 2 || this.editForm.type == '应用内部'){
            this.status = false
            this.linkStatus = true
            this.editForm.link = ''
            this.editForm.module = item.module
            this.getDetail()
            this.editForm.target = item.target
          }else{
            this.status = true
            this.linkStatus = true
            this.editForm.module=''
            this.editForm.target=''
            this.editForm.link = ''
          }
        }else{
          this.editTitle = '新增轮播图'
          this.editId=''
          this.editForm.link= ''
          this.editForm.category = ''
          this.editForm.type = ''
          this.editForm.module = ''
          this.editForm.sort = ''
          this.editForm.bannerurl = ''
          this.editForm.target = ''
        }
        this.addAccount_dialog = true
      },
      //删除轮播图
      del(scope){
        this.$confirm('是否确认删除该轮播图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/course/deleteBannner',{id:scope.row.id}).then(res=>{
              if(res.code == 0){
                this.$message.success('删除成功')
              }else{
                this.$message.error(res.message)
              }
            this.getBannerList()
          })
        }).catch(() => {

        });
      },
      //提交
      submit(){
        this.$refs['editForm'].validate(valid=>{
          if(valid){
            var params
            if(this.editForm.type ==1){
             params = {
                id:this.editId,
                category:this.editForm.category,
                banner_url:this.editForm.bannerurl,
                sort:Number(this.editForm.sort),
                type:this.editForm.type,
                target:this.editForm.link,
                module:this.editForm.module
              }
            }else{
              params ={
                id:this.editId,
                category:this.editForm.category,
                banner_url:this.editForm.bannerurl,
                sort:Number(this.editForm.sort),
                type:this.editForm.type,
                target:this.editForm.target,
                module:this.editForm.module
              }
            }
            this.$http('/admin/course/insertOrUpdateBanner',params).then(res=>{
              if(res.code == 0){
                this.$message.success('保存成功')
              }else{
                this.$message.error(res.message)
              }
              this.getBannerList()
              this.addAccount_dialog =false
            })
          }
        })
      }
		}
	}
</script>

<style lang='scss'>
	.photoManagement {
    .thumbnail {
      display: block;
      width: 100%;
      height: auto;
    }
	}
</style>
