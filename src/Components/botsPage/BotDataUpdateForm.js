/** @jsxImportSource @emotion/react */
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";
import {Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {css} from "@emotion/react";
import PropsTypes from 'prop-types';
import {updateBotData} from "../../api/adminApis";

const BotDataUpdateForm = ({extraStyle, botData, onDataUpdate}) => {
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
    const [isDirty, setIsDirty] = useState(false);
    const [isFirstData, setIsFirstData] = useState(true);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: {errors}
    } = useForm({
        defaultValues: useMemo(() => ({
            botName: botData.botName,
            botToken: botData.botToken,
            botType: botData.botType,
            lastUseDate: botData.lastUseDate,
            lastApiCall_news: botData.lastApiCall_news,
            lastApiCall_updates: botData.lastApiCall_updates,
            description: botData.description,
        }), [botData]),
    });

    useEffect(() => {
        if (botData) {
            setOtherDataFields({
                disabled: botData.disabled,
                isOfficial: botData.isOfficial,
                permissionToLogin: botData.permissionToLogin,
                permissionToCrawl: botData.permissionToCrawl,
                permissionToTorrentLeech: botData.permissionToTorrentLeech,
                permissionToTorrentSearch: botData.permissionToTorrentSearch,
            });
        }
        setTimeout(()=>{
            setIsFirstData(false);
            setIsDirty(false);
        }, 1000);
    }, [botData]);

    useEffect(() => {
        if (botData && !isFirstData) {
            setIsDirty(true);
        }
    }, [otherDataFields]);

    const _onPress = () => {
        handleSubmit((data) => {
                let updateFields = {...data, ...otherDataFields};
                setIsLoading(true);
                updateBotData(botData.botId, updateFields).then(res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                    } else {
                        setError("");
                        onDataUpdate();
                        setIsDirty(false);
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
                if (values[keys[i]] !== botData[keys[i]]) {
                    changed = true;
                    break;
                }
            }
            setIsDirty(changed);
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch, botData, getValues]);

    return (
        <form css={extraStyle} onSubmit={_onPress}>
            <div>
                <TextField
                    css={style.textField}
                    {...register("botName", {
                        required: 'This is required',
                    })}
                    name={"botName"}
                    placeholder={botData.botName}
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
                    placeholder={botData.botToken}
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
                    placeholder={botData.botType}
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
                    {...register("lastUseDate", {
                        required: true,
                    })}
                    name={"lastUseDate"}
                    placeholder={botData.lastUseDate}
                    label={"lastUseDate"}
                    type={"text"}
                    error={!!errors.lastUseDate}
                    helperText={errors.lastUseDate?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("lastApiCall_news", {
                        required: true,
                    })}
                    name={"lastApiCall_news"}
                    placeholder={botData.lastApiCall_news}
                    label={"lastApiCall_news"}
                    type={"text"}
                    error={!!errors.lastApiCall_news}
                    helperText={errors.lastApiCall_news?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("lastApiCall_updates", {
                        required: true,
                    })}
                    name={"lastApiCall_updates"}
                    placeholder={botData.lastApiCall_updates}
                    label={"lastApiCall_updates"}
                    type={"text"}
                    error={!!errors.lastApiCall_updates}
                    helperText={errors.lastApiCall_updates?.message}
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
                    placeholder={botData.description}
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
    );
};

const style = {
    textField: css({
        flex: 1,
        width: '100%',
        maxWidth: '500px',
        color: 'red',
    }),
    switch: css({
        display: 'block',
        marginLeft: '-10px',
    }),
    errorText: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    buttonsContainer: css({
        display: "flex",
        flexDirection: 'row',
    }),
    resetButtonMargin: css({
        marginRight: "10px",
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
}

BotDataUpdateForm.propTypes = {
    extraStyle: PropsTypes.object,
    botData: PropsTypes.object.isRequired,
    onDataUpdate: PropsTypes.func.isRequired,
}

export default BotDataUpdateForm;
