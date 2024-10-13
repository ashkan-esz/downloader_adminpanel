/** @jsxImportSource @emotion/react */
import React, {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import * as RolePermissionApis from "../../api/rolePermissionApis";
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import RefreshButton from "../../Components/crawlerPage/RefreshButton";
import {useSearchParams} from "react-router-dom";
import UpdateUserRoleModal from "./UpdateUserRoleModal";

const AllUsers = () => {
    const [urlSearchParams, _] = useSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();
    const [roleName, setRoleName] = useState(urlSearchParams.get("roleName"));
    const [modalOpenId, setModalOpenId] = useState(-1);


    const getRoles = async () => {
        let result = await RolePermissionApis.getAllRoles();
        if (!result.errorMessage) {
            return result.data;
        } else {
            // throw new Error();
            return [];
        }
    }

    const {data: roles, isLoading: isRolesLoading,} = useQuery(
        ['all_roles'],
        getRoles,
        {
            placeholderData: [],
            keepPreviousData: true,
        }
    );

    const getData = async () => {
        let result = await RolePermissionApis.getRoleUsers(roleName, 0, 100);
        if (!result.errorMessage) {
            return result.data;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['role_users', roleName],
        getData,
        {
            placeholderData: [],
            keepPreviousData: false,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['role_users', roleName]);
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
                    <span css={style.title}> Role Users </span>
                    --Error--
                </div>
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> Role Users </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <FormControl required disabled={refreshing || isFetching || isLoading || isRolesLoading}
                             sx={{m: 1, minWidth: 160}} style={style.roleNameSelect}>
                    <InputLabel id="demo-simple-select-label">Search Role</InputLabel>
                    <Select
                        autoWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={roleName}
                        label="Age"
                        onChange={(v) => setRoleName(v.target.value)}
                    >
                        {
                            roles.map(item => <MenuItem
                                key={item.name}
                                value={item.name}>
                                {item.name}
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>

                <div css={style.fieldsContainer}>
                    {
                        data.map((p, index) =>
                            <div css={style.roleContainer} key={p.userId}>
                                <span css={style.warning}>
                                    {index + 1}. Id: {p.userId} || Username: {p.username}
                                    {" || "}RegistrationDate: {p.registrationDate}
                                    {" || "}Roles: {p.roles.map(r => r.name).join(', ')}
                                </span>

                                <div css={style.buttonContainer}>
                                    <button css={style.button} onClick={() => {
                                        setModalOpenId(p.userId);
                                    }}> Edit Roles
                                    </button>
                                </div>

                                <UpdateUserRoleModal userId={p.userId} roles={p.roles} open={modalOpenId === p.userId}/>
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
        width: '95px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
    }),
    roleNameSelect: css({
        left: '10px',
        display: 'flex',
        maxWidth: '150px',
        marginTop: '15px',
    }),
};

export default AllUsers;

