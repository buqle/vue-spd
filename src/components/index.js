/**
 * @author QER
 * @date 2019/11/29
 * @Description: 组件全局注册
*/
import Radiuser from './Radius';//按钮
import PopTipser from './PopTips';//划过显示
import Searcher from './Search';//药品名检索
import Infoer from './Info';//药品名检索
export default (Vue)=>{
  Vue.component("Radius", Radiuser);
  Vue.component("PopTips", PopTipser);
  Vue.component("Search", Searcher);
  Vue.component("Info", Infoer)
}
