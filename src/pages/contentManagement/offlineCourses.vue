<template>
  <div class="offlineCourses container">
    <!--查询-->
    <el-form :inline="true" :model="filterForm">
      <el-form-item>
        <el-input v-model="filterForm.title" placeholder="请输入课程关键字搜索" prefix-icon="el-icon-search"
                  @keyup.enter.native="getCourseList"></el-input>
      </el-form-item>
      <el-form-item label="课程种类">
        <el-select v-model="filterForm.c_category_id" placeholder="请选择课程种类" @change="getCourseList">
          <el-option label="请选择课程种类" value=""></el-option>
          <el-option v-if="lessonCategory.length"  :label="item.name" :value="item.id" v-for='(item,index) in lessonCategory' :key='index'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="filterForm.status" placeholder="课程状态" @change="getCourseList">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getCourseList" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="$router.push({path:'/courseCategory'})">分类管理</el-button>
        <el-button @click="$router.push({path:'/courseDetails'})">新增课程</el-button>
        <el-button @click="remove()">批量删除</el-button>
        <el-button @click="export2Excel">批量导出</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="name" label="课程种类"></el-table-column>
      <el-table-column prop="title" label="课程标题"></el-table-column>
      <el-table-column label="课程封面"  min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail" width="40" height="40" class="thumbnail"/>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="开课时间" width="160"></el-table-column>
      <el-table-column prop="specificsite" label="课程地点"></el-table-column>
      <el-table-column prop="course_status" label="课程状态">
      </el-table-column>
      <el-table-column label="上课管理" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({path:'/classManagement',query:{id:scope.row.id}})" icon="el-icon-edit-outline">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({path:'/courseDetails',query:{id:scope.row.id}})" icon="el-icon-edit-outline">修改</el-button>
          <el-button type="text" @click="remove(scope.row.id)" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class='page'
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  export default {
    data() {
      return {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        filterForm: {
          title: '',
          c_category_id: '',
          status: ''
        },
        tableData: [],
      }
    },
    computed:{
      ...mapState({
        lessonCategory:state=>state.lessonCategory
      })
    },
    created() {
      this.getCourseList();
      this.getLessonCategory();
    },
    watch:{
      lessonCategory(val){

      }
    },
    methods: {
      //改变每页条数
      handleSizeChange(size) {
        this.pageSize = size;
        this.getCourseList()
      },
      //翻页
      handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getCourseList()
      },
      //多选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取线下课程列表
      getCourseList() {
        this.$http('/admin/course/getCourseList', {
          page: this.pageNum,
          size: this.pageSize,
          ...this.filterForm

        }).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
      },
      //删除
      remove(pkid) {
        var arr=[];
        var ids;
        if(pkid){
          ids=pkid;
        }else{
          for(var i=0;i<this.multipleSelection.length;i++){
            arr.push(this.multipleSelection[i].id);
          }
          ids=arr.join(',');
        }
        if(!ids){
          return;
        }
        this.$confirm('是否删除?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http('/admin/course/deleteCourseByIds',{
            ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功');
              this.getCourseList();
            }
          })
        })
      },
      //查询课程分类
      getLessonCategory(){
        this.$store.dispatch('getLessonCategory');
      },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','课程种类', '课程标题', '课程封面', '开课时间', '开课地点','课程状态'];
          let filterVal = ['id','name', 'title', 'thumbnail', 'start_time', 'specificsite','course_status'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          /* for(var i=0;i<data.length;i++){
             data[i][2] = data[i][2]==''?"无":this.formatImg(data[i][2]);
             data[i][8] = data[i][8]==0?"0":tool.timeFormat(data[i][8]);
           }*/
          export_json_to_excel(tHeader, data, '线下课程列表excel');
        })
      },
    }
  }
</script>

<style lang="scss">
  .offlineCourses {
    .el-header {
      background-color: white;
      padding: 10px 30px;
      margin-bottom: 6px;
    }

    .thumbnail {
      display: block;
      width: 100%;
      max-height: 120px;
      height: auto;
    }
  }
</style>
