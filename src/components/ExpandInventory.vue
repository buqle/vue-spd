/**
 * @date 2019/11/29
 * @Description: 盘点明细 新增批号
*/
<template>
  <div style="width: 100%">
    <Table :data="row" :columns="columns" :show-header="false"></Table>
  </div>
</template>
<script>
    export default {
      props: ['row'],
      // computed: {
      //   comp (){
      //     this.list = this.row.map(i => '0_'+i)
      //   }
      // }, 
      created(){
        console.log("111",this.row)
      },
      data(){
        return{
          columns:[
                        {
                          type: 'selection',
                          align: 'center',
                          width:'50',
                          fixed: 'left'
                        },
                        {
                          type: 'index',
                          title: '序号',
                          align: 'center',
                          width:'80',
                          fixed: 'left'
                        },
                        {
                          type: '',
                          align: 'center',
                          width:'10',
                          fixed: 'left'
                        },
                        { 
                          title: '货位',
                          key: 'locName',
                          align: 'center',
                          fixed: 'left',
                          render: (h, params) => {
                              return h('Select', {  
                                  props:{  
                                      value: this.row[params.index].locName,
                                      transfer:true
                                  },  
                                  on: {  
                                      'on-change':(value) => {
                                          this.row[params.index].locName = value;
                                      }
                                  },  
                              },  
                              params.row.positionName.map((obj)=>{
                                  return h('Option', {
                                      props: {value: obj.positionName}  
                                  });  
                              })
                              );  
                          },  
                        },
                        { 
                          title: '货位类型',
                          key: 'positionTypeName',
                          align: 'center',
                          fixed: 'left',
                          // render: (h, params) => {
                          //                         if(params.row.showUint&&this.comlist.checkStatus == 2 && params.row.checkDetailStatus == 1){
                          //     return  params.row.positionName.length&&params.row.positionName[0][0].locationName?params.row.positionName[0][0].locationName:'加载中...'
                          //   }else {
                          //     return h('div',params.row.positionTypeName);
                          //   }
                          // } 
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
                          title: '账面库存',
                          key: 'accountStoreNum',
                          align: 'center',
                          // render: (h, params) => {
                          //         if(this.comlist.checkBillType == "2" && params.row.checkDetailStatus == 1){
                          //           // return h('div',0);
                          //          }else{
                          //                                   return h('div',params.row.accountStoreNum);
                          //          }
                          // }
                        },
                        {
                          title: '实际数量',
                          key: 'practicalRepertory',
                          align: 'center',
                          render: (h, params) => { 
                              return h('InputNumber', {
                                                props: {
                                                  min:1,
                                                  max:params.index.accountStoreNum,
                                                      type: 'text',
                                                      value: this.row[params.index].accountStoreNum,
                                                      editable:false
                                                },
                                                on: {  
                                                  'on-change':(event)=>{
                                                                        this.row[params.index].practicalRepertory = event;
                                                                    }
                                                },
                                            }); 
                          }
                        },
                        {
                          title: '盈亏数量',
                          key: 'checkNum',
                          align: 'center',
                          // render: (h, params) => {
                          //   if(this.comlist.checkBillType == "2" && params.row.checkDetailStatus == 1){
                          //     // return h('div',0);
                          //    }else{
                          //                             return h('div',params.row.checkNum?params.row.checkNum:0);
                          //                          }
                          // }
                        },
                        {
                          title: '账面批号',
                          key: 'accountBatchNo',
                          align: 'center',
                        },
                        {
                          title: '实际批号',
                          key: 'practicalBatch',
                          align: 'center',
                          render: (h, params) => { 
                              return h('Input', {
                                                props: {
                                                      type: 'text',
                                                      value: this.row[params.index].accountBatchNo,
                                                      editable:false
                                                },
                                                on: {  
                                                    'on-change':(event)=>{
                                                                          this.row[params.index].practicalBatch = event;
                                                          }
                                                  },
                                         }); 
                          }
                        },
                        { 
                          title: '包装规格',
                          key: 'packageSpecification',
                          align: 'center',
                        },
                        {  
                          title: '单位',
                          key: 'unit',
                          align: 'center',
                        },
                        {
                          title: '生产日期',
                          key: 'accountProductTime',
                          align: 'center',
                        },
                        {
                          title: '实际生产日期',
                          key: 'realProductTime',
                          align: 'center',
                          render: (h, params) => { 
                              return h('DatePicker', {
                                                props: {
                                                      value: this.row[params.index].accountProductTime,
                                                      editable:false
                                                },
                                                on: {  
                                                'on-change':(event)=>{
                                                                      this.row[params.index].realProductTime = event;
                                                                  }
                                              },
                                         }); 
                          }
                        },
                        {
                          title: '有效期至',
                          key: 'accountEndTime',
                          align: 'center',
                        },
                        {
                          title: '实际有效期至',
                          key: 'validEndTime',
                          align: 'center',
                          render: (h, params) => { 
                              return h('DatePicker', {
                                                props: {
                                                      value: this.row[params.index].accountEndTime,
                                                      editable:false
                                                },
                                                on: {  
                                                'on-change':(event)=>{
                                                                      this.row[params.index].validEndTime = event;
                                                                  }
                                              },
                                         }); 
                          }
                        },
                        {
                          title: '单价',
                          key: 'referencePrice',
                          align: 'center',
                        },
                        {
                          title: '盈亏金额',
                          key: 'mount',
                          align: 'center',
                          render: (h, params) => {
                          　　return h('div',(Number(params.row.referencePrice) * Number(params.row.checkNum)).toFixed(4))
                          }
                        },
                        {
                          title: '操作',
                          align: 'center',
                          render: (h, params) => {
                                          return h('a', { 
                                                              on: {
                                                                  click: () => {
                                                                  }
                                                              }
                                                          }, '删除')
                          }
                        }
                    ],
  
        }
      },
    }
</script>

