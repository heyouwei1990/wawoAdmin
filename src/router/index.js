import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['../pages/index'],resolve),
      redirect:{
        name:'UserManagement'
      },
      children:[
        {
          path:'/userManagement',
          name:'UserManagement',
          component: resolve => require(['../pages/management/userManagement'],resolve),
          meta:{title:'用户管理'},
        },
        {
          path:'/teamManagement',
          name:'TeamManagement',
          component: resolve => require(['../pages/management/teamManagement'],resolve),
          meta:{title:'团队管理'},
        },
        {
          path:'/membershipLevel',
          name:'MembershipLevel',
          component: resolve => require(['../pages/contentManagement/membershipLevel'],resolve),
          meta:{title:'会员等级'},
        },
        {
          path:'/offlineCourses',
          name:'OfflineCourses',
          component: resolve => require(['../pages/contentManagement/offlineCourses'],resolve),
          meta:{title:'线下课程'},
        },
        {
          path:'/videoCourse',
          name:'VideoCourse',
          component: resolve => require(['../pages/contentManagement/videoCourse'],resolve),
          meta:{title:'视频课程'},
        },
        {
          path:'/articleManagement',
          name:'ArticleManagement',
          component: resolve => require(['../pages/contentManagement/articleManagement'],resolve),
          meta:{title:'文章管理'},
        },
        {
          path:'/discoveryManagement',
          name:'DiscoveryManagement',
          component: resolve => require(['../pages/contentManagement/discoveryManagement'],resolve),
          meta:{title:'发现管理'},
        },
				{
				  path:'/secretManagement',
				  name:'SecretManagement',
				  component: resolve => require(['../pages/contentManagement/secretManagement'],resolve),
				  meta:{title:'秘籍管理'},
				},
				{
				  path:'/courseDetails',
				  name:'CourseDetails',
				  component: resolve => require(['../pages/contentManagement/courseDetails'],resolve),
				  meta:{title:'课程详情'},
				},
        {
          path:'/courseCategory',
          name:'CourseCategory',
          component: resolve => require(['../pages/contentManagement/courseCategory'],resolve),
          meta:{title:'课程分类'},
        },
        {
          path:'/videoCategory',
          name:'VideoCategory',
          component: resolve => require(['../pages/contentManagement/videoCategory'],resolve),
          meta:{title:'视频分类'},
        },
        {
          path:'/articleCategory',
          name:'ArticleCategory',
          component: resolve => require(['../pages/contentManagement/articleCategory'],resolve),
          meta:{title:'资讯分类'},
        },
        {
          path:'/secretCategory',
          name:'SecretCategory',
          component: resolve => require(['../pages/contentManagement/secretCategory'],resolve),
          meta:{title:'秘籍分类'},
        },
				{
				  path:'/classManagement',
				  name:'ClassManagement',
				  component: resolve => require(['../pages/contentManagement/classManagement'],resolve),
				  meta:{title:'上课管理'},
				},
				{
				  path:'/classDetails',
				  name:'ClassDetails',
				  component: resolve => require(['../pages/contentManagement/classDetails'],resolve),
				  meta:{title:'课程详情'},
				},
        {
          path:'/articleDetails',
          name:'ArticleDetails',
          component: resolve => require(['../pages/contentManagement/articleDetails'],resolve),
          meta:{title:'文章详情'},
        },
				{
				  path:'/videoList',
				  name:'VideoList',
				  component: resolve => require(['../pages/contentManagement/videoList'],resolve),
				  meta:{title:'视频列表'},
				},
				{
				  path:'/secretDetails',
				  name:'SecretDetails',
				  component: resolve => require(['../pages/contentManagement/secretDetails'],resolve),
				  meta:{title:'秘籍详情'},
				},
				{
          path:'/selfClassification',
          name:'SelfClassification',
          component: resolve => require(['../pages/commodityManagement/selfClassification'],resolve),
          meta:{title:'自营分类'},
        },
        {
          path:'/proprietaryCommodities',
          name:'ProprietaryCommodities',
          component: resolve => require(['../pages/commodityManagement/proprietaryCommodities'],resolve),
          meta:{title:'自营商品'},
        },
        {
          path:'/amoyClassification',
          name:'AmoyClassification',
          component: resolve => require(['../pages/commodityManagement/amoyClassification'],resolve),
          meta:{title:'淘客分类'},
        },
				{
				  path:'/amoyProducts',
				  name:'AmoyProducts',
				  component: resolve => require(['../pages/commodityManagement/amoyProducts'],resolve),
				  meta:{title:'淘客商品'},
				},
				{
				  path:'/commodityComment',
				  name:'CommodityComment',
				  component: resolve => require(['../pages/commodityManagement/commodityComment'],resolve),
				  meta:{title:'商品评论'},
				},
				{
				  path:'/commodityInfo',
				  name:'CommodityInfo',
				  component: resolve => require(['../pages/commodityManagement/commodityInfo'],resolve),
				  meta:{title:'商品信息'},
				},
        {
          path:'/commoditySpecification',
          name:'CommoditySpecification',
          component: resolve => require(['../pages/commodityManagement/commoditySpecification'],resolve),
          meta:{title:'商品规格'},
        },
        {
          path:'/orderManagement',
          name:'OrderManagement',
          component: resolve => require(['../pages/orderManagements/orderManagement'],resolve),
          meta:{title:'订单管理'},
        },
				{
				  path:'/commodityInformation',
				  name:'CommodityInformation',
				  component: resolve => require(['../pages/orderManagements/commodityInformation'],resolve),
				  meta:{title:'商品信息'},
				},
				{
				  path:'/distributingInformation',
				  name:'DistributingInformation',
				  component: resolve => require(['../pages/orderManagements/distributingInformation'],resolve),
				  meta:{title:'分润信息'},
				},
        {
          path:'/refundManagement',
          name:'RefundManagement',
          component: resolve => require(['../pages/orderManagements/refundManagement'],resolve),
          meta:{title:'退款管理'},
        },
				{
          path:'/distributionSettings',
          name:'DistributionSettings',
          component: resolve => require(['../pages/distributionManagements/distributionSettings'],resolve),
          meta:{title:'分润设置'},
        },
				 {
				  path:'/distributionManagement',
				  name:'DistributionManagement',
				  component: resolve => require(['../pages/distributionManagements/distributionManagement'],resolve),
				  meta:{title:'分润管理'},
				},
				 {
				  path:'/cashManagement',
				  name:'CashManagement',
				  component: resolve => require(['../pages/distributionManagements/cashManagement'],resolve),
				  meta:{title:'提现管理'},
				},
				{
				  path:'/accountPermissions',
				  name:'AccountPermissions',
				  component: resolve => require(['../pages/systemSetup/accountPermissions'],resolve),
				  meta:{title:'账号权限'},
				},
				 {
				  path:'/systemNotification',
				  name:'SystemNotification',
				  component: resolve => require(['../pages/systemSetup/systemNotification'],resolve),
				  meta:{title:'系统通知'},
				},
				 {
				  path:'/homeLink',
				  name:'HomeLink',
				  component: resolve => require(['../pages/systemSetup/homeLink'],resolve),
				  meta:{title:'首页链接'},
				},
				{
				  path:'/promotePictures',
				  name:'PromotePictures',
				  component: resolve => require(['../pages/systemSetup/promotePictures'],resolve),
				  meta:{title:'推广图片'},
				},
				 {
				  path:'/systemHead',
				  name:'SystemHead',
				  component: resolve => require(['../pages/systemSetup/systemHead'],resolve),
				  meta:{title:'系统头像'},
				},
				 {
				  path:'/photoManagement',
				  name:'PhotoManagement',
				  component: resolve => require(['../pages/systemSetup/photoManagement'],resolve),
				  meta:{title:'轮播图管理'},
				},
				{
				  path:'/permissionSettings',
				  name:'PermissionSettings',
				  component: resolve => require(['../pages/systemSetup/permissionSettings'],resolve),
				  meta:{title:'权限设置'},
				},{
          path:'/versionManagement',
          name:'VersionManagement',
          component: resolve => require(['../pages/systemSetup/versionManagement'],resolve),
          meta:{title:'版本管理'},
        },
				 {
				  path:'/performanceEnquiry',
				  name:'PerformanceEnquiry',
				  component: resolve => require(['../pages/performanceEnquirys/performanceEnquiry'],resolve),
				  meta:{title:'业绩查询'},
				},
			
        {
          path: '/404',
          name: '404',
          component: resolve => require(['../pages/404'],resolve),
          meta:{title:'不存在'},
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../pages/login'],resolve),
      meta:{title:'登录'},
    }
  ]
})
