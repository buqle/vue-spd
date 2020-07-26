<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>计划单号</label>
        <Input  placeholder="请输入单号"  class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>状态</label>
        <Select class="condition-group-ipt">
          <Option value="0">全部</Option>
          <Option value="1">草稿</Option>
          <Option value="2">待审核</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>发起时间</label>
        <DatePicker type="daterange" v-model="date" placement="bottom-end" class="condition-group-ipt" placeholder="请选择日期范围" @on-change="getDateStartEnd"></DatePicker>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="ios-add" class="l">新建目录外采购计划</Button>
      <Button size="large" type="default" icon="ios-remove" class="l">删除</Button>
      <Button size="large" type="default" icon="ios-search" class="r">查询</Button>
    </div>
    <h3 class="f16 green-h3 mb10"></h3>
    <div class="demo-spin-container">
      <Table :columns="columns" :data="supplierList"></Table>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <div class="r mt15">
      <Page :total="page.total" :page-size="page.size" :current.sync="page.current" @on-change="supplierListClick(false)" show-total show-elevator />
    </div>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        date:'2019-10-10 10:10:10',
        spinShow:true,
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center'
          },
          {
            title: '计划单号',
            key: 'loginName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'userName',
            align: 'center'

          },
          {
            title: '类型',
            key: 'deptType',
            align: 'center'

          },
          {
            title: '发起人',
            key: 'hisCtDeptNme',
            align: 'center'
          },
          {
            title: '发起时间',
            key: 'hisCtDeptNme',
            align: 'center'
          },
          {
            title: '收货地址',
            key: 'hisCtDeptNme',
            align: 'center'
          },
          {
            title: '驳回原因',
            key: 'hisCtDeptNme',
            align: 'center'
          }
        ],
        supplierList:[],
        page:{
          current:1,
          size:2,
          total:0
        },
        ctmaSupplierName:'',
        date:'',
      }
    },
    methods:{
      async supplierListClick(flag){
        if(flag){
          this.page.current = 1;
        }
        this.spinShow = true;

        let datalist = await this.$api.system.supplierList(this.page.current,this.page.size,this.ctmaSupplierName);
        if(datalist.data.list.length > 0){
          this.spinShow = false;
        }
        this.supplierList=datalist.data.list;
        this.page.total = datalist.data.count;
      },
    },
    created(){
      this.supplierListClick(false);
    }

  }
</script>

<style scoped>

</style>
