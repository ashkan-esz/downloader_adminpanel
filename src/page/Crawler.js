/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import Chart from '../Components/chart';
import {css} from "@emotion/react";
import {getCrawlerHistory} from "../api/adminApis";
import {CrawlerStatus, CrawlerSources, StartCrawler} from "../Components/crawlerPage";

function Crawler() {
    const [crawlingHistory, setCrawlingHistory] = useState([]);

    useEffect(() => {
        let start = new Date();
        start.setDate(start.getDate() - 14);
        let end = new Date();
        getCrawlerHistory(start, end, 0, 240).then(res => {
            if (res !== 'error') {
                setCrawlingHistory(res);
            }
        });
    }, []);

    return (
        <div css={style.home}>
            <CrawlerStatus/>
            <StartCrawler/>
            <CrawlerSources/>
            <Chart
                data={crawlingHistory}
                title="Crawler Analytics - Last 14 days"
                grid
                xAxisDataKey={"startTime"}
                dataKey={"endTime"}
                dataKey2={"time"}
            />
        </div>
    );
}

const style = {
    home: css({
        flex: 4,
    }),
}

export default Crawler;
