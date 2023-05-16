/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useDebounceFuncCall, useIsMounted} from "../../hooks";
import {getServerAnalysisCurrentMonth} from "../../api/adminApis";
import {css} from "@emotion/react";
import RefreshButton from "./RefreshButton";
import GoogleCacheCallItem from "./GoogleCacheCallItem";

const GoogleCacheCalls = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getServerAnalysisCurrentMonth('googleCacheCalls');
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['googleCacheCalls'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 30 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['googleCacheCalls']);
        isMounted.current && setRefreshing(false);
    }

    const {counter, delayFuncCall} = useDebounceFuncCall(_onRefresh, 2000);

    if (isError) {
        return (
            <div css={style.container}>
                <span css={style.title}> Google Cache Calls </span>
                --Error--
            </div>
        );
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Google Cache Calls </span>
            <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

            <div css={style.fieldsContainer}>

                {
                    (data && data.length > 0) && <>
                        {
                            data.map((cacheCall, index) => (
                                <GoogleCacheCallItem
                                    key={cacheCall.id}
                                    data={cacheCall}
                                    index={index}
                                    onRemove={delayFuncCall}
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
    fieldsContainer: css({
        marginTop: '20px',
        marginLeft: '10px',
    }),
}

export default GoogleCacheCalls;
