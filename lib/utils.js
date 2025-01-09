function getChartTitle(content) {
    return content === '' ? '' : `
        <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
            ${content}
        </div>
    `;
}

function getFooter(hideFooter = false) {
    // Conditionally render the footer
    return hideFooter ? '' : `
        <div style="text-align: center; font-size: 12px; color: #666; margin-top: 10px; margin-bottom: 20px;">
            Powered by <a href="https://github.com/erispyu/hexo-stats-echarts" style="color: inherit; text-decoration: none;" target="_blank">hexo-stats-echarts</a>
        </div>
    `;
}

// 导出函数
module.exports = {
    getChartTitle,
    getFooter
};