"use strict";

const { log } = hexo;
const heatmapChart = require("./lib/heatmap-chart");
const pieChart = require("./lib/pie-chart");

hexo.extend.injector.register(
    "head_begin",
    '<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>',
);

hexo.extend.tag.register(
    'heatmapchart',
    function (args, content) {
        return heatmapChart.heatmapChartTag(hexo, args, content);
    },
    { ends: true },
    { async: true },
);
log.info("Register hexo tag plugin: heatmapchart");

hexo.extend.tag.register(
    'piechart',
    function (args, content) {
        return pieChart.pieChartTag(hexo, args, content);
    },
    { ends: true },
    { async: true },
);
log.info("Register hexo tag plugin: piechart");