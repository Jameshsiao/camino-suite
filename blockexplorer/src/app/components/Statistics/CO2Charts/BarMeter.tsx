import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sortBy from 'lodash/sortBy';

const BarMeter = ({ dataSeries, darkMode, titleText }) => {

    const sortByAndLoadBar = (data) => {
        let sortedData = sortBy(data, o => -o.value);
        let dataChart = sortedData.map((dat, index) => {
            return {
                name: dat.chain,
                y: dat.value,
                drilldown: dat.chain,
                color: `hsl(221, 48%, ${(index + 1) * (80/sortedData.length)}%)`
            }
        });
        return dataChart;
    }

   const options = {
        chart: {
            type: 'column',
            backgroundColor: 'rgba(0,0,0,0)',
        },
        title: {
            align: 'center',
            text: titleText,
            style: {
                color: darkMode ? 'white' : 'black'
            }
        },
        /*
        subtitle: {
            align: 'left',
            text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
        },
        */
        xAxis: {
            type: 'category',
            labels: {
                useHTML: true,
                formatter: function (obj) {
                    let index = obj.pos;
                    return `<span style="color:${darkMode == true ? 'white' : 'black'}">${obj.value}</span>`;
                },
            }
        },
        yAxis: {
            title: {
                text: 'CO2',
                style: {
                    color: darkMode ? 'white' : 'black'
                }
            },
            labels: {
                useHTML: true,
                formatter: function (obj) {
                    let index = obj.pos;
                    return `<span style="color:${darkMode == true ? 'white' : 'black'}">${obj.value}</span>`;
                },
            }

        },
        legend: {
            enabled: false
        },

        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                borderColor: 'transparent',
                name: "",
                data: sortByAndLoadBar(dataSeries)
            }
        ]
    } 
    

    return (
        <div>
            <br />
            <HighchartsReact type="" highcharts={Highcharts} options={options} />
        </div>
    );
};

export default BarMeter;