<template>
	<div class="commodityInformation">
			<div class="container">
        <el-form  :inline="true">
          <el-form-item>
            <el-button icon="el-icon-back" type="text" style="font-size: 18px;" @click="returnRouter"></el-button>
          </el-form-item>
        </el-form>
					<el-form ref="commodityform" :model="commodityform" label-width="80px" >
					<el-row>
            <el-form-item label-width="10px">
              <div class="title">订单信息</div>
            </el-form-item>
						<el-col :span="6">
							<el-form-item label="订单类型:" label-width="90px"  class="big-size">
								<span>{{commodityform.module_name}}</span>
							</el-form-item>
						</el-col>
            <el-col :span="6">
              <el-form-item label="订单名称:" label-width="90px"  class="big-size">
                <span>{{commodityform.title}}</span>
              </el-form-item>
            </el-col>
						<el-col :span="6">
							<el-form-item label="订单号:"  class="big-size">
								<span>{{commodityform.order_no}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="下单时间:" label-width="90px"  class="big-size">
								<span>{{commodityform.c_time}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单状态:" label-width="90px"  class="big-size">
								<span>{{commodityform.status_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="下单人:"  class="big-size">
								<span>{{commodityform.customer_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单总额:" label-width="90px"  class="big-size">
								<span>{{commodityform.total_price}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="支付方式:" label-width="90px"  class="big-size">
								<span>{{commodityform.payment_name}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
              <el-form-item label="是否分润:" label-width="90px"  class="big-size">
                <span>{{commodityform.is_share == 0?'未分润':'已分润'}}</span>
              </el-form-item>
						</el-col>
					</el-row>
					</el-form>
        <el-form ref="commentform" :model="commentform" label-width="80px"   class="big-size">
          <el-row>
            <el-form-item label-width="10px">
              <div class="title">评价信息</div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="评价时间" label-width="90px"  class="big-size">
                {{commentform.c_time}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评价内容" label-width="90px"  class="big-size">
                {{commentform.desc}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        commodityform:{
          module_name:'',
          title:'',
          order_no:'',
          c_time:'',
          status_name:'',
          customer_name:'',
          total_price:'',
          payment_name:'',
          is_share:'',
        },
        commentform:{
          c_time:'',
          desc:''
        }
			}
		},
    created(){
		  this.getOrderById()
    },
		methods: {
			returnRouter() {
				this.$router.go(-1);
			},
      //查询订单详情
      getOrderById(){
			  this.$http('/admin/order/getOrderById',{id:this.$route.query.id}).then(res=>{
			    if(res.code == 0){
			      this.commodityform = res.data.order
            if (res.data.order_comment[0]){
              this.commentform = res.data.order_comment[0]
            }
          }
        })
      }
		}
	}
</script>

<style lang="scss">
	.commodityInformation {

	}
</style>
