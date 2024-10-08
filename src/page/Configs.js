/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {css} from "@emotion/react";
import {Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {isUri} from "valid-url";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import {getConfigs, updateConfigs} from "../api/adminApis";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Message} from "../Components/configs";


const Configs = () => {
    const [otherDataFields, setOtherDataFields] = useState({
        disableTestUserRequests: false,
        disableCrawler: false,
        developmentFaze: false,
        disableBotsNotifications: false,
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
            (data && data.disableBotsNotifications !== otherDataFields.disableBotsNotifications)
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
                            validate: value => !isNaN(value) || "Int Numbers only",
                        })}
                        name={"disableCrawlerForDuration"}
                        placeholder={data.disableCrawlerForDuration || '0'}
                        defaultValue={data.disableCrawlerForDuration || 0}
                        label={"disableCrawlerForDuration"}
                        type={"url"}
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
                        placeholder={data.mediaFileSizeLimit || '0'}
                        defaultValue={data.mediaFileSizeLimit || 0}
                        label={"mediaFileSizeLimit"}
                        type={"url"}
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
                        placeholder={data.profileFileSizeLimit || '0'}
                        defaultValue={data.profileFileSizeLimit || 0}
                        label={"profileFileSizeLimit"}
                        type={"url"}
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
                        placeholder={data.profileImageCountLimit || '0'}
                        defaultValue={data.profileImageCountLimit || 0}
                        label={"profileImageCountLimit"}
                        type={"url"}
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
                        placeholder={data.torrentDownloadMaxFileSize || '0'}
                        defaultValue={data.torrentDownloadMaxFileSize || 0}
                        label={"torrentDownloadMaxFileSize"}
                        type={"url"}
                        error={!!errors.torrentDownloadMaxFileSize}
                        helperText={errors.torrentDownloadMaxFileSize?.message}
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
