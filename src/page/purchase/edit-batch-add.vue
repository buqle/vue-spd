/**
 * @author BQL
 * @date 2020/3/31
 * @Description: 新增批号
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <Row>
        <Col span="8" style="display: flex;align-items: center;margin-left: 20px;">
          <span>部门：</span>
          <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[1].infos.deptCode" style="flex: 1" :disabled="disabledInfo" @on-change="changeApply">
            <Option  v-for="(item,index) in deptArr" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item" v-if="deptArr.length>0">
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
        <Page :total="searchArr[1].infos.totalPage" :page-size="searchArr[1].infos.pageSize" :current.sync="searchArr[1].infos.pageNo" show-total show-elevator @on-change="refashList"/>
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
  import moment from 'moment';
  export default {

    data: function () {
      return {
        spinShow: false,
        spinShow2: false,
        loading: false,
        applyArr: [],//申领方式
        deptArr: [],//申领部门
        productsInfo: [],//产品信息
        disabledInfo: false,
        columnsProducts: [
          {
            type: 'selection',
            width: '60',
            align: 'center'
          },
          {
            type: 'index',
            title: '序号',
            width: '60',
            align: 'center'
          },
          {
            key: 'drugName',
            title: '药品名称',
            align: 'center',
            width:'180',
            fiexd:'left',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.drugName,
                  trigger: 'hover',
                  title:params.row.drugName,
                  placement:'right',
                }
              })
            },
          },
          {
            key: 'drugCode',
            title: '药品编码',
            width:'160',
            align: 'center'
          },
          {
            key: 'unitDesc',
            title: '单位',
            width:'100',
            align: 'center'
          },
          {
            key: 'totalQuantity',
            title: '数量',
            width:'90',
            align: 'center'
          },
          {
            key: 'lot',
            title: '批号',
            width:'120',
            align: 'center'
          },
          {
            key: 'ctmmSpecification',
            title: '规格',
            align: 'center',
            width: '120',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmSpecification,
                  trigger: 'hover',
                  title: params.row.ctmmSpecification,
                  placement: 'right',
                  length: 8
                }
              })
            }
          },
          {
            key: 'productDate',
            title: '生产日期',
            align: 'center',
            width: '110',
            render: (h, params) => {
              let time = moment(params.row.productDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'validEndDate',
            title: '有效期',
            align: 'center',
            width: 110,
            render: (h, params) => {
              let time = moment(params.row.productDate).format('YYYY-MM-DD')
              return h('span', time);
            }
          },
          {
            key: 'newLot',
            title: '新批号',
            fixed: 'right',
            align: 'center',
            width:110,
            render: (h, params) => {
              return h('Input', {
                props:{
                  value:params.row.newLot,
                },
                on: {
                  'on-change': (event) => {
                    this.productsInfo[params.index].newLot = event.target.value
                  }
                }
              });
            }
          },
          {
            key: 'newProductDate',
            title: '新生产日期',
            fixed: 'right',
            align: 'center',
            width:150,
            render: (h, params) => {
              return h('DatePicker', {
                props: {
                  clearable: false,
                  placeholder: '请选择日期',
                  value: params.row.newProductDate,
                  type: 'date',
                  format: 'yyyy-MM-dd',
                  size: 'small',
                  transfer:true
                },
                on: {
                  'on-change': (event) => {
                    this.productsInfo[params.index].newProductDate = event
                  }
                }
              });
            }
          },
          {
            key: 'newValidEndDate',
            title: '新有效日期',
            fixed: 'right',
            align: 'center',
            width:150,
            render: (h, params) => {
              return h('DatePicker', {
                props: {
                  clearable: false,
                  placeholder: '请选择日期',
                  value: params.row.newValidEndDate,
                  type: 'date',
                  format: 'yyyy-MM-dd',
                  size: 'small',
                  transfer:true
                },
                on: {
                  'on-change': (event) => {
                    this.productsInfo[params.index].newValidEndDate = event
                  }
                }
              });
            }
          },
          {
            key: 'adjustQty',
            title: '调整数量',
            align: 'center',
            fixed: 'right',
            width:'100',
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:1,
                  value:params.row.adjustQty,
                  max:999999
                },
                on: {
                  'on-change': (value) => {
                    this.productsInfo[params.index].adjustQty = value
                  }
                }
              });
            }
          },
          {
            key: 'remarks',
            title: '备注',
            fixed: 'right',
            align: 'center',
            width:'150',
            fixed: 'right',
            render: (h, params) => {
              return h('Input', {
                props:{
                  value:params.row.remarks,
                },
                on: {
                  'on-change': (event) => {
                    this.productsInfo[params.index].remarks = event.target.value
                  }
                }
              });
            }
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed: 'right',
            width: '140',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title: params.row.approvalNo,
                  placement: 'left',
                  length: 10
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
            key: 'hisDrugCode',
            title: '药品编码',
            width: 140,
            align: 'center'
          },
          {
            key: 'drugName',
            title: '药品名称',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.drugName,
                  trigger: 'hover',
                  title: params.row.drugName,
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
            key: 'ctmmSpecification',
            title: '规格',
            align: 'center',
            fixed: 'right',
            width: 120,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.ctmmSpecification,
                  trigger: 'hover',
                  title: params.row.ctmmSpecification,
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
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName: 'deptArr',
            type: 'lot_adjust_dept'
          },
          {
            url: this.$api.pharmacyApi.BATCH_LIST_SELECT,
            infoName: 'modalData',
            method: 'postJson',
            infos:{
              existInstoreCodeList: [],
              deptCode:'24C69445D19C4625960DA3F1E58A6A1F',
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
          this.searchArr[1].infos.existInstoreCodeList = this.productsInfo.map(item=>{
            return item.batchNo
          });
        }
        await this.refashList()
        this.searchArr[1].infos.totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
      },
      async refashList(){
        this.$store.state.spinsShow=true;
        await  this.record_search(this.searchArr[1]);
        this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
        this.$store.state.spinsShow=false;
      },

      //获取部门
      async deptFun(){
        await  this.record_search_head(this.searchArr[0]);
        let deptArrs=this.$store.state[this.searchArr[0].infoName].data;
        deptArrs= filter(deptArrs,(o)=>{
          return o.value!=''
        });
        this.deptArr=deptArrs;
        this.searchArr[1].infos.deptCode=this.deptArr[0].value;
      },
      //切换补货方式
      changeApply(v){
        this.searchArr[1].infos.deptCode=v;

      },
      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;
        this.canCel();
        this.productsInfo=[...this.productsInfo,...this.selectModalInfo]
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
      onCheck(){
        let isNull=this.selectproductsObj.every((item)=>{
          if(!item.newLot){
            this.$Message.error('请填写请新批号');
            return false;
          }else if(!item.newProductDate){
            this.$Message.error('请填写请新生产日期');
            return false;
          }else if(!item.newValidEndDate){
            this.$Message.error('请填写请新有效日期');
            return false;
          }else if(!item.newValidEndDate){
            this.$Message.error('请填写请新有效日期');
            return false;
          }else if(!item.adjustQty){
            this.$Message.error('请填写调整数量');
            return false;
          }else {
            return true
          }
        })
        return isNull
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
        if(!this.onCheck()) return;
        this.spinShow2=true;
        let sbumitInfo= await this.$api.pharmacy.submitBatch({
          deptCode:this.searchArr[1].infos.deptCode,
          lotAdjustList:this.selectproductsObj
        });
        if(sbumitInfo.code==200){
          this.$Message.success('新增单据成功');
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
          this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
          this.searchArr[1].infos.totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
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
    },
    async created(){
      await this.deptFun();

    },

  }
</script>

<style scoped>
  .search-top{align-items: center;color: #666;font-size: 16px;}
</style>
