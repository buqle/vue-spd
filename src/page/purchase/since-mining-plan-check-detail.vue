<template>
  <div class="condition">   
  <Card dis-hover :bordered="false">
              <p slot="title">
                  单据信息
              </p>
              <p slot="extra" class="btn-style">
                  <!-- <Button type="primary" v-if="comlist.auditStatus == 2 && show" @click="update()">修改需求数量</Button>
                  <Button type="primary" v-if="comlist.auditStatus == 2 && !show" @click="updateQtyClick()">保存</Button> -->
                  <Button type="primary" v-if="comlist.auditStatus == 2" @click="pass()">通过</Button>
                  <Button type="primary" v-if="comlist.auditStatus == 2" @click="updateQtyNoClick()">驳回</Button>
                  <!-- <Button type="primary" @click="print()" v-else>打印</Button> -->
              </p> 
              <div> 
                      <Row :gutter="30">
                          <Col span="6">
                          计划单号：{{comlist.planCode}}
                          </Col>
                          <Col span="6">
                             类型：{{comlist.planTypeName}}
                          </Col>
                          <Col span="6">
                             状态：{{comlist.statusName}}
                          </Col>
                      </Row>
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                             发起人：{{comlist.createUserName}}
                          </Col>
                          <Col span="6">
                             发起时间：{{comlist.createDate}}
                          </Col>
                          <Col span="6">
                             联系电话：{{comlist.mobile}}
                          </Col>
                      </Row> 
                      <Row :gutter="30" class="mt10">
                          <Col span="6">
                             收货地址：{{comlist.receiveAddress}}
                          </Col>
                          <Col span="6">
                             审核人：{{comlist.sheveUserName}}
                          </Col>
                          <Col span="6">
                             审核时间：{{comlist.sheveDate}}
                          </Col>
                      </Row> 
              </div>
          </Card>
           <div class="condition-row mb15">  
      <div class="condition-group">
        <Select
                      v-model="goodsName"
                      filterable
                      clearable
                      remote
                      placeholder="请选择药品"
                      :remote-method="queryDrugByListClick"
                      :loading="loading"  style="width: 300px" @on-change="goodsClick(goodsName)">
                      <Option v-for="(option, index) in goodsList" :value="option.ctmmParam" :key="index">{{option.ctmmParam}}</Option>
                  </Select>
      </div>
    </div>
    <h3 class="f16 green-h3 mb10">产品信息</h3>
    <Table :columns="columns" :data="druhList"></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
   <div class="r mt15">
    <Page :total="page.totalPage" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="planDrugDetailListClick(false)" show-total show-elevator />
   </div>
   <Modal
        v-model="model"
        title="驳回说明"
        :loading="loading"
        @on-ok="asyncOK">
     <div class="condition-row mb15">  
      <div class="condition-group">
         <label>说明</label>
         <Input v-model="note" type="textarea" placeholder="请输入驳回说明..." style="width: 400px" />
      </div>
    </div>
    </Modal>
        
  </div>  
