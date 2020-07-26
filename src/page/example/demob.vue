<template>
<div>
	<Dropdown  trigger="click"  style="margin-left: 20px"  placement="bottom-start">
        
        <Button type="primary" >
            传世会员
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
            <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
            <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
            <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
            <DropdownItem>深圳传世般若科技有限公司</DropdownItem>
            <div style="text-align: right;margin:10px;">
                <Page :current="2" :total="50" simple></Page>
            </div>
        </DropdownMenu>
    </Dropdown>
    <br/>
    
</div>
</template>
<script>
export default {
	data () {
        return {
            visible: false
        }
    },
    methods: {
        handleOpen () {
            this.visible = true;
        },
        handleClose () {
            this.visible = false;
        }
    }
}
</script>