<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title" v-if="tit">{{tit}}</p>
      <p slot="title" v-else="tit">单据信息</p>
      <slot name="header"></slot>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Row :gutter="20">
        <Col :span="item.span" v-for="(item,index) in headData" :key="index">
          <span>{{item.title ||''}}：</span>
          <span>{{item.cont ||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Table :columns="infoColumns" :data="detailList"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </Row>
      <div class="r mt15" v-if="detailList.length&&searchs.length>1">
        <Page :total="searchs[1].totalPage" :page-size="searchs[1].pageSize" :current.sync="searchs[1].pageNo" @on-change="record_search(searchs[1])" show-total show-elevator />
      </div>
    </Card>
  </div>
</template>

<script>
  import {mapState,mapActions,mapMutations } from 'vuex';
  import {filter} from 'lodash'
    export default {
        name: "Info",
        data(){
          return{
            datas:[],
            spinShow:false,
            info:{},
            detailList:[],
            detailList2:''
          }
        },
        props:{
          tit:{type:String},
          headData:{
            type:Array,
            default:this.datas
          },
          searchs:{
            type:Array||Object,
          },
          infoColumns:{type:Array},
          infoArr:{type:Array}
        },
      computed:{
        ...mapState(['totalPage'])
      },
      async created(){
        if(this.searchs.length==1){
          this.spinShow=true
        }
        if(this.searchs.length>1){
          this.spinShow=true;
          await  this.record_search_head(this.searchs[1]);
          this.detailList=this.$store.state[this.searchs[1].infoName].data.list;
          this.detailList2=this.detailList;
          this.searchs[1].totalPage=this.$store.state[this.searchs[1].infoName].data.count;
          this.spinShow=false;
        }
      },
          updated(){
            if(this.infoArr){
              if(this.detailList2.length){
                return false;
              }
              this.detailList=this.infoArr;
              this.detailList2=this.detailList;
              this.spinShow=false;
            }
          },
      methods:{
        ...mapActions(['record_search_head','record_search']),
        ...mapMutations(['RECORD_INFOTEL']),
        choseCode(drugCode){
          this.searchs[this.searchs.length-1].hisDrugCodeList=drugCode;
          if(!drugCode){
            this.detailList=this.detailList2;
            return
          }
          let filterArr= filter(this.detailList,(o)=>{
            return o.hisDrugCode==drugCode
          });
          if(filterArr.length>0){
            this.detailList=filterArr
          }else {
            this.$Message.error('请选择此单据中药品进行检索');
            return false;
          }
        }
      },
      beforeDestroy(){
          this.RECORD_INFOTEL()
      }
    }
</script>

<style scoped>

</style>
