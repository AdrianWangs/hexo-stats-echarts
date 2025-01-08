const moment = require("moment");

function calculatePostStatistics(hexo) {
    const posts = hexo.locals.get("posts");
    const dailyPostsByYear = {};
    const yearlyPostCounts = {};
    const tagFrequency = {};
    const tagBlacklist = hexo.config.stats_echarts?.tag_blacklist || [];

    posts.forEach((post) => {
        const postDate = moment(post.date).format("YYYY-MM-DD");
        const [postYear] = postDate.split('-');

        // Count daily posts and group by year
        if (!dailyPostsByYear[postYear]) {
            dailyPostsByYear[postYear] = {};
        }
        dailyPostsByYear[postYear][postDate] = (dailyPostsByYear[postYear][postDate] || 0) + 1;

        // Count yearly posts
        yearlyPostCounts[postYear] = (yearlyPostCounts[postYear] || 0) + 1;

        // Count the frequency of each tag
        post.tags.data
            .filter((tag) => !tagBlacklist.includes(tag.name))
            .forEach((tag) => {
                tagFrequency[tag.name] = (tagFrequency[tag.name] || 0) + 1;
            });
    });

    // Transform dailyPostsByYear into the desired format
    const formattedDailyPostsByYear = Object.keys(dailyPostsByYear).reduce((acc, year) => {
        acc[year] = Object.entries(dailyPostsByYear[year]);
        return acc;
    }, {});

    // Transform and sort yearlyPostCounts
    const sortedYears = Object.entries(yearlyPostCounts)
        .map(([year, count]) => ({ name: year, value: count }))
        .sort((a, b) => b.value - a.value);

    // Format and sort tags
    const sortedTags = Object.entries(tagFrequency)
        .sort(([, frequencyA], [, frequencyB]) => frequencyB - frequencyA)
        .map(([tagName, frequency]) => ({ name: tagName, value: frequency }));

    return { dailyPostsByYear: formattedDailyPostsByYear, sortedYears, sortedTags };
}

module.exports = { calculatePostStatistics };