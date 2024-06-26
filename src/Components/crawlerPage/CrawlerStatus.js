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
import {addHourToDate, getLeftTime, getPassedTime} from "../../utils/utils";
import PauseCrawlerButton from "./PauseCrawlerButton";
import StopCrawlerButton from "./StopCrawlerButton";
import RemoteBrowserItem from "./RemoteBrowserItem";

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
                disabledData: {
                    isEnvDisabled: false,
                    isDbDisabled: false,
                    isDbDisabled_temporary: false,
                    dbDisableDuration: 0,
                    dbDisableStart: 0,
                },
                disable: false,
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
                sourcePage: {
                    url: '',
                    state: '',
                    stateTime: 0,
                },
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
                constValues: {
                    concurrencyNumber: 0,
                    pauseDuration: 0,
                },
                limits: {
                    memory: {value: 0, limit: 0, total: 0},
                    cpu: {value: [0, 0, 0], limit: 100},
                    imageOperations: {value: 0, limit: 0},
                    trailerUpload: {value: 0, limit: 0},
                },
                domainChangeHandler: {
                    isActive: false,
                    startTime: 0,
                    endTime: 0,
                    duration: 0,
                    state: '',
                    stateTime: 0,
                    error: false,
                    errorMessage: '',
                    sources: [], //sourceName,url,checked,changed,crawled,errorMessage
                },
                remoteBrowsers: [], //endpoint,tabsCount,apiCallCount,urls,sourcesData:{sourceName,errorCounter,lastErrorTime,isBlocked},disabledTime,disabled
                axiosBlackList: {
                    default: [], //sourceName, errorCounter, lastErrorTime, isBlocked, totalErrorCounter
                    remoteBrowsers: [], //sourceName, lastErrorTime, isBlocked, linksCount
                },
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
                        Disabled(Env): <CheckIcon isCheck={data.disabledData.isEnvDisabled}/>
                    </span>
                    <span css={style.field}>
                        Disabled(Db): <CheckIcon isCheck={data.disabledData.isDbDisabled}/>
                    </span>
                    <span css={style.field}>
                        Temporary Disabled(Db): <CheckIcon isCheck={data.disabledData.isDbDisabled_temporary}/>
                    </span>
                    <span css={style.field}>Time to Crawler Activation:
                        {data.disabledData.isDbDisabled_temporary
                            ? getLeftTime(addHourToDate(data.disabledData.dbDisableStart, data.disabledData.dbDisableDuration))
                            : 0
                        } Hour
                        </span>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                    marginTop={1}
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
                    <span
                        css={style.field}>Memory/Limit/Total: {data.limits.memory.value}/{data.limits.memory.limit}/{data.limits.memory.total} MB</span>
                    <span css={style.field}>
                        Cpu/Limit: {data.limits.cpu.value.map(item => item.toFixed(1)).join(', ')}/{data.limits.cpu.limit.toString()} %
                    </span>
                    <span css={style.field}>pauseDurationLimit: {data.constValues.pauseDuration.toString()}Min</span>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                    marginTop={1}
                >

                    <span css={style.field}>
                        ImageOperations/Limit: {data.limits.imageOperations.value}/{data.limits.imageOperations.limit}
                    </span>
                    <span css={style.field}>
                        TrailerUpload/Limit: {data.limits.trailerUpload.value}/{data.limits.trailerUpload.limit}
                    </span>
                    <span css={style.field}>
                        extraConfigs: {JSON.stringify(data.extraConfigs || {}, null, 4)}
                    </span>
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
                            startTime: {getPassedTime(data.crawlingSource.startTime)} ago
                        </span>
                        <span css={style.field}>
                            pausedDuration: {(data.crawlingSource.pausedDuration / 60).toFixed(1)}
                        </span>
                        <span css={style.field}>crawlMode: {data.crawlingSource.crawlMode}</span>
                        <span css={style.field}>pageNumber: {data.pageNumber}/{data.pageCount?.toFixed(0)}</span>
                        <span
                            css={style.field}>Links/Limit: {data.pageLinks.length}/{data.constValues.concurrencyNumber}</span>
                    </Stack>
                }

                {
                    data.domainChangeHandler.isActive && <>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Domain Change </span>
                        </div>

                        <Stack
                            direction={"row"}
                            spacing={2}
                            divider={<Divider orientation="vertical" flexItem/>}
                            alignItems={"baseline"}
                            marginTop={1}
                        >
                            <span css={style.field}>
                            startTime: {getPassedTime(data.domainChangeHandler.startTime)} ago
                            </span>
                            <span css={style.field}>State: {data.domainChangeHandler.state}</span>
                            <span css={style.field}>
                            State Time: {getPassedTime(data.domainChangeHandler.stateTime)} ago
                            </span>
                            <span css={style.field}>
                                Error: <CheckIcon isCheck={data.domainChangeHandler.error}/>
                            </span>
                            <span css={style.field}>Error Message: {data.domainChangeHandler.errorMessage}</span>
                        </Stack>

                        <div css={[style.titleContainer, style.marginLeft10]}>
                            <span css={style.title2}> Sources </span>
                        </div>

                        {
                            data.domainChangeHandler.sources.map((item, index) => (
                                <span key={item.url} css={style.field2}>
                                    {index + 1}.
                                    Source: {item.sourceName} ||
                                    Link: {item.url.replace(/(\/page)|(\/$)/g, '')} ||
                                    Checked: <CheckIcon isCheck={item.checked}/> ||
                                    Changed: <CheckIcon isCheck={item.Changed}/> ||
                                    Crawled: <CheckIcon isCheck={item.Crawled}/> ||
                                    Error: {item.errorMessage || 'none'}
                                </span>
                            ))
                        }
                    </>
                }

                {
                    data.isCrawling && <>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Page Links </span>
                        </div>
                        {
                            data.sourcePage.url && <span css={style.field}>
                            Source Page: {data.sourcePage.url} || {data.sourcePage.state} || ({getPassedTime(data.sourcePage.stateTime)} ago)
                        </span>
                        }

                        {
                            data.pageLinks.map((item, index) => (
                                <span key={item.url} css={style.field}>
                                    {index + 1}.
                                    Page: {item.pageNumber} ||
                                    Link: {item.url.replace('https://', '').replace(/\/$/, '')} ||
                                    Time: {getPassedTime(item.time)} ||
                                    State: {item.state}, ({getPassedTime(item.stateTime)})
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

                {
                    data.remoteBrowsers.length > 0 && <div css={style.remoteBrowsersContainer}>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Remote Headless Browsers </span>
                        </div>

                        {
                            data.remoteBrowsers.map((item, index) => (
                                <RemoteBrowserItem key={index} data={item} index={index}/>
                            ))
                        }
                    </div>
                }

                {
                    data.axiosBlackList.default.length > 0 && <div css={style.remoteBrowsersContainer}>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Axios BlackLists </span>
                        </div>

                        {
                            data.axiosBlackList.default.map((item, index) => (
                                <span key={item.sourceName} css={style.field3}>
                                    {index + 1}.
                                    Name: {item.sourceName} ||
                                    Error Counter: {item.errorCounter} ||
                                    lastErrorTime: {item.lastErrorTime ? getPassedTime(item.lastErrorTime) : 0} ago ||
                                    Total Error Counter: {item.totalErrorCounter} ||
                                    Active: <CheckIcon isCheck={!item.isBlocked}/>
                                </span>
                            ))
                        }
                    </div>
                }

                {
                    data.axiosBlackList.remoteBrowsers.length > 0 && <div css={style.remoteBrowsersContainer}>
                        <div css={style.titleContainer}>
                            <span css={style.title2}> Axios BlackLists (remoteBrowsers) </span>
                        </div>

                        {
                            data.axiosBlackList.remoteBrowsers.map((item, index) => (
                                <span key={item.sourceName} css={style.field4}>
                                    {index + 1}.
                                    Name: {item.sourceName} ||
                                    lastErrorTime: {item.lastErrorTime ? getPassedTime(item.lastErrorTime) : 0} ago ||
                                    linksCount: {item.linksCount} ||
                                    Active: <CheckIcon isCheck={!item.isBlocked}/>
                                </span>
                            ))
                        }
                    </div>
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
    field2: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '7px',
        marginLeft: '30px',
    }),
    field3: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px',
        marginBottom: '5px',
        marginLeft: '100px',
    }),
    field4: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px',
        marginBottom: '5px',
        marginLeft: '20px',
    }),
    divider: css({
        marginTop: '20px',
    }),
    marginLeft10: css({
        marginLeft: '10px',
    }),
    remoteBrowsersContainer: css({
        marginTop: '40px',
    }),
}


export default CrawlerStatus;
