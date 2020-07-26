/**
 * @author QER
 * @date 2019/12/23
 * @Description: 出库管理-发药复核-详情
*/
<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">单据信息</p>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <p slot="extra" class="btn-style">
        <Button type="default" icon="md-checkmark" @click.native="submitData">保存</Button>
      </p>
      <Row :gutter="20" style="display: flex;
    flex-wrap: wrap;
    align-items: center;">
        <Col :span="item.span" v-for="(item,index) in info" :key="index" >
          <span>{{item.title ||''}}：</span>
          <span>{{item.cont ||''}}</span>
        </Col>
        <Col span="6" style="display: flex;align-items: center">
          <span><i style="color: red">*</i>配药人：</span>
          <Input v-model="confirmUserName" style="flex: 1" placeholder="请输入配药人工号" @keyup.enter.native="enterId"/>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Table :columns="infoColumns" :data="detailList" @on-selection-change="selectData"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </Row>
      <div class="r mt15" v-if="detailList.length">
        <Page :total="searchs[1].totalPage" :page-size="searchs[1].pageSize" :current.sync="searchs[1].pageNo" @on-change="record_search(searchs[1])" show-total show-elevator />
      </div>
    </Card>
  </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
    export default {
      data(){
        return{
          info:[],
          detailList:[],
          spinShow:false,
          confirmUserName:'',
          updateUserId:'',
          selectSubmitInfo:[],
          searchs:[
            {
              url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_OUTPUT_DETAILHEAD,
              backNo:this.$route.query.backNo,
              infoName:'info',
              method:'get'
            },
            {
              url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_OUTPUT_DETAILTAB,
              infoName:'detailList',
              backNo:this.$route.query.backNo,
              hisDrugCodeList:'',
              pageNo: 1,
              pageSize: 10,
              totalPage:0
            }
          ],
          infoColumns:[
            {
              type: 'selection',
              width: 60,
              align: 'center',
              fiexd:'left'
            },
            {
              type: 'index',
              title: '序号',
              width: 60,
              align: 'center'
            },
            {
              key: 'ctmmTradeName',
              title: '药品名称',
              align: 'center',
              width:180,
              fiexd:'left',
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
            },
            {
              key: 'ctmmDosageFormDesc',
              title: '剂型',
              width:90,
              align: 'center'
            },
            {
              key: 'packageSpecification',
              title: '包装规格',
              align: 'center',
              width:120,
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
              key: 'replanUnit',
              title: '发药单位',
              width:90,
              align: 'center'
            },
            {
              key: 'oEORIDispDrugQuantity',
              title: '发药数量',
              width:90,
              align: 'center'
            },
            {
              key: 'backSumNum',
              title: '出库数量',
              width:90,
              align: 'center'
            },
            {
              key: 'outStoreName',
              title: '货位类别',
              width:110,
              align: 'center'
            },
            {
              key: 'approvalNo',
              title: '批准文号',
              align: 'center',
              width:140,
              render: (h, params) => {
                return h('PopTips', {
                  props: {
                    content: params.row.approvalNo,
                    trigger: 'hover',
                    title:params.row.approvalNo,
                    placement:'left',
                    length:10
                  }
                })
              }
            },
            {
              key: 'ctmmManufacturerName',
              title: '生产厂家',
              align: 'center',
              width:180,
              render: (h, params) => {
                return h('PopTips', {
                  props: {
                    content: params.row.ctmmManufacturerName,
                    trigger: 'hover',
                    title:params.row.ctmmManufacturerName,
                    placement:'right',
                    length:8
                  }
                })
              }
            },
            {
              key: 'lot',
              title: '生产批号',
              width:110,
              align: 'center'
            },
            {
              key: 'productDate',
              title: '生产日期',
              width:110,
              align: 'center'
            },
            {
              key: 'validEndDate',
              title: '有效期至',
              width:110,
              align: 'center'
            },
            {
              key: 'confirmStatusName',
              title: '状态',
              width:100,
              align: 'center',
              fixed:'right'
            },
            {
              key: 'confirmUserName',
              title: '配药人',
              width:100,
              align: 'center',
              fixed:'right'
            },
            {
              key: 'confirmDate',
              title: '配药时间',
              width:154,
              align: 'center',
              fixed:'right'
            },
          ]
        }
      },
      created(){
        this.getInfo();
      },
      methods:{
        ...mapActions(['record_search_head']),
       async getInfo(){
         this.spinShow=true;
         await  this.record_search_head(this.searchs[0]);
         this.info=this.$store.state[this.searchs[0].infoName].data;
         const {dispensingCode,innerDeptName,outDeptName,backTypeName,dispensingDate,confirmUserName}=this.info;
         this.confirmUserName=confirmUserName;
         this.info=[{
           title:'发药单',
           span:10,
           cont:dispensingCode
         },
           {
             title:'内部药房',
             span:6,
             cont:innerDeptName
           },
           {
             title:'外部药房',
             span:6,
             cont:outDeptName
           },
           {
             title:'出库分类',
             span:10,
             cont:backTypeName
           },
           {
             title:'发药时间',
             span:6,
             cont:dispensingDate
           },
         ];
         await  this.record_search_head(this.searchs[1]);
         this.detailList=this.$store.state[this.searchs[1].infoName].data.list;
         this.searchs[1].totalPage=this.$store.state[this.searchs[1].infoName].data.count;
         this.spinShow=false;
        },

        selectData(selection){
          this.selectSubmitInfo=selection
        },
       async enterId(){
          if(this.updateUserId){
            return false;
          }
          if(!this.confirmUserName){
            this.$Message.error('请输入配药人工号');
            return false;
          }
          let sbumitInfo= await this.$api.pharmacy.getUserId({
            loginName:this.confirmUserName
          });
             if(sbumitInfo.code==200){
               this.updateUserId=sbumitInfo.data.id;
             }
        },
        async submitData(){
          if(!this.updateUserId){
            this.$Message.error('请输入配药人工号');
            return false;
          }else if(this.selectSubmitInfo.length==0){
            this.$Message.error('请选择要复核的单据');
            return false;
          };
          let confirmStatusDtoList=[];
              confirmStatusDtoList=this.selectSubmitInfo.map(item=>{
                  return {
                    dispensingNo: item.dispensingNo,
                    dispensingDetail: item.dispensingDetail,
                    updateUserId:this.updateUserId
                  }
                });

          this.spinShow=true;
          let sbumitInfo= await this.$api.pharmacy.submitOUtReview({
            confirmStatusDtoList
          });
          if(sbumitInfo.code==200){
            this.$Message.success('单据复核成功');
            this.getInfo();
          }else {
            this.spinShow=false;
          }
        },
        choseCode(drugCode){
          this.searchs[1].hisDrugCodeList=drugCode;
          if(!drugCode){
            this.detailList=this.$store.state.detailList.data.list;
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
      }
    }
</script>

<style scoped>

</style>
