/** @jsxImportSource @emotion/react */
import {
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer, Area, AreaChart
} from "recharts";
import {css} from "@emotion/react";

function Chart({title, data, xAxisDataKey, dataKey, dataKey2, grid}) {

    return (
        <div css={style.chart}>
            <h3 css={style.chartTitle}> {title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{top: 0, right: 0, left: 0, bottom: 30}}
                >
                    <defs>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="active" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="red" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="red" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey={xAxisDataKey}/>
                    {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5"/>}
                    <Tooltip/>
                    <Area type="monotone" dataKey={dataKey} stroke="#8884d8" fillOpacity={1} fill="url(#total)"/>
                    {dataKey2 &&
                        <Area type="monotone" dataKey={dataKey2} stroke="#8884d8" fillOpacity={1} fill="url(#active)"/>}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

const style = {
    chart: css({
        margin: '20px',
        padding: '20px 20px 30px 20px',
        webkitBoxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        height: '30vh',
    }),
    chartTitle: css({
        marginBottom: '20px',
    }),
}

export default Chart;
