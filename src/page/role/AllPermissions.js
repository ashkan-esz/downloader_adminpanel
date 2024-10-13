/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import * as RolePermissionApis from "../../api/rolePermissionApis";
import {CircularProgress} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";

const AllPermissions = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await RolePermissionApis.getAllPermissions();
        if (!result.errorMessage) {
            return result.data;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['all_permissions'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['all_permissions']);
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
                    <span css={style.title}> All Permissions </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> All Permissions </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    {
                        data.map((p, index) => <span key={p} css={style.warning}>
                            {index}. {p}
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
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
};


export default AllPermissions;

