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
        return radarChartForPostTags(hexo, radarChartId, hideFooter, displayLimit, chartTitle, footer)
    } else if (entity === 'years') {
        return radarChartForMonthlyPostsByYear(hexo, radarChartId, hideFooter, displayLimit, chartTitle, footer);
    } else {
        return `
            <div style="width: 100%;">
                <div>ERROR: invalid entity</div>
                <!-- Footer -->
                ${footer}
            </div>
        `;
    }
}

function radarChartForPostTags(hexo, radarChartId, hideFooter, displayLimit, chartTitle, footer) {
    const data = stats.calculatePostStatistics(hexo).sortedTags;
    const filteredData = data.slice(0, displayLimit);
    const valuesArray = filteredData.map(item => item.value);
    const maxValue = Math.max(...valuesArray);
    const radarIndicator = JSON.stringify(filteredData.map(item => ({
        max: maxValue,
        name: item.name,
    })));
    const dataJson = JSON.stringify(valuesArray);

    const colorScheme = hexo.config.stats_echarts?.color_scheme || 'auto';
    const backgroundColorLight = hexo.config.stats_echarts?.background_color.light_mode || 'transparent';
    const backgroundColorDark = hexo.config.stats_echarts?.background_color.dark_mode || '#333';

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const radarChartDom = document.getElementById('${radarChartId}');
                let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if ('${colorScheme}' === 'light') {
                    isDarkMode = false;
                } else if ('${colorScheme}' === 'dark') {
                    isDarkMode = true;
                }
                let radarChart = echarts.init(radarChartDom, isDarkMode ? 'dark' : 'light');

                const chartOptions = {
                    backgroundColor: isDarkMode ? '${backgroundColorDark}' : '${backgroundColorLight}',
                    radar: {
                        indicator: ${radarIndicator},
                    },
                    tooltip: {
                        trigger: 'item',
                        confine: true,
                    },
                    series: [
                        {
                            type: 'radar',
                            areaStyle: {},
                            data: [{
                                value: ${dataJson},
                                name: 'Post Tags',
                            }],
                        }
                    ]
                };

                radarChart.setOption(chartOptions);
                
                const handleClick = function (params) {
                    window.location.href = '/tags/';
                };

                radarChart.on('click', handleClick);

                // Listen for scheme changes if color shceme is 'auto'
                if ('${colorScheme}' === 'auto') {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                        radarChart.dispose();
                        radarChart = echarts.init(radarChartDom, event.matches ? 'dark' : 'light');
                        chartOptions.backgroundColor = event.matches ? '${backgroundColorDark}' : '${backgroundColorLight}';
                        radarChart.setOption(chartOptions);
                        radarChart.on('click', handleClick);
                    });
                }
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

function radarChartForMonthlyPostsByYear(hexo, radarChartId, hideFooter, displayLimit, chartTitle, footer) {
    const data = stats.calculatePostStatistics(hexo).monthlyPostsByYear;

    const maxValue = data.reduce((max, item) => {
        const currentMax = Math.max(...item.value);
        return currentMax > max ? currentMax : max;
    }, -Infinity);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const radarIndicator = JSON.stringify(monthNames.map(month => ({
        max: maxValue,
        name: month
    })));

    const dataJson = JSON.stringify(data);

    const colorScheme = hexo.config.stats_echarts?.color_scheme || 'auto';
    const backgroundColorLight = hexo.config.stats_echarts?.background_color.light_mode || 'transparent';
    const backgroundColorDark = hexo.config.stats_echarts?.background_color.dark_mode || '#333';

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const radarChartDom = document.getElementById('${radarChartId}');
                let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if ('${colorScheme}' === 'light') {
                    isDarkMode = false;
                } else if ('${colorScheme}' === 'dark') {
                    isDarkMode = true;
                }
                let radarChart = echarts.init(radarChartDom, isDarkMode ? 'dark' : 'light');

                const chartOptions = {
                    backgroundColor: isDarkMode ? '${backgroundColorDark}' : '${backgroundColorLight}',
                    radar: {
                        indicator: ${radarIndicator},
                    },
                    legend: {
                        bottom: '1%',
                    },
                    tooltip: {
                        trigger: 'item',
                        confine: true,
                    },
                    series: [
                        {
                            type: 'radar',
                            data: ${dataJson},
                        }
                    ]
                };

                radarChart.setOption(chartOptions);
                
                const handleClick = function (params) {
                    window.location.href = '/archives/' + encodeURIComponent(params.name)
                };

                radarChart.on('click', handleClick);

                // Listen for scheme changes if color shceme is 'auto'
                if ('${colorScheme}' === 'auto') {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                        radarChart.dispose();
                        radarChart = echarts.init(radarChartDom, event.matches ? 'dark' : 'light');
                        chartOptions.backgroundColor = event.matches ? '${backgroundColorDark}' : '${backgroundColorLight}';
                        radarChart.setOption(chartOptions);
                        radarChart.on('click', handleClick);
                    });
                }
            });
        </script>
        <div style="width: 100%">
            <!-- Title -->
            ${chartTitle}
            <!-- Radar Chart Container -->
            <div id="${radarChartId}" style="width: 100%; height: 425px; overflow-x: auto; overflow-y: auto;"></div>
            <!-- Footer -->
            ${footer}
        </div>
    `;
}

module.exports = { radarChartTag };