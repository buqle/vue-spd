<style lang="less" scoped>
</style>

<template>
    <div>
        <div class="login">
          <img src="../../assets/image/cs-logo.png"  class="cs-img" width="220" height="90">
          <div class="login-from">
            <img src="../../assets/image/left-pic.png" width="491" height="351">
            <Form class="form_box" :model="user" :label-width="80">
              <FormItem label="输入用户名">
                <Input v-model="user.username" placeholder="请输入用户名..."></Input>
              </FormItem>
              <FormItem label="输入密码">
                <Input type="password" v-model="user.password" placeholder="请输入密码..."></Input>
              </FormItem>
              <FormItem>
                <Button class="login_btn" type="primary" @click="login" @keyup.enter.native="login()" long>登录</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <Footer></Footer>

    </div>

</template>
<script>
  import {mapState,mapMutations} from 'vuex';
  import { Message} from 'iView';
    export default {
        data() {
            return {
                user: {username:'', password: ''},
                userInfo:{},

            }
        },
        methods: {
          ...mapMutations(['RECORD_USERINFO','SET_SELECTED_MENU']),

            async login(){
              let checkPassWord=await this.$api.user.checkPassword({password: this.user.password});
                  if(checkPassWord.code==200){
                    let newPassword=checkPassWord.data.password;
                    this.userLogin(this.user.username,newPassword);
                  }
            },
            async userLogin(username,password){
              this.userInfo=await this.$api.user.userLogin({
                username,password
              });
              await this.RECORD_USERINFO(this.userInfo);
              if(this.userInfo.data.length==0){
                Message.warning('当前登录用户没有配置部门!');
                return false;
              }
              //存选中的菜单
              if(this.userInfo.data && this.userInfo.data.deptInfo){
                let selectDept = this.userInfo.data.deptInfo.filter(item => {
                    return item.lastSelect
                })[0];
                if(selectDept && selectDept.deptId){
                  this.SET_SELECTED_MENU(selectDept.deptId);
                }
              }
              this.$router.push('/');
            },
            getItme(index) {
                this.activeClass = index;  // 把当前点击元素的index，赋值给activeClass
            }, 
        },
        created(){
            let self = this;
            document.onkeydown = function(e) {
                        let key = window.event.keyCode;
                        if (key == 13) {
                                self.login()
                        }
            }
        }
    }
</script>
