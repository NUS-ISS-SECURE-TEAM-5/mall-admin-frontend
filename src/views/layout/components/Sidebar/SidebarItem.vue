<template>
  <div class="menu-wrapper">
    <!-- 遍历 routes -->
    <template v-for="item in routes" :key="item?.name || item?.path">
      <template v-if="shouldDisplayParent(item)">
        <router-link
          v-if="shouldRenderAsSingle(item)"
          :to="resolveFullPath(item.children[0])"
        >
          <el-menu-item
            :index="resolveFullPath(item.children[0])"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <svg-icon
              v-if="item.children[0]?.meta?.icon"
              :icon-class="item.children[0].meta.icon"
            ></svg-icon>
            <span>
              {{ item.children[0]?.meta?.title }}
            </span>
          </el-menu-item>
        </router-link>

        <el-submenu
          v-else
          :index="resolveFullPath(item)"
          :popper-append-to-body="false"
        >
          <template #title>
            <svg-icon
              v-if="item.meta?.icon"
              :icon-class="item.meta.icon"
            ></svg-icon>
            <span>{{ item.meta?.title }}</span>
          </template>

          <template
            v-for="child in item.children.filter((c) => !c.hidden)"
            :key="child.path"
          >
            <sidebar-item
              v-if="child.children"
              :routes="filteredChildren(item)"
              :base-path="resolveFullPath(item)"
            ></sidebar-item>
            <a
              v-else-if="child?.path?.startsWith('http')"
              :href="child.path"
              target="_blank"
            >
              <el-menu-item :index="`${item.path}/${child.path}`">
                <svg-icon
                  v-if="child?.meta?.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span v-if="child?.meta?.title">{{ child.meta.title }}</span>
              </el-menu-item>
            </a>
            <router-link v-else :to="`${item.path}/${child.path}`">
              <el-menu-item :index="`${item.path}/${child.path}`">
                <svg-icon
                  v-if="child?.meta?.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span v-if="child?.meta?.title">{{ child.meta.title }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  components: { SidebarItem: () => import("./SidebarItem.vue") },
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  methods: {
    resolveFullPath(routeItem) {
      if (routeItem.path.startsWith("/")) {
        return routeItem.path.replace(/\/+$/, "");
      }
      const fullPath = `${this.basePath}/${routeItem.path}`.replace(
        /\/+/g,
        "/"
      );
      return fullPath.replace(/\/+$/, "");
    },
    hasOneShowingChildren(children, parent) {
      const showing = children?.filter((c) => !c.hidden) || [];
      return !parent?.alwaysShow && showing.length === 1;
    },
    shouldDisplayParent(item) {
      if (!item || item.hidden) return false;
      if (item.meta?.alwaysShow) return true;
      const hasVisibleChildren = item.children?.some(
        (child) => !child.hidden && child.meta?.title
      );
      return hasVisibleChildren;
    },
    shouldRenderAsSingle(parent) {
      if (parent.meta?.alwaysShow) return false;

      const visibleChildren =
        parent.children?.filter(
          (child) => !child.hidden && child.meta?.title
        ) || [];

      return visibleChildren.length === 1;
    },
    filteredChildren(parent) {
      return (
        parent.children?.filter(
          (child) => !child.hidden && child.meta?.title
        ) || []
      );
    },
  },
};
</script>
