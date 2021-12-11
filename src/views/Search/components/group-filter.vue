<template>
  <div class="group-filter" v-if="filterList && filterList.length > 0">
    <template v-for="(fil, index) in filterList">
      <div
        class="filter-item"
        v-if="fil.items && fil.items.length > 0"
        :key="index"
      >
        <div class="filter-item_title">
          <span>{{ fil.title }}</span>
        </div>
        <div class="filter-item_options">
          <div class="filter-item_option" v-for="(item,i) in fil.items" :key="item.id + item.name">
            <el-checkbox
              v-model="item.selected"
              @change="onFilterChange($event, index, i)"
              >{{ item.name }}</el-checkbox
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "group-filter",
  props: {
    filterList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onFilterChange(e, fil_index, item_index) {
      this.$emit("onFilterChange", { e, fil_index, item_index });
    },
  },
};
</script>

<style lang='scss' scoped>
.group-filter {
  .filter-item {
    margin-bottom: 10px;
    .filter-item_title {
      margin-bottom: 10px;
      font-weight: bold;
    }
    .filter-item_options {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .filter-item_option {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>