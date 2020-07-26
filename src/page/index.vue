<style scoped>
    /*f5f5f5*/
</style>
<template>
    <div class="layout">

        <div class="csu-logo">
            <img src="../assets/image/csu-logo.png"/>
        </div>
        <div class="csu-layout">
            <Header :firstMenu='firstMenu' :twoMenu='twoMenu' :headline='headline'></Header>
            <!--<div>
                          <Left class="fl"></Left>
                          <router-view  style='position: relative;'></router-view>
            </div>-->
            
            <div class="ivu-layout csu-layMenu" style="flex-direction: row;">
                
            
            <!-- <Layout > -->
                <!-- <Sider hide-trigger > -->
                    <Left class=""></Left>
                <!-- </Sider> -->
                <Content class="layout-con">
                    <router-view ></router-view>
                </Content>
            <!-- </Layout> -->
            </div>
            <Footer :footerName='footerName'></Footer>
        </div>
    </div>
</template>
<script>

export default {
    name: 'index',
    data() {
        return {
            footerName:'COPYRIGHT © 2015-2017 粤ICP备16033858号-4',
            firstMenu:'基本资料管理', // 面包屑一级标题
            twoMenu:'供应商信息', // 面包屑二级样式
            headline:'业务员', // 页面中的标题
        }
    },mounted(){
        console.log(window.localStorage.getItem('app'));
        if(!window.localStorage.getItem('app')){
            document.getElementsByClassName('app')[0].className ='app theme1';
            this.localStorageDate();
        }else{
            document.getElementsByClassName('app')[0].className = window.localStorage.getItem('app');
        }
        
    },
    
    methods: {  
        localStorageDate(){
            console.log(document.getElementsByClassName('app')[0].className);
            localStorage.setItem('app',document.getElementsByClassName('app')[0].className)
        }
    },
    created (){

        // if(this.$store.getters.getStatus){
        //     this.$router.push('/home')
        // }else{
        //     this.$router.push('/login')
        // }
    },

}
</script>
