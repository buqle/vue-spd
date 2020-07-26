/**
 * @author QER
 * @date 2019/12/16
 * @Description: 药房-申领-详情
*/
<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">单据信息</p>
      <Row :gutter="20">
        <Col span="6">
          <span>申领单：</span>
          <span>{{info.applyCode ||''}}</span>
        </Col>
        <Col span="6">
          <span>状态：</span>
          <span>{{info.applyStatusName||''}}</span>
        </Col>
        <Col span="6">
          <span>类型：</span>
          <span>{{info.applyTypeName||''}}</span>
        </Col>
        <Col span="6">
          <span>申领部门：</span>
          <span>{{info.applyDeptName||''}}</span>
        </Col>
        <Col span="6">
          <span>发起人：</span>
          <span>{{info.createUserName||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" v-if="info.applyStatus==0">
      <Col span="2-5">
        <Radius  iconText="编辑草稿"  @upButton="edit({
        applyCode:info.applyCode,
        applyStatus:info.applyStatus
        })"></Radius>
      </Col>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Table :columns="columns" :data="detailList" style="width: 100%"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </Row>
    </Card>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {filter} from 'lodash'
  export default {
    data () {
      return {
        info:{},
        spinsShow:false,
        detailList:[],
        searchArr:{
          url:this.$api.pharmacyApi.APPLY_DETAIL_LIST,
          method:'get',
          applyCode:this.$route.query.applyCode,
          infoName:'info',
          hisDrugCodeList:'',
        },
        columns:[
          {
            type: 'index',
            title: '序号',
            width:'80',
            align: 'center'

          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:'250',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmTradeName,
                  trigger: 'hover',
                  title:params.row.ctmmTradeName,
                  placement:'right',
                }
              })
            },
            /*render: (h, params) => {
              return h('div',{class:'btn__cells'}, [
                h('Poptip', {
                  props: {
                    trigger: 'hover',
                    title:params.row.ctmmTradeName,
                    placement:'right'
                  }
                },params.row.ctmmTradeName)
              ]);
            }*/
          },
          {
            key: 'applyNum',
            title: '申领数量',
            width:'150',
            align: 'center'
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:'150',
            align: 'center'
          },
          {
            key: 'ctmmSpecification',
            title: '规格',
            align: 'center',
            width:'200',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmSpecification,
                  trigger: 'hover',
                  title:params.row.ctmmSpecification,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width:'200',
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:'200',
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.packageSpecification,
                  trigger: 'hover',
                  title:params.row.packageSpecification,
                  placement:'right',
                  length:8
                }
              })
            }
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:'200',
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'right-start',
                  length:10
                }
              })
            }
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            fixed:'right',
            width:'250',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title:params.row.ctmmManufacturerName,
                  placement:'right-start',
                  length:10
                }
              })
            }
          }
        ],
      }
    },
    methods:{
      ...mapActions(['record_search_head']),
      async getInfo(){
        this.spinsShow=false;
        await  this.record_search_head(this.searchArr);
        this.info=this.$store.state[this.searchArr.infoName].data;
        this.detailList=this.info.detailList&&this.info.detailList.length?this.detailList=this.info.detailList:[]
        this.spinsShow=false;
      },
      choseCode(drugCode){
        this.searchArr.hisDrugCodeList=drugCode;
        if(!drugCode){
          this.detailList=this.info.detailList
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
      },
      edit(query){
        this.$skip.goEdit(
          this.$router,'/pharmacy/wareHouse/drugsFor/add',
          query
        )
      },
    },
    created(){
      this.getInfo()
    },

  }
</script>

<style scoped>
  .ivu-input-wrapper{width: 80%;}
</style>
