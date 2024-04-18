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
        let result = await TorrentApis.torrentStatus();
        let streamResult = await TorrentApis.streamStatus();
        if (result !== 'error' && streamResult !== 'error') {
            result.convertingFiles = streamResult.convertingFiles;
            return result;
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
            },
            keepPreviousData: true,
            refetchInterval: 5 * 1000,
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

