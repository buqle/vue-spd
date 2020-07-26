/**
 * @author QER
 * @date 2019/12/27
 * @Description: 药房-新建退库
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <p slot="title"  v-if="$route.query.isDraft==1">编辑草稿单据信息</p>
      <p slot="title"  v-if="$route.query.isDraft==2">编辑单据信息</p>
      <Row>
        <Col span="8" style="display: flex;align-items: center;">
          <span>退货原因：</span>
          <Select  placeholder="请选择退货原因" class="condition-group-ipt" v-model="searchArr[1].backCause" style="flex: 1">
            <Option  v-for="(item,index) in backCauseArrs" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="8" style="display: flex;align-items: center;margin-left: 20px;">
          <span>接收部门：</span>
          <Select  placeholder="请选择部门" class="condition-group-ipt" v-model="searchArr[1].deptCode" style="flex: 1" :disabled="disabledInfo">
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
      <div v-if="productsInfo.length" class="mt20" style="display: flex;justify-content: flex-end;">
        <Col span="2-5" style="margin-right: 16px;">
          <Radius  iconText="提交草稿"  @upButton="submitObj" iconHref="icon-tianjiaanniu"  iconSize="20" v-if="editdetailsData.backNo"></Radius>
          <Radius  iconText="提交"  @upButton="submitObj" iconHref="icon-tianjiaanniu"  iconSize="20" v-else></Radius>
        </Col>
        <Col span="2-5">
          <Radius  iconText="保存草稿"  @upButton="submitObj(1)"  buttonSize="1"></Radius>
        </Col>
      </div>
    </Card>
    <Modal v-model="modal" width="880">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>请选择要添加的产品</span>
      </p>
      <div flexcont class="search-top">
        <Search @upAdd="choseCode"></Search>
        <strong>以下背景色标蓝为药库库存为0的产品</strong>
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
        backCauseArrs:[],//退货原因
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
            key: 'backNum',
            title: '退库数量',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:1,
                  value:params.row.backNum?params.row.backNum:1,
                  max:params.row.usableQuantity
                },
                on: {
                  'on-change': (value) => {
                    if(value>params.row.usableQuantity){
                      this.$Message.error(`输入数值过大, 不能超过${params.row.usableQuantity}`);
                      return false;
                    }
                    this.productsInfo[params.index].backNum = value
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
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_ADDEPT,
            infoName:'deptArr',
            method: 'get'
          },
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_ADDUG_LIST,
            infoName:'modalData',
            method:'postJson',
            deptCode:'',
            existInstoreCodeList:[],
            backCause:'',
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          },
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_EDITDRAFT_HEAD,
            infoName:'editdetailsData',
            backNo:this.$route.query.backNo
          },
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_EDITDRAFT_TAB,
            infoName:'productsInfo',
            backNo:this.$route.query.backNo
          },
          {
            url:this.$api.pharmacyApi.DRUG_OUTPUT_REFUND_EDIT_HEAD,
            infoName:'editdetailsData',
            backNo:this.$route.query.backNo
          },
        ],
        modal:false,
        selectModalInfo:[],
        selectproductsObj:[],
        delObj:[],
        editdetailsData:{}
      }
    },
    computed:{
      ...mapState(['spinsShow','backCauseArr'])
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
        if(!this.searchArr[1].backCause){
          this.$Message.error('请选择要退货原因');
          return false;
        }else if(!this.searchArr[1].deptCode){
          this.$Message.error('请选择接收部门');
          return false;
        }
        this.modal=true;
        this.addInfo()

      },
      //添加产品Modal查询
      async addInfo(drugCode){
        if(this.productsInfo.length>0){
          this.searchArr[1].existInstoreCodeList = this.productsInfo.map(item=>this.searchArr[1].existInstoreCodeList.push(item.batchNo));
        }
        //drugCode?this.searchArr[1].detail.paramName=drugCode:this.searchArr[1].detail.paramName=''

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
        this.deptArr=this.$store.state[this.searchArr[0].infoName].data;
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
      },
      //弹窗列表选中
      selectModalTab(selection){
        this.selectModalInfo=selection
      },
      //提交
      selectproducts(selection){
        this.selectproductsObj=selection;
      },
      //保存草稿单&提交退货单
      async submitObj(type){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        this.spinShow2=true;
        let backDrugList=[];
        let postData={};
        if(!this.editdetailsData.backNo){
          backDrugList=this.selectproductsObj.map(item=>{
            return {
              backNum: item.backNum==undefined?1:item.backNum,
              drugCode: item.drugCode,
              inStoreCode: item.inStoreCode,
              lot: item.lot,
              supplierCode: item.supplierCode
            }
          });
        }else {
          backDrugList=this.productsInfo.map(item=>{
            return {
              backNum: item.backNum,
              drugCode: item.drugCode,
              inStoreCode: item.inStoreCode,
              lot: item.lot,
              supplierCode: item.supplierCode
            }
          });
          postData.backNo=this.editdetailsData.backNo;
        }
        postData.backDrugList = backDrugList;
        postData.backcause = this.searchArr[1].backCause;
        postData.deptCode = this.searchArr[1].deptCode;
        let sbumitInfo=''
        sbumitInfo=type?await this.$api.pharmacy.saveRefundData({...postData}):await this.$api.pharmacy.submitRefundData({...postData});
        if(sbumitInfo.code==200){
          this.$Message.success(type?'保存草稿成功':'新建退库单成功');
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
      },

      //获取草稿详情
     async getEditDraft(){
       this.spinShow2=true;
       await  this.record_search_head(this.searchArr[2]);
       this.editdetailsData=this.$store.state[this.searchArr[2].infoName].data;
       this.searchArr[1].deptCode=this.editdetailsData.acceptDeptCode;
       this.searchArr[1].backCause=this.editdetailsData.backCause;

       await  this.record_search_head(this.searchArr[3]);
       this.productsInfo=this.$store.state[this.searchArr[3].infoName].data;
       this.spinShow2=false;
     },
      //获取单据详情
      async getEdits(){
        this.spinShow2=true;
        await  this.record_search_head(this.searchArr[2]);
        this.editdetailsData=this.$store.state[this.searchArr[2].infoName].data;
        this.searchArr[1].deptCode=this.editdetailsData.acceptDeptCode;
        this.searchArr[1].backCause=this.editdetailsData.backCause;
        this.productsInfo=this.editdetailsData.list;
        this.spinShow2=false;
      },
      //提交草稿单
      async submitEditDarft(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        this.spinShow2=true;
        let backDrugList=[];
        backDrugList=this.productsInfo.map(item=>{
          return {
            backNum: item.backNum,
            drugCode: item.drugCode,
            lot:item.lot,
            inStoreCode:item.inStoreCode,
            supplierCode:item.supplierCode
          }
        });
        let sbumitInfo=await this.$api.pharmacy.submitEditDarft({
          backDrugList,
          backcause:this.searchArr[1].backCause,
          backNo:this.editdetailsData.backNo,
          deptCode:this.editdetailsData.acceptDeptCode,
        });
        if(sbumitInfo.code==200){
          this.$Message.success('提交草稿单成功');
          this.spinShow2=false;
          this.$router.go(-1);
        }else {
          this.spinShow2=false;
        }
      },

    },
    async created(){
      await this.deptFun();
      let filterArr= filter(this.backCauseArr.data,(o)=>{
        return o.value!=''
      });
      this.backCauseArrs=filterArr;
      if(this.$route.query.isDraft){
        this.disabledInfo=true
      }
       if(this.$route.query.isDraft==1){
         this.getEditDraft()
       }else if(this.$route.query.isDraft==2){
         this.getEdits()
       }
    },

  }
</script>

<style scoped>
  .search-top{align-items: center;color: #666;font-size: 16px;}
</style>

