<template>
	<div class="accountPermissions container">
    <el-form  :inline="true" :model="searchform">
      <el-form-item>
        <el-input v-model="searchform.role_name" placeholder="请输入角色名称" prefix-icon="el-icon-search" @keyup.enter.native='getAdminList'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getAdminList" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="edit()">新建账号</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="user_name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="手机号(账号)"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作权限" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline"  @click="showPowers(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline"  @click="edit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete"  @click="deleteAdmin(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
       :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
		<!--新建账号弹出框-->
		<el-dialog :title="editTitle" :visible.sync="addAccountDialog">
			<el-form :model="addform" label-width="110px" ref="addform" :rules="rules">
				<el-row>
					<el-col :span="12">
						<el-form-item label="角色" prop="role_name">
							<el-input v-model="addform.role_name" placeholder="请输入角色名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" prop="user_name">
							<el-input v-model="addform.user_name" placeholder="请输入角色名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手机号(账号)" prop="phone" >
							<el-input v-model="addform.phone" placeholder="请输入手机号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input v-model="addform.password" placeholder="请输入密码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="addform.email" placeholder="请输入邮箱"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="save">保 存</el-button>
			</div>
		</el-dialog>
	  <el-dialog title="权限编辑" :visible.sync="showPowerDialog" width="80%">
      <div class="info" v-if="userInfo">当前账号：{{userInfo.role_name}} {{userInfo.user_name}}{{userInfo.phone}}</div>
      <section>
        <div class="sec-hd">
          <span class='title'>用户权限</span>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">模块全选</el-checkbox>
        </div>
        <el-row v-for="(module,index) in powers" :key="index" v-if="powers">
          <el-col :span='2' :offset='1'>
            <span class='el-checkbox__label' v-if="module.pid==0">系统管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==1">用户管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==2">课程管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==3">视频管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==4">文章管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==5">推广管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==6">秘籍管理：</span>
            <span class='el-checkbox__label' v-if="module.pid==7">权限管理：</span>
            <span class='el-checkbox__label' v-if="module.pid===8">商品管理：</span>
          </el-col>
          <el-col :span='20'>
            <el-checkbox v-for="item in module.list" :key="item.id" v-model="item.is_checked" @change="itemChange(item.is_checked )">{{item.name}}{{item.id}}</el-checkbox>
          </el-col>
        </el-row>
      </section>
      <div class="btn-group">
        <el-button @click="setPower" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        addAccountDialog: false,
        showPowerDialog:false,
        searchform:{
          role_name: '',
        },
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
        addform: {
					role_name: '',
					user_name: '',
					phone: '',
					password: '',
					email: ''
				},
        id:'',
        editTitle:'',
        rules:{
          role_name:[{required:true,message:'请输入角色名称',trigger:'blur'}],
          user_name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          phone:[{required:true,message:'请输入手机号（账号）',trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
          email:[{required:true,message:'请输入邮箱',trigger:'blur'}],
        },
        powers:[],//全部权限
        powersId:'',//全部权限Id
        checkAll:false,
        isIndeterminate:true,
        userPowers:[],//用户权限
        userInfo:'',
			}
		},
		created() {
			this.getAdminList();
			this.getMenuList();
		},
		methods: {
			handleSizeChange(size) {
				this.pageSize = size;
				this.getAdminList()
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getAdminList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取账号列表
			getAdminList() {
				this.$http('/admin/setting/getAdminList', {
						page: this.pageNum,
						size: this.pageSize,
						role_name: this.searchform.role_name
				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
      //权限列表
      getMenuList() {
        this.$http('/admin/setting/getMenuList', {
          page:1,
          size:500
        }).then(res => {
          if (res.code == 0) {
            var list=res.data.list;
            this.powers = Object.values(list.reduce((res, item) => {
              item['is_checked']=false;
              if(res[item.pid]){
                res[item.pid]['pid']=item.pid;
                res[item.pid]['list'].push(item);
              }else{
                res[item.pid]={};
                res[item.pid]['pid']=item.pid;
                res[item.pid]['list']=[item];
              }
              return res;
            }, {}));
            var arr=[];
            for (let i = 0; i <list.length ; i++) {
              arr.push(list[i].id);
            }
            this.powersId=arr.sort(function (a,b) {
              return a-b;
            }).join(',');
          }
        })
      },
			//新增修改账号
			edit(item) {
        if(item){
          this.editTitle = '修改账号信息'
          this.id = item.id;
          this.addform.user_name = item.user_name
          this.addform.role_name = item.role_name
          this.addform.phone = item.phone
          this.addform.password = item.password
          this.addform.email = item.email
        }else{
          this.editTitle = '新增账号信息'
          this.id = ''
          this.addform.user_name = ''
          this.addform.role_name = ''
          this.addform.phone = ''
          this.addform.password = ''
          this.addform.email = ''
        }
        this.addAccountDialog = true
			},
      //保存修改
      save(){
        this.$refs['addform'].validate(valid=> {
          if (valid) {
            var params
            if(this.id){
              params = {
                id:this.id,
                ...this.addform
              }
            }else{
              params = {
                ...this.addform
              }
            }
            this.$http('/admin/setting/insertOrUpdateAdmin',params).then(res=>{
              if (res.code == 0) {
                this.$message({
                  message: res.data,
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
              this.addAccountDialog = false
              this.getAdminList()
            })
          }
        })
      },
			//删除管理员
			deleteAdmin(scope) {
        this.$confirm('是否确认删除该账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/setting/deleteAdmin', {
            id: scope.row.id
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message:'删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.message)
            }
            this.getAdminList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
			},
      //打开权限弹框
      showPowers(item){
			  this.userPowers=[];
			  this.showPowerDialog=true;
			  this.userInfo=item;
			  if(this.userInfo.roles){
			    if(this.userInfo.roles=='*'){
			      this.checkAll=true;
			      this.isIndeterminate=false;
            for (let i = 0; i < this.powers.length; i++) {
              for (let j = 0; j < this.powers[i].list.length; j++) {
                this.powers[i].list[j].is_checked=true;
                this.userPowers.push(this.powers[i].list[j].id);
                this.checkAll=true;
                this.isIndeterminate=false;
              }
            }
          }else{
            this.userPowers=this.userInfo.roles.split(',');
            this.isIndeterminate=true;
            for (let i = 0; i < this.powers.length; i++) {
              for (let j = 0; j < this.powers[i].list.length; j++) {
                this.powers[i].list[j].is_checked=false;
                for (let k = 0; k <this.userPowers.length ; k++) {
                  if(this.userPowers[k]==this.powers[i].list[j].id){
                    this.powers[i].list[j].is_checked=true;
                  }
                }
              }
            }
          }
        }else{
          for (let i = 0; i < this.powers.length; i++) {
            for (let j = 0; j < this.powers[i].list.length; j++) {
              this.powers[i].list[j].is_checked=false;
              this.userPowers=[];
              this.checkAll=false;
              this.isIndeterminate=false;
            }
          }
        }
      },
      //权限全选或者全部取消
      checkAllChange(){
        this.isIndeterminate=false;
        for (let i = 0; i < this.powers.length; i++) {
          for (let j = 0; j < this.powers[i].list.length; j++) {
            if(this.checkAll){
              this.powers[i].list[j].is_checked=true;
              this.userPowers.push(this.powers[i].list[j].id);
            }else{
              this.powers[i].list[j].is_checked=false;
              this.userPowers=[];
            }
          }
        }
      },
      //权限单选
      itemChange(data){
			  var arr=[];
        for (let i = 0; i < this.powers.length; i++) {
          for (let j = 0; j < this.powers[i].list.length; j++) {
            if(this.powers[i].list[j].is_checked){
             arr.push(this.powers[i].list[j].id);
            }
          }
        }
        this.userPowers=arr;
        var str=this.userPowers.sort((a,b)=>{
          return a-b;
        }).join(',');
        if(str==this.powersId){
          this.isIndeterminate=false;
          this.checkAll=true;
        }
        if(str==''){
          this.isIndeterminate=false;
          this.checkAll=false;
        }
        if(str!=this.powersId && str!=''){
          this.isIndeterminate=true;
        }
      },
      //提交权限设置
      setPower(){
        var ids=this.userPowers.sort((a,b)=>{
          return a-b;
        }).join(',');
        if(ids==this.powersId){
          ids='*';
        }
			  this.$http('/admin/setting/updateRole',{
			    id:this.userInfo.id,
          roles:ids
        }).then(r=>{
          if(r.code==0){
            this.$message.success('设置成功！');
            this.showPowerDialog=false;
            this.getAdminList();
          }
        })
      }
		}
	}
</script>

<style lang='scss'>
	.accountPermissions {
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
