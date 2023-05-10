/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useDebounceFuncCall, useIsMounted} from "../../hooks";
import {getCrawlerSources, getCrawlerWarnings} from "../../api/adminApis";
import {css} from "@emotion/react";
import {Divider, Stack} from "@mui/material";
import RefreshButton from "./RefreshButton";
import CheckIcon from "./CheckIcon";
import {CrawlerWarningItem} from "./index";

const CrawlerSources = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await Promise.all([
            getCrawlerSources(),
            getCrawlerWarnings(),
        ]);
        if (result[0] !== 'error' && result[1] !== 'error') {
            return {
                ...result[0],
                warnings: result[1],
            };
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['crawlerSources'],
        getData,
        {
            placeholderData: {
                sources: [],
                warnings: [],
            },
            keepPreviousData: true,
            refetchInterval: 30 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['crawlerSources']);
        isMounted.current && setRefreshing(false);
    }

    const {counter, delayFuncCall} = useDebounceFuncCall(_onRefresh, 2000);

    if (isError) {
        return (
            <div css={style.container}>
                <span css={style.title}> Crawler Sources </span>
                --Error--
            </div>
        );
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Crawler Sources </span>
            <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

            <div css={style.fieldsContainer}>

                {data.sources.map(item => (
                    <div key={item.sourceName}>
                        <Stack
                            direction={"row"}
                            spacing={2}
                            divider={<Divider orientation="vertical" flexItem/>}
                            alignItems={"baseline"}
                        >
                            <span css={style.field}>{item.sourceName}</span>
                            <span css={style.field}>
                              {item.movie_url.replace(/https?:\/\//, '').replace(/\/page\/?/, '')}
                            </span>
                            <span css={style.field}>Pages: {item.page_count}</span>
                            <span css={style.field}>
                                {item.serial_url?.replace(/https?:\/\//, '').replace(/\/page\/?/, '').replace(/\/series?\/?/, '')}
                            </span>
                            <span css={style.field}>Pages: {item.serial_page_count}</span>
                            <span css={style.field}>Cycle: {item.crawlCycle}</span>
                            <span css={style.field}>Last crawl: {item.lastCrawlDate.toString().trim()}</span>
                            <span css={style.field}>Active: <CheckIcon isCheck={!item.disabled}/></span>
                        </Stack>
                        <Divider css={style.divider} orientation="horizontal" flexItem/>
                    </div>
                ))}

                {
                    (data.warnings && data.warnings.length > 0) && <>
                        <span css={style.title2}> Warnings: </span>
                        {
                            data.warnings.map((warning, index) => (
                                <CrawlerWarningItem
                                    key={warning.message}
                                    data={warning}
                                    index={index}
                                    onResolve={delayFuncCall}
                                />
                            ))
                        }
                    </>
                }

            </div>
        </div>
    )
};

const style = {
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
    field: css({
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
    }),
    divider: css({
        marginTop: '10px',
        marginBottom: '10px',
    }),
}

export default CrawlerSources;
