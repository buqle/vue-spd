/**
 * @author QER
 * @date 2020/1/8
 * @Description: 药房-新建移库
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <Row style="display: flex;">
        <Col span="2-5" style="margin-right: 16px;">
          <Radius iconHref="icon-tianjiaanniu" iconText="添加产品" iconSize="20"  @upButton="add(1)"></Radius>
        </Col>
        <Col span="2-5">
          <Radius  iconText="删除"  @upButton="deletePros" buttonSize="0"></Radius>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">产品信息</p>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Table :columns="columnsProducts" :data="productsInfo" @on-selection-change="selectproducts" ref="selection"></Table>
      <Col span="2-5" v-if="productsInfo.length" class="r mt20">
        <Radius  iconText="提交"  @upButton="submitObj" iconHref="icon-tianjiaanniu"  iconSize="20"></Radius>
      </Col>
    </Card>
    <Modal v-model="modal" width="880">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>请选择要添加的产品</span>
      </p>
      <div flexcont class="search-top">
        <Search @upAdd="choseCode"></Search>
      </div>
      <div class="demo-spin-container mt15" style="height: 220px;overflow-y: auto">
        <Table :columns="columnsModal" :data="modalData" ref="selection" @on-selection-change="selectModalTab"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </div>
      <div class="r mt15">
        <Page :total="searchArr[0].infos.totalPage" :page-size="searchArr[0].infos.pageSize" :current.sync="searchArr[0].infos.pageNo" show-total show-elevator @on-change="refashList"/>
      </div>
      <div slot="footer">
        <Button @click="addIn" :loading="loading">确定</Button>
        <Button type="error" @click="canCel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {filter,differenceBy,intersection} from 'lodash';
  import SelectTips from '@/components/Tipp'
  export default {
    data: function () {
      return {
        spinShow: false,
        spinShow2: false,
        loading: false,
        locArr:[],
        applyArr: [],//申领方式
        deptArr: [],//申领部门
        productsInfo: [],//产品信息
        disabledInfo: false,
        columnsProducts: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmTradeName,
                  trigger: 'hover',
                  title: params.row.ctmmTradeName,
                  placement: 'right',
                }
              })
            }
          },
          {
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title: params.row.ctmmManufacturerName,
                  placement: 'right',
                  length: 8
                }
              })
            }
          },
          {
            key: 'ctmmSpecification',
            title: '规格',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmSpecification,
                  trigger: 'hover',
                  title: params.row.ctmmSpecification,
                  placement: 'right',
                  length:6
                }
              })
            }
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width: 120,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.packageSpecification,
                  trigger: 'hover',
                  title: params.row.packageSpecification,
                  placement: 'right',
                  length: 8
                }
              })
            }
          },
          {
            key: 'lot',
            title: '生产批号',
            align: 'center',
            width: 130
          },
          {
            key: 'adjustNum',
            title: '移动数量',
            align: 'center',
            width: 110,
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:1,
                  value:params.row.adjustNum,
                  max:params.row.usableQuantity
                },
                on: {
                  'on-change': (value) => {
                    if(value>params.row.usableQuantity){
                      this.$Message.error(`输入数值过大, 不能超过${params.row.usableQuantity}`);
                      return false;
                    }
                    this.productsInfo[params.index].adjustNum = value
                  }
                }
              });
            }
          },
          {
            key: 'replanUnit',
            title: '移动单位',
            align: 'center',
            width: 110,
          },
          {
            key: 'usableQuantity',
            title: '原库存',
            align: 'center',
            width: 110,

          },
          {
            key: 'goodsName',
            title: '原货位',
            align: 'center',
            width: 140,

          },
          {
            key: 'positionTypeName',
            title: '原货位类型',
            align: 'center',
            width: 140,
          },
          {
            key: 'goalLocCode',
            title: '目的货位',
            align: 'center',
            width: 140,
            render: (h, params) => {
              return h(SelectTips, {
                props: {
                  row: params.row
                },
                on:{
                  'on-choosed':item=>{
                    this.productsInfo[params.index].goalLocCode = item.id;
                    this.productsInfo[params.index].goalBigDrugCode = item.goalBigDrugCode;
                    this.productsInfo[params.index].goalDrugCode =item.goalDrugCode;
                    this.productsInfo[params.index].targetUnit =item.targetUnit;
                    this.productsInfo[params.index].targetUnitCode = item.targetUnitCode;
                    this.productsInfo[params.index].targetTypeName =item.targetTypeName;
                    this.productsInfo[params.index].conversionRate =item.conversionRate;
                    if(item.targetType!=1){
                      this.$Message.error('此药品不允许修改补货指示货位');
                      return false;
                    }
                    this.productsInfo[params.index].targetType =item.targetType;
                  }
                }
              })
            },
            fixed: 'right'
          },
          {
            key: 'isEditLoc',
            title: '同步修改补货指示货位',
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              return h('Checkbox', {
                props:{
                  value:params.row.isEditLoc,
                  disabled:params.row.targetType!=1? true : false
                },
                on: {
                  'on-change': (event) => {
                    event?params.row.isEditLoc=1:0
                  }
                }
              });
            },
            width: 160,
          },
          {
            key: 'targetTypeName',
            title: '目的货位类型',
            align: 'center',
            width: 120,
            fixed: 'right'
          },
          {
            key: 'targetUnit',
            title: '目的货位单位',
            align: 'center',
            width: 120,
            fixed: 'right'
          },
          {
            key: 'conversionRate',
            title: '转换系数',
            align: 'center',
            width: 100,
            fixed: 'right'
          },
          {
            key: 'lot',
            title: '生产批号',
            align: 'center',
            width: 100,
            fixed: 'right'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            width: 120,
            fixed: 'right',
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
        ],
        modalData: [],
        columnsModal: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
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
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmTradeName,
                  trigger: 'hover',
                  title: params.row.ctmmTradeName,
                  placement: 'right',
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
            key: 'ctmmManufacturerName',
            title: '生产厂家',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmManufacturerName,
                  trigger: 'hover',
                  title: params.row.ctmmManufacturerName,
                  placement: 'right',
                  length: 8
                }
              })
            }
          },
          {
            key: 'lot',
            title: '生产批号',
            width: 130,
            align: 'center'
          },
          {
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width: 90,
            align: 'center'
          },
          {
            key: 'goodsName',
            title: '货位',
            fixed: 'right',
            width: 140,
            align: 'center'
          },
          {
            key: 'positionTypeName',
            title: '货位类型',
            fixed: 'right',
            width: 120,
            align: 'center'
          },
          {
            key: 'packageSpecification',
            title: '包装规格',
            align: 'center',
            fixed: 'right',
            width: 120,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.packageSpecification,
                  trigger: 'hover',
                  title: params.row.packageSpecification,
                  placement: 'right',
                  length: 8
                }
              })
            }
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed: 'right',
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title: params.row.approvalNo,
                  placement: 'bottom'
                }
              })
            }
          },
        ],

        searchArr: [
          {
            url: this.$api.pharmacyApi.GOODS_ADJUST_ADD_DRUG_LIST,
            infoName: 'modalData',
            method: 'postJson',
            recallReasonType:'',
            infos:{
              existDrugList: [],
              pageNo: 1,
              pageSize: 10,
              totalPage: 0
            }
          }
        ],
        modal: false,
        selectModalInfo: [],
        selectproductsObj: [], delObj: []
      }
    },
    computed:{
      ...mapState(['spinsShow'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),

      add(type){
        this.modal=true;
        this.addInfo()

      },
      //添加产品Modal查询
      async addInfo(){
        if(this.productsInfo.length>0){
          this.searchArr[0].infos.existDrugList = this.productsInfo.map(item=>{
            return {
              drugCode: item.drugCode,
              locCode: item.goodsCode,
              lot: item.lot,
            }
          });
        }
        await this.refashList()
        this.searchArr[0].infos.totalPage=this.$store.state[this.searchArr[0].infoName].data.count;
      },
      async refashList(){
        this.$store.state.spinsShow=true;
        await  this.record_search(this.searchArr[0]);
        this.modalData=this.$store.state[this.searchArr[0].infoName].data.list;
        this.$store.state.spinsShow=false;
      },

      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;
        let detailList=this.selectModalInfo.map((item)=>{
          return {
            drugCode: item.drugCode,
            lot: item.lot,
            locCode: item.goodsCode
          };
        });
        let menuListSbumit= await this.$api.pharmacy.addAdjustBill({
          detailList,locType: '2'
        });
        if(menuListSbumit.code==200){
          let filterArr= menuListSbumit.data.map(item=>{
            return {
              ...item,
              targetUnit:item.targetUnit,
              targetTypeName: item.targetTypeName,
              conversionRate: item.targetTypeName,
              adjustNum:1,
              goalLocCode:item.goalLocCode
            }
          });
          this.canCel();
          this.productsInfo=[...this.productsInfo,...filterArr]
        }


        this.loading=false;

      },
      //取消
      canCel(){
        this.modal=false;
      },
      //弹窗列表选中
      selectModalTab(selection){
        this.selectModalInfo=selection
      },

      //提交
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      async submitObj(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        console.log(this.selectproductsObj)
        let isNull = this.selectproductsObj.every(item=>{
          if(!item.adjustNum) {
            this.$Message.error('移动数量不能为空');
            return false;
          };
          if(!item.goalLocCode) {
            this.$Message.error('目的货位不能为空');
            return false;
          };
          return true;
        });
        if(!isNull) return;
        this.spinShow2=true;
        let goodsLocationDetailDtoList=[];
        goodsLocationDetailDtoList=this.selectproductsObj.map(item=>{
          return {
            adjustNum: item.adjustNum,
            batchNo: item.batchNo,
            conversionRate: item.conversionRate,
            drugCode: item.drugCode,
            goalBigDrugCode: item.goalBigDrugCode,
            goalDrugCode: item.goalDrugCode,
            goalLocCode: item.goalLocCode,
            goalUnit: item.targetUnitCode,
            lot: item.lot,
            goalLot: item.lot,
            originalBigDrugCode: item.bigDrugCode,
            originalLocCode: item.goodsCode,
            originalStore: item.usableQuantity,
            productDate: item.productDate,
            supplierCode: item.supplierCode,
            validEndDate: item.validEndDate,
            originalUnit: item.replanUnitCode,
            originLocName: item.goodsName,
            isEditLoc:item.isEditLoc
          }
        });
        let sbumitInfo= await this.$api.pharmacy.submitAdjust({
          goodsLocationDetailDtoList
        });
        if(sbumitInfo.code==200){
          this.$Message.success('提交移库单据成功');
          this.spinShow2=false;
          this.$router.go(-1);
        }else {
          this.spinShow2=false;
        }
      },

      deletePros(){
        this.productsInfo=differenceBy(this.productsInfo, this.selectproductsObj,'drugCode');
      },

      choseCode(drugCode){
        //drugCode?this.searchArr[1].detail.paramName=drugCode:this.searchArr[1].detail.paramName=''
        if(!drugCode){
          this.modalData=this.$store.state[this.searchArr[0].infoName].data.list;
          return
        }
        let filterArr= filter(this.modalData,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.modalData=filterArr
        }else {
          this.$Message.error('请选择此单据中药品进行检索');
          return false;
        }
      }
    }
  }
</script>

<style scoped>
  .search-top{align-items: center;color: #666;font-size: 16px;}
</style>
