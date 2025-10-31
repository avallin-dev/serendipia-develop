import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const ExpiredMonthChart = (dataBar) => {

  const labels = dataBar.databar.map((d) => d.membresia.toUpperCase())
  const total = dataBar.databar.map((d) => d.cantidad)
  const options = {
    chart: {
      type: 'bar',
      height: '1000px',
    },
    title: {
      text: 'Facturación por planes',
    },
    subtitle: {
      // text: 'Source: <a ' +
      //   'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
      //   'target="_blank">Wikipedia.org</a>'
    },
    xAxis: {
      categories: labels,
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Facturación (millions)',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
      gridLineWidth: 0,
    },
    tooltip: {
      // valueSuffix: ' millions',
    },
    plotOptions: {
      bar: {
        borderRadius: '25%',
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
    },
    // legend: {
    //   layout: 'vertical',
    //   align: 'right',
    //   verticalAlign: 'top',
    //   x: -40,
    //   y: 80,
    //   floating: false,
    //   borderWidth: 1,
    //   backgroundColor: 'var(--highcharts-background-color, #ffffff)',
    //   shadow: true
    // },
    credits: {
      enabled: false,
    },
    series: [
      {
        color: {
          linearGradient: [0, 0, 0, 1500],
          stops: [[0, 'purple'], [0.25, 'violet'], [0.50, 'red'], [0.75, 'orange'], [1, 'yellow']],
        },
        name: 'Facturación',
        data: total,
      }],
  }


  return (<div className={'border-2 rounded-sm border-slate-100'}>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </div>)
}
export default ExpiredMonthChart
