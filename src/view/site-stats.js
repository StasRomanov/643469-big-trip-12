import Abstract from "./abstract";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {ChartType, TRANSFER_TYPE, TypeEmoji} from "../const";
import {getTimeDifference} from "../util/data-function";

export default class SiteStats extends Abstract {
  constructor(waypoints) {
    super();
    this._chartData = this._createChartData(waypoints);
    this._moneyChart = null;
    this._timeSpendChart = null;
    this._timeSpendChart = null;
    this._setCharts();
  }

  getTemplate() {
    return (
      `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
        </div>
      </section>`
    );
  }

  removeElement() {
    super.removeElement();
    this._removeCharts();
  }

  _removeCharts() {
    this._moneyChart = null;
    this._timeSpendChart = null;
    this._timeSpendChart = null;
  }

  _setCharts() {
    this._removeCharts();
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    this._moneyChart = this._renderChart(
        moneyCtx,
        ChartType.MONEY,
        ((val) => `€ ${val}`)
    );
    this._transportChart = this._renderChart(
        transportCtx,
        ChartType.TRANSPORT,
        (val) => `${val}x`
    );
    this._timeSpendChart = this._renderChart(
        timeSpendCtx,
        ChartType.TIME_SPENT,
        (val) => `${getTimeDifference(new Date(0), new Date(val))}`
    );
  }

  _renderChart(ctx, text, formatter) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._chartData[text].labels,
        datasets: [{
          data: this._chartData[text].data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          barThickness: 44,
          minBarLength: 100
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter
          }
        },
        title: {
          display: true,
          text,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _createChartData(waypoints) {
    const transportTypes = TRANSFER_TYPE;
    const chartMap = {
      [ChartType.MONEY]: {},
      [ChartType.TRANSPORT]: {},
      [ChartType.TIME_SPENT]: {}
    };

    waypoints.forEach((waypoint) => {
      if (chartMap[ChartType.MONEY][waypoint.type]) {
        chartMap[ChartType.MONEY][waypoint.type] += waypoint.price;
      } else {
        chartMap[ChartType.MONEY][waypoint.type] = waypoint.price;
      }

      if (chartMap[ChartType.TRANSPORT][waypoint.type]) {
        chartMap[ChartType.TRANSPORT][waypoint.type]++;
      } else {
        if (transportTypes.includes(waypoint.type)) {
          chartMap[ChartType.TRANSPORT][waypoint.type] = 1;
        }
      }

      if (chartMap[ChartType.TIME_SPENT][waypoint.type]) {
        chartMap[ChartType.TIME_SPENT][waypoint.type] += Number(getTimeDifference(waypoint.startTime, waypoint.endTime, true));
      } else {
        chartMap[ChartType.TIME_SPENT][waypoint.type] = Number(getTimeDifference(waypoint.startTime, waypoint.endTime, true));
      }
    });

    return Object.entries(chartMap).map(([key, items]) => {
      items = [...Object.entries(items)].sort((a, b) => b[1] - a[1]).reduce((result, [name, value]) => {
        result.labels.push(`${TypeEmoji.get(name)} ${name.toUpperCase()}`);
        result.data.push(value);
        return result;
      }, {labels: [], data: []});
      return ([key, items]);
    }).reduce((result, [key, items]) => {
      result[key] = items;
      return result;
    }, {});
  }
}
