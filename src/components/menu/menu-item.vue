<template>
    <div>
        <div class="menu-button" :style="'padding-left: ' + paddingLift + 'px;'">
            <template v-if="hasChildren">
                <i class="menu-icon menu-pointer"
                    :class="(!Open ? 'el-icon-arrow-right' : 'el-icon-arrow-down')"
                    @click="change(Item)"></i>
            </template>
            <template v-else>
                <i class="menu-icon"></i>
            </template>
            <el-tooltip class="item" effect="dark" :content="Name" placement="bottom">
                <div
                    ref="menu-title"
                    class="menu-title menu-pointer"
                    :class="Checked ? 'checked' : ''"
                    @click="openTitle($event, Item)"
                >{{ Name }}</div>
            </el-tooltip>
        </div>
        <template v-if="hasChildren">
            <menu-item
                v-show="Open"
                v-for="it in Children" :key="it.id"
                :value="value"
                :menuItem="it"
                :name="name" :children="children"
                :paddingLift="paddingLift + 8"
                :layer="layer + 1"
                @initOpen="initOpen"
                @openOrClose="openOrClose" @select="select"
                @scrollFun="scrollFun"
            />
        </template>
    </div>
</template>

<script>
export default {
    name: 'MenuItem',
    props: {
        paddingLift: {
            type: Number,
            required: false,
            default: 16
        },
        menuItem: {
            type: Object,
            required: false,
            default: () => {}
        },
        layer: {
            type: Number,
            required: false,
            default: 0
        },
        name: {
            type: String,
            required: false,
            default: "name"
        },
        children: {
            type: String,
            required: false,
            default: "children"
        },
        value: {
            type: Object,
            required: false,
            default: () => {}
        },
    },
    data() {
        return {
            Open: false,
        }
    },
    computed: {
        MenuItem() {
            return this.menuItem
        },
        Item: {
            get() {
                return {
                    menu: this.MenuItem,
                    open: this.Open,
                }
            },
        },
        Name: {
            get() {
                return this.menuItem[this.name];
            },
            set(val) {
                this.menuItem.name = val;
            },
        },
        Children: {
            get() {
                return this.menuItem[this.children] || [];
            },
            set(val) {
                this.MenuItem.children = val;
            },
        },
        Checked: {
            get() {
                return this.value === this.MenuItem;
            },
        },
        hasChildren() {
            return this.Children && this.Children.length > 0
        }
    },
    mounted() {
        if (this.Checked) {
            this.$emit("initOpen", this.$refs["menu-title"])
        }
    },
    methods: {
        initOpen(el) {
            this.Open = true;
            this.$nextTick(() => {
                this.$emit("initOpen", el);
            })
        },

        change(menuitem) {
            this.Open = !this.Open;
            this.openOrClose(menuitem);
        },

        openTitle(el, menuitem) {
            if (this.hasChildren && !this.Open) {
                this.Open = true;
                this.openOrClose(menuitem);
            }
            this.select(menuitem);

            // 菜单滚动到需要位置
            this.scrollFun(el)
        },


        select(menuitem) {
            this.$emit("select", menuitem);
        },
        openOrClose(menuitem) {
            this.$emit("openOrClose", menuitem)
        },
        scrollFun(el) {
            this.$emit("scrollFun", el);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.menu-button {
    display: flex;
    align-items: center;

    .menu-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        cursor: pointer;
    }

    .menu-icon:hover {
        color: #008cff;
    }

    .menu-pointer {
        cursor: pointer;
    }

    .menu-title {
        font-size: 14px;
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .menu-title.checked {
        color: #008cff;
    }

    .menu-title:hover {
        color: #008cff;
        text-decoration: underline;
    }
}
</style>
