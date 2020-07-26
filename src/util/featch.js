/**
 * @author QER
 * @date 2019/9/25
 * @Description: axios请求封装
*/
import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { Message,LoadingBar } from 'iView';
import {Cookie} from "@/util/storage";
import router from '@/router/LoginRouter'
var querystring = require('querystring');
axios.defaults.withCredentials=true;//设置发送请求时带上cookie

//发送
axios.interceptors.request.use(config=>{
  LoadingBar.start();
  store.state.httpDone=true;
  return config
},err=>{

  return Promise.reject(err) //承诺被拒绝
});


// 响应时
axios.interceptors.response.use(response => response, err => {
    // Message.error({
    //   content:err
    // })
    return Promise.resolve(err.response)

  }
)



//检查状态码
function checkStatus(res) {
  LoadingBar.finish();
  store.state.httpDone=false;
  if(res.status==200||res.status==304){
    return res.data
  }else {
    if(res.request.responseURL.indexOf('login')>-1){
      store.state.token=''
      Cookie.remove(['token']);
      Message.error({
        content:'当前用户token失效'
      })
      router.push('/login');
      return false
    }
  };
  let msg = res.data.msg?res.data.msg:'';
  return{
    code:0,
    msg:msg||res.statusText,
    data:res.statusText
  }

}


function checkCode(res) {
  if (res.code != 200) {
    Message.error({
      content:res.msg
    })
    // throw new Error(res.msg)
    console.error(res)
  }
  return res
}

export default {
  get(url,params){
    console.log(params)
    return axios({
      method:'get',
      url,
      //params:params.mt&&params.mt==1?qs.stringify(params, { arrayFormat: 'repeat' }):params,
      params,
      withCredentials: true,
    }).then(checkStatus).then(checkCode)
  },
  getArrayBuffer(url,params){
    return axios({
      method:'get',
      url,
      params,
      withCredentials: true,
      responseType: 'arraybuffer'
    }).then(checkStatus)
  },
  getArrayBufferByPost(url,params){
    return axios({
      method:'post',
      url:url,
      data:qs.stringify(params),
      responseType: 'arraybuffer'
    }).then(checkStatus)
  },
  getArrayBufferByPostJson(url,params){
    return axios({
      method:'post',
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      data:JSON.stringify(params),
      responseType: 'arraybuffer'
    }).then(checkStatus)
  },
  postJson(url,data){
    return axios({
      method:'post',
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      data:JSON.stringify(data),
      responseType: 'json',
    }).then(checkStatus).then(checkCode)
  },
  post(url,data){
    return axios({
      method:'post',
      url:url,
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      data:querystring.stringify(data),
      //data:qs.stringify(data, { arrayFormat: 'repeat' } ),//将对象 序列化成URL的形式，以&进行拼接
    }).then(checkStatus).then(checkCode)
  }
}
