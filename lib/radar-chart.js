'use strict';

// Counter to generate unique IDs
const stats = require('./stats');
const utils = require("./utils");
let radarChartCounter = 0;

function radarChartTag(hexo, args = [], content = '') {
    // Generate a unique ID for the radar chart container
    const radarChartId = `radarChart-${radarChartCounter++}`;

    // Parse arguments with defaults
    const [entity = 'tags', displayLimitArg, footerArg] = args.map(arg => arg ? arg.trim() : '');
    const hideFooter = footerArg?.toLowerCase() === 'no-footer';
    const displayLimit = parseInt(displayLimitArg, 10) || 6;

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
                <!-- Footer -->
                ${footer}
            </div>
        `;
    }

    const filteredData = data.slice(0, displayLimit);
    const valuesArray = filteredData.map(item => item.value);
    const maxValue = Math.max(...valuesArray);
    const radarIndicator = JSON.stringify(filteredData.map(item => ({
        max: maxValue,
        name: item.name,
    })));
    const dataJson = JSON.stringify(valuesArray);

    const backgroundColorLight = hexo.config.stats_echarts?.background_color.light_mode || 'transparent';
    const backgroundColorDark = hexo.config.stats_echarts?.background_color.dark_mode || '#333';

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const radarChartDom = document.getElementById('${radarChartId}');
                const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                let radarChart = echarts.init(radarChartDom, isDarkMode ? 'dark' : 'light');

                const chartOptions = {
                    backgroundColor: isDarkMode ? '${backgroundColorDark}' : '${backgroundColorLight}',
                    radar: {
                        indicator: ${radarIndicator},
                    },
                    series: [
                        {
                            type: 'radar',
                            data: [{
                                value: ${dataJson},
                                name: '${entity}',
                            }],
                        }
                    ]
                };

                radarChart.setOption(chartOptions);
                
                const handleClick = function (params) {
                    window.location.href = '/${redirect}/';
                };

                radarChart.on('click', handleClick);

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                    radarChart.dispose();
                    radarChart = echarts.init(radarChartDom, event.matches ? 'dark' : 'light');
                    chartOptions.backgroundColor = event.matches ? '${backgroundColorDark}' : '${backgroundColorLight}';
                    radarChart.setOption(chartOptions);
                    radarChart.on('click', handleClick);
                });
            });
        </script>
        <div style="width: 100%">
            <!-- Title -->
            ${chartTitle}
            <!-- Radar Chart Container -->
            <div id="${radarChartId}" style="width: 100%; height: 400px; overflow-x: auto; overflow-y: auto;"></div>
            <!-- Footer -->
            ${footer}
        </div>
    `;
}

module.exports = { radarChartTag };