/**
* @author QER
* @date 2019/12/29
* @Description: 药房-新建补登入库
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <p slot="title"  v-if="$route.query.isDraft==1">新建补登出库单</p>
      <p slot="title"  v-else>新建补登入库单</p>
      <Row class="flex-button">
        <Col span="8" style="display: flex;align-items: center;">
          <span>类型：</span>
          <Select  placeholder="请选择类型" class="condition-group-ipt" v-model="submitObjs.makeupType" style="flex: 2" @on-change="getValue" :disabled="disabledInfo">
            <Option  v-for="(item,index) in typeValueArrs" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="8" style="display: flex;align-items: center;margin-left:10px;" v-if="submitObjs.makeupType==5&&$route.query.isDraft==1">
          <span>科室：</span>
          <Select  placeholder="请选择科室" class="condition-group-ipt" v-model="submitObjs.ctdCode" style="flex: 2" @on-change="getctdName" :label-in-value="true">
            <Option  v-for="(item,index) in deptArr" :value="item.ctdCode" :key="index">{{item.ctdName}}</Option>
          </Select>
        </Col>
        <Col span="8" style="display: flex;align-items: center;margin-left: 10px;">
          <span>补登原因：</span>
          <Input v-model="submitObjs.makeupCause" placeholder="请输入补登原因" style="flex: 2"></Input>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item" v-if="typeValueArrs.length>0">
      <Row style="display: flex;">
        <Col span="2-5" style="margin-right: 16px;" v-if="submitObjs.makeupType==1||$route.query.isDraft==1">
          <Radius iconHref="icon-tianjiaanniu" iconText="添加产品" iconSize="20"  @upButton="add(1)" ></Radius>
        </Col>
        <Col span="6" style="margin-right: 16px;"  v-if="submitObjs.makeupType==4">
          <Radius iconHref="icon-tianjiaanniu" iconText="选择异常退药入库单" iconSize="20"  @upButton="add(2)" ></Radius>
        </Col>
        <Col span="2-5" v-if="productsInfo.length>0">
          <Radius  iconText="删除"  @upButton="deletePros" buttonSize="0"></Radius>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">产品信息</p>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Table :columns="columnsProducts" :data="productsInfo" @on-selection-change="selectproducts" ref="selection"></Table>
      <div v-if="productsInfo.length" class="mt20" style="display: flex;justify-content: flex-end;">
        <Col span="2-5">
          <!--出库单-->
          <Radius  iconText="提交"  @upButton="submitObj" iconHref="icon-tianjiaanniu"  iconSize="20"  v-if="$route.query.isDraft==1"></Radius>
          <!--入库单-->
          <Radius  iconText="提交"  @upButton="submitBillIn" iconHref="icon-tianjiaanniu"  iconSize="20"  v-if="$route.query.isDraft==2"></Radius>

        </Col>
      </div>
    </Card>
    <Modal v-model="modal" width="880">
      <div slot="header">
        <p  v-if="$route.query.isDraft==1||submitObjs.makeupType==1" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>请选择要添加的产品</span>
        </p>
        <p   v-if="$route.query.isDraft==2&&submitObjs.makeupType==4" style="color:#f60;text-align:center">
          异常退药入库单展示
        </p>
      </div>
      <div flexcont class="search-top"  v-if="$route.query.isDraft==1||submitObjs.makeupType==1">
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
        typeValueArrs:[],//类型
        deptArr:[],//科室
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
          },
          {
            key: 'totalQuantity',
            title: '数量',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  min:1,
                  value:params.row.totalQuantity?params.row.totalQuantity:1,
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
            title: '可用库存',
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
            key: 'goodsName',
            title: '货位',
            align: 'center',
            width: 100
          },
          {
            key: 'positionTypeName',
            title: '货位类型',
            align: 'center',
            width: 140
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
            width: 60,
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
            align: 'center',
            width:90,
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
          {
            key: 'goodsName',
            title: '货位',
            align: 'center',
            width: 100
          },
          {
            key: 'storeTypeName',
            title: '货位类型',
            align: 'center',
            width: 140
          }
        ],

        searchArr:[
          {
            url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_OUTBII_DEPT,
            infoName:'deptArr',
          },
          {
            url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_OUTBII_DRUG_LIST,
            infoName:'modalData',
            method:'postJson',
            existDrugList:[],
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          },
          {
            url:this.$api.systemApi.GETDEPT_TYPELIST,
            infoName:'typeValueArrs',
            type:'makeup_type_out'
          }
        ],
        modal:false,
        selectModalInfo:[],
        selectproductsObj:[],
        delObj:[],
        editdetailsData:{},
        submitObjs:{
          makeupType:'',
          ctdCode:'',
          ctdName:'',
          makeupCause:''
        }
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
        if(!this.submitObjs.makeupType){
          this.$Message.error('请选择补登单据类型');
          return false;
        }else if(!this.submitObjs.makeupCause){
          this.$Message.error('请输入补登原因');
          return false;
        }else if(this.submitObjs.makeupType==5&&!this.submitObjs.ctdCode){
          this.$Message.error('请选择补登科室');
          return false;
        }
        this.modal=true;
        this.addInfo(type)

      },
      //添加产品Modal查询
      async addInfo(type){
        if(this.$route.query.isDraft==2){
          if(type==1){
            this.searchArr[1]={
              url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_INBII_DRUG_LIST,
              infoName:'modalData',
              method:'postJson',
              pageNo: 1,
              pageSize: 10,
              totalPage:0
            }
          }else if(type==2){
            this.searchArr[1]={
              url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_INBII_DRUG_LIST2,
              infoName:'modalData',
              method:'postJson',
              pageNo: 1,
              pageSize: 10,
              totalPage:0
            }
          }

        }
        if(this.productsInfo.length>0&&this.$route.query.isDraft==1){
          this.searchArr[1].existDrugList = this.productsInfo.map(
            item => ({
              locCode: item.goodsCode,
              drugCode: item.drugCode,
              lot: item.lot
            })
          );
        }
        //drugCode?this.searchArr[1].detail.paramName=drugCode:this.searchArr[1].detail.paramName=''

        await this.refashList()

      },
      async refashList(){
        await  this.record_search(this.searchArr[1]);
        this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
        this.searchArr[1].totalPage=this.$store.state.modalData.data.count;
      },

      //获取部门
      async deptFun(){
        await  this.record_search_head(this.searchArr[0]);
        this.deptArr=this.$store.state[this.searchArr[0].infoName].data;
      },

      getValue(v){
        if(v==5){
          this.deptFun();
        }
        //补登类型为报溢单并且为入库单
        if(this.$route.query.isDraft==2){
          if(v==1){
            this.columnsProducts=[
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
                key: 'totalQuantity',
                title: '数量',
                align: 'center',
                width:100,
                render: (h, params) => {
                  return h('InputNumber', {
                    props:{
                      min:1,
                      value:params.row.totalQuantity?params.row.totalQuantity:1,
                    },
                    on: {
                      'on-change': (value) => {
                        this.productsInfo[params.index].backNum = value
                      }
                    }
                  });
                }
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
                key: 'goodsName',
                title: '货位',
                align: 'center',
                width: 100
              },
              {
                key: 'storeTypeName',
                title: '货位类型',
                align: 'center',
                width: 140
              },
              {
                key: 'lot',
                title: '生产批号',
                align: 'center',
                width:130,
                render: (h, params) => {
                  return h('Input', {
                    props:{
                      type:'number',
                      value:params.row.lot,
                    },
                    on: {
                      'on-change': (event) => {
                        this.productsInfo[params.index].lot = event.target.value
                      }
                    }
                  });
                },
                fixed:'right'
              },
              {
                key: 'purchaseType',
                title: '采购方式',
                align: 'center',
                width:140,
                render: (h, params) => {
                  return h('Select', {
                      props:{
                        filterable:true,
                        value:params.row.purchaseType,
                        transfer:true
                      },
                      on: {
                        'on-change': (value) => {
                          this.productsInfo[params.index].purchaseType = value;
                        }
                      },
                    },
                    params.row.dictVos.map((item)=>{
                      return h('Option',{
                        props:{
                          value:item.value,
                          label:item.label
                        }
                      })
                    })

                  );
                },
                fixed:'right'
              },
              {
                key: 'productDate',
                title: '生产日期',
                align: 'center',
                width:140,
                render: (h, params) => {
                  return h('DatePicker', {
                    props: {
                      clearable: false,
                      placeholder: '请选择日期',
                      value: params.row.productDate,
                      type: 'date',
                      format: 'yyyy-MM-dd',
                      transfer:true//下拉遮盖
                    },
                    on: {
                      'on-change': (val) => {
                        this.productsInfo[params.index].productDate = val
                      }
                    }
                  });
                },
                fixed:'right'
              },
              {
                key: 'validEndDate',
                title: '有效期至',
                align: 'center',
                width:140,
                render: (h, params) => {
                  return h('DatePicker', {
                    props: {
                      clearable: false,
                      placeholder: '请选择日期',
                      value: params.row.validEndDate,
                      type: 'date',
                      format: 'yyyy-MM-dd',
                      transfer:true//下拉遮盖
                    },
                    on: {
                      'on-change': (val) => {
                        this.productsInfo[params.index].validEndDate = val
                      }
                    }
                  });
                },
                fixed:'right'
              },
              {
                key: 'supplierCode',
                title: '供应商',
                align: 'center',
                fixed:'right',
                width:150,
                render: (h, params) => {
                  return h('Select', {
                      props:{
                        filterable:true,
                        value:params.row.supplierCode,
                        transfer:true
                      },
                      on: {
                        'on-change': (value) => {
                          this.productsInfo[params.index].supplierCode = value;
                        }
                      },
                    },
                    params.row.supplierDataVos.map((item)=>{
                      return h('Option',{
                        props:{
                          value:item.ctmaSupplierCode,
                          label:item.ctmaSupplierName
                        }
                      })
                    })

                  );
                }
              }
            ];
          }else if(v==4) {
            this.columnsProducts=[
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
                width: 60
              },
              {
                key: 'hisDrugName',
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
                key: 'backDrugQty',
                title: '数量',
                align: 'center',
                width:100,
                render: (h, params) => {
                  return h('InputNumber', {
                    props:{
                      min:1,
                      value:params.row.backDrugQty?params.row.backDrugQty:1,
                    },
                    on: {
                      'on-change': (value) => {
                        this.productsInfo[params.index].backDrugQty = value
                      }
                    }
                  });
                }
              },
              {
                key: 'unit',
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
                key: 'targLocList',
                title: '货位',
                align: 'center',
                width: 140,
                render: (h, params) => {
                  return h('Select', {
                      props:{
                        filterable:true,
                        value:params.row.locCode,
                        transfer:true,
                        ['label-in-value']:true
                      },
                      on: {
                        'on-change': (e) => {
                          console.log(e)
                          this.productsInfo[params.index].locCode = e.value;
                          this.productsInfo[params.index].locType=e.label;
                          //this.productsInfo[params.index].locType=e.label
                        }
                      },
                    },
                    params.row.targLocList.map((item)=>{
                      return h('Option',{
                        props:{
                          value:item.locCode,
                          label:item.positionTypeName,
                        }
                      },item.locName)
                    })

                  );
                },
                fixed:'right'
              },
              {
                key: 'locType',
                title: '货位类型',
                align: 'center',
                width: 140,
                fixed:'right'
              },
              {
                key: 'lot',
                title: '生产批号',
                align: 'center',
                width:130,
                render: (h, params) => {
                  return h('Input', {
                    props:{
                      value:params.row.lot,
                    },
                    on: {
                      'on-change': (event) => {
                        this.productsInfo[params.index].lot = event.target.value
                      }
                    }
                  });
                },
                fixed:'right'
              },
              {
                key: 'productDate',
                title: '生产日期',
                align: 'center',
                width:140,
                render: (h, params) => {
                  return h('DatePicker', {
                    props: {
                      clearable: false,
                      placeholder: '请选择日期',
                      value: params.row.productDate,
                      type: 'date',
                      format: 'yyyy-MM-dd',
                      transfer:true//下拉遮盖
                    },
                    on: {
                      'on-change': (val) => {
                        this.productsInfo[params.index].productDate = val
                      }
                    }
                  });
                },
                fixed:'right'
              },
              {
                key: 'expireDate',
                title: '有效期至',
                align: 'center',
                width:140,
                render: (h, params) => {
                  return h('DatePicker', {
                    props: {
                      clearable: false,
                      placeholder: '请选择日期',
                      value: params.row.expireDate,
                      type: 'date',
                      format: 'yyyy-MM-dd',
                      transfer:true//下拉遮盖
                    },
                    on: {
                      'on-change': (val) => {
                        this.productsInfo[params.index].expireDate = val
                      }
                    }
                  });
                },
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
              }
            ];
            this.columnsModal=[
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
                width: 60
              },
              {
                key: 'hisBackNo',
                title: '退药入库单编号',
                width:180,
                render: (h, params) => {
                  return h('PopTips', {
                    props: {
                      content: params.row.hisBackNo,
                      trigger: 'hover',
                      title:params.row.hisBackNo,
                      placement:'right'
                    }
                  })
                },
                align: 'center'
              },
              {
                key: 'backDate',
                title: '退药时间',
                width:180,
                align: 'center'
              },
              {
                key: 'drugTotal',
                title: '药品品类数',
                align: 'center'
              },
              {
                key: 'backTotal',
                title: '退药总数量',
                align: 'center'
              },
            ]
          }
        }

      },

      //切换科室
      getctdName(val){
        this.submitObjs.ctdName=val.label;
      },

      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;

        if(this.$route.query.isDraft==1){
          let filterArr= this.selectModalInfo.map(item=>{
            return {
              ...item,
              totalQuantity: 1,
            }
          });
          this.canCel();
          this.productsInfo = [...this.productsInfo, ...filterArr];
          this.loading = false;
          this.disabledInfo = true
        }

       if(this.$route.query.isDraft==2){
         if(this.submitObjs.makeupType==1){
           let drugCodeList=[];
                drugCodeList=this.selectModalInfo.map(item=>item.drugCode);
           let menuListSbumit= await this.$api.pharmacy.addDrugBillIn({
             drugCodeList
           });
           if(menuListSbumit.code==200) {
             let filterArr= menuListSbumit.data.map(item=>{
               return {
                 ...item,
                 purchaseType: item.dictVos[0].value,
                 supplierCode:  item.supplierDataVos[0].ctmaSupplierCode,
                 totalQuantity: 1,
               }
             });
             this.canCel();
             this.productsInfo = [...this.productsInfo, ...filterArr];
             this.loading = false;
             this.disabledInfo = true
           }
         }else if(this.submitObjs.makeupType==4){
           let backNoList=[];
               backNoList=this.selectModalInfo.map(item=>item.backNo);
           let menuListSbumit= await this.$api.pharmacy.addDrugBillInType4({
             backNoList
           });
           if(menuListSbumit.code==200) {
             this.canCel();
             this.productsInfo = [...this.productsInfo, ...menuListSbumit.data];
             this.loading = false;
             this.disabledInfo = true
           }
         }
       }

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
      //提交补登出库
      async submitObj(type){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        let isNull = this.selectproductsObj.every(item => {
          if(!item.totalQuantity) {
            this.$Message.error('数量不能为空');
            return false;
          };
          return true;
        });
        if(!isNull) return;
        this.spinShow2=true;
        let makeupinsertlist=[];
            makeupinsertlist=this.selectproductsObj.map(item=>{
              return {
                lot: item.lot,
                totalQuantity: item.totalQuantity,
                drugCode: item.drugCode,
                supplierCode:  item.supplierCode,
              }
            });
        let sbumitInfo=await this.$api.pharmacy.submitSupOutBill({
          makeupinsertlist,
          ...this.submitObjs
        });
        if(sbumitInfo.code==200){
          this.$Message.success('提交补登出库单成功');
          this.spinShow2=false;
          this.$router.go(-1);
        }else {
          this.spinShow2=false;
        }
      },
      //提交补登入库单
     async submitBillIn(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要提交的数据');
          return false;
        };
        if(this.submitObjs.makeupType==1){
          let isNull = this.selectproductsObj.every(item => {
            if(!item.totalQuantity) {
              this.$Message.error('数量不能为空');
              return false;
            };
            if(!item.lot) {
              this.$Message.error('生产批号不能为空');
              return false;
            };
            if(!item.productDate) {
              this.$Message.error('生产日期不能为空');
              return false;
            };
            if(!item.validEndDate) {
              this.$Message.error('有效期至不能为空');
              return false;
            };
            if(!item.supplierCode) {
              this.$Message.error('供应商不能为空');
              return false;
            };
            if(!item.purchaseType) {
              this.$Message.error('采购类型不能为空');
              return false;
            };
            return true;
          });
          if(!isNull) return;
          this.spinShow2=true;
          let makeupinsertlist=[];
          makeupinsertlist=this.selectproductsObj.map(item=>{
            return {
              lot: item.lot,
              productDate: item.productDate,
              totalQuantity: item.totalQuantity,
              validEndDate: item.validEndDate,
              drugCode: item.drugCode,
              purchaseType: item.purchaseType,
              supplierCode: item.supplierCode
            }
          });
          let sbumitInfo=await this.$api.pharmacy.submitSupOutBill({
            makeupinsertlist,
            ...this.submitObjs
          });
          if(sbumitInfo.code==200){
            this.$Message.success('提交补登入库单成功');
            this.spinShow2=false;
            this.$router.go(-1);
          }else {
            this.spinShow2=false;
          }
        }else if(this.submitObjs.makeupType==4){
          let isNull = this.selectproductsObj.every(item => {
            if(!item.backDrugQty) {
              this.$Message.error('数量不能为空');
              return false;
            };
            if(!item.lot) {
              this.$Message.error('生产批号不能为空');
              return false;
            };
            if(!item.productDate) {
              this.$Message.error('生产日期不能为空');
              return false;
            };
            if(!item.expireDate) {
              this.$Message.error('有效期至不能为空');
              return false;
            };
            if(!item.locCode) {
              this.$Message.error('货位不能为空');
              return false;
            };
            return true;
          });
          if(!isNull) return;
          this.spinShow2=true;
          let detailList=[];
          detailList=this.selectproductsObj.map(item=>{
            return {
              backDrugQty: item.backDrugQty,
              backNo: item.backNo,
              dispensingNo: item.dispensingNo,
              drugCode: item.drugCode,
              expireDate: `${item.expireDate}`,
              hisDrugCode: item.hisDrugCode,
              id: item.id,
              locCode: item.locCode,
              lot: item.lot,
              productDate:`${item.productDate}`,
              supplierCode: item.supplierCode,
              unit: item.unit,
              unitCode: item.unitCode
            }
          });

          let sbumitInfo=await this.$api.pharmacy.submitSupInBill({
            detailList,
            ...this.submitObjs
          });
          if(sbumitInfo.code==200){
            this.$Message.success('提交补登入库单成功');
            this.spinShow2=false;
            this.$router.go(-1);
          }else {
            this.spinShow2=false;
          }
        }
      },



      deletePros(){
        if(this.selectproductsObj.length==0){
          this.$Message.error('请选择要删除的数据');
          return false;
        }
        this.productsInfo=differenceBy(this.productsInfo, this.selectproductsObj,'drugCode');
        this.disabledInfo=false;
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

      //获取补登类型
      async getTypes(){
        await  this.record_search_head(this.searchArr[2]);
        let filterArr=this.$store.state[this.searchArr[2].infoName].data;
        filterArr= filter(filterArr,(o)=>{
          return o.value!=""
        });
        this.typeValueArrs=filterArr;

      }

    },
    async created(){

      if(this.$route.query.isDraft==2){
        this.searchArr[1]={
          url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_INBII_DRUG_LIST,
          infoName:'modalData',
          method:'postJson',
          pageNo: 1,
          pageSize: 10,
          totalPage:0
        }
        this.searchArr[2]= {
          url:this.$api.systemApi.GETDEPT_TYPELIST,
          infoName:'typeValueArrs',
          type:'makeup_type_in'
        };
        this.getTypes();


      }else if(this.$route.query.isDraft==1){
        this.getTypes();
      }
    },

  }
</script>

<style scoped>
  .search-top{align-items: center;color: #666;font-size: 16px;}
</style>

