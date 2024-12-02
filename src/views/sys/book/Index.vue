<template lang="pug">
.sysbook
  | 123
  router-view
</template>

<script setup>
</script>

<style lang="less">
.sysbook {
  .editBtn {
    display: block;
    margin: 5px 5px 5px auto;
    margin-left: auto;
  }

  .group {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>