</template>
<script>
import {route}  from '@/api/apiRoute';
export default {
  data () {
              return {
                url:`${route}/a/plandetail/print/printDetail`,
               comlist:'',
               loading:false,
               goodsName:'',
               goodsList:[],
               druhList:[],
               spinShow:false,
               show:true,
               model:false,
               note:'',
    columns:[
        {
          type: 'index',
          title: '序号',
          align: 'center'
        },
         { 
          title: '药品名称',
          key: 'ctmmTradeName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.ctmmTradeName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.ctmmTradeName)
          　　　　])
          　　])
          }
        },
        {  
          title: '剂型',
          key: 'ctmmDosageFormDesc',
          align: 'center'
        },
        {  
          title: '包装规格',
          key: 'packageSpecification',
          align: 'center'
        },
              {  
          title: '批准文号',
          key: 'approvalNo',
          align: 'center'
        },
        { 
          title: '生产厂家',
          key: 'ctmmManufacturerName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.ctmmManufacturerName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.ctmmManufacturerName)
          　　　　])
          　　])
          }
        },
        { 
          title: '供应商',
          key: 'supplierName',
          align: 'center',
          render: (h, params) => {
          　　return h('div', [
          　　　　h('Tooltip', {
          　　　　props: { placement: 'top' }
          　　　　}, [
          　　　　h('div', {
          　　　　　　style: {
          　　　　　　　　width: '80px',
          　　　　　　　　overflow: 'hidden',
          　　　　　　　　textOverflow: 'ellipsis',
          　　　　　　　　whiteSpace: 'nowrap',
          　　　　　　},
          　　　　　　}, params.row.supplierName),
          　　　　　　h('div', {
          　　　　　　　　slot: 'content',
          　　　　　　　　style: { whiteSpace: 'normal', wordBreak: 'break-all' }
          　　　　　　},params.row.supplierName)
          　　　　])
          　　])
          }
        },
        { 
          title: '需求数量',
          key: 'demandQuantity',
          align: 'center',
          render: (h, params) => {
                          if(!this.show){
                                return h('InputNumber', {
                                props: {
                                  min:1,
                                  // max:params.index.purchaseQuantity,
                                     type: 'text',
                                     value: this.druhList[params.index].demandQuantity,
                                },
                                on: { 
                                  'on-change':(event)=>{
                                                        this.druhList[params.index].demandQuantity = event;
                                                    }
                                },
                            });
                          }else{
                              return h('div',params.row.demandQuantity)
                          }
                      
                  }, 
        },
        { 
          title: '当前库存',
          key: 'usableQuantity',
          align: 'center'
        },   
        { 
          title: '单价',
          key: 'drugPrice',
          align: 'center'
        },
        {  
          title: '金额',
          key: 'totalPrice',
          align: 'center'
        },
        { 
          title: '库存上限',
          key: 'upperQuantity',
          align: 'center'
        },
        {  
          title: '库存下限',
          key: 'downQuantity',
          align: 'center'
        },
        {
          title: '药品编码',
          key: 'hisDrugCode',
          align: 'center'
        }
      ],
      page:{
      hisDrugCode:'',
      planCode:''
    },   
    }
  },
  methods: {
    update (){
      this.show = false;
    },
    updateQtyNoClick(){
      this.model = true;
    },
    pass(){
    this.$Modal.confirm({
      title: '提示',
      content:'是否通过审核？',
      onOk: () => {
        this.updateStatusClick(); 
      },
    });
    },
    // 通过
    async updateStatusClick(){ 
      let code = [];
      code.push(this.$router.history.current.query.id);
       let item = {
        list:code,
        opType:'4',
        purchaseType:2
       } 
      let datalist = await this.$api.druhStorage.updateStatusList(item); 
      this.model = false;
      this.planDrugDetailListClick();
    },
    // 驳回
    async asyncOK(){ 
      if(!this.note){
        this.$Message.error('请填写驳回原因!');
        return;
      }
      let code = [];
      code.push(this.$router.history.current.query.id);
       let item = {
        list:code,
        note:this.note,
        opType:'3',
        purchaseType:2
       } 
      let datalist = await this.$api.druhStorage.updateStatusList(item); 
      this.model = false;
      this.$Message.success('驳回成功!');
      this.planDrugDetailListClick();
    },
    // 保存
    async updateQtyClick(){
      let goods = [];
      for (let i = 0; i < this.druhList.length; i++) {
         let item = {
          id:this.druhList[i].id,
          demandQuantity:this.druhList[i].demandQuantity
         }
         goods.push(item);
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.updateQtyList({'updateQtyVo':goods});
      this.spinShow = false;
      this.show = true;
      this.$Message.success('保存成功!');
      this.planDrugDetailListClick();
    },
    // 保存
    async updateQtyClick(){
      let goods = [];
      for (let i = 0; i < this.druhList.length; i++) {
         let item = {
          id:this.druhList[i].id,
          demandQuantity:this.druhList[i].demandQuantity
         }
         goods.push(item);
      }
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.updateQtyList({'updateQtyVo':goods});
      this.spinShow = false;
      this.show = true;
      this.$Message.success('保存成功!');
      this.planDrugDetailListClick();
    },
    // 列表
    async planDrugDetailListClick(){
      this.druhList = [];
      this.page.planCode = this.$router.history.current.query.id;
      // this.page.hisDrugCode = this.$router.history.current.query.id;
      this.spinShow = true;
      let datalist = await this.$api.druhStorage.planDrugDetailList(this.page);
      this.spinShow = false;
      this.comlist=datalist.data;
      this.druhList=datalist.data.list;
      this.page.hisDrugCode = '';
    },
    // 药品
    async queryDrugByListClick(query){
      let item = {
        paramName:query,
        queryType:3,
      }
      this.loading = true;
      let datalist = await this.$api.publics.queryDrugByList(item);
      this.loading = false;
      this.goodsList=datalist.data;
    },
    // 药品检索
    goodsClick(name){
      for (let i = 0; i < this.goodsList.length; i++) {
         if(name == this.goodsList[i].ctmmParam){
          this.page.hisDrugCode = this.goodsList[i].bigDrugCode;
        }
      }
      this.planDrugDetailListClick();
    }, 
    // 打印
    async print(){
      window.open(`${this.url}?planCode=${this.$router.history.current.query.id}`, '_blank');
    },
    // 导出
    async exportAsPrint(){
      let item = [];
      item.push(this.$router.history.current.query.id);
      let datalist = await this.$api.druhStorage.exportList({'list':item}); 
      let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
      let fileName = `${this.getCurrentDate()}自采补货计划.xls`;
      let objectUrl = URL.createObjectURL(blob); 
      const link = document.createElement('a')
      link.download = fileName;
      link.href = objectUrl;
      link.click();

      // let objectUrl = URL.createObjectURL(blob); 
      // // window.location.href = objectUrl;
      // window.open(objectUrl);
    }, 
  }, 
  created(){
    // console.log(this.$router.history.current.query.id);
    // 列表
    this.planDrugDetailListClick();
  },
  watch: { 
   
  },


}
</script> 
<style scoped>
  .c_green_tit {
        color: #2d8cf0;
    }
</style>
