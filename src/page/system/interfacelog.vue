/**
 * @author QER
 * @date 2019/9/30
 * @Description:接口监控
*/
<template>
    <div class="condition">
      <div class="condition-row">
        <div class="condition-group">
          <label>类　　型</label>
          <Select  placeholder="请选择分类" class="condition-group-ipt" v-model="searchArr[0].requestType" filterable @on-change="changeType">
            <Option value="" key="">全部</Option>
            <Option  v-for="(item,index) in typeArr" :value="item.logType" :key="index">{{item.logTypeExplain}}</Option>
          </Select>
        </div>
        <div class="condition-group">
          <label>接　口</label>
          <Select  placeholder="请选择接口类型" class="condition-group-ipt" v-model="searchArr[0].requestMethod" filterable>
            <Option value="" key="" v-if="!searchArr[2].logType&&methodArr.length>0">全部</Option>
            <Option  v-for="(item,index) in methodArr" :value="item.logMethod" :key="index">{{item.logMethodExplain}}</Option>
          </Select>
        </div>
        <div class="condition-group">
          <label>状态</label>
          <Select  placeholder="请选择状态" class="condition-group-ipt" v-model="searchArr[0].resultCode" filterable>
            <Option  v-for="(item,index) in stateArr" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </div>
        <div class="condition-group  mt15">
          <label>日期范围</label>
          <DatePicker type="daterange" v-model="searchArr[0].closeDate" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getTime"></DatePicker>
        </div>
        <div class="condition-group  mt15">
          <label>关键字</label>
          <Input  placeholder="请输入关键字" class="condition-group-ipt" v-model="searchArr[0].requestParam"></Input>
        </div>
      </div>
      <div class="condition-row">
        <Button size="large" type="default" icon="ios-search" class="r" @click="table" >查询</Button>
      </div>

      <Card  class="mt15">
        <p slot="title">今日调用汇总</p>
        <Spin size="large" fix v-if="spinsShow2"></Spin>
        <div flexcont class="date-box">
          <dl v-for="(item,index) in dateArr" :key="index">
            <dt>
              <span>{{item.logTypeExplain}}：</span>
              <Tag color="primary">{{item.totalCount}}次</Tag>
            </dt>
            <dd>
              <span>失败：</span>
              <Tag color="error">{{item.failCount}}次</Tag>
            </dd>
          </dl>
        </div>
      </Card>

      <div class="demo-spin-container mt15">
        <Table :data="list" :columns="columns1"></Table>
        <Spin size="large" fix v-if="spinsShow"></Spin>
      </div>
      <div class="r mt15">
        <Page :total="totalPage" :page-size="searchArr[0].pageSize" :current.sync="searchArr[0].pageNo" @on-change="table" show-total show-elevator />
      </div>
      <Modal v-model="modal" width="500" footer-hide v-if="list">
        <p slot="header" style="color:#f60;text-align:center">
          参数详情
        </p>
        <json-viewer
          :value="jsonCont"
          :expand-depth=5
          copyable
          boxed
          sort></json-viewer>
      </Modal>
      <Modal
        v-model="modalObj.modalShow"
        title='提示'
        @on-ok="send"
        @on-cancel="cancel">
        <p>{{modalObj.cont}}</p>
      </Modal>
    </div>
</template>

