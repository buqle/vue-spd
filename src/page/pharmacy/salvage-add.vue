/**
 * @author BQL
 * @date 2020/3/13
 * @Description: 药房-抢救车目录管理-详情
*/
<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow2"></Spin>
    <Card :bordered="false" class="card-item">
      <p slot="title" v-if="!$route.query.baseMgt">抢救车：{{$route.query.tit}}</p>
      <p slot="title" v-else>基数药部门：{{$route.query.tit}}</p>
    </Card>
    <Card :bordered="false" class="card-item" v-if="productsInfo.length>0">
      <Row style="display: flex;">
        <Col span="2-5" style="margin-right: 16px;">
          <Radius iconHref="icon-tianjiaanniu" iconText="添加产品" iconSize="20"  @upButton="add(1)"></Radius>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card-item">
      <p slot="title">产品信息</p>
      <Search  @upAdd="choseCode2"></Search>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <Table :columns="columnsProducts" :data="productsInfo" ref="selection" class="mt15"></Table>
      <div class="r mt15" v-if="productsInfo.length>0">
        <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize"  @on-change="changepage" show-total show-elevator />
      </div>
    </Card>
    <Modal v-model="modal" width="900">
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
        spinShow:true,
        spinShow2:false,
        loading:false,
        backCauseArrs:[],//退货原因
        deptArr:[],//申领部门
        productsInfo:[],//产品信息
        disabledInfo:false,
        columnsProducts:[
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
            key: 'stockBase',
            title: '库存基数',
            align: 'center',
            width:100,
            render: (h, params) => {
              if(this.editQuery.editingKey==params.row.id){
                return h('InputNumber', {
                  props:{
                    min:1,
                    value:params.row.stockBase,
                    max:999999
                  },
                  on: {
                    'on-change': (value) => {
                      if(value<1){
                        this.productsInfo[params.index].stockBase =1
                        this.$Message.error(`请输入正整数`);
                        return false;
                      }
                      this.editQuery.stockBase = value
                    }
                  }
                });
              }else {
                return h('span', params.row.stockBase);
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
          {
            title: '操作',
            key: 'address',
            align: 'center',
            width:170,
            fixed:'right',
            render: (h, params) => {
              if(this.editQuery.editingKey!=params.row.id){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit({
                          editingKey:params.row.id,
                          stockBase: this.editQuery.stockBase,
                        })
                      }
                    }
                  }, '编辑库存基数'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deleteRoom({
                          id:params.row.id,
                          totalQuantity:params.row.totalQuantity
                        })
                      }
                    }
                  }, '删除')
                ]);
              }else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      //size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.StockBase({
                          id:params.row.id,
                          stockBase: this.editQuery.stockBase,
                        })
                      }
                    }
                  }, '保存'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      //size: 'small'
                    },
                    on: {
                      click: () => {
                        this.edit({
                        })
                      }
                    }
                  }, '取消')
                ]);
              }
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
            url:!this.$route.query.baseMgt?this.$api.pharmacyApi.SALVAFE_DETAILHEAD:this.$api.pharmacyApi.CARDINAL_DRUGS_DETAILHEAD,
            infoName:'productsInfo',
            deptCode:this.$route.query.backNo,
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          },
          {
            url:!this.$route.query.baseMgt?this.$api.pharmacyApi.SALVAFE_ADD_DRUG_LIST:this.$api.pharmacyApi.CARDINAL_DRUGS_ADD_DRUG_LIST,
            infoName:'modalData',
            method:'postJson',
            deptCode:this.$route.query.backNo,
            pageNo: 1,
            pageSize: 10,
            totalPage:0
          },
          {
            pageNo:[1].pageNo,
            deptCode:this.$route.query.backNo,
            rescuecarMedicineDetails: [],
          },
        ],

        modal:false,
        selectModalInfo:[],
        selectproductsObj:[],
        delObj:[],
        editdetailsData:{},
        editQuery:false
      }
    },
    computed:{
      ...mapState(['spinsShow','backCauseArr'])
    },
    methods:{
      ...mapActions(['record_search_head','record_search']),
      add(type){
        this.modal=true;
        this.addInfo()

      },
      //编辑数量
      edit(query){
        this.editQuery=query
      },
      //删除
      async deleteRoom(query){
        let sbumitInfo=!this.$route.query.baseMgt?await this.$api.pharmacy.salvageDelete({...query}):await this.$api.pharmacy.drugsDelete({...query});
        this.editQuery={}
        if(sbumitInfo.data!=-1){
          this.$Message.success('删除成功');
          this.deptFun();
        }else {
          this.$Message.error('删除失败');
        }
      },
      //保存
      async StockBase(query){
        let sbumitInfo=!this.$route.query.baseMgt?await this.$api.pharmacy.salvageSave(query):await this.$api.pharmacy.drugsSave(query);
        this.editQuery={}
        if(sbumitInfo.code==200){
          this.$Message.success('保存成功');
          this.deptFun();
        }else {
          this.$Message.error('删除失败');
        }
      },


      //添加产品Modal查询
      async addInfo(drugCode){
        await this.refashList()
        this.searchArr[1].totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
      },
      async refashList(){

        if(!this.$route.query.baseMgt){
          await  this.record_search(this.searchArr[1]);
        }else {
          this.searchArr[1].mate=''
          await  this.record_search(this.searchArr[1]);
        }
        this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;

      },
      //分页
      changepage(index){
        let _start = ( index - 1 ) * this.searchArr[0].pageSize;
        let _end = index * this.searchArr[0].pageSize;
        this.productsInfo = this.$store.state.productsInfo.data.list.slice(_start,_end);
      },
      createPage(list,historyData,data){
        if(list.length < this.searchArr[0].pageSize){
          historyData=list;
        }else{
          historyData =list.slice(0,this.searchArr[0].pageSize);
        }
        this[data] = historyData;
      },
      //获取列表
      async deptFun(){
        this.spinShow=true
        await  this.record_search_head(this.searchArr[0]);
        this.createPage(this.$store.state[this.searchArr[0].infoName].data.list,this.productsInfo,'productsInfo')
        this.searchArr[0].totalPage=this.$store.state[this.searchArr[0].infoName].data.count;
        this.spinShow=false
      },

      //弹窗添加产品
      async addIn(){
        if(this.selectModalInfo.length==0){
          this.$Message.error('请选择要添加的产品');
          return false;
        }
        this.loading=true;
        this.searchArr[2].rescuecarMedicineDetails = this.selectModalInfo.map(item=>{
          return {
            bigDrugCode: item.bigDrugCode,
            drugCode: item.drugCode
          }
        });

        let checkInfo=!this.$route.query.baseMgt?await this.$api.pharmacy.salvageChceck(this.searchArr[2]):await this.$api.pharmacy.drugsChceck({
          ...this.searchArr[2],
          baseMedicineDetails:this.searchArr[2].rescuecarMedicineDetails
        });
        this.canCel();
        this.productsInfo=[...this.productsInfo,...this.selectModalInfo];
        this.deptFun();
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

      choseCode(drugCode){
        //drugCode?this.searchArr[1].detail.paramName=drugCode:this.searchArr[1].detail.paramName=''
        if(!drugCode){
          this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
          this.searchArr[1].totalPage=this.$store.state[this.searchArr[1].infoName].data.count;
          return
        }
        let filterArr= filter(this.modalData,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.modalData=filterArr;
          this.searchArr[1].totalPage=filterArr.length;
        }else {
          this.$Message.error('请选择此单据中药品进行检索');
          return false;
        }
      },

      choseCode2(drugCode){
        if(!drugCode){
          this.productsInfo=this.$store.state.productsInfo.data.list;
          this.searchArr[0].totalPage=this.$store.state.productsInfo.data.list.length;
          return
        }
        let filterArr= filter(this.productsInfo,(o)=>{
          return o.hisDrugCode==drugCode
        });
        if(filterArr.length>0){
          this.productsInfo=filterArr;
          this.searchArr[0].totalPage=filterArr.length;
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

