/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {getCrawlerStatus} from "../../api/adminApis";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {css} from "@emotion/react";
import {useIsMounted} from "../../hooks";
import {Divider, Stack} from "@mui/material";
import CrawledSources from "./CrawledSources";
import RefreshButton from "./RefreshButton";
import CheckIcon from "./CheckIcon";
import {getDatesBetween} from "../../utils/utils";

const CrawlerStatus = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getCrawlerStatus();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['crawlerStatus'],
        getData,
        {
            placeholderData: {
                crawlId: "",
                isCrawling: false,
                isCrawlCycle: false,
                crawlingSource: null,
                crawledSources: [],
                lastCrawl: null,
                pageNumber: 0,
                pageCount: 0,
                pageLinks: [],
                isPaused: false,
                pausedFrom: 0,
                totalPausedDuration: 0,
            },
            keepPreviousData: true,
            refetchInterval: 2 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['crawlerStatus']);
        isMounted.current && setRefreshing(false);
    }

    if (isError) {
        return (
            <div css={style.chart}>
                <span css={style.title}> Crawler Status </span>
                --Error--
            </div>
        );
    }

    return (
        <div css={style.chart}>
            <span css={style.title}> Crawler Status </span>

            <RefreshButton
                refreshing={refreshing || isLoading || isFetching}
                onClick={_onRefresh}
            />

            <div css={style.fieldsContainer}>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >
                    <span css={style.field}>
                    isActive: <CheckIcon isCheck={data.isCrawling}/>
                    </span>

                    <span css={style.field}>
                        isCrawlCycle: <CheckIcon isCheck={data.isCrawlCycle}/>
                    </span>

                    <span css={style.field}>
                        isPaused: <CheckIcon isCheck={data.isPaused}/>
                    </span>

                    {data.isPaused && <span css={style.field}>
                        pauseDuration: {(Date.now() - data.pausedFrom) / (60 * 1000)}
                    </span>
                    }

                    <span css={style.field}>CrawlId: {data.crawlId.toString()}</span>
                </Stack>


                {
                    data.isCrawling && data.crawlingSource && <Stack
                        direction={"row"}
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem/>}
                        alignItems={"baseline"}
                    >
                        <span css={style.field}>sourceName: {data.crawlingSource.name}</span>
                        <span css={style.field}>startTime: {data.crawlingSource.startTime}</span>
                        <span css={style.field}>pausedDuration: {data.crawlingSource.pausedDuration}</span>
                        <span css={style.field}>crawlMode: {data.crawlingSource.crawlMode}</span>
                        <span css={style.field}>pageNumber: {data.pageNumber}/{data.pageCount}</span>
                    </Stack>
                }

                {
                    data.isCrawling && <>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Page Links </span>
                        </div>
                        {
                            data.pageLinks.map(item => (
                                <span key={item.url} css={style.field}>
                                    pageNumber: {item.pageNumber} | Link: {item.url} | time: {getDatesBetween(new Date(), item.time).minutes} | state: {item.state} | stateTime: {getDatesBetween(new Date(), item.stateTime).minutes}
                                </span>
                            ))
                        }
                    </>
                }

                {
                    data.isCrawling && <CrawledSources
                        crawledSources={data.crawledSources}
                        fieldStyle={style.field}
                    />
                }

                <Divider css={style.divider} orientation="horizontal" flexItem/>
            </div>

            {
                data.lastCrawl && <>
                    <div css={style.titleContainer}>
                        <span css={style.title2}> Last Crawl </span>
                    </div>

                    <Stack
                        direction={"row"}
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem/>}
                        alignItems={"baseline"}
                    >
                        <span css={style.field}>
                                isCrawlCycle: <CheckIcon isCheck={data.lastCrawl.isCrawlCycle}/>
                        </span>
                        <span css={style.field}>crawlId: {data.lastCrawl.crawlId}</span>
                        <span css={style.field}>crawlMode: {data.lastCrawl.crawlMode}</span>
                    </Stack>

                    <Stack
                        direction={"row"}
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem/>}
                        alignItems={"baseline"}
                    >
                        <span css={style.field}>startTime: {data.lastCrawl.startTime}</span>
                        <span css={style.field}>endTime: {data.lastCrawl.endTime}</span>
                        <span css={style.field}>time: {data.lastCrawl.time}</span>
                    </Stack>

                    {
                        (data.lastCrawl.error || data.lastCrawl.errorMessage) && <Stack
                            direction={"row"}
                            spacing={2}
                            divider={<Divider orientation="vertical" flexItem/>}
                            alignItems={"baseline"}
                        >
                              <span css={style.field}>
                                error: <CheckIcon isCheck={data.lastCrawl.error}/>
                              </span>
                            <span css={style.field}>errorMessage: {data.lastCrawl.errorMessage}</span>
                        </Stack>
                    }

                    {
                        data.lastCrawl.crawledSources.length > 0 && <CrawledSources
                            crawledSources={data.lastCrawl.crawledSources}
                            fieldStyle={style.field}
                        />
                    }

                </>
            }
        </div>
    );
};

const style = {
    chart: css({
        flex: 1,
        margin: '20px',
        padding: '20px',
        webkitBoxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    title: css({
        fontSize: '22px',
        fontWeight: 600,
    }),
    title2: css({
        fontSize: '18px',
        fontWeight: 600,
    }),
    titleContainer: css({
        marginTop: '20px',
        marginBottom: '10px',
    }),
    chartTitle: css({
        marginBottom: '20px',
    }),
    fieldsContainer: css({
        marginTop: '10px',
        marginLeft: '10px',
    }),
    fieldContainer: css({
        display: 'flex',
        alignItems: 'center',
    }),
    field: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '7px',
    }),
    divider: css({
        marginTop: '20px',
    }),
}


export default CrawlerStatus;
