/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useDebounceFuncCall, useIsMounted} from "../../hooks";
import {getServerAnalysisCurrentMonth, resolveServerAnalysisLastDays} from "../../api/adminApis";
import {CircularProgress, Pagination} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import {LoadingButton} from "@mui/lab";
import {CrawlerServerLogItem} from "../../Components/crawlerPage";


const ServerLogs = () => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getServerAnalysisCurrentMonth('serverLogs', page);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['serverLogs', page],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 30 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['serverLogs']);
        isMounted.current && setRefreshing(false);
    }

    const _onRemove = async () => {
        setRefreshing(true);
        await resolveServerAnalysisLastDays('serverLogs', 1);
        await queryClient.refetchQueries(['serverLogs']);
        isMounted.current && setRefreshing(false);
    }

    const {counter, delayFuncCall} = useDebounceFuncCall(_onRefresh, 2000);

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
                    <span css={style.title}> serverLogs </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> serverLogs </span>
                <span css={style.counter}> Removed: {counter} </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>
                <LoadingButton
                    css={style.removeButton}
                    variant={"outlined"}
                    size={"medium"}
                    color={"secondary"}
                    disabled={isLoading || isFetching || refreshing}
                    loadingIndicator={<CircularProgress color="error" size={18}/>}
                    onClick={_onRemove}
                >
                    Remove
                </LoadingButton>

                <div css={style.fieldsContainer}>
                    {
                        data.map((warning, index) => <CrawlerServerLogItem
                                key={warning.id}
                                data={warning}
                                index={index}
                                onResolve={delayFuncCall}
                            />
                        )
                    }
                </div>

                {
                    (page > 1 || data.length > 0) && <Pagination css={style.pagination}
                                                                 count={10} page={page}
                                                                 onChange={(event, value) => setPage(value)}/>

                }

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
    counter: css({
        position: 'absolute',
        right: 80,
        marginTop: '8px',
    }),
    pagination: css({
        marginTop: '20px',
    }),
    removeButton: css({
        position: 'absolute',
        right: 170,
    })
};


export default ServerLogs;
