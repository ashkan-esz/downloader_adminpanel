/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import RefreshButton from "../Components/crawlerPage/RefreshButton";
import {CircularProgress} from "@mui/material";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getRemoteBrowsersStatus, getServerStatus} from "../api/adminApis";
import {CheckSource, ServerDetails} from "../Components/CrawlerStatus";

const ServerStatus = () => {
    const queryClient = useQueryClient();

    const getData = async () => {
        let result = await getServerStatus();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const getData2 = async () => {
        let result = await getRemoteBrowsersStatus();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['serverStatus'],
        getData,
        {
            placeholderData: null,
            keepPreviousData: true,
            refetchInterval: 5 * 1000,
        }
    );

    const {data: remoteBrowsersStatus, isLoading: isLoading2, isFetching: isFetching2, isError: isError2} = useQuery(
        ['remoteBrowsersStatus'],
        getData2,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 5 * 1000,
        }
    );

    const _onRefresh = async () => {
        await Promise.allSettled([
            queryClient.refetchQueries(['serverStatus']),
            queryClient.refetchQueries(['remoteBrowsersStatus']),
        ]);
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

    if (isError || isError2) {
        return (
            <div css={style.pageContainer}>
                <div css={style.container}>
                    <span css={style.title}> Server Status </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> Server Status </span>
                <RefreshButton refreshing={isLoading || isFetching || isLoading2 || isFetching2} onClick={_onRefresh}/>
                <ServerDetails data={data}/>
            </div>

            <div css={style.container}>
                <span css={style.title}> RemoteBrowsers Status </span>
                <RefreshButton refreshing={isLoading || isFetching || isLoading2 || isFetching2} onClick={_onRefresh}/>

                {
                    remoteBrowsersStatus.filter(item => !item.error).map(item => (
                        <div css={style.container2} key={item.server.name}>
                            <span css={style.title2}> {item.server.serverName}: </span>
                            <ServerDetails data={item} isRemoteBrowser={true}/>
                        </div>
                    ))
                }

                {
                    remoteBrowsersStatus.filter(item => item.error).map(item => (
                        <div css={style.container2} key={item.endpoint}>
                            <span css={style.title2}> {item.endpoint}: </span>
                            <span css={style.title2}> Error </span>
                        </div>
                    ))
                }
            </div>

            <CheckSource remoteBrowsersStatus={remoteBrowsersStatus}/>

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
    container2: css({
        flex: 1,
        margin: '10px',
        marginTop: '20px',
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
        display: 'block',
        marginTop: '20px',
    }),
    divider: css({
        marginTop: '10px',
        marginBottom: '10px',
    }),
    refreshIcon: css({
        position: 'absolute',
        right: 40,
        cursor: 'pointer',
    }),
}


export default ServerStatus;
