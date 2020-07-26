/**
 * @author QER
 * @date 2019/12/18
 * @Description: 药房-上架
*/
<template>
  <div class="container container-warp">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Card :bordered="false" class="card-item">
      <p slot="title">单据信息</p>
      <Row :gutter="20">
        <Col span="6">
          <span>验收单：</span>
          <span>{{info.distributeCode||''}}</span>
        </Col>
        <Col span="6">
          <span>状态：</span>
          <span>{{info.statusName||''}}</span>
        </Col>
        <Col span="6">
          <span>上架时间：</span>
          <span>{{info.upUserDate||''}}</span>
        </Col>
        <Col span="6">
          <span>验收时间：</span>
          <span>{{info.receptionTime||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <Row class="mt15">
        <Tabs :value="von" @on-click="changeTab">
          <div slot="extra">
            <Radius  iconText="确认上架"  @upButton="submitData" v-if="searchArr[1].upFinishType==0&&info.auditStatus==2||info.auditStatus==3"></Radius>
          </div>
          <TabPane  :name="index.toString()" v-for="(item,index) in tabs" :key="index" :label="item.label" :disabled="!info.distributeCode">
            <Table :columns="columns" :data="dataWait" ref="selection" @on-selection-change="selectData"></Table>
          </TabPane>
        </Tabs>
        <div class="r mt15">
          <Page :total="searchArr[1].totalPage" :page-size="searchArr[1].pageSize" :current.sync="searchArr[1].pageNo" @on-change="record_search(searchArr[1])" show-total show-elevator />
        </div>
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
        spinShow:false,
        spinShow2:false,
        loading:false,
        tabs:[{
          label:'待上架'
        },{
          label:'已上架'
        }],
        info:{},
        dataWait:[],
        dataHad:[],
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fiexd:'left'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            fiexd:'left',
            width: 80
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
            key: 'realNum',
            title: '实际上架数量',
            width:110,
            align: 'center',
            render: (h, params) => {
              if(this.searchArr[1].upFinishType==0){
                return h('InputNumber', {
                  props:{
                    min:params.row.storeType=='备选上架货位'?0:1,
                    value:params.row.storeType!='备选上架货位'&&!params.row.realNum?params.row.realReceiveQuantiry:params.row.realNum,
                    max:params.row.realDeliveryQuantiry
                  },
                  on: {
                    'on-change': (value) => {
                      if(value>params.row.realReceiveQuantiry){
                        this.$Message.error(`输入数值过大, 不能超过${params.row.realReceiveQuantiry}`);
                        return false;
                      }
                      this.dataWait[params.index].realNum = value
                    }
                  }
                });
              }else{
                return h('span', params.row.realNum);
              }
            }
          },
          {
            key: 'realReceiveQuantiry',
            title: '指示数量',
            width:100,
            align: 'center'
          },
          {
            key: 'actualStore',
            title: '指示货位',
            width:160,
            align: 'center'
          },
          {
            key: 'storeType',
            title: '货位类型',
            width:130,
            align: 'center'
          },
          {
            key: 'realReceiveStore',
            title: '实际货位',//下拉框
            width:140,
            align: 'center',
            render: (h, params) => {
              if(this.searchArr[1].upFinishType==0&&params.row.acceptoodsVo!=null){
                return h('Select', {
                  props:{
                    filterable:true,
                    value:params.row.realReceiveStore,
                    transfer:true
                  },
                  on: {
                    'on-change': (value) => {
                      this.dataWait[params.index].realReceiveStore = value;
                    }
                  },
                },
                  params.row.acceptoodsVo.map((item)=>{
                    return h('Option',{
                      props:{
                        value:item.id,
                        label:item.positionName
                      }
                    })
                  })

                );
              }else {
                return h('span', params.row.realReceiveStoreName);
              }
            }
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:90,
            align: 'center'
          },
          {
            key: 'productBatchNo',
            title: '生产批号',
            width:100,
            align: 'center'
          },
          {
            key: 'realProductTime',
            title: '生产日期',
            width:100,
            align: 'center'
          },
          {
            key: 'realValidEndDate',
            title: '有效期至',
            width:100,
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width:120,
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
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width:180,
            fixed:'right',
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
        ],
        searchArr:[
          {
            url:this.$api.pharmacyApi.PUTAWAY_DETAILHEAD,
            distributeCode:this.$route.query.distributeCode,
            infoName:'info',
          },
          {
            url:this.$api.pharmacyApi.PUTAWAY_DETAILTAB,
            infoName:'dataWait',
            distributeCode:this.$route.query.distributeCode,
            hisDrugCodeList:'',
            upFinishType:0,
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          }
        ],
        von:'0',
        selectSubmitInfo:'',//选中的数据
      }
    },
    created(){
      this.submit();
    },
    computed:{
      ...mapState(['totalPage'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),

      async submit(){
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[0]);
        this.info=this.$store.state[this.searchArr[0].infoName].data;
        this.von=this.info.auditStatus==2?this.von='0':this.von='1';
        this.searchArr[1].upFinishType=this.von;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.searchArr[1].totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
        this.dataWait.forEach((item, index) => {
          if (this.von==1) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      async changeTab(v){
        if(this.searchArr[1].upFinishType==v){
          return false;
        }
        this.dataWait=[];
        this.searchArr[1].upFinishType=v;
        this.spinShow=true;
        await  this.record_search_head(this.searchArr[1]);
        this.dataWait=this.$store.state[this.searchArr[1].infoName].data.list;
        this.dataWait.forEach((item, index) => {
          if (v==1) {
            item._disabled = true
          }
        });
        this.spinShow=false;
      },
      selectData(selection){
        this.selectSubmitInfo=selection
      },
      async submitData(){
        if(this.selectSubmitInfo.length==0){
          this.$Message.error('请选择要上架的单据');
          return false;
        };
        let isNull = this.selectSubmitInfo.every((item,i)=>{
          if(!item.realNum&&item.storeType!='备选上架货位') {
            item.realNum=item.realReceiveQuantiry
          };
          return true;
        });

        if(!isNull) return;
        let detailListVo=[];
        detailListVo=this.selectSubmitInfo.map(item=>{
          return {
            id: item.id,
            realNum:item.realNum,
            realReceiveStore: item.realReceiveStore,
            productBatchNo: item.productBatchNo,
            upParentId:item.upParentId
          }
        });
        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.submitWarePutData({
          detailListVo,
          distributeCode:this.info.distributeCode,
        });
        if(sbumitInfo.code==200){
          this.$Message.success('上架成功');
          this.von='1';
          this.submit();
        }else {
          this.spinShow=false;
        }
      },
      choseCode(drugCode){
        this.searchArr[1].hisDrugCodeList=drugCode;
        if(!drugCode){
          this.dataWait=this.$store.state.dataWait.data.list;
          return
        }
        let filterArr= filter(this.dataWait,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.dataWait=filterArr
        }else {
          this.$Message.error('请选择此单据中药品进行检索');
          return false;
        }
      }
    },


  }
</script>

<style scoped>
.search-top{align-items: center;color: #666;font-size: 16px;}
</style>
