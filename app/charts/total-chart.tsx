import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const TotalChart = (pieData) => {
  const seriesData = [{}]
  const data = pieData.pieTrainerData?.datasets[0].data || pieData.pieTrainerData
  const labels = pieData.pieTrainerData.labels

  data.forEach((item, index) => {
    seriesData.push({
      y: item,
      name: labels[index],
    })
  })

  const options = {
    colors: [
      '#fbbf24', '#fb923c', '#ef4444', '#e11d48',
      '#4f46e5', '#4338ca', '#701a75',
    ],
    chart: {
      type: 'pie',
      zooming: {
        type: 'xy',
      },
      panning: {
        enabled: true,
        type: 'xy',
      },
      panKey: 'shift',
    },
    title: {
      text: pieData.chartTitle,
      align: 'left',
      style: {
        fontSize: '32px',
        weight: 'normal',
      }
    },
    tooltip: {
      // valueSuffix: '%'
      // format: '{series.name}',
    },
    // subtitle: {
    //   text:
    //     'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
    // },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        showInLegend: true,
        dataLabels: [{
          enabled: true,
          distance: 20,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontStyle: 'italic',
          },
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: '2em',
            opacity: 0.7,
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10,
          },
        }],
      },
    },
    series: [
      {
        name: 'Facturaci&oacuten Total',
        // colorByPoint: true,
        data: seriesData,
      },
    ],
  }

  return (
    <div className={'border-2 rounded-sm border-slate-100'}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default TotalChart