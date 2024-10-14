/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {css} from "@emotion/react";
import {Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {isUri} from "valid-url";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import {getConfigs, updateConfigs} from "../api/adminApis";
import * as TorrentApi from "../api/torrentApi";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Message} from "../Components/configs";


const Configs = () => {
    const [otherDataFields, setOtherDataFields] = useState({
        disableTestUserRequests: false,
        disableCrawler: false,
        developmentFaze: false,
        disableBotsNotifications: false,
        torrentDownloadDisabled: false,
        torrentFilesServingDisabled: false,
        torrentSendResultToBot: false,
    });
    const [isFirstData, setIsFirstData] = useState(true);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset, watch, getValues, formState: {errors}} = useForm();

    const getData = async () => {
        let result = await getConfigs();
        if (result !== 'error') {
            if (isFirstData) {
                setOtherDataFields({
                    disableTestUserRequests: result.disableTestUserRequests,
                    disableCrawler: result.disableCrawler,
                    developmentFaze: result.developmentFaze,
                    disableBotsNotifications: result.disableBotsNotifications,
                    torrentDownloadDisabled: result.torrentDownloadDisabled,
                    torrentFilesServingDisabled: result.torrentFilesServingDisabled,
                    torrentSendResultToBot: result.torrentSendResultToBot,
                });
                setIsFirstData(false);
            }
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading} = useQuery(
        ['serverConfigs'],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _updateConfigsData = async () => {
        await queryClient.refetchQueries(['serverConfigs']);
    }

    const _onPress = () => {
        handleSubmit((data) => {
                setIsLoading2(true);
                let updateFields = {...data, ...otherDataFields};
                updateFields.corsAllowedOrigins = updateFields.corsAllowedOrigins.split(' --- ');
                updateFields.disableCrawlerForDuration = Number(updateFields.disableCrawlerForDuration);
                updateConfigs(updateFields).then(async res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                    } else {
                        TorrentApi.fetchConfigs();
                        setError("");
                        await _updateConfigsData();
                        setIsDirty(false);
                    }
                    setIsLoading2(false);
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
                if (keys[i] === "corsAllowedOrigins") {
                    if (values[keys[i]] !== data[keys[i]].join(" --- ")) {
                        changed = true;
                        break;
                    }
                } else if (values[keys[i]] !== data[keys[i]]) {
                    changed = true;
                    break;
                }
            }
            setIsDirty(changed);
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch, data, getValues]);


    useEffect(() => {
        if (
            (data && data.disableTestUserRequests !== otherDataFields.disableTestUserRequests) ||
            (data && data.disableCrawler !== otherDataFields.disableCrawler) ||
            (data && data.developmentFaze !== otherDataFields.developmentFaze) ||
            (data && data.disableBotsNotifications !== otherDataFields.disableBotsNotifications) ||
            (data && data.torrentDownloadDisabled !== otherDataFields.torrentDownloadDisabled) ||
            (data && data.torrentFilesServingDisabled !== otherDataFields.torrentFilesServingDisabled) ||
            (data && data.torrentSendResultToBot !== otherDataFields.torrentSendResultToBot)
        ) {
            setIsDirty(true);
        } else if (data && isDirty) {
            setIsDirty(true);
        }
    }, [otherDataFields]);

    if (!data && (isLoading || isLoading2)) {
        return (
            <CircularProgress color="error" size={18}/>
        );
    }

    return (
        <div css={style.container}>
            <form onSubmit={_onPress}>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("corsAllowedOrigins", {
                            validate: value => (value === "" || value.toString().split(' --- ').every(item => isUri(item))) || "Not array of url joined by \\s---\\s",
                        })}
                        name={"corsAllowedOrigins"}
                        placeholder={data.corsAllowedOrigins.join(" --- ")}
                        defaultValue={data.corsAllowedOrigins.join(" --- ")}
                        label={"corsAllowedOrigins"}
                        type={"url"}
                        error={!!errors.corsAllowedOrigins}
                        helperText={errors.corsAllowedOrigins?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("disableCrawlerForDuration", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"disableCrawlerForDuration"}
                        placeholder={data.disableCrawlerForDuration.toString() || '0'}
                        defaultValue={data.disableCrawlerForDuration || 0}
                        label={"disableCrawlerForDuration"}
                        type={"number"}
                        error={!!errors.disableCrawlerForDuration}
                        helperText={errors.disableCrawlerForDuration?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("mediaFileSizeLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"mediaFileSizeLimit"}
                        placeholder={data.mediaFileSizeLimit.toString() || '0'}
                        defaultValue={data.mediaFileSizeLimit || 0}
                        label={"mediaFileSizeLimit"}
                        type={"number"}
                        error={!!errors.mediaFileSizeLimit}
                        helperText={errors.mediaFileSizeLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("profileFileSizeLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"profileFileSizeLimit"}
                        placeholder={data.profileFileSizeLimit.toString() || '0'}
                        defaultValue={data.profileFileSizeLimit || 0}
                        label={"profileFileSizeLimit"}
                        type={"number"}
                        error={!!errors.profileFileSizeLimit}
                        helperText={errors.profileFileSizeLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("profileImageCountLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"profileImageCountLimit"}
                        placeholder={data.profileImageCountLimit.toString() || '0'}
                        defaultValue={data.profileImageCountLimit || 0}
                        label={"profileImageCountLimit"}
                        type={"number"}
                        error={!!errors.profileImageCountLimit}
                        helperText={errors.profileImageCountLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("mediaFileExtensionLimit", {
                            validate: value => value && value.match(/^([a-zA-Z\d]+((,\s)|$))+$/) || "example: jpg, png",
                        })}
                        name={"mediaFileExtensionLimit"}
                        placeholder={data.mediaFileExtensionLimit || ''}
                        defaultValue={data.mediaFileExtensionLimit || ''}
                        label={"mediaFileExtensionLimit"}
                        type={"url"}
                        error={!!errors.mediaFileExtensionLimit}
                        helperText={errors.mediaFileExtensionLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("profileImageExtensionLimit", {
                            validate: value => value && value.match(/^([a-zA-Z\d]+((,\s)|$))+$/) || "example: jpg, png",
                        })}
                        name={"profileImageExtensionLimit"}
                        placeholder={data.profileImageExtensionLimit || ''}
                        defaultValue={data.profileImageExtensionLimit || ''}
                        label={"profileImageExtensionLimit"}
                        type={"url"}
                        error={!!errors.profileImageExtensionLimit}
                        helperText={errors.profileImageExtensionLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentDownloadMaxFileSize", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentDownloadMaxFileSize"}
                        placeholder={data.torrentDownloadMaxFileSize.toString() || '0'}
                        defaultValue={data.torrentDownloadMaxFileSize || 0}
                        label={"torrentDownloadMaxFileSize"}
                        type={"number"}
                        error={!!errors.torrentDownloadMaxFileSize}
                        helperText={errors.torrentDownloadMaxFileSize?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentDownloadMaxSpaceSize", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentDownloadMaxSpaceSize"}
                        placeholder={data.torrentDownloadMaxSpaceSize.toString() || '0'}
                        defaultValue={data.torrentDownloadMaxSpaceSize || 0}
                        label={"torrentDownloadMaxSpaceSize"}
                        type={"number"}
                        error={!!errors.torrentDownloadMaxSpaceSize}
                        helperText={errors.torrentDownloadMaxSpaceSize?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentDownloadSpaceThresholdSize", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentDownloadSpaceThresholdSize"}
                        placeholder={data.torrentDownloadSpaceThresholdSize.toString() || '0'}
                        defaultValue={data.torrentDownloadSpaceThresholdSize || 0}
                        label={"torrentDownloadSpaceThresholdSize"}
                        type={"number"}
                        error={!!errors.torrentDownloadSpaceThresholdSize}
                        helperText={errors.torrentDownloadSpaceThresholdSize?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentFilesExpireHour", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentFilesExpireHour"}
                        placeholder={data.torrentFilesExpireHour.toString() || '0'}
                        defaultValue={data.torrentFilesExpireHour || 0}
                        label={"torrentFilesExpireHour"}
                        type={"number"}
                        error={!!errors.torrentFilesExpireHour}
                        helperText={errors.torrentFilesExpireHour?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentFilesServingConcurrencyLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentFilesServingConcurrencyLimit"}
                        placeholder={data.torrentFilesServingConcurrencyLimit.toString() || '0'}
                        defaultValue={data.torrentFilesServingConcurrencyLimit || 0}
                        label={"torrentFilesServingConcurrencyLimit"}
                        type={"number"}
                        error={!!errors.torrentFilesServingConcurrencyLimit}
                        helperText={errors.torrentFilesServingConcurrencyLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentDownloadTimeoutMin", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentDownloadTimeoutMin"}
                        placeholder={data.torrentDownloadTimeoutMin.toString() || '0'}
                        defaultValue={data.torrentDownloadTimeoutMin || 0}
                        label={"torrentDownloadTimeoutMin"}
                        type={"number"}
                        error={!!errors.torrentDownloadTimeoutMin}
                        helperText={errors.torrentDownloadTimeoutMin?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentDownloadConcurrencyLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentDownloadConcurrencyLimit"}
                        placeholder={data.torrentDownloadConcurrencyLimit.toString() || '0'}
                        defaultValue={data.torrentDownloadConcurrencyLimit || 0}
                        label={"torrentDownloadConcurrencyLimit"}
                        type={"number"}
                        error={!!errors.torrentDownloadConcurrencyLimit}
                        helperText={errors.torrentDownloadConcurrencyLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentFileExpireDelayFactor", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Float Numbers only",
                        })}
                        name={"torrentFileExpireDelayFactor"}
                        placeholder={data.torrentFileExpireDelayFactor.toString() || '0'}
                        defaultValue={data.torrentFileExpireDelayFactor || 0}
                        label={"torrentFileExpireDelayFactor"}
                        type={"number"}
                        error={!!errors.torrentFileExpireDelayFactor}
                        helperText={errors.torrentFileExpireDelayFactor?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentFileExpireExtendHour", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentFileExpireExtendHour"}
                        placeholder={data.torrentFileExpireExtendHour.toString() || '0'}
                        defaultValue={data.torrentFileExpireExtendHour || 0}
                        label={"torrentFileExpireExtendHour"}
                        type={"number"}
                        error={!!errors.torrentFileExpireExtendHour}
                        helperText={errors.torrentFileExpireExtendHour?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("torrentUserEnqueueLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"torrentUserEnqueueLimit"}
                        placeholder={data.torrentUserEnqueueLimit.toString() || '0'}
                        defaultValue={data.torrentUserEnqueueLimit || 0}
                        label={"torrentUserEnqueueLimit"}
                        type={"number"}
                        error={!!errors.torrentUserEnqueueLimit}
                        helperText={errors.torrentUserEnqueueLimit?.message}
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
                            color={otherDataFields.disableTestUserRequests ? "error" : "primary"}
                            checked={otherDataFields.disableTestUserRequests}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                disableTestUserRequests: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    }
                    label="disableTestUserRequests"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.disableCrawler ? "error" : "primary"}
                            checked={otherDataFields.disableCrawler}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                disableCrawler: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'disableCrawler'}}
                        />
                    }
                    label="disableCrawler"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.developmentFaze ? "error" : "primary"}
                            checked={otherDataFields.developmentFaze}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                developmentFaze: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'developmentFaze'}}
                        />
                    }
                    label="developmentFaze"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.disableBotsNotifications ? "error" : "primary"}
                            checked={otherDataFields.disableBotsNotifications}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                disableBotsNotifications: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'disableBotsNotifications'}}
                        />
                    }
                    label="disableBotsNotifications"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.torrentDownloadDisabled ? "error" : "primary"}
                            checked={otherDataFields.torrentDownloadDisabled}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                torrentDownloadDisabled: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'torrentDownloadDisabled'}}
                        />
                    }
                    label="torrentDownloadDisabled"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={otherDataFields.torrentFilesServingDisabled ? "error" : "primary"}
                            checked={otherDataFields.torrentFilesServingDisabled}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                torrentFilesServingDisabled: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'torrentFilesServingDisabled'}}
                        />
                    }
                    label="torrentFilesServingDisabled"
                    labelPlacement="start"
                />

                <FormControlLabel
                    css={style.switch}
                    value="start"
                    control={
                        <Switch
                            size={"medium"}
                            color={!otherDataFields.torrentSendResultToBot ? "error" : "primary"}
                            checked={otherDataFields.torrentSendResultToBot}
                            onChange={(e) => setOtherDataFields(prev => ({
                                ...prev,
                                torrentSendResultToBot: e.target.checked,
                            }))}
                            inputProps={{'aria-label': 'torrentSendResultToBot'}}
                        />
                    }
                    label="torrentSendResultToBot"
                    labelPlacement="start"
                />

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.disabled", {
                            validate: value =>
                                value === "" || ["all", "serial", "movie"].includes(value) || `Invalid Value (${["all", "serial", "movie"].join("|")})`,
                        })}
                        name={"defaultTorrentDownloaderConfig.disabled"}
                        placeholder={data.defaultTorrentDownloaderConfig.disabled || ''}
                        defaultValue={data.defaultTorrentDownloaderConfig.disabled}
                        label={"defaultTorrentDownloaderConfig.disabled"}
                        type={"text"}
                        error={!!errors.defaultTorrentDownloaderConfig?.disabled}
                        helperText={errors.defaultTorrentDownloaderConfig?.disabled?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.status")}
                        name={"defaultTorrentDownloaderConfig.status"}
                        placeholder={data.defaultTorrentDownloaderConfig.status || ''}
                        defaultValue={data.defaultTorrentDownloaderConfig.status}
                        label={"defaultTorrentDownloaderConfig.status"}
                        type={"text"}
                        error={!!errors.defaultTorrentDownloaderConfig?.status}
                        helperText={errors.defaultTorrentDownloaderConfig?.status?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.minImdbScore", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Float Numbers only",
                        })}
                        name={"defaultTorrentDownloaderConfig.minImdbScore"}
                        placeholder={data.defaultTorrentDownloaderConfig.minImdbScore.toString() || '0'}
                        defaultValue={data.defaultTorrentDownloaderConfig.minImdbScore || 0}
                        label={"defaultTorrentDownloaderConfig.minImdbScore"}
                        type={"number"}
                        error={!!errors.defaultTorrentDownloaderConfig?.minImdbScore}
                        helperText={errors.defaultTorrentDownloaderConfig?.minImdbScore?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.minMalScore", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Float Numbers only",
                        })}
                        name={"defaultTorrentDownloaderConfig.minMalScore"}
                        placeholder={data.defaultTorrentDownloaderConfig.minMalScore.toString() || '0'}
                        defaultValue={data.defaultTorrentDownloaderConfig.minMalScore || 0}
                        label={"defaultTorrentDownloaderConfig.minMalScore"}
                        type={"number"}
                        error={!!errors.defaultTorrentDownloaderConfig?.minMalScore}
                        helperText={errors.defaultTorrentDownloaderConfig?.minMalScore?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.newEpisodeQualities", {
                            validate: value => value.split(',').every(item => item.match(/\s?\d\d\d\d?p/)) || "Array(\\d\\d\\d\\dP).join(,)",
                        })}
                        name={"defaultTorrentDownloaderConfig.newEpisodeQualities"}
                        placeholder={data.defaultTorrentDownloaderConfig.newEpisodeQualities || ''}
                        defaultValue={data.defaultTorrentDownloaderConfig.newEpisodeQualities || ''}
                        label={"defaultTorrentDownloaderConfig.newEpisodeQualities"}
                        type={"text"}
                        error={!!errors.defaultTorrentDownloaderConfig?.newEpisodeQualities}
                        helperText={errors.defaultTorrentDownloaderConfig?.newEpisodeQualities?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.movieQualities", {
                            validate: value => value.split(',').every(item => item.match(/\s?\d\d\d\d?p/)) || "Array(\\d\\d\\d\\dP).join(,)",
                        })}
                        name={"defaultTorrentDownloaderConfig.movieQualities"}
                        placeholder={data.defaultTorrentDownloaderConfig.movieQualities || ''}
                        defaultValue={data.defaultTorrentDownloaderConfig.movieQualities || ''}
                        label={"defaultTorrentDownloaderConfig.movieQualities"}
                        type={"text"}
                        error={!!errors.defaultTorrentDownloaderConfig?.movieQualities}
                        helperText={errors.defaultTorrentDownloaderConfig?.movieQualities?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.torrentFilesExpireHour", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Integer Numbers only",
                        })}
                        name={"defaultTorrentDownloaderConfig.torrentFilesExpireHour"}
                        placeholder={data.defaultTorrentDownloaderConfig.torrentFilesExpireHour.toString() || '0'}
                        defaultValue={data.defaultTorrentDownloaderConfig.torrentFilesExpireHour || 0}
                        label={"defaultTorrentDownloaderConfig.torrentFilesExpireHour"}
                        type={"number"}
                        error={!!errors.defaultTorrentDownloaderConfig?.torrentFilesExpireHour}
                        helperText={errors.defaultTorrentDownloaderConfig?.torrentFilesExpireHour?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.newEpisodeLinkLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Integer Numbers only",
                        })}
                        name={"defaultTorrentDownloaderConfig.newEpisodeLinkLimit"}
                        placeholder={data.defaultTorrentDownloaderConfig.newEpisodeLinkLimit.toString() || '0'}
                        defaultValue={data.defaultTorrentDownloaderConfig.newEpisodeLinkLimit || 0}
                        label={"defaultTorrentDownloaderConfig.newEpisodeLinkLimit"}
                        type={"number"}
                        error={!!errors.defaultTorrentDownloaderConfig?.newEpisodeLinkLimit}
                        helperText={errors.defaultTorrentDownloaderConfig?.newEpisodeLinkLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>
                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.movieLinkLimit", {
                            setValueAs: value => Number(value),
                            validate: value => !isNaN(value) || "Integer Numbers only",
                        })}
                        name={"defaultTorrentDownloaderConfig.movieLinkLimit"}
                        placeholder={data.defaultTorrentDownloaderConfig.movieLinkLimit.toString() || '0'}
                        defaultValue={data.defaultTorrentDownloaderConfig.movieLinkLimit || 0}
                        label={"defaultTorrentDownloaderConfig.movieLinkLimit"}
                        type={"number"}
                        error={!!errors.defaultTorrentDownloaderConfig?.movieLinkLimit}
                        helperText={errors.defaultTorrentDownloaderConfig?.movieLinkLimit?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("defaultTorrentDownloaderConfig.bypassIfHasDownloadLink",{
                            setValueAs: value => value === "true"
                        })}
                        name={"defaultTorrentDownloaderConfig.bypassIfHasDownloadLink"}
                        placeholder={data.defaultTorrentDownloaderConfig.bypassIfHasDownloadLink.toString() || ''}
                        defaultValue={data.defaultTorrentDownloaderConfig.bypassIfHasDownloadLink}
                        label={"defaultTorrentDownloaderConfig.bypassIfHasDownloadLink"}
                        type={"text"}
                        error={!!errors.defaultTorrentDownloaderConfig?.bypassIfHasDownloadLink}
                        helperText={errors.defaultTorrentDownloaderConfig?.bypassIfHasDownloadLink?.message}
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
                            disabled={!isDirty || isLoading || isLoading2}
                        >
                            Reset
                        </Button>
                    </div>

                    <div css={style.submitButtonContainer}>
                        <LoadingButton
                            variant={"outlined"}
                            size={"large"}
                            color={"secondary"}
                            loading={isLoading || isLoading2}
                            loadingIndicator={<CircularProgress color="error" size={18}/>}
                            onClick={_onPress}
                            disabled={!isDirty}
                        >
                            Update
                        </LoadingButton>
                    </div>
                </div>
            </form>

            <Message/>

        </div>
    );
};

const style = {
    container: css({
        flex: 4,
    }),
    textField: css({
        flex: 1,
        width: '100%',
        maxWidth: '800px',
        color: 'red',
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
    switch: css({
        display: 'block',
    }),
};


export default Configs;
