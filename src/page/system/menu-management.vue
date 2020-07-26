/**
 * @author QER
 * @date 2019/9/30
 * @Description:菜单管理-查询
*/
<template>
    <div class="table-expanded">
      <Row>
        <Col  span="2-5">
          <Radius iconHref="icon-tianjiaanniu" iconText="添加菜单" iconSize="20" @upButton="add"></Radius>
        </Col>
      </Row>

      <Table :data="menuList" :columns="columns1"></Table>
    </div>
</template>

<script>
  import Radius from '@/components/Radius';
  import ExpandRow from '@/components/ExpandRow';
  import {DeptFormat} from '@/util/find'
  import {filter} from 'lodash';
  import Icon from '@/components/Icon';
    export default {
      components: {Radius},
      filters:{
        DeptFormat(val){
          if(val==1){
            return '设置'
          }
        }
      },
      data(){
        return{
          columns1: [
            {
              type: 'expand',
              width: 50,
              render: (h, params) => {
                return h(ExpandRow, {
                  props: {
                    row: params.row.children
                  }
                })
              }
            },
            {
              title: '菜单名称',
              key: 'name',
              align: 'center',
            },
            {
              title: '链接',
              key: 'href',
              align: 'center'
            },
            {
              title: '图标',
              key: 'icon',
              align: 'center',
              render: (h, params) => {
                return h(Icon, {
                  props: {
                    iconHref: `icon-${params.row.icon}`
                  }
                })
              }
            },
            {
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
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('span', DeptFormat[params.row.depType]),
                ]);
              }
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
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit({
                          id:params.row.id,
                          parentId:params.row.parentId
                        })
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'primary',
                     size: 'small'
                    },
                    on: {
                      click: () => {
                        this.edit({
                          parentId:params.row.id,
                          parentName:params.row.name
                        })
                      }
                    }
                  }, '添加下级菜单')
                ]);
              }
            },
          ],
          menuList:[]
        }
      },
      async created(){
       let menu= await this.$api.system.menuListSearch();
        let newmenuList= await this.$skip.menuFormat( menu.data,true);
        this.menuList=newmenuList;
      },
      methods:{
        add(){
          this.$skip.goAdd(this.$router, '/menu-managementAdd')
        },

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
