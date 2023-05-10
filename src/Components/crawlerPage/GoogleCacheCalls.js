/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import {getGoogleCacheCalls, removeGoogleCacheCall} from "../../api/adminApis";
import {css} from "@emotion/react";
import {CircularProgress} from "@mui/material";
import RefreshButton from "./RefreshButton";
import {LoadingButton} from "@mui/lab";
import {getPassedTime} from "../../utils/utils";

const GoogleCacheCalls = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [resolving, setResolving] = useState({
        id: '',
        isRemoving: false,
    });
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getGoogleCacheCalls();
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

    const _remove = async (id) => {
        if (!resolving.isRemoving) {
            setResolving({
                id: id,
                isRemoving: true,
            });
            let result = await removeGoogleCacheCall(id);
            setResolving({
                id: '',
                isRemoving: false,
            });
            _onRefresh();
        }
    }

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
                                <div css={style.cacheCallRow} key={index}>
                                    <span css={style.cacheCall}>
                                        {index + 1}. {cacheCall.url} ({getPassedTime(cacheCall.date)}) (counts:{cacheCall.count})
                                    </span>

                                    <div css={style.removeButtonContainer}>
                                        <LoadingButton
                                            variant={"outlined"}
                                            size={"small"}
                                            color={"primary"}
                                            disabled={resolving.isRemoving}
                                            loading={resolving.id === cacheCall.id}
                                            loadingIndicator={<CircularProgress color="error" size={18}/>}
                                            onClick={() => _remove(cacheCall.id)}
                                        >
                                            Remove
                                        </LoadingButton>
                                    </div>
                                </div>
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
    cacheCall: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
    cacheCallRow: css({
        display: 'flex',
        alignItems: 'center',
    }),
    removeButtonContainer: css({
        position: 'absolute',
        right: '40px',
        alignItems: 'center',
        justifyContent: 'center',
    }),
}

export default GoogleCacheCalls;
