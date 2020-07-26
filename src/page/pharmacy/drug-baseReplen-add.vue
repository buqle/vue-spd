/**
* @author QER
* @date 2019/12/25
* @Description: 药房-新建基数药补货
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <Row>
        <Col span="8" style="display: flex;align-items: center;margin-left: 20px;">
          <span>接收部门：</span>
          <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[1].detail.deptCode" style="flex: 1" :disabled="productsInfo.length>0" @on-change="changeApply">
            <Option  v-for="(item,index) in deptArr" :value="item.id" :key="index">{{item.deptName}}</Option>
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
        <Table :columns="columnsModal" :data="modalData" ref="selection" @on-selection-change="selectModalTab" :row-class-name="rowClassName"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </div>
      <div class="r mt15">
        <Page :total="searchArr[1].totalPage" :page-size="searchArr[1].pageSize" :current.sync="searchArr[1].pageNo" show-total show-elevator @on-change="refashList"/>
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
  import {filter,differenceBy,intersection} from 'lodash'
  export default {

    data () {
      return {
        spinShow:false,
        spinShow2:false,
        loading:false,
        applyArr:[],//申领方式
        deptArr:[],//申领部门
        productsInfo:[],//产品信息
        disabledInfo:false,
        columnsProducts:[
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
            key: 'outStoreNum',
            title: '数量',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:0,
                  value:params.row.outStoreNum,
                  max:params.row.usableQuantity
                },
                on: {
                  'on-change': (value) => {
                    if(value>params.row.usableQuantity){
                      this.$Message.error(`输入数值过大, 不能超过${params.row.usableQuantity}`);
                      return false;
                    }
                    this.productsInfo[params.index].outStoreNum = value
                  }
                }
              });
            }
          },
          {
            key: 'usableQuantity',
            title: '当前库存',
            width:100,
            align: 'center'
          },
          {
            key: 'baseStoreNum',
            title: '基数药库存',
            width:100,
            align: 'center'
          },
          {
            key: 'baseNum',
            title: '库存基数',
            width:100,
            align: 'center'
          },
          {
            key: 'replanUnit',
            title: '单位',
            width:90,
            align: 'center'
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
            key: 'lot',
            title: '生产批号',
            align: 'center',
            width:120
          },
          {
            key: 'productDate',
            title: '生产日期',
            align: 'center',
            width:110,
            fixed:'right'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            align: 'center',
            width:110,
            fixed:'right'
          },
          {
            key: 'supplierName',
            title: '供应商',
            align: 'center',
            fixed:'right',
            width:140,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.supplierName,
                  trigger: 'hover',
                  title:params.row.supplierName,
                  placement:'left',
                  length:6
                }
              })
            }
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed:'right',
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
        ],
        modalData:[],
        columnsModal:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width:180,
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
            key: 'ctmmDosageFormDesc',
            title: '剂型',
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
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            width:180,
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  content: params.row.approvalNo,
                  trigger: 'hover',
                  title:params.row.approvalNo,
                  placement:'bottom'
                }
              })
            }
          },
        ],

        searchArr:[
          {
            url:this.$api.pharmacyApi.PUTAWAY_ADD_REPLEN_DEPTTYPE,
            infoName:'deptArr',
            method: 'get'
          },
          {
            url:this.$api.pharmacyApi.PUTAWAY_ADD_REPLEN_DRUGINFO,
            infoName:'modalData',
            method:'postJson',
            deptCode:'',
            detail:{},
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          }
        ],
        modal:false,
        selectModalInfo:[],
        //search
        drugSearch:{
          value:'',
          data:[]
        },
        querySearch:{
          url:'/a/common/queryDrugByList',
          infoName:'deptArr',
        },
        selectproductsObj:[],delObj:[]
      }
    },
    computed:{
      ...mapState(['spinsShow'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      //库存为0的添加背景色
      rowClassName (row, index) {
        if (row.usableQuantity==0) {
          return 'info-row';
        }
        return '';
      },
      add(type){
        this.modal=true;
        this.addInfo()

      },
      //添加产品Modal查询
      async addInfo(drugCode){
        if(this.productsInfo.length>0){
          this.searchArr[1].detail.listDetail = this.productsInfo.map(item=>{
            return {
              lot: item.lot,
              drugCode: item.drugCode
            }
          });
        }
        drugCode?this.searchArr[1].detail.paramName=drugCode:this.searchArr[1].detail.paramName=''

        await this.refashList()
        this.searchArr[1].totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
      },
      async refashList(){
        await  this.record_search(this.searchArr[1]);
        this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
      },

      //获取部门
      async deptFun(){
        await  this.record_search_head(this.searchArr[0]);
       let deptArrs=this.$store.state[this.searchArr[0].infoName].data;

        let filterArr='';
        if(this.$route.meta.check){
          filterArr= filter(deptArrs,(o)=>{
            return o.key==3
          });
        }else {
           filterArr= filter(deptArrs,(o)=>{
            return o.key==2
          });
        }
        this.deptArr=filterArr;
        this.searchArr[1].detail.deptCode=this.deptArr[0].id;
      },
      //切换补货方式
      changeApply(v){
        this.searchArr[1].detail.deptCode=v;
      },
      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;
        let filterArr=[];
        filterArr=this.selectModalInfo.map((item)=>{
          return {
            ...item,
            outStoreNum: item.usableQuantity,
          };
        });
        this.canCel();
        this.productsInfo=[...this.productsInfo,...filterArr]
        this.loading=false;
        this.disabledInfo=true

      },
      //取消
      canCel(){
        this.modal=false;
        this.searchArr[1].detail.paramName='';
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
        let isNull = this.selectproductsObj.every(item => {
          if(!item.outStoreNum) {
            this.$Message.error('请填写数量');
            return false;
          };
          return true
        });
        if(!isNull) return;
        this.spinShow2=true;
        let listDetail=[];
        listDetail=this.selectproductsObj.map(item=>{
          return {
            batchNo: item.batchNo,
            drugCode: item.drugCode,
            outStoreNum: item.outStoreNum
          }
        });
        let sbumitInfo= await this.$api.pharmacy.submitBaseReplen({
          detail: {
            deptCode:this.searchArr[1].detail.deptCode,
            outStoreType: '2',
            listDetail
          }
        });
        if(sbumitInfo.code==200){
          this.$Message.success('提交基数药补货单成功');
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
