exports.firstLevelRoute = `export default [
  {
    path: "/firstLevel",
    name: "firstLevelName",
    component: () => import("@/views/firstLevel/firstLevelComponentName.index.vue"),
    meta: {
      requiresAuth: true,
      title: "firstLevelName"
    },
    children: []
  }
]`
exports.secondLevelRoute = `const demo = {
  path: "secondLevel",
  name: "firstLevelName-secondLevelName",
  component: () => import("@/views/firstLevel/pages/secondLevel/secondLevelComponentName.index.vue"),
  meta: {
    requiresAuth: true,
    title: "secondLevelName"
  }
}`
