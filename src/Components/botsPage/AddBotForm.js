/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {css} from "@emotion/react";
import {addBotData} from "../../api/adminApis";
import PropsTypes from 'prop-types';

const AddBotForm = ({extraStyle, onDataUpdate}) => {
    const [otherDataFields, setOtherDataFields] = useState({
        disabled: false,
        isOfficial: false,
        permissionToLogin: false,
        permissionToCrawl: false,
        permissionToTorrentLeech: false,
        permissionToTorrentSearch: false,
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

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={!otherDataFields.disabled ? "primary" : "error"}
                        checked={otherDataFields.disabled}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            disabled: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="disabled"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={otherDataFields.isOfficial ? "primary" : "error"}
                        checked={otherDataFields.isOfficial}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            isOfficial: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="isOfficial"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={otherDataFields.permissionToLogin ? "primary" : "error"}
                        checked={otherDataFields.permissionToLogin}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            permissionToLogin: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="permissionToLogin"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={otherDataFields.permissionToCrawl ? "primary" : "error"}
                        checked={otherDataFields.permissionToCrawl}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            permissionToCrawl: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="permissionToCrawl"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={otherDataFields.permissionToTorrentLeech ? "primary" : "error"}
                        checked={otherDataFields.permissionToTorrentLeech}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            permissionToTorrentLeech: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="permissionToTorrentLeech"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={otherDataFields.permissionToTorrentSearch ? "primary" : "error"}
                        checked={otherDataFields.permissionToTorrentSearch}
                        onChange={(e) => setOtherDataFields(prev => ({
                            ...prev,
                            permissionToTorrentSearch: e.target.checked,
                        }))}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="permissionToTorrentSearch"
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
    switch: css({
        display: 'block',
        marginLeft: '-10px',
    }),
}

AddBotForm.propTypes = {
    extraStyle: PropsTypes.object,
    onDataUpdate: PropsTypes.func.isRequired,
}

export default AddBotForm;
