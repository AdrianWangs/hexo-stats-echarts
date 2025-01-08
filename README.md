# Hexo-Stats-ECharts

> **hexo-stats-echarts** is a lightweight and visually stunning Hexo plugin designed to help you effortlessly visualize and analyze your blog's statistical data. With just **one line of code**, you can seamlessly integrate beautiful, customizable charts into **any** Hexo page or article.

<div align="right">
  Language:
  🇺🇸
  <a title="Chinese" href="docs/zh-CN/README.md">🇨🇳</a>
</div>

## Overview

Built on the [Hexo Tag Plugins](https://hexo.io/api/tag) framework and powered by the versatile [Apache ECharts library](https://echarts.apache.org/zh/index.html), this plugin transforms raw blog statistics—such as post frequency, tags, and categories—into elegant, interactive charts.

The charts dynamically adapt to your site's theme, switching between `dark mode` and `light mode` based on your browser settings. Whether you're tracking your writing habits or showcasing your blog's activity, this plugin delivers a seamless and engaging experience.

Inspired by [hexo-graph](https://github.com/codepzj/hexo-graph), this plugin offers a fresh take on data visualization for Hexo blogs. If you're looking for alternative solutions, feel free to explore hexo-graph as well!

## Installation

To install the plugin, run the following command in your Hexo project directory:

```bash
npm install hexo-stats-echarts
```

## Supported Charts

### Heatmap Chart

Visualize your daily posting activity with an interactive heatmap.

**Quick Start**: Insert the following code snippet into **any** Hexo post or page:

```nunjucks
{% heatmapchart %}Blog Heatmap{% endheatmapchart %}
```

For detailed usage instructions and examples, visit: [Heatmap Chart Documentation](https://blog.erispyu.fun/hexo-stats-echarts/heatmap-chart/)

### Pie Chart

Visualize your blog's data by tags or publication years.

**Quick Start**: Insert the following code snippets into **any** Hexo post or page:

- **Stats by Tags**:
```nunjucks
{% piechart tags %}Tags Pie Chart{% endpiechart %}
```

- **Stats by Years**:
```nunjucks
{% piechart years %}Years Pie Chart{% endpiechart %}
```

For detailed usage instructions and examples, visit: [Pie Chart Documentation](https://blog.erispyu.fun/hexo-stats-echarts/pie-chart/)

## Planned Features (TODO)

- **Documentation Updates**: Add detailed guides on heatmap themes, pie chart arguments, post tag blacklists, and chart background color customization.
- **Radar Chart**: Display the most frequently used post tags in a radar chart format.
- **Sunburst Chart**: Visualize nested post categories with a sunburst chart.

## Feedback & Support

If you find this plugin useful, consider giving it a ⭐ on [GitHub](https://github.com/erispyu/hexo-stats-echarts) to show your support and help others discover it!

We welcome contributions and feature suggestions! Your feedback and support are greatly appreciated. Feel free to open an issue or submit a pull request on GitHub.