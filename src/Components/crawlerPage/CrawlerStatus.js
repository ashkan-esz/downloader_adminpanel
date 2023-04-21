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
import {getPassedTime} from "../../utils/utils";
import PauseCrawlerButton from "./PauseCrawlerButton";
import StopCrawlerButton from "./StopCrawlerButton";

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
                crawlId: '',
                isCrawling: false,
                isCrawlCycle: false,
                isManualStart: false,
                crawledSources: [],
                crawlingSource: null,
                totalPausedDuration: 0,
                startTime: 0,
                endTime: 0,
                duration: 0,
                error: false,
                errorMessage: '',
                crawlMode: 0,
                pageNumber: 0,
                pageCount: 0,
                pageLinks: [],
                pauseData: {
                    isPaused: false,
                    pauseReason: '',
                    isManualPause: false,
                    manualPauseDuration: 0,
                    pausedFrom: 0,
                },
                crawlerState: 'ok',
                forceResume: false,
                forceStop: false,
                limits: {
                    totalMemory: 0,
                    memory: 0,
                    cpu: 0,
                    pauseDuration: 0,
                }
            },
            keepPreviousData: true,
            refetchInterval: 1000,
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

            <PauseCrawlerButton isCrawling={data.isCrawling && !data.forceStop} isPaused={data.pauseData.isPaused}/>
            <StopCrawlerButton isCrawling={data.isCrawling && !data.forceStop}/>

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
                        isManualStart: <CheckIcon isCheck={data.isManualStart}/>
                    </span>

                    <span css={style.field}>CrawlId: {data.crawlId.toString()}</span>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                    marginTop={1}
                >
                    <span css={style.field}>CrawlerState: {data.crawlerState}</span>
                    <span css={style.field}>MemoryLimit: {data.limits.memory}/{data.limits.totalMemory} MB</span>
                    <span css={style.field}>CpuLimit: {data.limits.cpu.toString()}%</span>
                    <span css={style.field}>pauseDurationLimit: {data.limits.pauseDuration.toString()}Min</span>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                    marginTop={1}
                >
                    <span css={style.field}>
                        isPaused: <CheckIcon isCheck={data.pauseData.isPaused}/>
                    </span>

                    <span css={style.field}>
                        isManualPause: <CheckIcon isCheck={data.pauseData.isManualPause}/>
                    </span>

                    <span css={style.field}>
                        pauseDuration: {data.pauseData.isPaused ? ((Date.now() - data.pauseData.pausedFrom) / (60 * 1000)).toFixed(1) : 0}
                    </span>

                    <span css={style.field}>
                        manualPauseDuration: {data.pauseData.manualPauseDuration}
                    </span>

                    <span css={style.field}>
                        pauseReason: {data.pauseData.pauseReason || "NONE"}
                    </span>
                </Stack>

                {
                    data.isCrawling && data.crawlingSource && <Stack
                        direction={"row"}
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem/>}
                        alignItems={"baseline"}
                        marginTop={1}
                    >
                        <span css={style.field}>sourceName: {data.crawlingSource.name}</span>
                        <span css={style.field}>
                            startTime: {getPassedTime(data.crawlingSource.startTime).minutes} ago
                        </span>
                        <span css={style.field}>
                            pausedDuration: {(data.crawlingSource.pausedDuration / 60).toFixed(1)}
                        </span>
                        <span css={style.field}>crawlMode: {data.crawlingSource.crawlMode}</span>
                        <span css={style.field}>pageNumber: {data.pageNumber}/{data.pageCount.toFixed(0)}</span>
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
                                    Page: {item.pageNumber} ||
                                    Link: {item.url.replace('https://', '').replace(/\/$/, '')} ||
                                    Time: {getPassedTime(item.time).minutes} ||
                                    State: {item.state}, ({getPassedTime(item.stateTime).minutes} ago)
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
