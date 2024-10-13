/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import * as RolePermissionApis from "../../api/rolePermissionApis";
import {CircularProgress} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import {Link, useLocation} from "react-router-dom";
import CheckIcon from "../../Components/crawlerPage/CheckIcon";

const AllRoles = () => {
    const location = useLocation();
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await RolePermissionApis.getRoleData(location.state?.roleName);
        if (!result.errorMessage) {
            return result.data;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['role', location.state?.roleName],
        getData,
        {
            placeholderData: null,
            keepPreviousData: true,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['role', location.state?.roleName]);
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
                    <span css={style.title}> Role Data </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> Role Data </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>
                    <div css={style.roleContainer} key={data.name}>
                        <span css={style.warning}>
                            Id: {data.id} || Name: {data.name}
                            {" || "}Torrent-Leach: {data.torrentLeachLimitGb}GB
                            {" || "}Torrent-Search: {data.torrentSearchLimit}
                            {" || "}BotsNotification: <CheckIcon isCheck={data.botsNotification}/>
                        </span>

                        <div css={style.buttonContainer}>
                            <Link to={"/role/all_users?roleName=" + data.name} state={{roleName: data.name}}>
                                <button css={style.button}> Users</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div css={[style.fieldsContainer, {
                    marginLeft: '20px',
                }]}>
                    <span css={style.warning}> Permissions </span>
                    {
                        data.permissions.map((p, index) =>
                            <div css={style.roleContainer} key={p.permission.name}>
                                <span css={style.warning}>
                                    {index + 1}. Id: {p.permission.id} || Name: {p.permission.name}
                                </span>
                            </div>
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
    roleContainer: css({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
    }),
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
    buttonContainer: css({
        position: 'absolute',
        right: '40px',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    button: css({
        width: '80px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
    }),
};


export default AllRoles;

