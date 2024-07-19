/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {CircularProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {css} from "@emotion/react";
import {addBotData} from "../../api/adminApis";
import PropsTypes from 'prop-types';

const AddBotForm = ({extraStyle, onDataUpdate}) => {
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
                let updateFields = {...data};
                setIsLoading(true);
                addBotData(updateFields).then(async res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                        setIsLoading(false);
                    } else {
                        setError("");
                        await onDataUpdate();
                        navigate("/botsList");
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
        <form css={extraStyle} onSubmit={_onPress}>
            <div>
                <TextField
                    css={style.textField}
                    {...register("botName", {
                        required: 'This is required',
                    })}
                    name={"botName"}
                    label={"Bot Name"}
                    type={"url"}
                    error={!!errors.botName}
                    helperText={errors.botName?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("botToken", {
                        required: 'This is required',
                    })}
                    name={"botToken"}
                    label={"botToken"}
                    type={"url"}
                    error={!!errors.botToken}
                    helperText={errors.botToken?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("botType", {
                        required: true,
                    })}
                    name={"botType"}
                    label={"Bot Type"}
                    type={"url"}
                    error={!!errors.botType}
                    helperText={errors.botType?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("disabled", {
                        setValueAs: v => v === true || v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"disabled"}
                    label={"Disabled"}
                    type={'text'}
                    error={!!errors.disabled}
                    helperText={errors.disabled?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("isOfficial", {
                        setValueAs: v => v === true || v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"isOfficial"}
                    label={"isOfficial"}
                    type={'text'}
                    error={!!errors.isOfficial}
                    helperText={errors.isOfficial?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("permissionToLogin", {
                        setValueAs: v => v === true || v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"permissionToLogin"}
                    label={"permissionToLogin"}
                    type={'text'}
                    error={!!errors.permissionToLogin}
                    helperText={errors.permissionToLogin?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("permissionToCrawl", {
                        setValueAs: v => v === true || v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"permissionToCrawl"}
                    label={"permissionToCrawl"}
                    type={'text'}
                    error={!!errors.permissionToCrawl}
                    helperText={errors.permissionToCrawl?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("permissionToTorrentLeech", {
                        setValueAs: v => v === true || v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"permissionToTorrentLeech"}
                    label={"permissionToTorrentLeech"}
                    type={'text'}
                    error={!!errors.permissionToTorrentLeech}
                    helperText={errors.permissionToTorrentLeech?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

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
    );
};

const style = {
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
}

AddBotForm.propTypes = {
    extraStyle: PropsTypes.object,
    onDataUpdate: PropsTypes.func.isRequired,
}

export default AddBotForm;
