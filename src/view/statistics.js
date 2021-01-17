import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {getMoney, getEventsNumber, getTimeSpend} from "../utils/statistics.js";
import {EVENT_TYPES} from "../utils/events.js";
import {StatisticsChartType} from "../const.js";

const BAR_HEIGHT = 55;

const chartTemplate = (chartLabels, chartTitle, chartValueFormatter, chartData) => {
  return {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
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
          formatter: chartValueFormatter
        }
      },
      title: {
        display: true,
        text: `${chartTitle}`,
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
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};

const createStatisticsTemplate = (eventTypes) => {
  return `<section class="statistics" id="stats">
    <h2 class="visually-hidden">Trip statistics</h2>
    ${Object.values(StatisticsChartType).map((chartType) => `<div class="statistics__item statistics__item--${chartType}">
      <canvas class="statistics__chart  statistics__chart--${chartType}" width="900" height ="${BAR_HEIGHT * eventTypes.length}"></canvas>
    </div>`).join(``)}
  </section>`;
};

export default class StatisticsView extends SmartView {
  constructor(events) {
    super();

    this._data = events;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._existedEventTypes = EVENT_TYPES.filter((type) => getEventsNumber(this._data, type) !== 0);
    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._existedEventTypes);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const labels = this._existedEventTypes.map((type) => type.toUpperCase());
    const moneyChartData = this._existedEventTypes.map((type) => getMoney(this._data, type));
    const typeChartData = this._existedEventTypes.map((type) => getEventsNumber(this._data, type));
    const timeSpendChartData = this._existedEventTypes.map((type) => getTimeSpend(this._data, type));

    this._moneyChart = new Chart(moneyCtx, chartTemplate(labels, `MONEY`, (val) => `€ ${val}`, moneyChartData));
    this._typeChart = new Chart(typeCtx, chartTemplate(labels, `TYPE`, (val) => `${val}x`, typeChartData));
    this._timeChart = new Chart(timeCtx, chartTemplate(labels, `TIME-SPEND`, (val) => `${val}H`, timeSpendChartData));
  }
}
