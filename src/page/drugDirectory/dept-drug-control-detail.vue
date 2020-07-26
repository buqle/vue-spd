<template>
  <div class="container">
    <Card :bordered="false" dis-hover class="card-item info-item">
      <p slot="title">基本信息</p>
      <p slot="extra" class="btn-style">
        <Button type="default" icon="md-checkmark" @click.native="handleSubmit()">保存</Button>
      </p>
      <Row :gutter="20">
        <Col span="8" v-for="(item,index) in basicInfo" :key="index">
          <span>{{ item.name }}：</span>
          <span>{{ item.value }}</span>
        </Col>
      </Row>
    </Card>
    <Collapse v-model="collapse.a" class="card-item">
      <Panel name="1">
        <span>单位信息</span>
        <Row slot="content">
          <Table :columns="columns" :data="listTransforsVo"></Table>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.b" class="card-item">
      <Panel name="1">
        <div class="customUnit">
          <span>自定义单位信息</span>
          <Button class="customUnit-button" type="default" icon="md-add" @click.native.stop="addCustomUnit">新增自定义单位</Button>
        </div>
        <Row slot="content">
          <Table :columns="columns1" :data="customUnit">

            <template slot-scope="{ row, index }" slot="index">
              <Input type="text" v-model="index"/>
            </template>

            <template slot-scope="{ row, index }" slot="unitName">
              <Input type="text" v-model="customUnit[index].unitName"/>
            </template>

            <template slot-scope="{ row, index }" slot="unitCoefficient">
              <InputNumber :min="1" v-model="customUnit[index].unitCoefficient"></InputNumber>
            </template>

            <template slot-scope="{ row, index }" slot="unit">
              <Select v-model="customUnit[index].unit" :transfer="true">
                <Option v-for="(item,index) in unitInfo" :value="item.unitCode" :key="index">{{ item.unit }}</Option>
              </Select>
            </template>

            <template slot-scope="{ row, index }" slot="action">
              <Button @click="delCustomUnit(customUnit[index], index)">删除</Button>
            </template>
          </Table>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.c" class="card-item">
      <Panel name="1">
        <span>库存上下限</span>
        <Row slot="content">
          <Form class="form-container" label-position="left" :model="detailInfo" ref="storageLimit" :rules="storageLimit" :label-width="100">
            <Row>
              <Col span="8">
                <FormItem label="本部门上限" prop="upperQuantity">
                  <InputNumber :min="downQuantity" v-model="detailInfo.upperQuantity"></InputNumber>
                </FormItem>
              </Col>
              <Col offset="4" span="8">
                <FormItem label="采购量" prop="purchaseQuantity">
                  <InputNumber :max="upperQuantity" v-model="detailInfo.purchaseQuantity"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="本部门下限" prop="downQuantity">
                  <InputNumber :max="upperQuantity" v-model="detailInfo.downQuantity"></InputNumber>
                </FormItem>
              </Col>
              <Col offset="4" span="8">
                <FormItem label="补货策略" prop="planStrategyType">
                  <RadioGroup v-model="detailInfo.planStrategyType">
                    <Radio :label="1">
                      <span>补固定量</span>
                      <Tooltip content="采购的数量为补固定的数量" placement="bottom">
                        <Icon type="ios-alert-outline" size="22" />
                      </Tooltip>
                    </Radio>
                    <Radio :label="2">
                      <span>补基准水位</span>
                      <Tooltip content="采购的数量为采购量-当前库存" placement="bottom">
                        <Icon type="ios-alert-outline" size="22" />
                      </Tooltip>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.d" class="card-item">
      <Panel name="1">
        <span>供应商</span>
        <Row slot="content">
          <Form class="form-container" label-position="left" :label-width="100">
            <Row v-for="(item,index) in supplierList" :key="index">
              <Col span="8">
                <FormItem label="供应商" prop="supplierCode">
                  <span v-if="medDrugType===1">{{item.supplierName}}</span>
                  <Select v-else v-model="item.supplierCode" :transfer="true">
                    <Option v-for="(s,i) in supplierSelect" :value="s.ctmaSupplierCode" :key="i">{{ s.ctmaSupplierName }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col offset="2" span="8">
                <FormItem label="" prop="whetherDefault">
                  <RadioGroup v-model="item.whetherDefault">
                    <Radio :label="1">设为默认</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.e" class="card-item">
      <Panel name="1">
        <span>指示货位</span>
        <Row slot="content">
          <Form class="form-container" label-position="left" ref="goosLocation" :model="detailInfo" :rules="goosLocation" :label-width="100">
            <Col span="12" v-for="(item,index) in goodsList" :key="index">
              <Row :gutter="8">
                <Col span="14">
                  <FormItem :label="item.name" :prop="item.dataIndex">
                   <div style="display: flex">
                     <Tooltip :content="item.tip" placement="bottom">
                       <Icon type="ios-alert-outline" size="22" />
                     </Tooltip>
                     <Select v-model="detailInfo[item.dataIndex]" :transfer="true" style="width:90%;margin-left: 4px;">
                       <Option v-for="(o,i) in item.list" :value="o.id" :key="i">{{ o.positionName }}</Option>
                     </Select>
                   </div>
                  </FormItem>
                </Col>
                <Col offset="2" span="8" v-if="deptType == '4'">
                  <FormItem label="存储单位" prop="supplierCode">
                    <span>{{item.dataIndexUnit}}</span>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.f" class="card-item info-item">
      <Panel name="1">
        <span>药品标志</span>
        <Row :gutter="20" slot="content">
          <Col span="8" v-for="(item,index) in drugMark" :key="index">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}</span>
          </Col>
        </Row>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse.g" class="card-item info-item">
      <Panel name="1">
        <span>药品信息</span>
        <Row :gutter="20" slot="content">
          <Col span="8" v-for="(item,index) in drugInfo" :key="index">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}</span>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
  import { Message,Modal } from 'iView';
  import { difference } from 'lodash';
  export default {
    data () {
      return {
        collapse:{a:'1', b:'1', c:'1', d:'1', e:'1', f:'1', g:'1'},
        id:'',
        uuid:0,
        detailInfo:{},
        unitInfo:[],
        supplierList:[],//供应商循环
        supplierSelect:[],//供应商
        medDrugType:null,//1 目录内 2 目录外
        customUnit:[],
        upperQuantity: 0,
        downQuantity: 0,
        listTransforsVo:[],//单位信息
        goodsList:[],//指示货位
        deptType:0,//3药库 4药房
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 80
          },
          {
            title: '单位属性',
            key: 'sort',
            align: 'center',
            render: (h, params) => {
              switch (params.row.sort) {
                case 1:
                  return h('span', '整包装单位');
                  break;
                case 2:
                  return h('span', '包装规格');
                  break;
                case 3:
                  return h('span', '最小发药单位');
                  break;
                case 4:
                  return h('span', '补货单位');
                  break;
                case 5:
                  return h('span', '发药单位');
                  break;
                default:
                  return "";
              }
            }
          },
          {
            title: '单位名称',
            key: 'bigUnit',
            align: 'center'

          },
          {
            title: '转化系数',
            key: 'conversionRate',
            align: 'center'

          },
          {
            title: '基础单位',
            key: 'smallUit',
            align: 'center'
          }
        ],
        columns1: [
          {
            type: 'index',
            title: '序号',
            width:60
          },
          {
            title: '单位名称',
            slot: 'unitName'
          },
          {
            title: '转化系数',
            slot: 'unitCoefficient'
          },
          {
            title: '基础单位',
            slot: 'unit'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center',
            width: 100
          }
        ],
        basicInfo:[],//基本信息
        drugMark:[],//药品标志
        drugInfo:[],//药品信息
        storageLimit: {
          upperQuantity: [{required: true, type:'number',message: '请输入本部门上限！', trigger: 'change'}],
          downQuantity:[{required: true, type:'number',message: '请输入本部门下限！', trigger: 'change'}],
          purchaseQuantity:[{required: true, type:'number',message: '请输入采购量！', trigger: 'change'}],
          planStrategyType:[{required: true, type:'number',message: '请选择补货策略！', trigger: 'change'}]
        },
        goosLocation: {
          advanceScatteredLoc: [{required: true, message: '请选择预拆零货位！', trigger: 'change'}],
          scatteredLoc: [{required: true, message: '请选择拆零发药货位！', trigger: 'change'}],
          dispensingMachineLoc: [{required: true, message: '请选择发药机货位！', trigger: 'change'}],
          replanStore: [{required: true, message: '请选择补货指示货位！', trigger: 'change'}],
        }
      }
    },
    methods: {
      handleSubmit(){
        Modal.confirm({
          title: '确认',
          content: '<p>确认保存吗？</p>',
          onOk: () => {
            this.setSaveParams()
          },
          onCancel: () => {}
        });
      },
      setSaveParams(){
        let flag = this.customUnit.every(item => {
          if(!item.unit) {
            this.$Message.error('自定义单位基础单位不能为空!');
            return false;
          };
          if(!item.unitCoefficient) {
            this.$Message.error('自定义单位转换系数不能为空!')
            return false;
          };
          if(!item.unitName) {
            this.$Message.error('自定义单位名称不能为空!')
            return false;
          };
          return true;
        });
        if (!flag) {
          return;
        }
        this.$refs['storageLimit'].validate((valid) => {
          if (!valid) {
            this.$Message.error('请输入库存上下限信息！');
            flag = false;
          }
        });
        this.$refs['goosLocation'].validate((valid) => {
          if (!valid) {
            this.$Message.error('请选择指示货位信息！');
            flag = false;
          }
        })
        if (!flag) {
          return;
        }
        flag = this.supplierList.some(item => {
          if(item.whetherDefault) {
            return true;
          };
          return false;
        });
        if (!flag&&this.$route.query.deptType==3) {
          return this.$Message.warning('请选择一个供应商为默认');
          return;
        }
        let postData = {
          customUnit:this.customUnit,//自定义单位
          drugInfo:{
            upperQuantity:this.detailInfo.upperQuantity,//上限
            downQuantity:this.detailInfo.downQuantity,//下限
            purchaseQuantity:this.detailInfo.purchaseQuantity,//采购量
            planStrategyType:this.detailInfo.planStrategyType,//补货策略
            id:this.id,
            medDrugType:this.medDrugType,
            drugCode:this.detailInfo.drugCode,
            bigDrugCode:this.detailInfo.bigDrugCode,
            hisDrugCode:this.detailInfo.hisDrugCode,
          }
        }
        if(this.goodsList && this.goodsList.length >0){
          this.goodsList.forEach(item=>{
            postData.drugInfo[item.dataIndex] = this.detailInfo[item.dataIndex];
          })
        }
        if(this.supplierList && this.supplierList.length > 0 ){
          postData.supplier = this.supplierList;
        }
        this.saveData(postData);
      },
      async saveData(params){
        let saveInfo = await this.$api.purchase.operDeptInfo(params);
        if(saveInfo.code == 200){
          this.$Message.success('保存成功！');
          this.$router.go(-1);
        }else{
          this.$Message.error('保存失败！');
        }
      },
      addCustomUnit(){
        this.uuid++;
        let flag = this.customUnit.every(item=>{
          let _flag = false;
          for(let i in item){
              if(i != 'uuid' && item[i]){
                _flag = true;
                break;
              }
          }
          return _flag;
        })
        if(!flag){
          this.$Message.warning("已有一条为空的数据可以操作！");
          return;
        }
        this.customUnit.push({
          unitCode:'',
          unitName: '',
          unitCoefficient: 0,
          unit: '',
          uuid:this.uuid
        })
      },
      delCustomUnit(record,index){
        this.customUnit.splice(index, 1);
      },
      async getDrugListDetail(id = this.id){
        let data = await this.$api.purchase.getDrugInfo({
          id
        });
        this.detailInfo  = data.data;
        this.upperQuantity = data.data.upperQuantity;
        this.downQuantity = data.data.downQuantity;
        let {listTransforsVo, customUnit, goodsVos} = data.data;
        //单位信息
        listTransforsVo.push({
          sort: 4,
          bigUnit: data.data.replanUnit
        });
        if(this.deptType == '4'){//药房
          listTransforsVo.push({
            sort: 5,
            bigUnit: data.data.dispensingUnit
          });
        }
        this.listTransforsVo = data.data.listTransforsVo;
        //自定义单位
        customUnit = customUnit || [];
        customUnit = customUnit.map(item => {
          this.uuid ++;
          item.uuid = this.uuid;
          return item;
        });
        this.customUnit = data.data.customUnit;
        //指示货位
        const obj = goodsVos[0];
        let goodsList = [];
        const goodsListMap = {
          advance: {
            goods: 'advanceScatteredLoc',
            tip: '单位默认补货单位',
            unit: this.detailInfo.replanUnit,
            name: '预拆零货位',
          },
          scattered: {
            goods: 'scatteredLoc',
            tip: '单位默认发药单位',
            unit: this.detailInfo.ctpHdmsBasicUnitDesc,
            name: '拆零发药货位',
          },
          dispensing: {
            goods: 'dispensingMachineLoc',
            tip: '单位默认补货单位',
            unit: this.detailInfo.replanUnit,
            name: '发药机货位',
          },
          replan: {
            goods: 'replanStore',
            tip: '单位默认补货单位',
            unit: this.detailInfo.replanUnit,
            name: '补货指示货位',
          }
        };
        for (const key in obj) {
          if( Array.isArray(obj[key]) ) {
            if(obj[key].length === 0) {
              this.$Message.warning(`该部门下没有${goodsListMap[key].name}, 请先新增货位后再对该药品进行编辑`, 3);
            };
            this.goodsList.push({
              name: goodsListMap[key].name,
              dataIndex: goodsListMap[key].goods,
              dataIndexUnit: goodsListMap[key].unit,
              list: obj[key],
              tip: goodsListMap[key].tip
            });
          };
        };
        //供应商
        this.medDrugType = data.data.medDrugType;
        if(this.medDrugType===2){
          if(data.data.supplier){
            if(data.data.supplier == 0){
              this.supplierList = [{
                supplierCode:null,
                supplierName:null,
                supplierPrice:null,
                whetherDefault:1,
              }];
            }else{
              this.supplierList = data.data.supplier
            }
          }
        }else{
          this.supplierList = data.data.supplier
        }
        this.setInfoList();
        this.getUnitInfo();
        this.getSupplier();
      },
      setInfoList(){
        let info = this.detailInfo;
        const basicInfo = [
          {name:'药品名称',value:info.ctmmTradeName?info.ctmmTradeName:''},
          {name:'别名',value:info.ctmmAnotherName?info.ctmmAnotherName:''},
          {name:'包装规格',value:info.packageSpecification?info.packageSpecification:''},
          {name:'剂型',value:info.ctmmDosageFormDesc?info.ctmmDosageFormDesc:''},
          {name:'生产厂家',value:info.ctmmManufacturerName?info.ctmmManufacturerName:''},
          {name:'批准文号',value:info.approvalNo?info.approvalNo:''},
          {name:'状态',value:info.statusName?info.statusName:''},
          {name:'药品编码',value:info.hisDrugCode?info.hisDrugCode:''},
        ];
        const drugMark = [
          {name:'是否报告药',value:info.medDrugTypes?info.medDrugTypes:''},
          {name:'危重药物标志',value:info.ctmmCriticalCareMedicine?info.ctmmCriticalCareMedicine:''},
          {name:'贵重标记',value:info.ctmmValuableSign?info.ctmmValuableSign:''},
          {name:'存储条件',value:info.storageConditions?info.storageConditions:''},
          {name:'毒麻标识',value:info.poisonHemps?info.poisonHemps:''}
          ];
        const drugInfo = [
            {name:'药品名称',value:info.ctmmDesc?info.ctmmDesc:''},
            {name:'药品剂量',value:info.ctphdmiDosageUnitDesc?info.ctphdmiDosageUnitDesc:''},
            {name:'药学分类描述',value:info.ctphdmiCategoryDesc?info.ctphdmiCategoryDesc:''},
            {name:'管制分类描述',value:info.ctphdmiRegulatoryClassDesc?info.ctphdmiRegulatoryClassDesc:''},
            {name:'抗菌药物标志',value:info.ctmmAntibacterialsign?info.ctmmAntibacterialsign:''},
            {name:'国家基本药物标记',value:info.ctmmEssentialMedicine?info.ctmmEssentialMedicine:''},
            {name:'皮试标志',value:info.ctmmSkintestSign?info.ctmmSkintestSign=="1"?'Y':'N':''},
            {name:'冷藏标识',value:info.refrigerateType?info.refrigerateType=="1"?'Y':'N':''},
            {name:'停用标记',value:info.ctmmStatusCode?info.ctmmStatusCode=="1"?'Y':'N':''}
          ];
        this.basicInfo = basicInfo;
        this.drugMark = drugMark;
        this.drugInfo = drugInfo;
      },
      async getUnitInfo(){
        let bigDrugCode = this.detailInfo.bigDrugCode
        let data = await this.$api.publics.getUnitInfo({bigDrugCode});
        this.unitInfo  = data.data;
      },
      async getSupplier(){
        let data = await this.$api.publics.getSupplier();
        this.supplierSelect  = data.data;
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.deptType = this.$route.query.deptType;
      this.getDrugListDetail();
    },
  }
</script>
<style lang="less" scoped>
  .container{
    background-color: #f5f7f9;
    .card-item{
      margin-bottom:10px;
      .customUnit{
        display: inline-block;
        width: 97%;
        .customUnit-button{
          float: right;
          margin-top: 6px;
        }
      }
    }
    /deep/.ivu-collapse{
      border: none;
      background-color: #fff;
      border-radius: 0px;
      .ivu-collapse-item{
        .ivu-collapse-header {
          height: 48px;
          line-height: 48px;
          color: #17233d;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 1px solid #fff;
          width: 100%;
          i{
            margin-right: 0;
          }
        }
        .ivu-collapse-content-box{
          padding-top: 0;
        }
      }
    }
    /deep/.ivu-input-number{
      width: 100%;
    }
    .info-item{
      .ivu-col {
        margin-bottom:10px;
        font-size: 14px;
      }
    }
  }
</style>

