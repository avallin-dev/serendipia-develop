import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const AlumnChart = (barData) => {

  const data = barData.barData
  const horas = barData.horas.map((h) => `${h}:00`)

  const options = {
    colors: ['#fbbf24', '#fb923c', '#ef4444', '#e11d48', '#4f46e5', '#4338ca', '#701a75'], chart: {
      type: 'column', // styledMode:true,
    }, title: {
      text: 'Concurrencia de alumnos por hora',
    }, // subtitle: {
    //   text:
    //     'Source: <a target="_blank" ' +
    //     'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
    // },
    xAxis: {
      categories: horas, crosshair: true, accessibility: {
        description: 'Horario',
      },
    }, yAxis: {
      min: 0, title: {
        text: 'Total alumnos por hora',
      },
    }, tooltip: {}, plotOptions: {
      column: {
        pointPadding: 0.2, borderWidth: 0,

      },
    }, series: [{
      color: {
        linearGradient: [0, 0, 0, 400], stops: [[0, 'red'], [0.5, 'orange'], [1, 'green']],
      }, name: 'Concurrencia', data: data,
    }],
  }


  return (<div className={'border-2 rounded-sm border-slate-100'}>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </div>)
}
export default AlumnChart


