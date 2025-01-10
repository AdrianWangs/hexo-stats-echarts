'use strict';

const stats = require('./stats');
const utils = require("./utils");
let pieChartCounter = 0;

function pieChartTag(hexo, args = [], content = '') {
    // Generate a unique ID for the pie chart container
    const pieChartId = `pieChart-${pieChartCounter++}`;

    // Parse arguments with defaults
    const [entity = 'tags', displayLimitArg, roseType = 'radius', footerArg] = args.map(arg => arg ? arg.trim() : '');
    const hideFooter = footerArg?.toLowerCase() === 'no-footer';
    const displayLimit = parseInt(displayLimitArg, 10) || 10;

    const chartTitle = utils.getChartTitle(content);
    const footer = utils.getFooter(hideFooter);

    // Check entity and prepare data
    let data = [];
    let redirect = entity;
    if (entity === 'tags') {
        data = stats.calculatePostStatistics(hexo).sortedTags;
    } else if (entity === 'years') {
        data = stats.calculatePostStatistics(hexo).sortedYears;
        redirect = 'archives';
    } else {
        return `
            <div style="width: 100%;">
                <div>ERROR: invalid entity</div>
                <!-- Footer (Conditional) -->
                ${footer}
            </div>
        `;
    }
    const dataJson = JSON.stringify(data.slice(0, displayLimit));
    const sortedLegends = JSON.stringify(data
        .map(item => item.name)
        .sort((a, b) => a.localeCompare(b)));

    const backgroundColorLight = hexo.config.stats_echarts?.background_color.light_mode || 'transparent';
    const backgroundColorDark = hexo.config.stats_echarts?.background_color.dark_mode || '#333';

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const pieChartDom = document.getElementById('${pieChartId}');
                const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                let pieChart = echarts.init(pieChartDom, isDarkMode ? 'dark' : 'light');

                const chartOptions = {
                    backgroundColor: isDarkMode ? '${backgroundColorDark}' : '${backgroundColorLight}',
                    legend: {
                        bottom: '1%',
                    },
                    series: [
                        {
                            type: 'pie',
                            label: {
                                position: 'outside',
                                formatter: '{b}: {c}({d}%)', // {a}: series name; {b}: data name; {c}: data value; {d}: percentage
                            },
                            radius: ['15%', '60%'],
                            roseType: '${roseType}',
                            itemStyle: {
                                borderRadius: 8
                            },
                            data: ${dataJson},
                        }
                    ]
                };
                
                if ('${entity}' === 'years') {
                    chartOptions.legend.data = ${sortedLegends};
                };

                pieChart.setOption(chartOptions);
                
                const handleClick = function (params) {
                    window.location.href = '/${redirect}/' + encodeURIComponent(params.name);
                };

                pieChart.on('click', handleClick);

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                    pieChart.dispose();
                    pieChart = echarts.init(pieChartDom, event.matches ? 'dark' : 'light');
                    chartOptions.backgroundColor = event.matches ? '${backgroundColorDark}' : '${backgroundColorLight}';
                    pieChart.setOption(chartOptions);
                    pieChart.on('click', handleClick);
                });
            });
        </script>
        <div style="width: 100%">
            <!-- Title -->
            ${chartTitle}
            <!-- Pie Chart Container -->
            <div id="${pieChartId}" style="width: 100%; height: 425px; overflow-x: auto; overflow-y: auto;"></div>
            <!-- Footer -->
            ${footer}
        </div>
    `;
}

module.exports = { pieChartTag };