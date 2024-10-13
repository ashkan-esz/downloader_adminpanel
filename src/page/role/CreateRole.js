/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {css} from "@emotion/react";
import * as rolePermissionApis from "../../api/rolePermissionApis";
import PropsTypes from 'prop-types';

const CreateRole = ({extraStyle, onDataUpdate}) => {
    const [otherDataFields, setOtherDataFields] = useState({
        botsNotification: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm();
    const navigate = useNavigate();

    const _onPress = () => {
        handleSubmit((data) => {
                let updateFields = {...data, ...otherDataFields};
                updateFields.permissionIds = updateFields.permissionIds.split(',').map(item => Number(item));
                setIsLoading(true);
                rolePermissionApis.createNewRole(updateFields).then(async res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                        setIsLoading(false);
                    } else {
                        setError("");
                        onDataUpdate && await onDataUpdate();
                        navigate("/role/all_roles");
                    }
                });
            }
        )();
    }

    useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div css={style.pageContainer}>
            <form css={style.container} onSubmit={_onPress}>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("name", {
                            required: 'This is required',
                        })}
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
                        {...register("torrentLeachLimitGb", {
                            required: 'This is required',
                        })}
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
                        {...register("torrentSearchLimit", {
                            required: 'This is required',
                        })}
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
                        {...register("permissionIds", {
                            required: 'This is required',
                        })}
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
                        {...register("description")}
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

                <div css={style.submitButtonContainer}>
                    <LoadingButton
                        variant={"outlined"}
                        size={"large"}
                        color={"secondary"}
                        loading={isLoading}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={_onPress}
                    >
                        Add
                    </LoadingButton>
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

CreateRole.propTypes = {
    extraStyle: PropsTypes.object,
    // onDataUpdate: PropsTypes.func.isRequired,
}

export default CreateRole;
