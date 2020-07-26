/**
* @author QER
* @date 2019/12/25
* @Description: 药房-新建锁定
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <Row>
        <Col span="8" style="display: flex;align-items: center;margin-left: 20px;">
          <span>锁定原因：</span>
          <Select  placeholder="请选择原因" class="condition-group-ipt" v-model="searchArr[1].recallReasonType" style="flex: 1" :disabled="disabledInfo" @on-change="changeApply">
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
  import {filter,differenceBy,intersection} from 'lodash'
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
            width: 60,
            align: 'center',
            fiexd: 'left'
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            fiexd: 'left',
            width: 80
          },
          {
            key: 'ctmmTradeName',
            title: '药品名称',
            align: 'center',
            width: 180,
            fiexd: 'left',
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
            key: 'ctmmDosageFormDesc',
            title: '剂型',
            width: 90,
            align: 'center'

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
            key: 'productDate',
            title: '生产日期',
            align: 'center',
            width: 110,
            fixed: 'right'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            align: 'center',
            width: 110,
            fixed: 'right'
          },
          {
            key: 'approvalNo',
            title: '批准文号',
            align: 'center',
            fixed: 'right',
            width: 140,
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
            key: 'productDate',
            title: '生产日期',
            fixed: 'right',
            width: 110,
            align: 'center'
          },
          {
            key: 'validEndDate',
            title: '有效期至',
            fixed: 'right',
            width: 110,
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
            url: this.$api.systemApi.GETDEPT_TYPELIST,
            infoName: 'deptArr',
            type: 'recall_reason'
          },
          {
            url: this.$api.pharmacyApi.DRUG_OUTPUT_LOCKED_ADD_DRUG_LIST,
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
          this.searchArr[1].infos.existDrugList = this.productsInfo.map(item=>{
            return {
              lot: item.lot,
              bigDrugCode: item.bigDrugCode,
            }
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
        this.searchArr[1].recallReasonType=this.deptArr[0].value;
      },
      //切换补货方式
      changeApply(v){
        this.searchArr[1].recallReasonType=v;

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
            ...item
          };
        });
        this.canCel();
        this.productsInfo=[...this.productsInfo,...filterArr]
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
        this.spinShow2=true;
        let detailList=[];
        detailList=this.selectproductsObj.map(item=>{
          return {
            bigDrugCode: item.bigDrugCode,
            lot: item.lot,
            recallNum: item.totalQuantity,
            refrigerateType: item.refrigerateType,
            supplierCode: item.supplierCode,
          }
        });
        let sbumitInfo= await this.$api.pharmacy.submitLock({
          recallReasonType:this.searchArr[1].recallReasonType,
          detailList
        });
        if(sbumitInfo.code==200){
          this.$Message.success('提交锁定单据成功');
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
