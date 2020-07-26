<template>
  <div>
    <Row><h1 class="work-title">{{workTitle}}</h1></Row>
    <Row>
      <div class="swiperContainer">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(todo,index) in toDoList" :index="index" :key="`key-${index}`">
            <Card class="todo-card" :class="cardSelect == index?'todo-card-active':''">
              <div @click="selectToDo(index,todo)" class="card-item">
                <div class="card-item-icon">
                  <img class = "card-item-icon-img" :src="require(`@/assets/icon/icon_${todo.iconName}.png`)">
                </div>
                <div class="card-item-text">
                  <p class="card-item-text-p">{{todo.categoryName}}</p>
                  <span class="card-item-text-span">{{todo.count}}</span>
                </div>
              </div>
            </Card>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev" slot="button-prev" v-show="toDoList.length!=0"></div>
        <div class="swiper-button-next" slot="button-next" v-show="toDoList.length!=0"></div>
      </div>
    </Row>
    <Row>
      <span class="work-moudle">{{workMoudle}}</span>
    </Row>
    <Row :gutter="20">
      <Col :xs="12" :md="12" :lg="6" v-for="(todoDetail, i) in toDoDetailList" :key="`key-${i}`" class="detail-col">
        <Card class="detail-card">
          <div class="detail-item">
            <div class="detail-odd-status">
              <div class="detail-odd">
                <Tooltip placement="bottom">
                  <span class="detail-odd-text">{{todoDetail.numberNo}}</span>
                  <span slot="content" style="white-space: normal;">{{todoDetail.numberNo}}</span>
                </Tooltip>
              </div>
              <span class="detail-status">{{todoDetail.statusName}}</span>
            </div>
            <div class="detail-module-date">
              <span class="deatil-moudle">{{todoDetail.typeName}}</span>
              <span class="detail-date">{{todoDetail.createTime | getDate('monthMinute')}}</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  export default {
    components:{
      swiper,
      swiperSlide
    },
    data () {
      return {
        workTitle:"您好，今日的待办事项",
        workMoudle:"最新单据",
        swiperOption: {
          slidesPerView: 4,
          centeredSlides: false,
          spaceBetween: 20,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        toDoList:[],
        toDoDetailList:[],
        cardSelect:-1,
      }
    },
    methods:{
      async getToDoList(){
        let list = await this.$api.workbench.toDoList();
        if(list.data.length == 0){
            this.getToDoList();
        }
        if(list && list.data){
          this.toDoList = list.data;
          if(this.toDoList && this.toDoList.length > 0){
            this.toDoListDetail(this.toDoList[0].categoryCode);
          }
        }
      },
      selectToDo(index,todo){
        this.cardSelect = index;
        if(todo && todo.categoryCode){
          this.toDoListDetail(todo.categoryCode);
        }
      },
      async toDoListDetail(categoryCode){
        let list = await this.$api.workbench.toDoListDetail({categoryCode});
        if(list && list.data){
          this.toDoDetailList = list.data;
        }
      }
    },
    created(){
      this.getToDoList();
    },
    watch:{
      $route(){
        this.getToDoList();
      }
    },
  }
</script>
<style scoped lang="less">
  .work-title{
    font-size: 26px;
    margin: 20px 0px 40px 24px;
  }
  .work-moudle{
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 15px;
    border-bottom: 2px solid rgb(79, 161, 164);
    padding: 4px 0px;
    margin: 20px 0px 40px 24px;
  }
  .swiperContainer{
    margin:0 50px;
    .todo-card{
      padding: 20px 10px;
      border-radius: 4px;
      cursor: pointer;
      background-color: #fafafa;
      /deep/.ivu-card-body{
        width:100%;
        height: 100%;
        padding: 0 !important;
        .card-item{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          &-icon{
            width: 35%;
            border-radius: 50%;
            text-align: center;
          }
          &-text{
            width: 55%;
            &-p{
              font-size: 16px;
              font-weight: 600;
              margin: 0;
            }
            &-span{
              font-size: 20px;
            }
          }
        }
      }
    }
    .todo-card-active{
      box-shadow: 0 2px 8px #a0dcf2;
      border: 1px solid #57c8f2;
      color: #4fa1a4;
    }
  }
  .detail-col {
    margin-bottom: 15px;
    .detail-item{
      display: flex;
      flex-direction: column;
      .detail-odd-status{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 18px;
        .detail-odd{
          width: 75%;
          .ivu-tooltip{
            width: 100%;
            .detail-odd-text{
              width: 100%;
              display: inline-block;
              -o-text-overflow: ellipsis;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
        .detail-status{
          color: #4aa8e5;
        }
      }
      .detail-module-date{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .deatil-moudle{
          width: 65%;
        }
        .detail-date{

        }
      }
    }
  }
  .detail-card{
    /deep/.ivu-card-body{
      padding: 16px !important;
    }
  }


</style>

