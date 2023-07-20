/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {RowStack} from "../index";
import {CheckIcon} from "../crawlerPage";
import {convertToGbIfNeeded, getPassedTime} from "../../utils/utils";


const ServerDetails = ({data, isRemoteBrowser}) => {
    return (
        <div css={style.fieldsContainer}>
            <span css={style.title2}> Server: </span>
            <RowStack>
                <span css={style.field}>Host Name: {data.server.hostName}</span>
                <span css={style.field}>Uptime: {Math.floor(data.server.upTime)} Min</span>
                <span css={style.field}>Node Uptime: {Math.floor(data.server.nodeUpTime)} Min</span>
                <span css={style.field}>Node Version: {data.server.nodeVersion}</span>
                <span css={style.field}>Platform-arch: {data.server.platform}-{data.server.arch}</span>
                {
                    isRemoteBrowser && <span css={style.field}>Error: <CheckIcon isCheck={data.error}/></span>
                }
                {
                    isRemoteBrowser && <span css={style.field}>Message: {data.message}</span>
                }
            </RowStack>

            <span css={style.title2}> Memory: </span>
            <RowStack>
                <span css={style.field}>
                    Total(OS): {convertToGbIfNeeded(data.memoryStatus.memoryStatus_os.total)}
                </span>
                <span css={style.field}>
                    Used(OS): {convertToGbIfNeeded(data.memoryStatus.memoryStatus_os.used)}
                </span>
                <span css={style.field}>
                    Free(OS): {convertToGbIfNeeded(data.memoryStatus.memoryStatus_os.free)}
                </span>
                <span css={style.field}>Total: {convertToGbIfNeeded(data.memoryStatus.total)}</span>
                {
                    isRemoteBrowser ? <span css={style.field}>
                                    Used: {data.memoryStatus.used.toFixed(2)} MB
                                    [ node: {data.memoryStatus.used_node.toFixed(0)}, puppeteer: {data.memoryStatus.used_pupputeer.toFixed(0)} ]
                                </span>
                        : <span css={style.field}>Used: {convertToGbIfNeeded(data.memoryStatus.used)}</span>
                }
                <span css={style.field}>Free: {convertToGbIfNeeded(data.memoryStatus.free)}</span>
            </RowStack>
            {
                !isRemoteBrowser && <RowStack>
                    <span css={style.field}>
                        Cache(jikan-api): {JSON.stringify(data.memoryStatus.cache.jikan)}
                    </span>
                        <span css={style.field}>
                        Cache(userStats): {JSON.stringify(data.memoryStatus.cache.userStats)}
                    </span>
                </RowStack>
            }

            <span css={style.title2}> Cpu: </span>
            <RowStack>
                <span css={style.field}>Model: {data.cpu.model}</span>
                <span css={style.field}>Cors: {data.cpu.count}</span>
                {
                    isRemoteBrowser ? <span css={style.field}>
                                    Usage: {data.cpu.usage} %  [ puppeteer: {data.cpu.puppeteerCpu.toFixed(1)} ]
                                </span>
                        : <span css={style.field}>Usage: {data.cpu.usage} %</span>
                }
                <span css={style.field}>Free: {data.cpu.free.toFixed(2)} %</span>
                <span css={style.field}>Load Average: {data.cpu.loadAvg.join(' - ')} %</span>
                <span css={style.field}>Load Average Time: {data.cpu.loadAvgTime} Min</span>
            </RowStack>

            <span css={style.title2}> Disk: </span>
            <RowStack>
                <span css={style.field}>DiskPath: {data.diskStatus.diskStatus_os.diskPath}</span>
                <span css={style.field}>Total(OS): {convertToGbIfNeeded(data.diskStatus.diskStatus_os.total)}</span>
                <span css={style.field}>Used(OS): {convertToGbIfNeeded(data.diskStatus.diskStatus_os.used)}</span>
                <span css={style.field}>Free(OS): {convertToGbIfNeeded(data.diskStatus.diskStatus_os.free)}</span>
                <span css={style.field}>Total: {convertToGbIfNeeded(data.diskStatus.total)}</span>
                <span css={style.field}>Used: {convertToGbIfNeeded(data.diskStatus.used)}</span>
                <span css={style.field}>Free: {convertToGbIfNeeded(data.diskStatus.free)}</span>
            </RowStack>

            {
                isRemoteBrowser && <>
                    <span css={style.title2}> Files: </span>
                    <RowStack>
                        <span css={style.field}>Files Count: {data.filesStatus.files.length}</span>
                        <span
                            css={style.field}>Files Total Size: {convertToGbIfNeeded(data.filesStatus.filesTotalSize)}</span>
                        <span css={style.field}>Download Count: {data.filesStatus.downloadCount}</span>
                        <span css={style.field}>Upload Count: {data.filesStatus.uploadCount}</span>
                        <span css={style.field}>
                            disableUploadJob: <CheckIcon isCheck={data.configs.disableUploadJob}/>
                        </span>
                        <span css={style.field}>
                            uploadJobRunning: <CheckIcon isCheck={data.filesStatus.uploadJobRunning}/>
                        </span>
                    </RowStack>
                    <RowStack>
                        <span css={style.field}>BlackHole Message: {data.filesStatus.blackHoleUpload.message}</span>
                        <span css={style.field}>BlackHole Time: {data.filesStatus.blackHoleUpload.time}</span>
                        <span css={style.field}>BlackHole State: {data.filesStatus.blackHoleUpload.state}</span>
                        <span
                            css={style.field}>BlackHole File Size Limit: {convertToGbIfNeeded(data.configs.blackHole.fileSizeLimit)}</span>
                    </RowStack>
                    <RowStack>
                        {
                            data.filesStatus.files.length > 0 && <span css={style.field}>
                                Files: {JSON.stringify(data.filesStatus.files, null, 4)}
                            </span>
                        }
                    </RowStack>
                </>
            }

            {
                isRemoteBrowser && <>
                    <span css={style.title2}> Crawler: </span>
                    <RowStack>
                        <span css={style.field}>State: {data.crawlerStatus.crawlerState}</span>
                        <span css={style.field}>
                            Last Use: {getPassedTime(data.crawlerStatus.lastTimeCrawlerUse)} Ago
                        </span>
                        <span css={style.field}>
                            Tabs/Limit: {data.crawlerStatus.pageLinks.length}/{data.configs.browserTabsCount}
                        </span>
                        <span css={style.field}>Memory Limit: {convertToGbIfNeeded(data.crawlerStatus.memoryLimit)}</span>
                        <span css={style.field}>Pause Duration Limit: {data.configs.pauseDurationLimit}sec</span>
                        <span css={style.field}>
                            IsPaused: <CheckIcon isCheck={data.crawlerStatus.pauseData.isPaused}/>
                        </span>
                        <span css={style.field}>Pause Reason: {data.crawlerStatus.pauseData.pauseReason}</span>
                        <span css={style.field}>Paused From: {data.crawlerStatus.pauseData.pausedFrom}</span>
                        <span css={style.field}>
                            Total Pause: {data.crawlerStatus.pauseData.totalPausedDuration.toFixed(1)} Min
                        </span>
                    </RowStack>

                    {
                        data.crawlerStatus.pageLinks.length > 0 && <>
                            <span css={style.title2}> Page Links: </span>
                            {
                                data.crawlerStatus.pageLinks.map((item, index) => (
                                    <span key={item.url} css={style.field}>
                                    {index + 1}.
                                    Url: {item.url.replace('https://', '').replace(/\/$/, '')} ||
                                    Type: {item.type} ||
                                    Time: {getPassedTime(item.time)} ||
                                    State: {item.state}, ({getPassedTime(item.stateTime)}) ||
                                    RetryCounter: {item.retryCounter}
                                </span>
                                ))
                            }
                        </>
                    }
                </>
            }
        </div>
    );
};

const style = {
    title: css({
        fontSize: '22px',
        fontWeight: 600,
    }),
    title2: css({
        fontSize: '18px',
        fontWeight: 600,
        display: 'block',
        marginTop: '20px',
    }),
    fieldsContainer: css({
        marginTop: '10px',
        marginLeft: '10px',
    }),
    field: css({
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        marginLeft: '10px',
    }),
};


export default ServerDetails;
