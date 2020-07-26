/**
 * @author QER
 * @date 2019/9/29
 * @Description: 按钮跳转
*/
const skip={
  //新增
  goAdd(route,path){
    route.push(path)
  },
  //goDetails
  goDetails(route,path, id){
    route.push(`${path}/${id}`)
  },
  //多个参数传递
  goEdit(route,path, query){
    route.push({
      path,
      query
    })
  },
  //加载列表
  menuFormat(data,returnToggle,returnIndex){
    let menuList =JSON.parse(JSON.stringify(data ));
    let menuIndex = returnIndex ? 1: 2;
    for (let i=0; i<menuList.length; i++) {
      menuList[i].parentIds = menuList[i].parentIds.split(',')
      menuList[i].parentIds.pop();
      if(!menuList[i].children){
        delete menuList[i].children
      }
    }
    // let index = 1, tree = [], currentNode = '';
    let tree = [];
    menuList.sort(function(a, b) {
      return a.parentIds.length - b.parentIds.length;
    })
    let max = menuList[menuList.length - 1].parentIds.length;
    function genRoot(keyNodes, target) {
      for (let i=0; i<target.length; i++) {
        if (target[i].id === keyNodes.parentId) {
          target[i].children = target[i].children || [];
          target[i].children = [ ...target[i].children, keyNodes ];
        } else if (target[i].children){
          genRoot(keyNodes, target[i].children)
        }
      }
    }
    function genTree(index) {
      for (let i=0; i<menuList.length; i++) {
        if (menuList[i].parentIds.length === index) {
          if (index === menuIndex) {
            tree.push(menuList[i])
          } else {
            genRoot(menuList[i], tree);
          }
        }
      }
    }
    // 排序
    function dabendan(tree) {
      tree.sort((a, b)=>a.sort - b.sort);
      for (var i in tree) {
        if(tree[i].children) {
          dabendan(tree[i].children)
        }
      }
    }
    let min = 1;
    while (min < max + 1) {
      genTree(min);
      min++;
    }
    // console.log(JSON.stringify(tree),'tree');
    if(returnToggle){
      dabendan(tree);
      return tree
    }
  },
  //打印
  print(url,query,params){
    window.open(`${url}?${query}=${params}`, '_blank');
  }
}
export default skip;
