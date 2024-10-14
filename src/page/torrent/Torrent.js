/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import * as TorrentApis from "../../api/torrentApi";
import {CircularProgress} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import LocalFile from "./LocalFile";
import DownloadingFile from "./DownloadingFile";
import ConvertingFile from "./convertingFile";


const Torrent = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let prom = await Promise.allSettled([
            TorrentApis.torrentStatus(),
            TorrentApis.streamStatus(),
        ]);
        if (prom[0].value !== 'error' && prom[1].value !== 'error') {
            prom[0].value.convertingFiles = prom[1].value.convertingFiles;
            return prom[0].value;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['torrentStatus'],
        getData,
        {
            placeholderData: {
                localFiles: [],
                downloadingFiles: [],
                convertingFiles: [],
                stats: {
                    configs: {},
                },
                downloadQueueStats: {},
                tasks: {},
                torrentClientStats: {},
            },
            keepPreviousData: true,
            refetchInterval: 3 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['torrentStatus']);
        isMounted.current && setRefreshing(false);
    }

    if (!data && (isLoading || isFetching)) {
        return (
            <CircularProgress
                color={"error"}
                size={35}
                css={style.refreshIcon}
            />
        );
    }

    if (isError) {
        return (
            <div css={style.pageContainer}>
                <div css={style.container}>
                    <span css={style.title}> Torrent Status </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> Stats </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        Object.keys(data.stats.configs).map(c =>
                            <span key={c} style={{display: 'block'}}>
                                {c}: {data.stats.configs[c].toString()}
                            </span>
                        )
                    }
                    {
                        Object.keys(data.stats).filter(c => c !== "configs").map(c =>
                            <span key={c} style={{display: 'block'}}>
                                {c}: {data.stats[c].toString()}
                            </span>
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Local Files </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        data.localFiles.map((f, index) => <LocalFile
                                key={f.name}
                                data={f}
                                index={index}
                            />
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Downloading Files </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        data.downloadingFiles.map((f, index) => <DownloadingFile
                                key={f.name}
                                data={f}
                                index={index}
                            />
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Converting Files </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        data.convertingFiles.map((f, index) => <ConvertingFile
                                key={f.name}
                                data={f}
                                index={index}
                            />
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Download Queue Status </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        Object.keys(data.downloadQueueStats).map(c =>
                            <span key={c} style={{display: 'block'}}>
                                {c}: {data.downloadQueueStats[c].toString()}
                            </span>
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Tasks </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        Object.keys(data.tasks).map(c =>
                            <span key={c} style={{display: 'block'}}>
                                {c}: {data.tasks[c].toString()}
                            </span>
                        )
                    }
                </div>
            </div>

            <div css={style.container}>
                <span css={style.title}> Torrent Client Stats </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        Object.keys(data.torrentClientStats).map(c =>
                            <span key={c} style={{display: 'block'}}>
                                {c}: {data.torrentClientStats[c].toString()}
                            </span>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

const style = {
    pageContainer: css({
        flex: 4,
    }),
    container: css({
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
    fieldsContainer: css({
        marginTop: '10px',
        marginLeft: '10px',
    }),
};


export default Torrent;

