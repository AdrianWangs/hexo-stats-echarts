# hexo-stats-echarts

> `hexo-stats-echarts` is a lightweight and visually appealing Hexo plugin designed to help you visualize and analyze your blog's statistical data in an interactive and elegant way.
> With just **one line of code**, you can effortlessly insert beautiful, customizable charts into **any** Hexo page or article.

## Brief Introduction

Built on the [Hexo Tag Plugins](https://hexo.io/api/tag) and powered by the versatile [Apache ECharts library](https://echarts.apache.org/zh/index.html), this plugin transforms raw blog stats—such as post frequency, tags, and categories—into beautiful, customizable charts.

Whether you're tracking your writing habits or showcasing your blog's activity, this plugin provides a seamless and engaging experience.

This plugin is inspired by [hexo-graph](https://github.com/codepzj/hexo-graph). If you're looking for something different, feel free to explore it as well!

## Supported Charts

### Heatmap Chart

Visualize your daily posts with an interactive heatmap.

**Quick Start**: Paste the following line into **any** place of your hexo post or page!

```nunjucks
{% heatmapchart %}Blog Heatmap{% endheatmapchart %}
```

Detailed usage and more samples can be found here: [Heatmap Chart](https://blog.erispyu.fun/hexo-stats-echarts/heatmap-chart/)

### [Pie Chart](https://blog.erispyu.fun/hexo-stats-echarts/pie-chart/)

Visualize your site data by tags or in years.

**Quick Start**: Paste the following line into **any** place of your hexo post or page!
- Stats by Tags:
```nunjucks
{% piechart tags %}Tags Pie Chart{% endpiechart %}
```

- Stats in Years:
```nunjucks
{% piechart years %}Years Pie Chart{% endpiechart %}
```

Detailed usage and more samples can be found here: [Pie Chart](https://blog.erispyu.fun/hexo-stats-echarts/pie-chart/)

## Planned Features (TODO)
- **Radar Chart**: Display the most frequently used post tags in a radar chart format.
- **Sunburst Chart**: Visualize nested post categories with a sunburst chart.

## Feedback

If you find this plugin useful, consider giving it a ⭐ on [GitHub](https://github.com/erispyu/hexo-stats-echarts) to show your support and help others discover it!

Feel free to contribute or suggest new features! Your feedback and support are greatly appreciated.