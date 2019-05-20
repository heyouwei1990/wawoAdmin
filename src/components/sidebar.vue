<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" text-color="#666" active-text-color="#fff"
		 unique-opened router>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
						</template>
						<template v-for="subItem in item.subs">
							<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template slot="title">{{ subItem.title }}</template>
								<el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
									{{ threeItem.title }}
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index">
								{{ subItem.title }}
							</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import bus from '@/util/bus';

	export default {
		data() {
			return {
				collapse: false,
				items: [{
						icon: 'el-icon-info',
						index: 'management',
						title: '用户管理',
						subs: [{
								index: 'userManagement',
								title: '用户管理'
							},
							{
								index: 'teamManagement',
								title: '团队管理'
							},
						]
					},
					{
						icon: 'el-icon-info',
						index: 'contentManagement',
						title: '内容管理',
						subs: [{
								index: 'membershipLevel',
								title: '会员等级'
							},
							{
								index: 'offlineCourses',
								title: '线下课程'
							},
							{
								index: 'videoCourse',
								title: '视频课程'
							},
							{
								index: 'articleManagement',
								title: '文章管理'
							},
							{
								index: 'discoveryManagement',
								title: '发现管理'
							},
							{
								index: 'secretManagement',
								title: '秘籍管理'
							}
						]
					},
					{
						icon: 'el-icon-info',
						index: 'commodityManagement',
						title: '商品管理',
						subs: [{
								index: 'selfClassification',
								title: '自营分类'
							},
							{
								index: 'proprietaryCommodities',
								title: '自营商品'
							},
							// {
							// 	index: 'amoyClassification',
							// 	title: '淘客分类'
							// },
							// {
							// 	index: 'amoyProducts',
							// 	title: '淘客商品'
							// },
						]
					},
					{
						icon: 'el-icon-info',
						index: 'orderManagements',
						title: '订单管理',
						subs: [{
							index: 'orderManagement',
							title: '订单管理'
						},{
              index: 'refundManagement',
              title: '退款管理'
            } ]
					},
					{
						icon: 'el-icon-info',
						index: 'distributionManagements',
						title: '分润管理',
						subs: [
						  // {
							// 	index: 'distributionSettings',
							// 	title: '分润设置'
							// },
							// {
							// 	index: 'distributionManagement',
							// 	title: '分润管理'
							// },
							{
								index: 'cashManagement',
								title: '提现管理'
							},
						]
					},
					{
						icon: 'el-icon-info',
						index: 'systemSetup',
						title: '系统设置',
						subs: [{
								index: 'accountPermissions',
								title: '账号权限'
							},
							{
								index: 'systemNotification',
								title: '系统通知'
							},

							// {
							// 	index: 'homeLink',
							// 	title: '首页链接'
							// },
							// {
							// 	index: 'promotePictures',
							// 	title: '推广图片'
							// },
							// {
							// 	index: 'systemHead',
							// 	title: '系统头像'
							// },
							{
								index: 'photoManagement',
								title: '轮播图管理'
							},
              {
                index: 'versionManagement',
                title: '版本管理'
              },
						]
					},
					// {
					// 	icon: 'el-icon-info',
					// 	index: 'performanceEnquirys',
					// 	title: '业绩查询',
					// 	subs: [{
					// 		index: 'performanceEnquiry',
					// 		title: '业绩查询'
					// 	}, ]
					// },

					/*{
					  icon: 'el-icon-info',
					  index: '6',
					  title: '错误处理',
					  subs: [
					    {
					      index: '404',
					      title: '404页面'
					    }
					  ]
					}*/
				]
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		}
	}
</script>

<style scoped>
	.sidebar-el-menu {
		background-color: #fff;
	}

	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;
	}

	.sidebar::-webkit-scrollbar {
		width: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;
	}

	.sidebar>ul {
		height: 100%;
	}

	.el-menu-item.is-active {
		background-color: #20a0ff;
	}
</style>
