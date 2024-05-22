// 定义一些路由
import Index from "../pages/Index.vue";
import Team from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserRegisterPage from "../pages/UserRegisterPage.vue";
import BookListPage from "../pages/BookListPage.vue";
import BookDetailsPage from "../pages/BookDetailsPage.vue";
import OtherBookListPage from "../pages/OtherBookListPage.vue";
import EmailPage from "../pages/EmailPage.vue";
import FollowPage from "../pages/FollowPage.vue";
import UserShowPage from "../pages/UserShowPage.vue";
import ChatPage from "../pages/ChatPage.vue";
const routes = [
    { path: '/', component: Index, meta:{keepAlive:true}},
    { path: '/bookList', component: BookListPage, meta:{keepAlive:true}},
    { path: '/otherBookList', component: OtherBookListPage, meta:{keepAlive:true}},
    { path: '/bookDetails', component: BookDetailsPage, keepAlive:false},
    { path: '/team', title: '找队伍', component: Team, meta:{keepAlive:true}},
    { path: '/team/add', title: '创建队伍', component: TeamAddPage, meta:{keepAlive:true}},
    { path: '/team/update', title: '更新队伍', component: TeamUpdatePage, meta:{keepAlive:true}},
    { path: '/user', title: '个人信息', component: UserPage, meta:{keepAlive:true}},
    { path: '/search', title: '搜索页面', component: SearchPage, meta:{keepAlive:true}},
    { path: '/searchResult', title: '搜索结果', component: SearchResultPage, meta:{keepAlive:true}},
    { path: '/user/edit', title: '编辑信息', component: UserEditPage, meta:{keepAlive:true}},
    { path: '/user/register', title: '注册', component: UserRegisterPage, meta:{keepAlive:false}},
    { path: '/user/login', title: '登录', component: UserLoginPage, meta:{keepAlive:false}},
    { path: '/apply', title: '通知', component: EmailPage, meta:{keepAlive:false}},
    { path: '/follow', title: '关注列表', component: FollowPage, meta:{keepAlive:false}},
    { path: '/chat', title: '聊天', component: ChatPage, meta:{keepAlive:false}},
    { path: '/user/update', title: '更新信息', component: UserUpdatePage, meta:{keepAlive:true}},
    { path: '/user/show', title: '查看用户', component: UserShowPage, meta:{keepAlive:true}},
    { path: '/user/team/join', title: '加入队伍', component: UserTeamJoinPage, meta:{keepAlive:true}},
    { path: '/user/team/create', title: '创建队伍', component: UserTeamCreatePage, meta:{keepAlive:true}},

]

export default routes;
