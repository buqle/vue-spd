/**
 * @author QER
 * @date 2020/1/5
 * @Description: 配货出库-单据信息
*/
<template>
  <div class="container container-warp">
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">单据信息</p>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Row :gutter="20" style="display: flex;
    flex-wrap: wrap;
    align-items: center;">
        <Col :span="item.span" v-for="(item,index) in infoData" :key="index" >
          <span>{{item.title ||''}}：</span>
          <span>{{item.cont ||''}}</span>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <div  style="display:  flex; justify-content: space-around;
    width: 262px;">
        <Radius  iconText="配货"  @upButton="submitEvent('allocate','配货成功')"  v-if="info.applyStatus==1||info.applyStatus==3"></Radius>
        <Radius  iconText="配货"  :ondisabled="1" v-else-if="info.applyStatus!=1||info.applyStatus!=3"></Radius>
        <Radius  iconText="取消"   v-if="info.applyStatus==2||info.applyStatus==4" @upButton="submitEvent('cancel','单据取消成功')"></Radius>
        <Radius  iconText="取消"  :ondisabled="1" v-else-if="info.applyStatus!=2||info.applyStatus!=4"></Radius>
        <Radius  iconText="生成拣货单" v-if="info.applyStatus==2||info.applyStatus==4" @upButton="submitEvent('addPick','生成拣货单成功')"></Radius>
        <Radius  iconText="生成拣货单" :ondisabled="1" v-else-if="info.applyStatus!=2||info.applyStatus!=4"></Radius>
      </div>
    </Card>
    <Card :bordered="false" class="card-item info-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode"></Search>
      <div style="display: flex;justify-content: space-between;">
        <Row class="mt15" style="width: 50%">
          <Table :columns="infoColumns" :data="detailList" @on-row-click="rowClick"></Table>
          <Spin size="large" fix v-if="spinShow"></Spin>
        </Row>

        <Row class="mt15" style="width: 48%;">

          <Table :columns="infoColumnsRight" :data="detailListRight"></Table>
          <Spin size="large" fix v-if="spinShow"></Spin>
          <Col style="display: flex;justify-content: flex-end;margin-top: 6px;" v-if="detailListRight.length>0&&info.applyStatus==2||info.applyStatus==4">
            <Radius  iconText="保存"  @upButton="submitObj"></Radius>
          </Col>
        </Row>
      </div>

    </Card>
  </div>
</template>

<script>
  import {filter,reduce} from 'lodash'
  import {mapState,mapActions} from 'vuex'
  export default {
    data(){
      return{
        info:[],
        infoData:[],
        detailList:[],
        spinShow:false,
        confirmUserName:'',
        updateUserId:'',
        selectSubmitInfo:[],
        searchs:[
          {
            url:this.$api.pharmacyApi.PUTAWAY_OUTSTORAGE_ACCPTDIS_DETAILHEAD,
            applyCode:this.$route.query.applyCode,
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
            key: 'replanUnit',
            title: '单位',
            width:90,
            align: 'center'
          },
          {
            key: 'applyNum',
            title: '申领数量',
            width:90,
            align: 'center'
          },
          {
            key: 'usableQuantity',
            title: '可用库存',
            width:90,
            align: 'center'
          },
          {
            key: 'finishNum',
            title: '已分配',
            width:90,
            align: 'center'
          },
          {
            key: 'lackNum',
            title: '欠品数',
            width:90,
            align: 'center'
          },
          {
            key: 'receiveNum',
            title: '预分配数',
            fixed:'right',
            width:90,
            align: 'center'
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
          }
        ],
        okHanData:[],
        amount:0,
        detailListRight:[],
        infoColumnsRight:[
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            key: 'lot',
            title: '生产批号',
            width:130,
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
            key: 'allocationNum',
            title: '可分配数',
            width:90,
            align: 'center'
          },
          {
            key: 'usableQuantity',
            title: '分配数',
            width:90,
            align: 'center',
            render: (h, params) => {
              if(params.row.detailDistributeStatus!=1){
                return h('InputNumber', {
                  props:{
                    min:0,
                    value:params.row.usableQuantity,
                    max:this.amount
                  },
                  on: {
                    'on-change': (value) => {
                      let otherAmount=this.detailListRight.map(item => item.usableQuantity)
                      otherAmount = otherAmount.reduce((total, num) => total + num);
                      let max = this.amount - otherAmount + params.row.usableQuantity;
                      if(value>max){
                        this.$Message.error(`输入数值过大, 总数不能超过未分配数量`);
                        this.detailListRight[params.index].usableQuantity =0
                        return false;
                      }
                      this.detailListRight[params.index].usableQuantity = value
                    }
                  }
                });
              }else {
                return h('span', params.row.usableQuantity);
              }

            }
          }
        ],
        rowId:''
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
        this.detailList=this.info.detailList;
        const {applyCode,applyStatusName,applyDeptName,createUserName,createDate,applyUserPhone,applyLocation}=this.info;
        this.infoData=[{
          title:'申领单',
          span:6,
          cont:applyCode
        },
          {
            title:'状态',
            span:6,
            cont:applyStatusName
          },
          {
            title:'申领部门',
            span:6,
            cont:applyDeptName
          },
          {
            title:'发起人',
            span:6,
            cont:createUserName
          },
          {
            title:'发起时间',
            span:6,
            cont:createDate
          },
          {
            title:'联系电话',
            span:6,
            cont:applyUserPhone
          },
          {
            title:'药房地址',
            span:10,
            cont:applyLocation
          },
        ];

        /*await  this.record_search_head(this.searchs[1]);
        this.detailList=this.$store.state[this.searchs[1].infoName].data.list;
        this.searchs[1].totalPage=this.$store.state[this.searchs[1].infoName].data.count;*/
        this.spinShow=false;
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
      },
      //配货、取消等按钮操作
      async submitEvent(type,typeName){
        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.submitAccept({
          applyCode: this.$route.query.applyCode,
          editType: type
        });
        if(sbumitInfo.code==200){
          this.$Message.success(typeName);
          this.getInfo();
        }else {
          this.spinShow=false;
        }
      },
      //点击产品表
      async rowClick(row,index){
        if(this.info.applyStatus==1||this.info.applyStatus==3){
          this.$Message.error('请先点击配货按钮');
          return false;
        };
        if(this.rowId==row.id){
          return false;
        }
        this.spinShow=true;

        this.rowId=row.id;
        let sbumitInfo= await this.$api.pharmacy.getAcceptRight({
          id:row.id
        });
        this.amount=row.applyNum - row.finishNum
        if(sbumitInfo.code==200){
          this.spinShow=false;
          this.detailListRight=sbumitInfo.data.detailList
        }else {
          this.spinShow=false;
        }
      },
      //保存
      async submitObj(){
        let detailList=[];
        detailList=this.detailListRight.filter(item => item.detailDistributeStatus === 0).map(item=>{
          return {
            id: item.id, usableQuantity: item.usableQuantity
          }
        });

        this.spinShow=true;
        let sbumitInfo= await this.$api.pharmacy.saveRightData({
          detailList,
          id:this.rowId
        });
        if(sbumitInfo.code==200){
          this.$Message.success('配货出库成功');
          this.getInfo();
        }else {
          this.spinShow=false;
        }
      },
    }
  }
</script>
