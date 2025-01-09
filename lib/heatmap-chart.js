'use strict';

// Counter to generate unique IDs
const stats = require('./stats');
const utils = require("./utils");
let heatmapCounter = 0;

function heatmapChartTag(hexo, args = [], content = '') {
    // Generate a unique ID for the heatmap container
    const heatmapId = `heatmapChart-${heatmapCounter++}`;

    const dailyPostsByYear = stats.calculatePostStatistics(hexo).dailyPostsByYear;
    const dataJson = JSON.stringify(dailyPostsByYear);

    // Parse arguments with defaults
    const [theme = 'random', inputYear, footerArg] = args.map(arg => (arg ? arg.trim() : ''));
    const years = Object.keys(dailyPostsByYear).reverse();
    const initYear = years.includes(inputYear) ? inputYear : years[0];
    const hideFooter = footerArg?.toLowerCase() === 'no-footer';

    const chartTitle = utils.getChartTitle(content);
    const footer = utils.getFooter(hideFooter);

    const backgroundColorLight = hexo.config.stats_echarts?.background_color.light_mode || 'transparent';
    const backgroundColorDark = hexo.config.stats_echarts?.background_color.dark_mode || '#333';

    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const heatmapChartDom = document.getElementById('${heatmapId}');
                if (heatmapChartDom) {
                    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const backgroundColor = isDarkMode ? '${backgroundColorDark}' : '${backgroundColorLight}';
                    let heatmapChart = echarts.init(heatmapChartDom, isDarkMode ? 'dark' : 'light');
                    const cellSize = [16, 16];

                    const groupedData = ${dataJson};
                    const years = Object.keys(groupedData).reverse();
                    const initYear = '${initYear}' || years[0];

                    // Define color themes
                    const themes = {
                        oceanic: ['#A6D8E8', '#6FB3D2', '#4A90BF', '#2E6A8E', '#1A4461'],
                        forest: ['#ACE7AE', '#8FD694', '#69C16D', '#549F57', '#3A7D3E'],
                        sunset: ['#FFD1A6', '#FFA07A', '#FF6F52', '#D94A3D', '#A62B2B'],
                        earthy: ['#E3C8A8', '#C4A076', '#A57C52', '#7A5A3A', '#4E3A28'],
                        pastel: ['#F5D5E6', '#E8B8D0', '#D18FB8', '#A86A8E', '#7A4A61'],
                        golden: ['#FFEBB5', '#FFD966', '#FFB74D', '#D18F4A', '#A66B2B'],
                        berry: ['#F4C2D7', '#E88BB3', '#D94A7A', '#A62B5C', '#7A1F3D'],
                        charcoal: ['#E0E0E0', '#9E9E9E', '#616161', '#424242', '#212121'],
                    };

                    // Function to get a random theme
                    function getRandomTheme() {
                        const themeKeys = Object.keys(themes);
                        const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
                        return themes[randomKey];
                    }

                    // Use the specified theme or default to 'random'
                    const colors = themes['${theme}'.toLowerCase()] || getRandomTheme();

                    const chartOptions = {
                        backgroundColor: backgroundColor,
                        tooltip: {
                            position: 'top',
                            confine: true,
                            formatter: params => \`\${params.value[0]}: \${params.value[1]} Article\${params.value[1] !== 1 ? 's' : ''}\`,
                        },
                        calendar: {
                            top: '13%',
                            left: '2%',
                            right: '8%',
                            range: initYear,
                            cellSize: cellSize,
                            splitLine: { lineStyle: { color: '#E0E0E0', width: 1 } },
                            itemStyle: { borderWidth: 1, borderColor: '#E0E0E0', color: backgroundColor },
                            dayLabel: { show: false },
                            monthLabel: { show: true },
                            yearLabel: { show: false },
                        },
                        visualMap: {
                            show: true,
                            right: '8%',
                            bottom: '5%',
                            type: 'piecewise',
                            orient: 'horizontal',
                            text: ['More', 'Less'],
                            min: 0,
                            max: Math.max(...groupedData[initYear].map(item => item[1])),
                            inRange: { color: colors },
                        },
                        legend: {
                            type: 'scroll',
                            icon: 'none',
                            data: years,
                            orient: 'vertical',
                            top: '5%',
                            right: 'right',
                            itemWidth: 20,
                            itemHeight: 20,
                            itemGap: 10,
                            pageIconSize: 10,
                            pageTextStyle: { fontSize: 14 },
                            selectedMode: 'single',
                        },
                        series: years.map(year => ({
                            type: 'heatmap',
                            coordinateSystem: 'calendar',
                            data: groupedData[year],
                            name: year,
                            emphasis: { disabled: true },
                            silent: year !== initYear,
                        })),
                    };

                    heatmapChart.setOption(chartOptions);

                    heatmapChart.dispatchAction({
                        type: 'legendSelect',
                        name: initYear,
                    });

                    // Function to handle legend selection changes
                    const handleLegendSelectChanged = function(params) {
                        const selectedYear = Object.keys(params.selected).find(key => params.selected[key]);
                        if (selectedYear && groupedData[selectedYear]) {
                            heatmapChart.setOption({
                                calendar: { range: selectedYear },
                                visualMap: {
                                    max: Math.max(...groupedData[selectedYear].map(item => item[1])),
                                },
                                series: years.map(year => ({
                                    type: 'heatmap',
                                    coordinateSystem: 'calendar',
                                    data: groupedData[year],
                                    name: year,
                                    emphasis: { disabled: true },
                                    silent: year !== selectedYear,
                                })),
                            });
                        }
                    };
                    
                    const handleClick = function(params) {
                        if (params.componentType === 'series') {
                            const [year, month] = params.value[0].split('-');
                            window.location.href = '/archives/' + year + '/' + month;
                        }
                    };

                    heatmapChart.on('legendselectchanged', handleLegendSelectChanged);
                    heatmapChart.on('click', handleClick);

                    // Listen for theme changes
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                        heatmapChart.dispose();
                        heatmapChart = echarts.init(heatmapChartDom, event.matches ? 'dark' : 'light');
                        const newBackgroundColor = event.matches ? '${backgroundColorDark}' : '${backgroundColorLight}';
                        chartOptions.backgroundColor = newBackgroundColor;
                        chartOptions.calendar.itemStyle.color = newBackgroundColor;
                        heatmapChart.setOption(chartOptions);
                        
                        // Re-select the initial year
                        heatmapChart.dispatchAction({
                            type: 'legendSelect',
                            name: initYear,
                        });

                        // Reattach the event listeners
                        heatmapChart.on('legendselectchanged', handleLegendSelectChanged);
                        heatmapChart.on('click', handleClick);
                    });
                }
            });
        </script>
        <div style="width: 100%">
            <!-- Title -->
            ${chartTitle}
            <!-- Heatmap Chart -->
            <div id="${heatmapId}" style="width: 100%; height: 200px; overflow-x: auto; overflow-y: hidden;"></div>
            <!-- Footer -->
            ${footer}
        </div>
    `;
}

module.exports = { heatmapChartTag };