/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {CrawlerWarningItem} from "../../Components/crawlerPage";
import {useDebounceFuncCall, useIsMounted} from "../../hooks";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getServerAnalysisCurrentMonth} from "../../api/adminApis";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import {CircularProgress} from "@mui/material";
import {Pagination} from "@mui/lab";


const Warnings = () => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getServerAnalysisCurrentMonth('warnings', page);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['warnings', page],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 30 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['warnings']);
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
                    <span css={style.title}> Warnings </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> Warnings </span>
                <span css={style.counter}> Resolved: {counter} </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        data.length > 0 && <>
                            <span css={style.title2}> Server Warnings: </span>
                            {
                                data.filter(f => !f.message.startsWith('RemoteBrowser')).map((warning, index) => (
                                    <CrawlerWarningItem
                                        key={warning.id}
                                        data={warning}
                                        index={index}
                                        onResolve={delayFuncCall}
                                    />
                                ))
                            }
                        </>
                    }

                    {
                        data.filter(f => f.message.startsWith('RemoteBrowser')).length > 0 && <>
                            <span css={style.title2}>RemoteBrowser Warnings: </span>
                            {
                                data.filter(f => f.message.startsWith('RemoteBrowser')).map((warning, index) => (
                                    <CrawlerWarningItem
                                        key={warning.id}
                                        data={warning}
                                        index={index}
                                        onResolve={delayFuncCall}
                                    />
                                ))
                            }
                        </>
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
    counter: css({
        position: 'absolute',
        right: 80,
        marginTop: '8px',
    }),
    pagination: css({
        marginTop: '20px',
    })
};


export default Warnings;
