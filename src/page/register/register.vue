<style lang="less" scoped>
    .ivu-form-item {
        margin-bottom: 18px !important;
    }
</style>

<template>
    <div>
        <nav class="login_nav">
            <div class="nav_wrp">
                <ul class="nav_con">
                    <li class="csu-serve">服务中心</li>
                    <li class="csu-society">传链社区</li>
                    <li class="csu-home">首页</li>
                </ul>
            </div>
            <div class="nav_logo">
                <img src="../../assets/image/login-nav-logo.png" alt="">
            </div>
            <ul class="login_line">
                <li></li>
                <li></li>
                <li></li>
                <li class="line4"></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </nav>
        <div class="login">
            <div class="login_con">
                <div class="form_wrp">
                    <Form class="form_box" :model="user" :label-width="80">
                        <ul class="form_logo">
                            <li v-for="(item,$ind) in titles" @click="getItme($ind) "
                                :class="activeClass == $ind ? 'active':''">
                                {{item.tit}}
                            </li>
                        </ul>
                        <FormItem label="用户名">
                            <Input v-model="user.userName" placeholder="请输入用户名..."></Input>
                        </FormItem>
                        <FormItem label="密码">
                            <Input type="password" v-model="user.pwd" placeholder="请输入密码..."></Input>
                        </FormItem>
                        <FormItem label="确认密码">
                            <Input type="password" v-model="user.pwds" placeholder="请输入密码..."></Input>
                        </FormItem>
                        <FormItem>
                            <Button class="login_btn" type="primary" @click="login">注册</Button>
                        </FormItem>
                        <!--<p>-->
                        <!--<CheckboxGroup>-->
                        <!--<Checkbox label="Movie"></Checkbox>-->
                        <!--</CheckboxGroup>-->
                        <!--</p>-->
                        <!--<Row :gutter="16" class="form_tip">-->
                        <!--<Col span="6" offset="6">-->
                        <!--<router-link to="/register"><span>忘记密码</span></router-link>-->
                        <!--</Col>-->
                        <!--<Col span="12">-->
                        <!--<router-link to="/register"><span>注册</span></router-link>-->
                        <!--</Col>-->
                        <!--</Row>-->
                    </Form>
                </div>
            </div>
        </div>
        <Footer></Footer>

    </div>

</template>
<script>
    export default {
        data() {
            return {
                user: {userName: 'star', pwd: ''},
                activeClass: 0,
                titles: [
                    {tit: '会员'},
                    {tit: '货主'}
                ]
            }
        },
        methods: {
            login() {
                var t = this.$route.query.redirect || "/";
                this.axios.post('/mock/user/login', this.user).then(res => {
                    console.log(res);
                    if (res.errorCode == 0) {
                        this.$store.dispatch('user_update', {
                            data: res.data
                        }).then(() => {
                            this.$router.push(t);
                        })
                    }

                })

            },
            getItme(index) {
                this.activeClass = index;  // 把当前点击元素的index，赋值给activeClass
            },
        }
    }
</script>
