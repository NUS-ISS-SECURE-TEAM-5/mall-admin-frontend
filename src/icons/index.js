import SvgIcon from "@/components/SvgIcon"; // svg组件

const requireAll = (requireContext) =>
  requireContext.keys().forEach(requireContext);
const req = require.context("./svg", false, /\.svg$/);
requireAll(req);

export default function registerIcons(app) {
  app.component("svg-icon", SvgIcon);
}
