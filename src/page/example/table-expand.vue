<style lang="less">
</style>
<template>
    <div>
        <div class="ivu-table-wrapper csu-table">
            <div class="ivu-table ivu-table-with-fixed-top ">
                <div class="ivu-table-body">
                    <table class="table_border" cellspacing="0" cellpadding="0" border="0" style="width: 100%;table-layout: auto;">
                        <thead>
                        <tr>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>序号</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>姓名</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>权限</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>状态</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>品规数</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>医疗机构</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center" style="width:180px;">
                                <div class="ivu-table-cell">
                                    <span>手机号</span>
                                </div>
                            </th>
                            <th class="ivu-table-column-center">
                                <div class="ivu-table-cell">
                                    <span>操作</span>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="ivu-table-tbody" v-for="(item,i) in data1" v-if="data1">
                        <tr class="ivu-table-row">
                            <td class="">
                                <div class="ivu-table-cell">
                                    <span>{{i+1}}</span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                    <span>{{item.name}}</span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                    <span>{{item.age}}</span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                    <span>{{item.state}} </span>
                                </div>
                            </td>
                            <td :class="item.show[0]?'active': ''" @click="toggle(i,0,2)">
                                <div class="ivu-table-cell table-expand f-color tc">
                                    <span>{{item.num}} </span>
                                    <img v-if="item.show[0]" src="../../assets/image/angle-double-down.png" alt="">
                                    <img v-else src="../../assets/image/angle-double-up.png" alt="">
                                </div>
                            </td>
                            <td :class="item.show[1]?'active': ''" @click="toggle(i,1,2)">
                                <div class="ivu-table-cell table-expand f-color tc">
                                    <span>{{item.hos}} </span>
                                    <img v-if="item.show[1]" src="../../assets/image/angle-double-down.png" alt="">
                                    <img v-else src="../../assets/image/angle-double-up.png" alt="">
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                    <span>{{item.phone}} </span>
                                </div>
                            </td>
                            <td class="">
                                <div class="ivu-table-cell">
                                    <Button @click="show(item)">明细</Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-show="item.show[0]">
                            <td colspan="8" class="ivu-table-expanded-cell">
                                <div>
                                    <Table class="box-shadow" border :columns="columns1" :data="data1"></Table>
                                </div>
                            </td>
                        </tr>
                        <tr v-show="item.show[1]">
                            <td colspan="8" class="ivu-table-expanded-cell">
                                <div>
                                    <h3 class="csu-expand-num">品规数（{{item.num}}）条</h3>
                                    <Table class="box-shadow" border :columns="columns1" :data="data1"></Table>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="body_empty" v-if="data1.length==0">
                        暂无数据
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                columns1: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        width: 100,
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        width: 100,
                        title: '权限',
                        key: 'age',
                        align: 'center'

                    },
                    {
                        // width: 100,
                        title: '状态',
                        key: 'state',
                        align: 'center'

                    },
                    {
                        // width: 150,
                        title: '品规数',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '医疗机构',
                        key: 'hos',
                        align: 'center'
                    },
                    {
                        title: '手机号',
                        key: 'phone',
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
                                        // size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '明细')
                            ]);
                        }
                    },

                ],
                data1: [
                    {
                        name: '张三张三',
                        age: 18,
                        state: '正常',
                        num: 30,
                        hos: 40,
                        phone: 13261000445,
                        date: '2016-10-03'
                    },
                    {
                        name: '李四',
                        age: 24,
                        state: '正常',
                        num: 30,
                        hos: 40,
                        phone: 13261000445,
                        date: '2016-10-01'
                    },
                ]
            }
        },
        methods: {
            // len  一行几个可点击
            toggle: function (ind, z, len) {
                let status = !this.data1[ind].show[z]
                let arr = [];
                for (let i = 0; i < len; i++) {
                    if (i == z) {
                        arr[i] = status;
                    } else {
                        arr[i] = false;
                    }
                }
                this.$set(this.data1[ind], 'show', arr)
            },
        },
        created() {
            this.data1.forEach((list, i) => {
                this.$set(this.data1[i], 'show', [false, false])
            })
        }
    }
</script>


