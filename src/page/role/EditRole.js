/** @jsxImportSource @emotion/react */
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";
import {Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {css} from "@emotion/react";
import PropsTypes from 'prop-types';
import * as rolePermissionApis from "../../api/rolePermissionApis";
import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import * as RolePermissionApis from "../../api/rolePermissionApis";

const EditRole = ({extraStyle, onDataUpdate}) => {
    const location = useLocation();

    const roleName = location.state?.roleName || location.pathname.split('/').pop();

    const [otherDataFields, setOtherDataFields] = useState({
        name: "",
        description: "",
        torrentLeachLimitGb: 0,
        torrentSearchLimit: 0,
        permissionIds: "",
        botsNotification: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // const [isDirty, setIsDirty] = useState(false);
    const [isDirty, setIsDirty] = useState(true);

    const {
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: {errors}
    } = useForm();

    const getData = async () => {
        let result = await RolePermissionApis.getRoleData(roleName);
        if (!result.errorMessage) {
            setOtherDataFields({
                ...result.data,
                permissionIds: result.data.permissions.map(p => p.permission.id).join(', ')
            });
            return result.data;
        } else {
            setError(result.errorMessage);
            // throw new Error();
            return {};
        }
    }

    const {data, isLoading: isLoadingRoleData, isFetching, isError} = useQuery(
        ['role', roleName],
        getData,
        {
            placeholderData: {},
            keepPreviousData: false,
            cacheTime: 0,
        }
    );

    const _onPress = () => {
        handleSubmit((data) => {
                let updateFields = {...data, ...otherDataFields};
                updateFields.permissionIds = updateFields.permissionIds.split(',').map(item => Number(item));
                setIsLoading(true);
                rolePermissionApis.editRoleData(roleName, updateFields).then(res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                    } else {
                        setError("");
                        onDataUpdate && onDataUpdate();
                        // setIsDirty(false);
                    }
                    setIsLoading(false);
                });
            }
        )();
    }

    useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            const values = getValues();
            let keys = Object.keys(values);
            let changed = false;
            for (let i = 0; i < keys.length; i++) {
                if (values[keys[i]] !== otherDataFields[keys[i]]) {
                    changed = true;
                    break;
                }
            }
            // setIsDirty(changed);
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch, otherDataFields, getValues]);

    return (
        <div css={style.pageContainer}>
            <form css={style.container} onSubmit={_onPress}>
                <div>
                    <TextField
                        css={style.textField}
                        value={otherDataFields.name || ""}
                        onChange={(value) => setOtherDataFields(prev => ({
                                ...prev,
                                name: value.target.value,
                            })
                        )}
                        name={"name"}
                        label={"Role Name"}
                        type={"text"}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        value={otherDataFields.torrentLeachLimitGb || ""}
                        onChange={(value) => setOtherDataFields(prev => ({
                                ...prev,
                            torrentLeachLimitGb: value.target.value,
                            })
                        )}
                        name={"torrentLeachLimitGb"}
                        placeholder={"torrentLeachLimitGb"}
                        label={"torrentLeachLimitGb"}
                        type={"number"}
                        error={!!errors.torrentLeachLimitGb}
                        helperText={errors.torrentLeachLimitGb?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        value={otherDataFields.torrentSearchLimit || ""}
                        onChange={(value) => setOtherDataFields(prev => ({
                                ...prev,
                            torrentSearchLimit: value.target.value,
                            })
                        )}
                        name={"torrentSearchLimit"}
                        placeholder={"torrentSearchLimit"}
                        label={"torrentSearchLimit"}
                        type={"number"}
                        error={!!errors.torrentSearchLimit}
                        helperText={errors.torrentSearchLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        value={otherDataFields.permissionIds || ""}
                        onChange={(value) => setOtherDataFields(prev => ({
                                ...prev,
                            permissionIds: value.target.value,
                            })
                        )}
                        name={"permissionIds"}
                        placeholder={"permissionIds"}
                        label={"permissionIds"}
                        type={"text"}
                        error={!!errors.permissionIds}
                        helperText={errors.permissionIds?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.botsNotification ? "primary" : "error"}
                            checked={otherDataFields.botsNotification}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                botsNotification: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    }
                    label="botsNotification"
                    labelPlacement="start"
                />

                <div>
                    <TextField
                        css={style.textField}
                        value={otherDataFields.description || ""}
                        onChange={(value) => setOtherDataFields(prev => ({
                                ...prev,
                            description: value.target.value,
                            })
                        )}
                        name={"description"}
                        label={"Description"}
                        type={"text"}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>
                {
                    !!error && <div>
                        <Typography
                            css={style.errorText}
                            variant="subtitle2"
                            component="h2"
                            color={"red"}
                        >
                            *{error}.
                        </Typography>
                    </div>
                }

                <div css={style.buttonsContainer}>
                    <div css={[style.submitButtonContainer, style.resetButtonMargin]}>
                        <Button
                            variant={"outlined"}
                            size={"large"}
                            color={"primary"}
                            onClick={() => reset()}
                            disabled={!isDirty || isLoading}
                        >
                            Reset
                        </Button>
                    </div>

                    <div css={style.submitButtonContainer}>
                        <LoadingButton
                            variant={"outlined"}
                            size={"large"}
                            color={"secondary"}
                            loading={isLoading}
                            loadingIndicator={<CircularProgress color="error" size={18}/>}
                            onClick={_onPress}
                            disabled={!isDirty}
                        >
                            Update
                        </LoadingButton>
                    </div>
                </div>
            </form>
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
        maxWidth: "600px",
    }),
    textField: css({
        flex: 1,
        width: '100%',
        color: 'red',
    }),
    errorText: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    switch: css({
        display: 'block',
        marginLeft: '-10px',
    }),
}

EditRole.propTypes = {
    extraStyle: PropsTypes.object,
    // onDataUpdate: PropsTypes.func.isRequired,
}

export default EditRole;
