<template>
  <div class="condition">
    <div class="condition-row">
      <div class="condition-group">
        <label>部门</label>
        <Select v-model="form.deptCode" class="condition-group-ipt">
          <Option key='' value=''>全部</Option>
          <Option v-for="(item,index) in deptList" :value='item.id' :key="index">{{item.deptName}}</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>名称</label>
        <Input v-model="form.ctmmTradeName" placeholder="请输入名称" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>货位名称</label>
        <Input v-model="form.replanStore" placeholder="请输入货位名称" class="condition-group-ipt"></Input>
      </div>
    </div>
    <div class="condition-row">
      <div class="condition-group">
        <label>状态</label>
        <Select v-model="form.ctmmStatusCode" class="condition-group-ipt">
          <Option value=''>全部</Option>
          <Option value='0'>启用</Option>
          <Option value='1'>停用</Option>
        </Select>
      </div>
      <div class="condition-group">
        <label>剂型</label>
        <Input v-model="form.ctmmDosageFormDesc" placeholder="请输入剂型" class="condition-group-ipt"></Input>
      </div>
      <div class="condition-group">
        <label>是否报告药</label>
        <Select v-model="form.medDrugType" class="condition-group-ipt" style="margin-left: 0;">
          <Option value=''>全部</Option>
          <Option value='2'>是</Option>
          <Option value='1'>否</Option>
        </Select>
      </div>
    </div>
    <div class="condition-row">
      <Button size="large" type="default" icon="md-settings" class="l mr10" @click="setUpDown()">批量设置上下限</Button>
      <Button size="large" type="default" icon="md-add" class="l mr10" @click="addDeptDrug()">新增</Button>
      <Button size="large" type="default" icon="md-remove" class="l mr10" @click="removeDeptDrug()">移除</Button>
      <Button size="large" type="default" icon="md-download" class="l" @click="exportData()">导出</Button>
      <Button size="large" type="default" icon="ios-search" class="r" @click="getData(true)">查询</Button>
    </div>
    <div class="condition-table">
      <Table ref="selection" @on-select="onSelect" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange" :loading="loading" :columns="columns" :data="drugList"></Table>
    </div>
    <div class="condition-page">
      <Page :total="page.total" :page-size="page.pageSize" :current.sync="page.pageNo" @on-change="getData()" show-total show-elevator />
    </div>
    <NormalModal :modal="editModal"
                 @modalValueChange="modalValueChange"
                 @cancleEditModal="cancleEditModal"
                 @comfirmEditModal="comfirmEditModal">
    </NormalModal>
    <NormalModal :modal="addModal"
                 @modalDataQuery="modalDataQuery"
                 @cancleEditModal="cancleEditModal"
                 @comfirmEditModal="addComfirmEditModal">
    </NormalModal>
  </div>
