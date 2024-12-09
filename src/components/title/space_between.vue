<template>
    <div class="TitleBody">
        <div class="Title-Left">
            <slot name="Title-Left"></slot>
        </div>
        <div class="Title-Right">
            <slot name="Title-Right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpaceBetween',
    data() {
        return {}
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.TitleBody {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 15px;
    font-weight: bold;
    color: #333;
    .Title-Left {
        cursor: pointer;
        display: inline-block;
    }
    .Title-Right {
        cursor: pointer;
        display: inline-block;
    }
}
</style>
