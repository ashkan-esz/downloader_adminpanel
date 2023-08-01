/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import Chart from '../../Components/chart';
import {css} from "@emotion/react";
import {getServerAnalysisInTimes} from "../../api/adminApis";
import {CrawlerStatus, CrawlerSources, StartCrawler, ApiKeys, StartCrawlUrl} from "../../Components/crawlerPage";
import {Grid} from "@mui/material";

function Crawler() {
    const [crawlingHistory, setCrawlingHistory] = useState([]);
    const [sourcesHistory, setSourcesHistory] = useState({});

    useEffect(() => {
        let start = new Date();
        start.setDate(start.getDate() - 14);
        let end = new Date();
        getServerAnalysisInTimes('crawlerLogs', start, end, 0, 240).then(res => {
            if (res !== null) {
                let t = res.map(item => item.crawledSources).flat(1);
                let shit = t.reduce((rv, x) => {
                    (rv[x.name] = rv[x.name] || []).push(x);
                    return rv;
                }, {});
                setSourcesHistory(shit);
                if (res !== 'error') {
                    setCrawlingHistory(res);
                }
            }
        });
    }, []);

    return (
        <div css={style.home}>
            <CrawlerStatus/>
            <StartCrawler/>
            <StartCrawlUrl/>
            <ApiKeys/>
            <CrawlerSources/>
            <Chart
                data={crawlingHistory}
                title="Crawler Analytics - Last 14 days"
                grid
                xAxisDataKey={"startTime"}
                dataKey={"duration"}
                dataKey2={"totalPausedDuration"}
            />

            <Grid
                container
                spacing={0}
            >
                {
                    Object.keys(sourcesHistory).map((sourceName) => (
                        <Grid
                            item
                            key={sourceName}
                            xs={6}
                        >
                            <Chart
                                data={sourcesHistory[sourceName]}
                                title={`${sourceName} - Last 14 days`}
                                grid
                                xAxisDataKey={"startTime"}
                                dataKey={"duration"}
                                dataKey2={"pausedDuration"}
                            />
                        </Grid>
                    ))
                }
            </Grid>

        </div>
    );
}

const style = {
    home: css({
        flex: 4,
    }),
}

export default Crawler;
