<template>
	<div class="systemNotification container">
        <el-form  :inline="true">
          <el-form-item class="pull-right">
            <el-button @click="addAccount_dialog = true">新增</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="title" label="消息标题"></el-table-column>
						<el-table-column prop="content" label="消息内容"></el-table-column>
						<el-table-column prop="info_link" label="消息链接"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" @click="getMsgDetail(scope)">修改</el-button>
								<el-button type="text" icon="el-icon-delete"  @click="deleteMsg(scope)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>

		<!--新增弹出框-->
		<el-dialog title="新增通知" :visible.sync="addAccount_dialog">
			<el-form :model="form" label-width="100px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="消息标题">
							<el-input v-model="form.title" placeholder="消息标题"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label='消息内容'>
							<el-input type="textarea" v-model="form.content" placeholder="消息内容" :rows="5" resize="none"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addMsg">保 存</el-button>
			</div>
		</el-dialog>
		<!--修改消息弹出框-->
		<el-dialog title="修改通知消息" :visible.sync="changeMsg_dialog">
			<el-form :model="form1" label-width="100px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="消息标题">
							<el-input v-model="form1.title" placeholder="消息标题"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label='消息内容'>
							<el-input type="textarea" v-model="form1.content" placeholder="消息内容" :rows="5" resize="none"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="changeMsg">保 存</el-button>
				<el-button type="primary" @click="sendMsg">发 送</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				addAccount_dialog: false,
				deleteAccount_dialog: false,
				changeMsg_dialog: false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
				form: {
					title: '',
					content: ''
				},
				form1: {
				  id:'',
					title: '',
					content: ''
				},
			}
		},
		created() {
			this.getMsgList()
		},
		methods: {
			handleSizeChange(size) {
				this.pageSize = size;
				this.getMsgList()
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getMsgList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取系统通知列表
			getMsgList() {
				this.$http('/admin/setting/getMsg', {
						page: this.pageNum,
						size: this.pageSize
				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//新增消息
			addMsg() {
				this.$http('/admin/setting/insertOrUpdateMsg', {

						...this.form

				}).then(res => {
					if (res.code == 0) {
						this.$message({
							message: res.data,
							type: 'success'
						})
					} else {
						this.$message.error(res.message)
					}
					this.addAccount_dialog = false
					this.form.title = ''
					this.form.content = ''
					this.getMsgList()
				})
			},
			//修改消息
			getMsgDetail(scope) {
				this.changeMsg_dialog = true
				this.form1.id = scope.row.id
				this.form1.title = scope.row.title
				this.form1.content = scope.row.content
			},
			changeMsg() {
				this.$http('/admin/setting/insertOrUpdateMsg', {
						...this.form1

				}).then(res => {
					if (res.code == 0) {
						this.$message({
							message: res.data,
							type: 'success'
						})
					} else {
						this.$message.error(res.message)
					}
					this.changeMsg_dialog = false
					this.getMsgList()
				})
			},
      //发送系统消息
       sendMsg(){
			  this.$http('/admin/setting/sendMsg',{id:this.form1.id}).then(res=>{
          if(res.code == 0){
            this.$message({
              message:'发送成功',
              type:'success'
            })
          }else{
            this.$message.error(res.message)
          }
          this.changeMsg_dialog = false;
          this.getMsgList()
        })
       },
			//删除消息
      deleteMsg(scope){
        this.$confirm('确认删除改消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/setting/deleteMsg',{
            id:scope.row.id
          }).then(res=>{
            if (res.code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.message)
            }
            this.getMsgList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
			},
		}
	}
</script>

<style lang='scss'>
	.systemNotification {

	}
</style>
