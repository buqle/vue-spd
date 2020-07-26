/**
 * @author QER
 * @date 2020/1/2
 * @Description: 药房-异常发药单处理
*/
<template>
  <div class="condition" v-if="!infoTel">
    <Row class="flex-button">
      <Col span="6">
        <Radius iconHref="icon-tianjiaanniu" iconText="选择异常发药出库单" iconSize="20"  @upButton="refashList"></Radius>
      </Col>
    </Row>
    <div class="demo-spin-container mt15">
      <Table :columns="columns" :data="searchTab"></Table>
      <Spin size="large" fix v-if="spinsShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="searchArr[0].totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="record_search(searchArr[0])" show-total show-elevator />
    </div>

    <Modal v-model="modal" width="880">
      <p  slot="header" style="color:#f60;text-align:center">
        异常发药出库单
      </p>
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
  <Info v-else :headData="info" :searchs="searchInfo" :infoColumns="infoColumns" :infoArr="infoArr">
  </Info>




</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions,mapMutations} from 'vuex'
    export default {
      data(){
        return{
          modal:false,
          loading:false,
          //弹窗
          columnsModal:[
            {
              type: 'selection',
              align: 'center'
            },
            {
              type: 'index',
              title: '序号',
              align: 'center',
            },
            {
              title: '发药单据编号',
              key: 'dispensingNo',
              align: 'center',
              width:220
            },
            {
              title: '发药时间',
              key: 'dispensingDate',
              align: 'center',
              width: 170
            },
            {
              title: '药品品类数',
              key: 'drugCategories',
              align: 'center',
            },
            {
              title: '发药总数量',
              key: 'drugCount',
              align: 'center',
            }
          ],
          modalData:[],
          selectModalInfo:[],
          searchArr:[{
            pageNo:1,
            pageSize:10,
            totalPage:0,
            url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_MAKE_LIST,
            makeupType:3,
            type: 2
          },
            {
              url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_MAKE_MODALIST,
              infoName:'modalData',
              pageNo: 1,
              pageSize: 10,
              totalPage:0
            },
          ],
          columns: [
            {
              type: 'index',
              title: '序号',
              align: 'center'
            },
            {
              title: '发药单编号',
              key: 'storeCode',
              align: 'center'
            },
            {
              title: '补登单号',
              key: 'makeupCode',
              align: 'center'
            },
            {
              title: '状态',
              key: 'makeupStatusName',
              align: 'center'
            },
            {
              title: '操作',
              key: 'address',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      //size: 'small'
                    },
                    style: {
                      marginRight: '2px',
                    },
                    on: {
                      click: () => {
                        this.aboutInfoTel(params.row.makeupCode)
                      }
                    }
                  }, '详情')
                ]);
              }
            }
          ],
          //详情页传参
          info:[],
          searchInfo:[
            {
              url:this.$api.pharmacyApi.DRUG_SUPPLEMENTDOC_MAKE_DETAILHEAD,
              makeupCode:'',
              infoName:'infoData',
              hisDrugCodeList:'',
              method:'get'
            }
          ],
          infoData:{},
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
              key: 'makeipQuantity',
              title: '数量',
              width:100,
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
              width:130,
              align: 'center',
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
              key: 'productDate',
              title: '生产日期',
              width:110,
              align: 'center',
              fixed:'right'
            },
            {
              key: 'validEndDate',
              title: '有效期至',
              width:110,
              align: 'center',
              fixed:'right'
            },
          ],
          infoArr:[]
        }
      },
      async created(){
        if(this.infoTel){
          // this.searchInfo[0].backNo=this.$route.query.backNo;
          this.aboutInfoTel(this.$route.query.makeupCode)
        }else {

          this.getList();
        }
      },
      computed:{
        ...mapState(['spinsShow','searchTab','infoTel','totalPage'])
      },
      methods:{
        ...mapActions(['record_search_head','record_search',]),
        ...mapMutations(['RECORD_INFOTEL']),
        //弹窗列表选中
        selectModalTab(selection){
          this.selectModalInfo=selection
        },
        async addIn(){
          if(this.selectModalInfo.length==0){
            this.$Message.error('请选择要提交的发药单');
            return false;
          }else  if(this.selectModalInfo.length>1){
            this.$Message.error('一次只能处理一张异常单据');
            return false;
          }
          let menuListSbumit= await this.$api.pharmacy.submitexceptionBill({
            dispensingNo:this.selectModalInfo[0].dispensingNo
          });
          if(menuListSbumit.code==200) {

            this.canCel();
            this.getList();
            this.loading = false;
          }
        },
        //取消
        canCel(){
          this.modal=false;
        },

        async getList(){
          await this.record_search(this.searchArr[0]);
          this.searchArr[0].totalPage=this.totalPage;
        },
        async aboutInfoTel(backNos){
          this.$router.push({ name: '异常发药单处理', query: { makeupCode: backNos } })
          this.RECORD_INFOTEL(1);
          this.searchInfo[0].makeupCode=backNos;
          await  this.record_search_head(this.searchInfo[0]);
          this.infoData=this.$store.state[this.searchInfo[0].infoName].data;
          const {makeupCode,storeCode,makeupTypeName,makeupStatusName,createUserName,createDate,list}=this.infoData
          this.info=[{
            title:'补登单',
            span:10,
            cont:makeupCode
          },
            {
              title:'异常发药单',
              span:10,
              cont:storeCode
            },
            {
              title:'类型',
              span:6,
              cont:makeupTypeName
            },
            {
              title:'状态',
              span:6,
              cont:makeupStatusName
            },
            {
              title:'补登人',
              span:6,
              cont:createUserName
            },
            {
              title:'补登时间',
              span:6,
              cont:createDate
            }
          ];
          this.infoArr=list;
        },
        async refashList(){
          this.modal=true;
          await  this.record_search(this.searchArr[1]);
          this.modalData=this.$store.state[this.searchArr[1].infoName].data.list;
          console.log(this.modalData)
          this.searchArr[1].totalPage=this.$store.state.modalData.data.count;
        },
      },
      watch:{
        infoTel(v){
          if(!v){
            this.getList()
          }
        }
      }
    }
</script>

<style scoped>

</style>
