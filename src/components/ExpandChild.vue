/**
 * @author QER
 * @date 2019/10/9
 * @Description: 菜单展开
*/
<template>
  <div style="width: 100%">
    <Table :data="row" :columns="columns1" :show-header="false"></Table>
  </div>
</template>

<script>

    export default {
      props: ['row'],
      created(){
        console.log(this.row)
      },
      data(){
        return{
          columns1: [
            {
              width: 50
            },
            {
              key: 'name',
              align: 'center',
            },
            {

              title: '链接',
              key: 'href',
              align: 'center'
            },
            {
              key: 'icon',
              align: 'center'

            },
            {
              // width: 150,
              title: '排序',
              key: 'sort',
              align: 'center'
            },
            {
              title: '可见',
              key: 'isShow',
              align: 'center',
              render: (h, params) => {
                if (params.row.isShow ==1) {
                  return h('span', '是');
                }else {
                  return h('span', '否');
                }
              }
            },
            {
              title: '部门类型',
              key: 'depType',
              align: 'center'
            },
            {
              title: '备注',
              key: 'remarks',
              align: 'center'
            },
            {
              title: '操作',
              key: 'address',
              align: 'center',
              width:'170',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      //size: 'large',
                      long:true
                    },
                    on: {
                      click: () => {
                        this.edit({
                          id:params.row.id,
                          parentId:params.row.parentId
                        })
                      }
                    }
                  }, '编辑')
                ]);
              }
            },
          ],
        }
      },
      methods:{
        edit(query){
          this.$skip.goEdit(
            this.$router,'/menu-managementAdd',
            query
          )
        }
      }
    }
</script>

<style scoped>

</style>
