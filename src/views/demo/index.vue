<template>
    <div>
        <div id="asdf" style="width: 800px;height: 400px;background: black;">

        </div>
    </div>
    <!-- <div>
      <div id="chart" style="width: 800px;height: 400px; background: #000;"></div>
    </div> -->
</template>

<script>
import * as echarts from 'echarts';
function initDate(value) {
    if (value == "0") return ""
    const date = new Date(value)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}-${month}-${day}`
}
function formatDateTime(date, format) {
    date= new Date(date)
  const o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "D+": date.getDate(), // 日
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    "H+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    a: date.getHours() < 12 ? "上午" : "下午", // 上午/下午
    A: date.getHours() < 12 ? "AM" : "PM", // AM/PM
  };
  if (/(Y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
}
export default {
    name: 'App',
    data() {
        return {
            myCharts: null,
            resData: [
            {
                Id: 23,
                nodeName: "测试1",
                nodeType: "NORMAL",
                startTime: "2023-11-16 00:00:00",
                endTime: "2024-01-26 00:00:00",
                riskPoints: [
                {
                    riskPointName: "风险点1",
                    riskPointTime: "2023-11-17 12:00:00",
                    riskPointDescription: "描述1"
                },
                {
                    riskPointName: "风险点2",
                    riskPointTime: "2023-11-18 14:00:00",
                    riskPointDescription: "描述2"
                }
                ]
            },
            {
                Id: 24,
                nodeName: "测试2",
                nodeType: "OVER",
                startTime: "2023-10-16 00:00:00",
                endTime: "2024-12-26 00:00:00",
                riskPoints: []
            },
            {
                Id: 25,
                nodeName: "测试3",
                nodeType: "NORMAL",
                startTime: "2024-11-16 00:00:00",
                endTime: "2025-01-26 00:00:00",
                riskPoints: [
                {
                    riskPointName: "风险点1",
                    riskPointTime: "2024-11-17 12:00:00",
                    riskPointDescription: "描述1"
                },
                ]
            }
            ],
        }
    },
    mounted() {
        // var chartDom = document.getElementById('asdf');
        // var myChart = echarts.init(chartDom);


        // const option = {
        //     color: [
        //         "rgba(2, 179, 253, 1)",
        //         "rgba(255, 57, 57, 1)",
        //         "rgba(253, 189, 1, 1)",
        //     ],
        //     tooltip: {
        //         trigger: "axis",
        //         axisPointer: {  
        //             type: 'cross', 
        //         },
        //         position: "top",
        //         backgroundColor: "rgba(19,62,76,0.3)",
        //         borderColor: "rgba(64, 213, 228, 1)",
        //         padding: [6, 13, 6, 13],
        //         textStyle: {
        //             color: "#262626",
        //             fontSize: 12,
        //         },
        //         extraCssText:
        //             "box-shadow: 0px 3px 5px 0px rgba(19,68,84,1), inset 0px 0px 9px 0px rgba(64,213,228,1);",
        //         // 提示框自定义(鼠标移入)
        //         formatter: function (res) {
        //             console.log(res);
        //             let info =
        //                 '<span style="font-size: 12px;color: #fff;margin-bottom: 0px;">' +
        //                 res[0].name +
        //                 "</span>";
        //             let list = "";
        //             let name = `<span style="font-size: 12x;color:#fff;margin-right: 30px;">时间</span>`;
        //             let endTime = res[1].value != '0' ? res[1].value : res[2].value != '0' ? res[2].value : res[3].value != '0' ? res[3].value : '--'
        //             let num = `<span style="font-size: 12px;color: #fff">${initDate(res[0].value) +
        //                 "-" +
        //                 initDate(endTime)
        //                 }</span>`;
        //             list = `<p  style="margin: 4px 0;">${name + num}</p>`;
        //             let infoData = info + list;
        //             return infoData;
        //         },
        //     },
        //     legend: {
        //         data: ["正常节点", "关键节点", "超期节点"],
        //         right: 14,
        //         top: 4,
        //         itemWidth: 12,
        //         itemHeight: 12,
        //         textStyle: {
        //             color: "#E7F7FF",
        //         },
            
        //     },
        //     grid: {
        //         left: "6%",
        //         right: "5%",
        //         bottom: "0%",
        //         containLabel: true,
        //     },
        //     xAxis: {
        //         type: "time",
        //         position: "top", // x 轴位置
        //         axisLabel: {
        //             show: true,
        //             color: "#fff",
        //             formatter: function (val) {
        //                 return initDate(val)
        //             },
        //         },
        //         axisPointer: {
        //             link: {xAxisIndex: 'all'},
        //             label: {
        //                 backgroundColor: '#777',
        //                 // 文本标签文字的格式化器
        //                 formatter: function (v) {
        //                 // 逻辑写这里
        //                 console.log(v)
        //                     // return initDate(v.value);
        //                     return 456;
        //                 }
        //             },
        //         }
        //     },
        //     yAxis: {
        //         inverse: true, // y 轴数据翻转，该操作是为了保证项目一放在最上面，项目四在最下面
        //         type: "category",
        //         data: ["节点1", "节点2", "节点3", "节点4", "节点5", "节点6", "节点7"],
        //     },
        //     series: [
        //         //隐藏条(存储开始时间)
        //         {
        //             name: "",
        //             type: "bar",
        //             stack: "duration",
        //             itemStyle: {
        //                 color: "#041B23",
        //             },
        //             zlevel: -1, // zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
        //             z: 9, // z值小的图形会被z值大的图形覆盖，z相比zlevel优先级更低，而且不会创建新的 Canvas
        //             data: ["2023-09-04 00:00:00", "2023-10-03 00:00:00", "2023-10-29 00:00:00", "2023-11-01 00:00:00", "2023-11-07 00:00:00", "2023-11-16 00:00:00", "2023-12-07 00:00:00"],
        //         },
        //         //展示条(存储结束时间)
        //         {
        //             name: "正常节点",
        //             type: "bar",
        //             stack: "duration",
        //             zlevel: -1,//必须设置
        //             itemStyle: {
        //                 borderColor: "#041B23",
        //                 borderWidth: 2,
        //             },
            
        //             data: ["2023-10-14 23:00:00", "2023-11-03 23:00:00", "0", "2023-11-01 23:00:00", "0", "0", "0"],
        //         },
        //         {
        //             name: "关键节点",
        //             type: "bar",
        //             stack: "duration",
        //             zlevel: -1,//必须设置
        //             itemStyle: {
        //                 borderColor: "#041B23",
        //                 borderWidth: 2,
        //             },
            
        //             data: ["0", "0", "2023-11-06 23:00:00", "0", "2023-11-09 23:00:00", "0", "2024-01-18 23:00:00"],
        //         },
        //         {
        //             name: "超期节点",
        //             type: "bar",
        //             stack: "duration",
        //             zlevel: -1,//必须设置
        //             itemStyle: {
        //                 borderColor: "#041B23",
        //                 borderWidth: 2,
        //             },
            
        //             data: ["0", "0", "0", "0", "0", "2024-01-26 23:00:00", "0"],
        //         },
        //     ]
        // }

        // // option.yAxis.data = ["节点1", "节点2", "节点3", "节点4", "节点5", "节点6", "节点7"]
        
        // // option.series[0].data = ["2023-09-04 00:00:00", "2023-10-03 00:00:00", "2023-10-29 00:00:00", "2023-11-01 00:00:00", "2023-11-07 00:00:00", "2023-11-16 00:00:00", "2023-12-07 00:00:00"]
        // // option.series[1].data = ["2023-11-14 23:00:00", "2023-11-03 23:00:00", "0", "2023-11-01 23:00:00", "0", "0", "0"]
        // // option.series[2].data = ["0", "0", "2023-11-06 23:00:00", "0", "2023-11-09 23:00:00", "0", "2024-01-18 23:00:00"]
        // // option.series[3].data = ["0", "0", "0", "0", "0", "2024-01-26 23:00:00", "0"]

        // option.yAxis.data = ["节点1", "节点2", "节点3"]
        
        // option.series[0].data = ["2024-09-02 00:00:00", "2024-10-16 00:00:00", "2024-10-31 00:00:00"]
        // option.series[1].data = ["0", "0", "2024-11-07 23:00:00"]
        // option.series[2].data = ["0", "2024-10-31 23:00:00", "0"]
        // option.series[3].data = ["2024-10-16 23:00:00", "0", "0"]
        // // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);



        
        var charDom = document.getElementById("chart");
        this.myCharts = echarts.init(charDom);
        // this.getInfo();

        let option = {
            color: [
                "rgba(2, 179, 253, 1)",
                "rgba(255, 57, 57, 1)",
                "rgba(253, 189, 1, 1)",
            ],
            tooltip: {
                trigger: "axis",
                formatter: function (res) {
                    for (let i = 0; i < res.length; i++) {
                        const item = res[i];
                        if (item && item.componentType === 'markPoint') {
                            return `风险点：${item.seriesName}<br/>信息：${item.value}`;
                        }
                    }
        
                    if (res[0] && res[0].componentType === 'series') {
                        let info = '<span style="font-size: 12px;color: #fff;margin-bottom: 0px;">' +
                                res[0].name +
                            "</span>";
                        let list = "";
                        let name = `<span style="font-size: 12px;color:#fff;margin-right: 30px;">时间</span>`;
                        let endTime = res[0].value!= '0'? res[0].value : '--'
                        let num = `<span style="font-size: 12px;color: #fff">${
                            formatDateTime(res[0].value, "YYYY-MM-DD") +
                                "-" +
                            formatDateTime(endTime, "YYYY-MM-DD")
                        }</span>`;
                        list = `<p  style="margin: 4px 0;">${name + num}</p >`;
                        let infoData = info + list;
                        return infoData;
                    }
        
                    return '';
                },
                axisPointer: {
                    type: "shadow",
                },
                position: "top",
                backgroundColor: "rgba(19,62,76,0.3)",
                borderColor: "rgba(64, 213, 228, 1)",
                padding: [6, 13, 6, 13],
                textStyle: {
                    color: "#262626",
                    fontSize: 12,
                },
                extraCssText:
                    "box-shadow: 0px 3px 5px 0px rgba(19,68,84,1), inset 0px 0px 9px 0px rgba(64,213,228,1);",
            },
            legend: {
                data: ["正常节点", "关键节点", "超期节点"],
                right: 14,
                top: 4,
                itemWidth: 12,
                itemHeight: 12,
                textStyle: {
                    color: "#E7F7FF",
                },
            },
            grid: {
                left: "6%",
                right: "5%",
                bottom: "0%",
                containLabel: true,
            },
            xAxis: {
                type: "time",
                position: "top",
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: "rgba(255, 255, 255, 0.2)",
                    },
                },
                axisLabel: {
                    show: true,
                    color: "#fff",
                    formatter: function (val) {
                        return formatDateTime(val, "YYYY-MM-DD");
                    },
                },
            },
            yAxis: {
                inverse: true,
                type: "category",
                axisLabel: {
                    show: true,
                    color: "rgba(255, 255, 255, 0.65)",
                },
                data: [],
            },
            series: [
                {
                    name: "",
                    type: "bar",
                    stack: "duration",
                    itemStyle: {
                        color: "#041B23",
                    },
                    zlevel: -1,
                    z: 9,
                    data: [],
                }, {
                    name: "正常节点",
                    type: "bar",
                    stack: "duration",
                    zlevel: -1,
                    itemStyle: {
                        borderColor: "#041B23",
                        borderWidth: 2,
                    },
                    data: [],
                }, {
                    name: "关键节点",
                    type: "bar",
                    stack: "duration",
                    zlevel: -1,
                    itemStyle: {
                        borderColor: "#041B23",
                        borderWidth: 2,
                    },
                    data: [],
                }, {
                    name: "超期节点",
                    type: "bar",
                    stack: "duration",
                    zlevel: -1,
                    itemStyle: {
                        borderColor: "#041B23",
                        borderWidth: 2,
                    },
                    data: [],
                }, {
                    name: '风险点',
                    type: 'scatter',
                    markPoint: {
                        data: [],
                        symbol: 'circle',
                        symbolSize: 10,
                        itemStyle: {
                            color: 'red'
                        },
                        label: {
                            show: true
                        },
                        tooltip: {
                            formatter: function (params) {
                                return `<span style="font-size: 12px;color: #fff">风险点：${params.name}</span><br/>
                                    <span style="font-size: 12px;color: #fff">信息：${params.value}</span>`;
                            },
                            trigger: 'item'
                        }
                    }
                }
            ],
        };
        // 初始化风险点数据
        let riskPoints = [];
        this.resData.forEach((val) => {
            // 存储 y 轴数据
            option.yAxis.data.push(val.nodeName);
            // 存储开始时间
            option.series[0].data.push(formatDateTime(val.startTime, "YYYY-MM-DD 00:00:00"));
            // 存储结束时间
            if (val.nodeType === "NORMAL") {
                option.series[1].data.push(formatDateTime(val.endTime, "YYYY-MM-DD 23:59:59"));
                option.series[2].data.push("0");
                option.series[3].data.push("0");
            } else if (val.nodeType === "IMPORTANT") {
                option.series[2].data.push(formatDateTime(val.endTime, "YYYY-MM-DD 23:59:59"));
                option.series[1].data.push("0");
                option.series[3].data.push("0");
            } else if (val.nodeType === "OVER") {
                option.series[3].data.push(formatDateTime(val.endTime, "YYYY-MM-DD 23:59:59"));
                option.series[2].data.push("0");
                option.series[1].data.push("0");
            }
            // 存储风险点数据
            val.riskPoints.forEach((riskPoint) => {
                const timeFormatted = formatDateTime(riskPoint.riskPointTime, "YYYY-MM-DD");
                const coord = [timeFormatted, val.nodeName];
                riskPoints.push({
                    name: riskPoint.riskPointName,
                    coord: coord,
                    value: riskPoint.riskPointDescription
                });
            });
        });
        option.series[4].markPoint.data = riskPoints;
        // 使用刚指定的配置项和数据显示图表。
        this.myCharts.setOption(option);
    }
}
</script>

<style lang="less" scoped></style>
