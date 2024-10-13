/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import * as RolePermissionApis from "../../api/rolePermissionApis";
import {CircularProgress} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import {Link} from "react-router-dom";
import CheckIcon from "../../Components/crawlerPage/CheckIcon";
import {Colors} from "../../styles";

const AllRoles = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await RolePermissionApis.getAllRoles();
        if (!result.errorMessage) {
            return result.data;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['all_roles'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['all_roles']);
        isMounted.current && setRefreshing(false);
    }

    const _removeRole = async (roleData) => {
        let res = await RolePermissionApis.removeRole(roleData.name);

        setRefreshing(true);
        await queryClient.refetchQueries(['all_roles']);
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
                    <span css={style.title}> All Roles </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> All Roles </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>
                <div css={style.createRoleContainer}>
                    <Link to={"/role/create_role"}>
                        <button css={style.createRole}> Create Role</button>
                    </Link>
                </div>

                <div css={style.fieldsContainer}>
                    {
                        data.map((p, index) =>
                            <div css={style.roleContainer} key={p.name}>
                                <span css={style.warning}>
                                    {index + 1}. Id: {p.id} Name: {p.name}
                                    {" || "}Torrent-Leach: {p.torrentLeachLimitGb}GB
                                    {" || "}Torrent-Search: {p.torrentSearchLimit}
                                    {" || "}BotsNotification: <CheckIcon isCheck={p.botsNotification}/>
                                </span>

                                <div css={[style.buttonContainer, {
                                    marginRight: '270px',
                                }]}>
                                    <button css={[style.button, {
                                        backgroundColor: Colors.RED2,
                                    }]} onClick={() => _removeRole(p)}> Remove
                                    </button>
                                </div>

                                <div css={[style.buttonContainer, {
                                    marginRight: '180px',
                                }]}>
                                    <Link to={"/role/edit_role/" + p.name} state={{roleName: p.name, roleData: p}}>
                                        <button css={[style.button, {
                                            backgroundColor: 'cyan',
                                        }]}> Edit Role
                                        </button>
                                    </Link>
                                </div>
                                <div css={[style.buttonContainer, {
                                    marginRight: '90px',
                                }]}>
                                    <Link to={"/role/" + p.name} state={{roleName: p.name}}>
                                        <button css={style.button}> All Data</button>
                                    </Link>
                                </div>
                                <div css={style.buttonContainer}>
                                    <Link to={"/role/all_users?roleName=" + p.name} state={{roleName: p.name}}>
                                        <button css={style.button}> Users</button>
                                    </Link>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
        ;
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
    createRoleContainer: css({
        position: 'absolute',
        right: '75px',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-23px',
    }),
    createRole: css({
        width: '120px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'mediumpurple',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
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

