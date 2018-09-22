<template>
  <div :class="[$style.wrapper]">
    <!-- temp header, later in component -->
    <div :class="[$style.header]">
      Система проведения олимпиад. Загрузка заданий.
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
html, body {
  font-family: Arial, Helvetica;
  font-size: 18px;
  padding: 0;
  margin: 0;
}
</style>

<style lang="scss" module scoped>
@import "./styles/base.scss";

.wrapper {
}

.header {
  text-align: center;
  padding: $x2;
}
</style>
