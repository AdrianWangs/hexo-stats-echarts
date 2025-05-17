function getChartTitle(content) {
    return content === '' ? '' : `
        <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
            ${content}
        </div>
    `;
}

function getFooter(hideFooter = false) {
    // Conditionally render the footer
    return '';
}

// 导出函数
module.exports = {
    getChartTitle,
    getFooter
};
