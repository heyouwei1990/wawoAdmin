<template>
	<div class="membershipLevel container">
    <el-form :inline="true" >
      <el-form-item class="pull-right">
        <el-button @click="edit()">新增</el-button>
      </el-form-item>
    </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="name" label="等级"></el-table-column>
						<el-table-column prop="equities" label="会员权益"></el-table-column>
						<el-table-column prop="price" label="购买价格"></el-table-column>
						<el-table-column prop="gift_score" label="赠送信用值"></el-table-column>
						<el-table-column prop="profit_ratio" label="分润比例%"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
                <el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
		<!--操作弹出框-->
		<el-dialog :title="rankDetail" :visible.sync="dialogFormVisible">
			<el-form :model="form" :label-position="labelPosition" ref="form" :rules="rules">
				<el-form-item label="等级" :label-width="formLabelWidth" prop="name">
					<el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
				</el-form-item>
				<el-form-item label="购买价格" :label-width="formLabelWidth" prop="price">
					<el-input v-model="form.price" placeholder="请输入购买价格"></el-input>
				</el-form-item>
				<el-form-item label="赠送信用值" :label-width="formLabelWidth" prop="gift_score">
					<el-input v-model="form.gift_score" placeholder="请输入购买赠送信用值"></el-input>
				</el-form-item>
				<el-form-item label="分润比例%" :label-width="formLabelWidth" prop="profit_ratio">
          <el-input placeholder="请输入分润%" v-model="form.profit_ratio">
            <template slot="append">%</template>
          </el-input>
				</el-form-item>
				<el-form-item label="会员权益" :label-width="formLabelWidth" prop="equities">
					<el-input type="textarea" :rows="5" placeholder="请输入会员权益" v-model="form.equities"  resize="none">
					</el-input>
				</el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth" prop="thumbnail">
          <uploader  :fileName="fileName1" @success="fileCover" @remove="removeCover" :image="form.thumbnail"></uploader>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="save">保 存</el-button>
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
				pageSize: 10,
				pageNum: 1,
				total: 0,
        rankDetail:'',
        fileName1:'rankImage',
				dialogFormVisible: false,
				labelPosition: 'left',
				form: {
          name: '',
          price: '',
          gift_score: '',
          profit_ratio: '',
          equities: '',
          thumbnail:''
				},
				tableData: [],
				formLabelWidth: '120px',
        editId:'',
        rules:{
          name:[{required:true,message:'请输入等级名称',trigger:'blur'}],
          price:[{required:true,message:'请输入购买价格',trigger:'blur'}],
          gift_score:[{required:true,message:'请输入赠送信用值',trigger:'blur'}],
          profit_ratio:[{required:true,message:'请输入分润比例%',trigger:'blur'}],
          equities:[{required:true,message:'请输入会员权益',trigger:'blur'}],
          thumbnail:[{required:true,message:'请选择封面图片',trigger:'change'}],
        }
			}
		},
		created() {
			this.getRankList()
		},
		methods: {
			handleSizeChange(size) {
				this.pageSize = size;
				this.getRankList()
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getRankList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//获取会员等级信息
			getRankList() {
				this.$http('/admin/customer/getRankList', {
						page: this.pageNum,
						size: this.pageSize,
				}).then(res=>{
					if ( res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
      //修改会员等级信息
      edit(item){
			  if(item){
			    this.rankDetail = '修改会员等级信息'
          this.editId = item.id
          this.form.name = item.name
          this.form.price = item.price
          this.form.gift_score = item.gift_score
          this.form.profit_ratio = item.profit_ratio
          this.form.equities = item.equities
          this.form.thumbnail = item.thumbnail
        }else{
			    this.rankDetail = '新增会员等级'
          this.form.name = ''
          this.form.price = ''
          this.form.gift_score = ''
          this.form.profit_ratio = ''
          this.form.equities = ''
          this.form.thumbnail = ''
        }
			  this.dialogFormVisible = true
      },
      save(){
        this.$refs['form'].validate(valid=> {
          if (valid) {
            var params
            if(this.editId){
              params = {
                id:this.editId,
                name:this.form.name,
                price:this.form.price,
                gift_score:this.form.gift_score,
                profit_ratio:this.form.profit_ratio,
                equities:this.form.equities,
                thumbnail:this.form.thumbnail
              }
            }else{
              params = {
                name:this.form.name,
                price:this.form.price,
                gift_score:this.form.gift_score,
                profit_ratio:this.form.profit_ratio,
                equities:this.form.equities,
                thumbnail:this.form.thumbnail
              }
            }
            this.$http('/admin/customer/insertOrUpdateRank',params).then(res=>{
              if(res.code == 0){
                this.$message({
                  message:res.data,
                  type:'success'
                })
              }else{
                this.$message.error(res.message)
              }
              this.dialogFormVisible = false
              this.getRankList()
            })
          }
        })

      },
      //删除会员等级
      remove(pkid){
        this.$confirm('是否删除该分类','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http('/admin/customer/deleteRank',{id:pkid}).then(res=>{
            if(res.code == 0){
              this.$message.success('删除成功！');
            }else{
              this.$message.error(res.message)
            }
            this.getRankList()
          })
        }).catch(()=>{

        })
      },
      //上传缩略图
      fileCover(data){
        this.form.thumbnail=data
        console.log(this.form.thumbnail)
      },
      //删除缩略图
      removeCover(){
        this.form.thumbnail='';
        this.getRankList()
      },
		}
	}
</script>

<style lang="scss">
	.membershipLevel {

	}
</style>
