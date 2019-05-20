<template>
  <div class="classManagement container">
    <div class="info">当前账号：客服人员 张三 1399999999</div>
    <section>
      <div class="sec-hd">
        <span class='title'>用户管理</span>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">模块全选</el-checkbox>
      </div>
      <el-row>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>用户管理：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedUser">
            <el-checkbox v-for="user in users" :label="user" :key="user">{{user}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>团队管理：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedTeam">
            <el-checkbox v-for="team in teams" :label="team" :key="team">{{team}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </section>
    <section>
      <div class="sec-hd">
        <span class='title'>内容管理</span>
        <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">模块全选</el-checkbox>
      </div>
      <el-row>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>会员等级：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedMember">
            <el-checkbox v-for="member in members" :label="member" :key="member">{{member}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>线下课程：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedUnderline">
            <el-checkbox v-for="underline in underlines" :label="underline" :key="underline">{{underline}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>视频课程：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedVideo">
            <el-checkbox v-for="video in videos" :label="video" :key="video">{{video}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>文章管理：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedArticle">
            <el-checkbox v-for="article in articles" :label="article" :key="article">{{article}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>发现管理：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedFind">
            <el-checkbox v-for="find in finds" :label="find" :key="find">{{find}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span='2' :offset='1'>
          <span class='el-checkbox__label'>秘籍管理：</span>
        </el-col>
        <el-col :span='8'>
          <el-checkbox-group v-model="checkedSecret">
            <el-checkbox v-for="secret in secrets" :label="secret" :key="secret">{{secret}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </section>

  </div>
</template>

<script>
  const userOptions = ['查询', '修改', '冻结/解冻', '导出'];
  const teamOptions = ['查询', '修改', '冻结/解冻', '导出'];
  const memberOptions = ['查询', '新建', '修改', '导出'];
  const underlineOptions = ['查询', '新建', '修改', '导出'];
  const videoOptions = ['查询', '新建', '修改', '导出'];
  const articleOptions = ['查询', '新建', '修改', '导出'];
  const findOptions = ['查询', '新建', '修改', '导出'];
  const secretOptions = ['查询', '新建', '修改', '导出'];
  export default {
    data() {
      return {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        checkAll: false,
        checkAll1: false,
        checkedUser: [],
        users: userOptions,
        checkedTeam: [],
        teams: teamOptions,
        checkedMember: [],
        members: memberOptions,
        checkedUnderline: [],
        underlines: underlineOptions,
        checkedVideo: [],
        videos: videoOptions,
        checkedArticle: [],
        articles: articleOptions,
        checkedFind: [],
        finds: findOptions,
        checkedSecret: [],
        secrets: secretOptions,
        isIndeterminate: true,
        isIndeterminate1: true
      }
    },
    methods: {
      returnRouter() {
        this.$router.go(-1);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleCheckAllChange(val) {
        this.checkedUser = val ? userOptions : [];
        this.checkedTeam = val ? teamOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckAllChange1(val) {
        this.checkedMember = val ? memberOptions : [];
        this.checkedUnderline = val ? underlineOptions : [];
        this.checkedVideo = val ? videoOptions : [];
        this.checkedArticle = val ? articleOptions : [];
        this.checkedFind = val ? findOptions : [];
        this.checkedSecret = val ? secretOptions : [];
        this.isIndeterminate1 = false;
      }
    }

  }
</script>

<style lang="scss">
  .classManagement {
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
        margin-bottom: 10px;
      }
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
