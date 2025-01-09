"use strict";

const { log } = hexo;

const {heatmapChartTag} = require("./lib/heatmap-chart");
const {pieChartTag} = require("./lib/pie-chart");
const {radarChartTag} = require("./lib/radar-chart");

hexo.extend.injector.register(
    "head_begin",
    '<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>',
);

hexo.extend.tag.register(
    'heatmapchart',
    function (args, content) {
        return heatmapChartTag(hexo, args, content);
    },
    { ends: true },
    { async: true },
);
log.info("Register hexo tag plugin: heatmapchart");

hexo.extend.tag.register(
    'piechart',
    function (args, content) {
        return pieChartTag(hexo, args, content);
    },
    { ends: true },
    { async: true },
);
log.info("Register hexo tag plugin: piechart");

hexo.extend.tag.register(
    'radarchart',
    function (args, content) {
        return radarChartTag(hexo, args, content);
    },
    { ends: true },
    { async: true },
);
log.info("Register hexo tag plugin: radarchart");