<script>
  import {filter} from 'lodash'
  import {mapState,mapActions} from 'vuex'
  import * as convert from 'xml-js'
  import JsonViewer from 'vue-json-viewer'
    export default {
      components: {JsonViewer},
      data(){
        return{
          columns1: [
            {
              type: 'index',
              title: '序号',
              align: 'center'
            },
            {
              title: '接口名称',
              key: 'requestMethod',
              align: 'center'
            },
            {
              title: '状态',
              key: 'resultCodeName',
              align: 'center'
            },
            {
              title: '是否处理',
              key: 'isHandle',
              align: 'center',
              render: (h, params) => {
                if (params.row.isHandle==0) {
                  return h('span', '已处理');
                }else {
                  return h('span', '未处理');
                }
              }
            },
            {
              title: '请求时间',
              key: 'requestTime',
              align: 'center'
            },
            {
              title: '参数',
              key: 'requestParam',
              align: 'center',
              width:120,
              render: (h, params) => {
                return h('div',{class:'btn__cell'}, [
                  h('p',{
                  },convert.xml2json(params.row.requestParam, {compact: true, spaces: 4})),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size:'small'
                    },
                    on: {
                      click: () => {
                        this.jsonShow(params.row.requestParam)
                      }
                    }
                  }, '查看详情')
                ]);
              }
            },
            {
              title: '返回结果',
              key: 'resultContent',
              align: 'center',
              width:'130',
              render: (h, params) => {
                return h('div',{class:'btn__cell'}, [
                  h('p',{
                  },params.row.resultContent)
                ]);
              }
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              width:190,
              render: (h, params) => {
                return h('div',{class:'action-btn'}, [
                  h('Button', {
                    props: {
                      type:params.row.isSupportSend==0 ?'primary':'dashed',
                      // size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.sendMenthod(params.row)
                      }
                    }
                  }, '重发'),
                  h('Button', {
                    props: {
                      type:params.row.isHandle==1 ?'primary':'dashed',
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.allDown(params.row)
                      }
                    }
                  }, '处理完毕'),

                ]);
              }
            }
          ],
          jsonCont:[],
          typeArr:[],
          methodArr:[],
          dateArr:[],
          modal:false,
          spinsShow2:false,
          searchType:[{
            url:this.$api.systemApi.INTERFACELOG_GETALLMETHODTYPE,
            method: 'get'
          }],
          //查询条件组
          searchArr:[{
            pageNo:1,
            pageSize:10,
            totalPage:0,
            url:this.$api.systemApi.INTERFACELOG_LIST,
            requestType:'',
            resultCode:"",
            startTime:'',
            endTime:'',
            closeDate:'',
            requestParam:''
          },{
            url:this.$api.systemApi.INTERFACELOG_GETALLMETHODTYPE,
            method: 'get',
            infoName:'typeArr'
          },
            {
              url:this.$api.systemApi.INTERFACELOG_GETREQUESTMETHODS,
              method: 'get',
              infoName:'methodArr'
            },
            {
              url:this.$api.systemApi.INTERFACELOG_GETRCOUNTBYDATE,
              infoName:'dateArr',
              infos:{}
            }
          ],
          list:[],
          modalObj:{
            modalShow:false,
            cont:'您确定要执行重发操作?',
            flag:''
          },
          //状态
          stateArr:[
            {value: "", label: "全部"},
            {value: "0", label: "成功"},
            {value: "-1", label: "失败"}
          ]
        }
      },
      async created(){
        this.spinsShow2=true;
        await  this.record_search_head(this.searchArr[3]);
        this.spinsShow2=false;
        this.dateArr=this.$store.state[this.searchArr[3].infoName].data;
        await  this.record_search(this.searchArr[0]);
        this.list= this.searchTab;
        await  this.record_search_head(this.searchArr[1]);
        this.typeArr=this.$store.state[this.searchArr[1].infoName].data;
        await  this.record_search_head(this.searchArr[2]);
        this.methodArr=this.$store.state[this.searchArr[2].infoName].data;
      },
      computed:{
        ...mapState(['searchInfo','spinsShow','searchTab','totalPage'])
      },
      methods:{
        ...mapActions(['record_search','record_search_head']),
        async table(){
          await  this.record_search(this.searchArr[0]);
          this.list= this.searchTab
        },
        add(){
          this.$skip.goAdd(this.$router, '/menu-managementAdd')
        },
        jsonShow(text){
          let jsonText=convert.xml2json(text, {compact: true, spaces: 4})
          let jsonTexts=JSON.parse(jsonText)
          this.jsonCont=jsonTexts;
          this.modal=true
        },
        async changeType(v){
          this.searchArr[2].logType=v;
          this.methodArr=this.$store.state[this.searchArr[2].infoName].data;
          if(v){
            this.searchArr[0].requestMethod=this.methodArr[0].logMethod
          }else {
            this.searchArr[0].requestMethod=''
          }
          await  this.record_search_head(this.searchArr[2]);
          this.methodArr=this.$store.state[this.searchArr[2].infoName].data;
        },
        //重发
        async sendMenthod(row){
          if(row.isSupportSend!=0){
            return false
          }else {
                this.modalObj.modalShow=true;
                this.modalObj.flag='method';
                this.modalObj.logId=row.id;
                this.modalObj.cont='您确定要执行重发操作?'
          }
        },
        async send(){
          if(this.modalObj.flag=='method'){
           let resend=await this.$api.system.interfacelogReSend({logId:this.modalObj.logId});
                if(resend.code==200){
                  this.$Message.success('重发接口成功');
                  this.table()
                }
          }else if(this.modalObj.flag=='isHandle'){
            let hanleLog=await  this.$api.system.interfacelogHandleLog({logId:this.modalObj.logId});
            if(hanleLog.code==200){
              this.$Message.success('接口处理完毕');
              this.table()
            }
          }

        },
        cancel(){
          this.modalObj.modalShow=false;
        },
        //处理完毕
        allDown(row){
          if(row.isHandle!=1){
            return false
          }else {
            this.modalObj.modalShow=true;
            this.modalObj.flag='isHandle';
            this.modalObj.logId=row.id;
            this.modalObj.cont='您确定要执行处理完毕操作?'
          }
        },
        getTime(date){
          this.searchArr[0].startTime=date[0];
          this.searchArr[0].endTime=date[1];
        }
      }
    }
</script>

<style scoped>
  .date-box{
    flex-wrap:wrap;justify-content: space-between;
  }

  .date-box dl span{width: 60px;display: inline-block;text-align: right;}
</style>
