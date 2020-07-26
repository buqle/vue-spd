/**
* @author QER
* @date 2019/11/28
* @Description: 药房-新建药品申领
*/
<template>
  <div class="container">
    <Card :bordered="false" class="card-item">
      <Row>
        <Col span="8" style="display: flex;align-items: center;">
          <span>补货方式：</span>
          <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="submitInfo.applyType" style="flex: 1" @on-change="changeApply" :disabled="productsInfo.length>0">
            <Option  v-for="(item,index) in applyArr" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="8" style="display: flex;align-items: center;margin-left: 20px;">
          <span>补货部门：</span>
          <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="submitInfo.deptCode" style="flex: 1" :disabled="productsInfo.length>0">
            <Option  v-for="(item,index) in deptArr" :value="item.id" :key="index">{{item.deptName}}</Option>
          </Select>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <Row style="display: flex;">
        <Col span="2-5">
          <Radius iconHref="icon-tianjiaanniu" iconText="添加产品" iconSize="20"  @upButton="add(1)"></Radius>
        </Col>
        <Col span="5" style="margin: 0 16px;">
          <Radius  iconText="一键添加低库存产品"  @upButton="add(2)" iconSize="20" iconHref="icon-tianjiaanniu"></Radius>
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
      <Col class="flex-button" style="justify-content:space-around;margin-top: 20px;    width: 220px;
    float: right;">
        <Radius  iconText="提交"  @upButton="submitObj" iconHref="icon-tianjiaanniu"  iconSize="20"></Radius>
        <Radius  iconText="保存草稿"  @upButton="submitObj(1)" iconHref="icon-tianjiaanniu"  iconSize="20"></Radius>
      </Col>
    </Card>
    <Modal v-model="modal" width="880">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>请选择要添加的产品</span>
      </p>
      <div flexcont class="search-top">
        <Search @upAdd="addInfo"></Search>
        <strong>以下背景色标蓝为药库库存为0的产品</strong>
      </div>
      <div class="demo-spin-container mt15" style="height: 220px;overflow-y: auto">
        <Table :columns="columnsModal" :data="modalData" ref="selection" @on-selection-change="selectModalTab" :row-class-name="rowClassName"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </div>
      <div class="r mt15">
        <Page :total="searchArr[2].totalPage" :page-size="searchArr[2].pageSize" :current.sync="searchArr[2].pageNo" show-total show-elevator @on-change="refashList"/>
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
            key: 'applyNum',
            title: '申领数量',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:1,
                  value:params.row.applyNum,
                },
                on: {
                  'on-change': (value) => {
                    this.productsInfo[params.index].applyNum = value
                  }
                }
              });
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
            key: 'locaUpperQuantity',
            title: '库存上限',
            width:100,
            align: 'center'
          },
          {
            key: 'localDownQuantity',
            title: '库存下限',
            width:100,
            align: 'center'
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
            title: '单位',
            width:100,
            align: 'center'
          },
          {
            key: 'ctpHdmsPackageDesc',
            title: '整包装单位',
            align: 'center',
            width:100
          },
          {
            key: 'usableQuantity',
            title: '配货部门库存',
            align: 'center',
            width:120,
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  trigger: 'hover',
                  content:params.row.usableQuantity,
                  title:'配货部门可用库存',
                  placement:'right',
                }
              })
            }
          },
          {
            key: 'localUsableQuantity',
            title: '药房可用库存',
            align: 'center',
            width:120,
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  trigger: 'hover',
                  content:params.row.localUsableQuantity,
                  title:'当前部门可用库存',
                  placement:'right',
                }
              })
            }
          },
          {
            key: 'recentlyUseNum',
            title: '7天使用量',
            align: 'center',
            width:150,
            fixed:'right',
            render: (h, params) => {
              return h('PopTips', {
                props: {
                  trigger: 'hover',
                  content:params.row.recentlyUseNum,
                  title:'当前部门近7天的药品发药量',
                  placement:'right',
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
        submitInfo:{
          applyType:'',
          deptCode:'',
        },
        searchArr:[
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            filterAllFlag: true,
            type: 'apply_type',
            infoName:'applyArr',
          },
          {
            url:this.$api.pharmacyApi.APPLY_SELECT_DEPT,
            infoName:'deptArr',
            applyType: 1
          },
          {
            url:this.$api.pharmacyApi.APPLY_SELECT_BY_DEPT,
            infoName:'modalData',
            method:'postJson',
            addDrugType:'',
            applyFlag: true,
            deptCode:'',
            existDrugCodeList: [],
            hisDrugCodeList: [],
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          },
          {
            url:this.$api.pharmacyApi.APPLY_EDIT_LIST,
            infoName:'productsInfo',
            method:'postJson',
            infos:{
              applyCode:this.$route.query.applyCode,
              applyStatus:this.$route.query.applyStatus
            }
          },
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
        selectproductsObj:[],delObj:[],edit:{}
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
      this.searchArr[2].addDrugType=type
      //console.log(this.searchArr[2].addDrugType)
       this.modal=true;
       this.addInfo()

      },
      //添加产品Modal查询
      async addInfo(drugCode){
        drugCode?this.searchArr[2].hisDrugCodeList[0]=drugCode:this.searchArr[2].hisDrugCodeList=[]
       await this.refashList()
        this.searchArr[2].totalPage=this.$store.state[this.searchArr[2].infoName].data.count;

      },
      async refashList(){
        await  this.record_search(this.searchArr[2]);
        this.modalData=this.$store.state[this.searchArr[2].infoName].data.list;
      },

      //获取部门
      async deptFun(){
        await  this.record_search_head(this.searchArr[1]);
        this.deptArr=this.$store.state[this.searchArr[1].infoName].data;
        if(this.$route.query.applyStatus==0){
          this.submitInfo.deptCode=this.edit.distributeDeptCode;
        }else {
          this.submitInfo.deptCode=this.deptArr[0].id;
        }

      },
      //切换补货方式
      changeApply(v){
        this.searchArr[1].applyType=v;
        //this.deptFun()
      },
      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;
        let drugCodeList=[];
        drugCodeList=this.selectModalInfo.map(item=>item.drugCode);
        let menuListSbumit= await this.$api.pharmacy.addDrug({
          drugCodeList,
          deptCode:this.submitInfo.deptCode,
          addDrugType:1
        });
        if(menuListSbumit.code==200){
          let filterArr2= filter(menuListSbumit.data,(o)=>{
            return o.usableQuantity==0
          })
          if(filterArr2.length){
            this.$Message.success('药库库存为0产品将不进行添加');
          }else {
            this.$Message.success('添加成功');
          }
          let filterArr= filter(menuListSbumit.data,(o)=>{
            return o.usableQuantity!=0
          })
          this.canCel();
          this.productsInfo=[...this.productsInfo,...filterArr]
          this.loading=false;
          this.disabledInfo=true
        }

      },
      //取消
      canCel(){
        this.modal=false;
        this.searchArr[2].hisDrugCodeList=[]
      },
      //弹窗列表选中
      selectModalTab(selection){
        this.selectModalInfo=selection
      },
      //提交
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      async submitObj(flag){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        let isNull = this.selectproductsObj.every(item => {
          if(!item.applyNum) {
            this.$Message.error('申领数量不能为空');
            return false;
          };
          return true
        });
        if(!isNull) return;
        let detaiList=[];
        detaiList=this.selectproductsObj.map(item=>{
          return {
            applyNum: item.applyNum,
            drugCode: item.drugCode
          }
        });
        let sbumitInfo= !flag?await this.$api.pharmacy.submitDrug:await this.$api.pharmacy.saveDrug({
          detaiList,
          distributeDeptCode:this.submitInfo.deptCode,
          applyType:this.searchArr[1].applyType,
          applyStatus:this.$route.query.applyStatus,
          applyCode:this.$route.query.applyCode
        });
        if(sbumitInfo.code==200){
          this.$Message.success(!flag?'提交申领单成功':'保存申领单成功');
          this.$router.go(-1);
        }
      },

      deletePros(){
        this.productsInfo=differenceBy(this.productsInfo, this.selectproductsObj,'drugCode');
      }
    },
    async created(){
      if(this.$route.query.applyStatus==0){
        await  this.record_search_head(this.searchArr[3]);
        this.productsInfo=this.$store.state[this.searchArr[3].infoName].data.detailList;
        this.edit=this.$store.state[this.searchArr[3].infoName].data;
        this.submitInfo.applyType=this.edit.applyType.toString();
      }
      await  this.record_search_head(this.searchArr[0]);
      this.applyArr=this.$store.state[this.searchArr[0].infoName].data;
      if(this.$route.query.applyStatus!=0){
        this.submitInfo.applyType=this.applyArr[0].value;
      }
      await this.deptFun();
      this.searchArr[2].deptCode=this.submitInfo.deptCode;
    }

  }
</script>

<style scoped>
.search-top{align-items: center;color: #666;font-size: 16px;}
</style>
