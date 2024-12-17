<template>
    <div v-if="userinfo" class="user-picture">
        <el-dropdown trigger="click" @command="handleCommand">
            <el-tooltip class="item" effect="dark" :content="username" placement="left">
                <img class="picture" :src="userinfo.picture" :alt="username">
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-view" command="view">
                    查看信息
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" divided command="set">
                    设置信息
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" command="setpassword">
                    更改密码
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" divided command="logout">
                    退出账号
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <userinfoUpdateDialog
            :visible.sync="updateVisible"
            :phone="phone"
            :userinfo="updateUserInfo"
            @success="updateSuccess"
        />
        <userinfoViewDialog
            :visible.sync="viewVisible"
            :userinfo="viewUserInfo"
        />
        <userinfoUpdatePasswordDialog
            :visible.sync="updatePasswordVisible"
            :phone="phone"
        />
    </div>
</template>

<script>
import userinfoUpdateDialog from "@/components/user/userinfo/update_dialog.vue"
import userinfoViewDialog from "@/components/user/userinfo/view_dialog.vue"
import userinfoUpdatePasswordDialog from "@/components/user/userinfo/update_password_dialog.vue"

export default {
    name: "user-picture",
    components: {
        userinfoUpdateDialog,
        userinfoViewDialog,
        userinfoUpdatePasswordDialog,
    },
    data() {
        return {
            updateVisible: false,
            updateUserInfo: {},

            viewVisible: false,
            viewUserInfo: {},

            updatePasswordVisible: false,
        }
    },
    computed: {
        userinfo() {
            return this.$store.getters["user/getUser"]
        },
        username() {
            return this.userinfo.username
        },
        phone() {
            return this.userinfo.phone
        },
    },
    created() {
        // console.log(this.userinfo)
    },
    methods: {
        handleCommand(command) {
            if (command == "view") {
                this.view()
            } else if (command == "set") {
                this.setUserInfo()
            } else if (command == "setpassword") {
                this.setPassword()
            } else if (command == "logout") {
                this.logout()
            }
        },
        view() {
            this.viewVisible = true;
            this.viewUserInfo = {
                ...this.userinfo,
            }
        },
        setUserInfo() {
            this.updateVisible = true;
            this.updateUserInfo = {
                ...this.userinfo,
            }
        },
        updateSuccess(userinfo) {
            this.$store.commit("user/setInfo", userinfo)
        },
        setPassword() {
            this.updatePasswordVisible = true;
        },
        logout() {
            this.$store.commit('user/setInfo', null)
            this.$store.commit('user/setToken', null)
            this.$router.push("/login")
        },
    },
}
</script>

<style lang="less" scoped>
.user-picture {
    border: 1px solid #ccc;
    .picture {
        height: 100%;
        width: 100%;
    }
}
.el-dropdown {
    height: 100%;
}
</style>
