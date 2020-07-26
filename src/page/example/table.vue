<style lang="less">
</style>
<template>
    <div>
        <section style="margin-left: 600px">
            <Poptip  placement="bottom-end" width="400">
                <span class="reject-warn-box">驳回详情</span>
                <div class="reject-warn-con" slot="content">
                    <h3>医疗机构-驳回理由</h3>
                    <div class="reject-warn-con-item">
                        <div class="repo-img">
                        </div>
                        <div class="repo-con">
                            <p>北京大学人民医院</p>
                            <span>驳回理由驳回理由驳回理由驳回理由驳回理由 <br> 驳回理由驳回理由驳回理 由驳回理由驳回理由驳回理由驳回理由驳回理由。</span>
                        </div>
                    </div>
                </div>
            </Poptip>
        </section>
        <h3 class="f20"> 表格 </h3>
        <section class="pb30">
            <Table border :columns="columns1" :data="data1"></Table>
        </section>
        <section class="pb30" style="width: 50%">
            <Table border :columns="columns2" :data="data1"></Table>
        </section>
        <section>
            <Table border :columns="columns" :data="data">
                <template slot-scope="{ row, index }" slot="name">
                    <Input type="text" v-model="editName" v-if="editIndex === index"/>
                    <span v-else>{{ row.name }} </span>
                </template>

                <template slot-scope="{ row, index }" slot="age">
                    <Input type="text" v-model="editAge" v-if="editIndex === index"/>
                    <span v-else>{{ row.age }}</span>
                </template>

                <template slot-scope="{ row, index }" slot="birthday">
                    <Input type="text" v-model="editBirthday" v-if="editIndex === index"/>
                    <span v-else>{{ getBirthday(row.birthday) }}</span>
                </template>

                <template slot-scope="{ row, index }" slot="address">
                    <Input type="text" v-model="editAddress" v-if="editIndex === index"/>
                    <span v-else>{{ row.address }}</span>
                </template>

                <template slot-scope="{ row, index }" slot="action">
                    <div v-if="editIndex === index">
                        <Button @click="handleSave(index)">保存</Button>
                        <Button @click="editIndex = -1">取消</Button>
                    </div>
                    <div v-else>
                        <Button @click="handleEdit(row, index)">操作</Button>
                    </div>
                </template>
            </Table>
        </section>
        <h3 class="f20"> 分页 </h3>
        <section class="pb30">
            <Page :total="100" show-elevator/>
        </section>
        <section class="pb30">
            <Page :current="2" :total="50" simple/>
        </section>
        <section class="pb30">
            <Dropdown style="margin-left: 20px">
                <Button type="primary"><img src="../../assets/image/staff.png" alt=""> <span class="vm">传世会员</span>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem>安徽</DropdownItem>
                    <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
                    <DropdownItem>武汉链享有限公司</DropdownItem>
                    <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
                    <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
                    <Page :current="1" :total="50" simple/>
                </DropdownMenu>
            </Dropdown>
        </section>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                columns: [
                    {
                        width: 100,
                        title: '姓名',
                        slot: 'name'
                    },
                    {
                        title: '年龄',
                        slot: 'age'
                    },
                    {
                        title: '出生日期',
                        slot: 'birthday'
                    },
                    {
                        title: '地址',
                        slot: 'address'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data: [
                    {
                        name: '王小明',
                        age: 18,
                        birthday: '919526400000',
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        birthday: '696096000000',
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        birthday: '563472000000',
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        birthday: '687024000000',
                        address: '深圳市南山区深南大道'
                    }
                ],
                editIndex: -1,  // 当前聚焦的输入框的行数
                editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
                editAge: '',  // 第二列输入框
                editBirthday: '',  // 第三列输入框
                editAddress: '',  // 第四列输入框
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
                ],
                columns2: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        width: 100,
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        width: 100,
                        title: '权限',
                        key: 'age',
                        align: 'center'

                    },
                    {
                        width: 200,
                        title: '状态',
                        key: 'state',
                        align: 'center'

                    },
                    {
                        width: 150,
                        title: '品规数',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        width: 150,

                        title: '医疗机构',
                        key: 'hos',
                        align: 'center'
                    },
                    {
                        width: 250,

                        title: '手机号',
                        key: 'phone',
                        align: 'center'
                    },
                    {
                        width: 150,
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
            }
        },
        methods: {
            handleEdit(row, index) {
                this.editName = row.name;
                this.editAge = row.age;
                this.editAddress = row.address;
                this.editBirthday = row.birthday;
                this.editIndex = index;
            },
            handleSave(index) {
                this.data[index].name = this.editName;
                this.data[index].age = this.editAge;
                this.data[index].birthday = this.editBirthday;
                this.data[index].address = this.editAddress;
                this.editIndex = -1;
            },
            getBirthday(birthday) {
                const date = new Date(parseInt(birthday));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            }
        }
    }
</script>


