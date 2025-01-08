'use strict';

// Counter to generate unique IDs
const stats = require('./stats');
let pieChartCounter = 0;

function pieChartTag(hexo, args = [], content = '') {
    // Generate a unique ID for the pie chart container
    const pieChartId = `pieChart-${pieChartCounter++}`;

    // Parse arguments with defaults
    const [entity = 'tags', displayLimitArg, roseType = 'radius', footerArg] = args.map(arg => arg ? arg.trim() : '');
    const hideFooter = footerArg?.toLowerCase() === 'no-footer';
    const displayLimit = parseInt(displayLimitArg, 10) || 10;

    const chartTitle = content === '' ? '' :`
        <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
            ${content}
        </div>
    `;

    // Conditionally render the footer
    const footer = hideFooter
        ? ''
        : `
            <div style="text-align: center; font-size: 12px; color: #666; margin-top: 10px; margin-bottom: 20px;">
                Powered by <a href="https://github.com/erispyu/hexo-stats-echarts" style="color: inherit; text-decoration: none;" target="_blank">hexo-stats-echarts</a>
            </div>
        `;

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
                        bottom: '2%',
                    },
                    series: [
                        {
                            type: 'pie',
                            label: {
                                position: 'outside',
                                formatter: '{b}: {c}({d}%)', // {a}: series name; {b}: data name; {c}: data value; {d}: percentage
                            },
                            radius: ['15%', '60%'],
                            center: ['50%', '50%'],
                            roseType: '${roseType}',
                            itemStyle: {
                                borderRadius: 8
                            },
                            data: ${dataJson},
                        }
                    ]
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
            <div id="${pieChartId}" style="width: 100%; height: 400px; overflow-x: auto; overflow-y: auto;"></div>
            <!-- Footer (Conditional) -->
            ${footer}
        </div>
    `;
}

module.exports = { pieChartTag };