</template>
<script>
  import NormalModal from '@/components/NormalModal';
  import {Message,Modal} from 'iView';
  export default {
    components:{
      NormalModal
    },
    data () {
      const validateUpperQuantity = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入库存上限'));
        } else if (!isNaN(rule.max) && value > rule.max) {
          callback(new Error(`请输入小于等于${rule.max}的数值`));
        } else if (!isNaN(rule.min) && value < rule.min) {
          callback(new Error(`请输入大于等于${rule.min}的数值`));
        } else {
          callback();
        }
      };
      const validateDownQuantity = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入库存下限'));
        } else if (!isNaN(rule.max) && value > rule.max) {
          callback(new Error(`请输入小于等于${rule.max}的数值`));
        } else if (!isNaN(rule.min) && value < rule.min) {
          callback(new Error(`请输入大于等于${rule.min}的数值`));
        } else {
          callback();
        }
      };
      const validatePurchaseQuantity = (rule, value, callback) => {
        if (!isNaN(rule.max) && value > rule.max) {
          callback(new Error(`请输入小于等于${rule.max}的数值`));
        } else if (!isNaN(rule.min) && value < rule.min) {
          callback(new Error(`请输入大于等于${rule.min}的数值`));
        } else {
          callback();
        }
      };
      return {
        page:{
          pageNo:1,
          pageSize:10,
          total:0
        },
        form: {
          deptCode:'',//部门
          ctmmTradeName: '',//名称
          ctmmDosageFormDesc: '',//剂型
          ctmmStatusCode: '',//状态
          medDrugType:'',//是否报告药
          replanStore:'',//货位名称
        },
        upperQuantity: 999999,
        downQuantity: 0,
        selectData:[],
        loading:false,
        drugList:[],
        deptList:[],
        editModal:{
          show:false,
          title:'批量编辑',
          htmlType:'form',
          width:520,
          labelWidth:100,
          loading:false,
          datas:[{
            id:"upperQuantity",
            text:"库存上限",
            type:'InputNumber',
            value:0,
            min:0,
            rules:[
              { required: true, validator:validateUpperQuantity,min:0,trigger: 'change' }
            ]
          },
          {
            id:"downQuantity",
            text:"库存下限",
            type:'InputNumber',
            value:0,
            max:999999,
            rules:[
              { required: true, validator:validateDownQuantity,max:999999,trigger: 'change' }
            ]
          },
          {
            id:"purchaseQuantity",
            text:"采购量",
            type:'InputNumber',
            value:0,
            max:999999,
            rules:[
              { validator:validatePurchaseQuantity,max:999999,trigger: 'change' }
            ]
          }]
        },
        addModal:{
          show:false,
          title:'添加药品',
          htmlType:'formTable',
          width:884,
          top:20,
          labelWidth:50,
          loading:false,
          form:[{
            id:"deptCode",
            text:"部门",
            type:'Select',
            label:true,
            fun:'',
            list:[],
            listValue:'id',
            listText:'deptName',
            value:''
          },
            {
              id:"ctmmGenericName",
              text:"通用名/药品名称/生产厂家",
              type:'Input',
              label:false,
              value:''
            }],
          table:{
            loading:false,
            columns:[],
            data:[]
          },
          page:{
            pageNo:1,
            pageSize:10,
            total:0
          }
        },
        columns: [
          {
            type: 'selection',
            align: 'center',
            width: 60
          },
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 60
          },
          {
            title: '药品名称',
            key: 'ctmmTradeName',
            align: 'center',
            width: 200
          },
          {
            title: '剂型',
            key: 'ctmmDosageFormDesc',
            align: 'center',
            width: 100
          },
          {
            title: '包装规格',
            key: 'packageSpecification',
            align: 'center',
            width: 200
          },
          {
            title: '单位',
            key: 'replanUnit',
            align: 'center',
            width: 100
          },
          {
            title: '批准文号',
            key: 'approvalNo',
            align: 'center',
            width: 150
          },
          {
            title: '部门',
            key: 'deptName',
            align: 'center',
            width: 200
          },
          {
            title: '生产厂家',
            key: 'ctmmManufacturerName',
            align: 'center',
            width: 200
          },
          {
            title: '库存上限',
            key: 'upperQuantity',
            align: 'center',
            width: 100
          },
          {
            title: '库存下限',
            key: 'downQuantity',
            align: 'center',
            width: 100
          },
          {
            title: '药品编码',
            key: 'hisDrugCode',
            align: 'center',
            width: 200
          },
          {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (h, params) => {
              if(params.row.deptType==3||params.row.deptType==4){
                return h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: "/sys/deptDrugControl/directory/detail", query:{id:params.row.detailId,deptType:params.row.deptType}})
                    }
                  }
                }, '编辑')
              }else {
                return h('Button', {
                  props: {
                    disabled:true,
                    type:'text'
                  },
                  style: {
                    marginRight: '5px',
                    backgroundColor:'#ccc!important'
                  },
                }, '编辑')
              }
            }
          }
        ],

      }
    },
    methods:{
      setProps(){
        this.addModal.table.columns = this.columns.concat();
        this.addModal.table.columns.splice(7);
        this.addModal.table.columns.splice(5,1,{
          align: "center",
          key: "ctpHdmsCheckinUnitDesc",
          title: "单位",
          width: 80
        })
      },
      setUpDown(){
        if(this.selectData.length == 0){
          Message.warning('请至少选中一条数据');
          return;
        }
        this.editModal.show = true;
      },
      addDeptDrug(){
        this.addModal.show = true;
      },
      removeDeptDrug(){
        if(this.selectData.length == 0){
          Message.warning('请至少选中一条数据');
          return;
        }
        Modal.confirm({
          title: '确认',
          content: '<p>是否确认执行此操作</p>',
          onOk: () => {
            this.deleteDeptDrug()
          },
          onCancel: () => {

          }
        });
      },
      async deleteDeptDrug(){
        let arr = [];
        this.selectData.forEach(item =>{
          arr.push(item.detailId)
        })
        let drugCode = arr.join(',');
        let delInfo = await this.$api.purchase.deleteDeptDrug({drugCode}).then(res=>{
          if(res.code == 200){
            Message.success("操作成功！");
            this.getData();
          }
        })
      },
      modalValueChange (params) {
        this.editModal.datas.forEach((item,index)=> {
          this.editModal.datas[index].value = params[item.id];
        })
      },
      cancleEditModal (flag) {
        this.editModal.show = flag;
        this.addModal.show = flag;
      },
      comfirmEditModal({downQuantity='',purchaseQuantity='',upperQuantity=''}){
        this.editModal.loading = true;
        let datas = this.selectData,info = [];
        if(datas.length > 0){
          datas.forEach(item =>{
            info.push({
              id:item.detailId || '',
              bigDrugCode:item.bigDrugCode || '',
              hisDrugCode:item.hisDrugCode || '',
              medDrugTypes:item.medDrugType || '',
              downQuantity,
              purchaseQuantity,
              upperQuantity
            })
          })
          this.saveEditModal(info);
        }
      },
      async saveEditModal(info){
        let saveInfo = await this.$api.purchase.operDeptDrug({info})
        if(saveInfo.code == 200){
          this.editModal.loading = false;
          this.editModal.show = false;
          Message.success("保存成功！");
          this.getData();
        }

      },
      addComfirmEditModal(selectDatas){
        this.addModal.loading = true;
        let info = [];
        if(selectDatas.length > 0){
          selectDatas.forEach(item =>{
            info.push({
              deptCode:this.addModal.form[0].value || '',
              bigDrugCode:item.bigDrugCode || '',
              hisDrugCode:item.hisDrugCode || '',
              medDrugTypes:item.medDrugType || '',
            })
          })
          this.saveAddModal(info);
        }
      },
      async saveAddModal(info){
        let saveInfo = await this.$api.purchase.operDeptDrug({info})
            this.addModal.loading = false;
            this.addModal.show = false;
            if(saveInfo.code==200){
              Message.success("保存成功！");
              this.getData();
            }
      },
      onSelect(selection,row){
        this.selectData = selection;
      },
      onSelectAll(selection){
        this.selectData = selection;
      },
      onSelectionChange(selection){
        this.selectData = selection;
      },
      async modalDataQuery(params){
        this.addModal.form.forEach((item,index)=> {
          this.addModal.form[index].value = params[item.id];
        })
        this.addModal.table.loading = true;
        let datalist = await this.$api.purchase.findDepotFilterList(params);
        this.addModal.table.loading = false;
        let data = datalist.data;
        this.addModal.table.data = data.list;
        this.addModal.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async getDeptList(){
        let datalist = await this.$api.publics.getAllSysDept();
        this.deptList = datalist.data;
        this.addModal.form[0].list = this.deptList;
        this.addModal.form[0].value = (this.deptList[0] && this.deptList[0].id)?this.deptList[0].id:'';
      },
      async getData(flag){
        if(flag){
          this.page.pageNo = 1;
        }
        this.loading = true;
        let datalist = await this.$api.purchase.findDepotlist({
          ...this.form,pageNo:this.page.pageNo,pageSize:this.page.pageSize
        });
        this.loading = false;
        let data = datalist.data;
        this.drugList = data.list;
        this.page = { total: data.count, pageNo: data.pageNo,pageSize: data.pageSize};
      },
      async exportData(exportType = 1){
        let datalist = await this.$api.purchase.exportDrugList({
          ...this.form
        });
        let blob = new Blob([datalist], {type: "application/vnd.ms-excel"});
        let fileName = `${this.getCurrentDate()}药品目录.xls`;
        let objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.download = fileName;
        link.href = objectUrl;
        link.click();
      },
    },
    created(){
      this.setProps();
      this.getDeptList();
      this.getData();
    },

  }
</script>

<style lang="less" scoped>

</style>
