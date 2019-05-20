<template>
  <div class="commoditySpecification container">
    <el-form :inline="true" :model="filterForm">
      <el-form-item class="pull-right">
        <el-button @click="edit()">新增规格</el-button>
        <!--<el-button @click="export2Excel">批量导出</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="attribute_values" label="规格" ></el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" :disabled="scope.row.thumbnail.length==0" @click="getPhotosUrl(scope)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="vip_price" label="VIP价格"></el-table-column>
      <el-table-column prop="postage" label="邮费"></el-table-column>
      <el-table-column prop="stock" label="库存数量"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="is_sell_out" label="销售状态" :formatter="formatPopular"></el-table-column>
      <el-table-column prop="status" label="规格状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作"  align="center" width="220px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
          <!--<el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
                     :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--操作弹出框-->
    <el-dialog :title="rankDetail" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="form" :label-position="labelPosition" ref="form" :rules="rules">
        <el-form-item label="原产地" :label-width="formLabelWidth" prop="place_of_origin">
          <el-input v-model="form.place_of_origin " placeholder="请输入原产地"></el-input>
        </el-form-item>
        <el-form-item label="现价" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price" placeholder="请输入现价"></el-input>
        </el-form-item>
        <el-form-item label="VIP价" :label-width="formLabelWidth" prop="vip_price">
          <el-input v-model="form.vip_price " placeholder="请输入VIP价格"></el-input>
        </el-form-item>
        <el-form-item label="邮费" :label-width="formLabelWidth" prop="postage">
          <el-input placeholder="请输入邮费" v-model="form.postage "></el-input>
        </el-form-item>
        <el-form-item label="库存数量" :label-width="formLabelWidth" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="formLabelWidth" prop="attribute_values">
          <el-input v-model="form.attribute_values" placeholder="请输入商品规格"></el-input>
        </el-form-item>
        <el-form-item label="是否售罄" :label-width="formLabelWidth" prop="is_sell_out">
          <el-select v-model="form.is_sell_out" placeholder="请选择">
            <el-option v-if="typeDetail.length" :label="item.name" :value="item.id" v-for="(item,index) in typeDetail" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格状态" :label-width="formLabelWidth" prop="is_sell_out">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-if="SpecStatus.length" :label="item.name" :value="item.id" v-for="(item,index) in SpecStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" :label-width="formLabelWidth" prop="thumbnail">
          <!--<uploader  :fileName="fileName1" @success="fileCover" @remove="removeCover" :image="photos"></uploader>-->
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-progress="uploading"
            :on-error="fail"
            :on-success="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save">保 存</el-button>
      </div>
    </el-dialog>
    <!--查看图片详情弹出框-->
    <el-dialog title="查看图片详情" :visible.sync="photos_dialog" width="50%" class='photos-dialog'>
      <div v-for='item in photos' :key='item' class='photos-box'>
        <img :src="item" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tool from '@/util/tool'
  export default {
    data() {
      return {
        filterForm:{
          title: '',
          status:'',
        },
        pageSize: 10,
        pageNum: 1,
        total: 0,
        tableData: [],
        form: {
          place_of_origin: '',
          price: '',
          vip_price: '',
          postage: '',
          stock: '',
          attribute_values:'',
          is_sell_out:'',
          thumbnail:'',
          status:'',
          content_id:'',
        },
        typeDetail:[{
          name:'有货',
          id:1
        },{
          name:'售罄',
          id:2
        }],
        SpecStatus:[{
          name:'上架',
          id:0
        },{
          name:'下架',
          id:1
        }],
        rankDetail:'',
        dialogFormVisible: false,
        labelPosition: 'left',
        formLabelWidth: '120px',
        fileName1:'SpecificationsImage',
        rules:{
          place_of_origin:[{required:true,message:'请输入等级原产地',trigger:'blur'}],
          price:[{required:true,message:'请输入购买现价',trigger:'blur'}],
          vip_price:[{required:true,message:'请输入VIP价格',trigger:'blur'}],
          postage:[{required:true,message:'请输入邮费',trigger:'blur'}],
          stock:[{required:true,message:'请输入库存数量',trigger:'blur'}],
          // attribute_values:[{required:true,message:'请输入商品规格',trigger:'blur'}],
          is_sell_out:[{required:true,message:'请选择商品状态',trigger:'change'}],
          status:[{required:true,message:'请选择规格状态',trigger:'change'}],
          thumbnail:[{required:true,message:'请选择封面图片',trigger:'change'}],
        },
        photos_dialog:false,
        photos:[],
        editId:'',
        fileList:[]
      }
    },
    computed:{
      uploadUrl(){
        var api='/api/img/insertImage';
        return tool.baseUrl+api+'?folder='+this.fileName1;
      }
    },
    created() {
      this.getAttributeList();
    },
    methods: {
      //上传成功
      handlePreview(res,file){
        this.loading=false;
        if(res.code==0){
          var url=tool.imgBaseUrl+'/'+res.data;
          this.photos.push(url)
          this.form.thumbnail=this.photos.join(',')
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
      handleClose() {
        this.fileList=[]
        this.dialogFormVisible =false
      },
      //删除图片
      handleRemove(file, fileList) {
        var url = file.url
        if(file.response){
          url=tool.imgBaseUrl+'/'+file.response.data;
        }
        var index = this.photos.indexOf(url)
        this.photos.splice(index,1)
        this.form.thumbnail=this.photos.join(',');
      },
      changeImage(){
        for(var i=0;i<this.photos.length;i++){
          this.fileList.push({url:this.photos[i]})
        }
        console.log(this.fileList)
      },
      //格式化
      formatPopular(row,col){
        return row.is_sell_out === 1 ? '有货':'售罄'
      },
      //规格状态格式化
      formatStatus(row,col){
        return row.status === 0 ? '上架':'下架'
      },
      //翻页
      handleSizeChange(size) {
        this.pageSize = size;
        this.getAttributeList();
      },
      //改变每页条目
      handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getAttributeList();
      },
      //多选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取规格列表
      getAttributeList() {
        this.$http('/admin/commodity/getAttributeList', {
          page: this.pageNum,
          size: this.pageSize,
          content_id:this.$route.query.id
        }).then(res => {
          if(res.code == 0){
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
      },
      //获取所有图片Url
      getPhotosUrl(scope){
        this.photos_dialog = true;
        this.photos = scope.row.thumbnail.split(',')
      },
      //修改规格
      edit(item){
        if(item){
          this.rankDetail = '修改规格信息'
          this.editId = item.id
          this.form.place_of_origin = item.place_of_origin
          this.form.price = item.price
          this.form.vip_price = item.vip_price
          this.form.postage = item.postage
          this.form.stock = item.stock
          this.form.attribute_values = item.attribute_values
          this.form.is_sell_out = item.is_sell_out
          this.form.status = item.status
          this.form.thumbnail = item.thumbnail
          this.form.content_id = item.content_id
          this.photos = this.form.thumbnail.split(',')
          this.changeImage()
        }else{
          this.rankDetail = '新增规格'
          this.editId = ''
          this.form.place_of_origin = ''
          this.form.price = ''
          this.form.vip_price = ''
          this.form.postage = ''
          this.form.stock = ''
          this.form.attribute_values = ''
          this.form.is_sell_out = ''
          this.form.status = ''
          this.form.thumbnail = ''
          this.form.content_id = this.$route.query.id
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
                content_id:this.form.content_id,
                place_of_origin:this.form.place_of_origin,
                price:this.form.price,
                vip_price:this.form.vip_price,
                postage:this.form.postage,
                stock:this.form.stock,
                attribute_values:this.form.attribute_values,
                is_sell_out:this.form.is_sell_out,
                status:this.form.status,
                thumbnail:this.form.thumbnail
              }
            }else{
              params = {
                content_id:this.form.content_id,
                place_of_origin:this.form.place_of_origin,
                price:this.form.price,
                vip_price:this.form.vip_price,
                postage:this.form.postage,
                stock:this.form.stock,
                attribute_values:this.form.attribute_values,
                is_sell_out:this.form.is_sell_out,
                status:this.form.status,
                thumbnail:this.form.thumbnail
              }
            }
            console.log(params)
            this.$http('/admin/commodity/insertOrUpdateAttribute',params).then(res=>{
              if(res.code == 0){
                this.$message({
                  message:'修改成功',
                  type:'success'
                })
              }else{
                this.$message.error(res.message)
              }
              this.dialogFormVisible = false
              this.fileList = []
              this.getAttributeList()
            })
          }
        })
      },
    }
  }
</script>

<style lang='scss'>
  .commoditySpecification {
    .thumbnail {
      display: block;
      width: 100%;
      max-height: 120px;
      height: auto;
    }
    .photos-dialog{
      .photos-box{
        width: 33.3333%;
        display: inline-block;
        box-sizing: border-box;
        padding: 10px;
        img{
          width: 100%;
          height:150px;
        }
      }
    }
    .el-form-item__content{
      .upload-demo{
        .el-upload-list {
          float: none;
        }
      }
    }
  }
</style>
