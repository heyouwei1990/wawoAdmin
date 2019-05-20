
import axios from 'axios';
import qs from 'qs';
let debug = process.env.NODE_ENV == 'production';
let BASEURL='';
if (debug) {
  BASEURL='http://wawoapi.haomaieco.cn';//生产域名
}else{
  // BASEURL='http://minghu.natapp1.cc';//开发域名
  BASEURL='http://192.168.3.128:8080';//开发域名
  // BASEURL='http://wawoapi.haomaieco.cn';//生产域名
}
const imgBaseUrl='http://wawocdn.haomaieco.cn';//图片域名
window.URLCONFIG={
  baseUrl:BASEURL,
  imgUrl:imgBaseUrl
}
axios.defaults.baseURL = BASEURL;//正式域名

//拦截请求以添加token
//  axios.interceptors.request.use(config=>{
//   //需要加token的接口
// 	console.log(config)
// 	let Jwt=sessionStorage.getItem('Jwt');
// 	defaultHd['Jwt']=Jwt;
//   return config;
// });


axios.defaults.timeout = 40000;//
const $http=function (url,data={},method="GET",headers) {
  var defaultHd={'Content-Type':'application/json;charset=UTF-8'};
  defaultHd['Jwt']=getSession('Jwt');
  var head=extend(defaultHd,headers);
  if(head['Content-Type'].indexOf('application/x-www-form-urlencoded')!=-1){
    data=qs.stringify(data);
  }
  var methods=method.toUpperCase();
  return new Promise((resolve,reject)=>{
    axios({
      method:methods,
      url:url,
      data:methods=="POST"?data:null,
      params:methods=="GET"?data:null,
      headers:head
    }).then((response)=>{
      resolve(response.data);
    }).catch((err)=>{
      reject(err);
    })
  })
}

// 响应拦截
axios.interceptors.response.use(res=>{
  return res;
},error=>{
  //  1.判断请求超时
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    // console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
    alert('请求超时');
    //return service.request(originalRequest);//例如再重复请求一次
  }
});
//合并对象
const extend=function (target,source) {
  var obj=target||{};
  for(var i in source){
    if(typeof source[i]==='object' && source[i]){
      obj[i]=source[i].constructor===Array?[]:{};
      extend(obj[i],source[i]);
    }else{
      obj[i]=source[i];
    }
  }
  return obj;
};


//格式化json
const formatJson=function(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
};

//格式化时间
const timeFormat = function(value){
  var date = new Date(parseInt(value*1000));
  var seperator1 = "-";
  var seperator2 = ":";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var hour = date.getHours();
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  var minute = date.getMinutes();
  if (minute >= 0 && minute <= 9) {
    minute = "0" + minute;
  }
  var second = date.getSeconds();
  if (second >= 0 && second <= 9) {
    second = "0" + second;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + minute;
  return currentdate;
};

//存储localStorage
const setLocal=function (name, content) {
  if (!localStorage) { return; }
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

//获取localStorage
const getLocal=function (name) {
  if (!localStorage) { return; }
  if (!name) return;
  return window.localStorage.getItem(name);
};

//删除localStorage
const removeLocal=function (name) {
  if (!localStorage) { return; }
  if (!name) return;
  window.localStorage.removeItem(name);
};
//存储sessionStorage
const setSession=function (name, content) {
  if (!sessionStorage) { return; }
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

//获取sessionStorage
const getSession=function (name) {
  if (!sessionStorage) { return; }
  if (!name) return;
  return window.sessionStorage.getItem(name);
};

//删除sessionStorage
const removeSession=function (name) {
  if (!sessionStorage) { return; }
  if (!name) return;
  window.sessionStorage.removeItem(name);
};
//储存cookie
const setCookie=function (key,val,days) {
  var d=new Date();
  d.setDate(d.getDate()+days);
  document.cookie=key+'='+ val +';expires='+d.toGMTString();
};

//过去cookie
const getCookie=function (key) {
  let str=document.cookie;
  let arr=str.split('; ');
  let value='';
  for(var i= 0;i<arr.length;i++){
    var temp=arr[i].split('=');
    if(temp[0]==key){
      value=temp[1];
      break;
    }
  }
  return value;
};



export default{
  debug,
  extend,
  $http,
  axios,
  qs,
  timeFormat,
  formatJson,
  baseUrl:BASEURL,
  imgBaseUrl,
  setLocal,
  getLocal,
  removeLocal,
  setSession,
  getSession,
  removeSession,
  setCookie,
  getCookie
}
