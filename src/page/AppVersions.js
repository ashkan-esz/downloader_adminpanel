/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {Box, Button, CircularProgress, LinearProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import React, {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {addNewAppVersion, getAppVersions} from "../api/adminApis";
import {AppsData} from "../Components/appVersions";


const AppVersions = () => {
    const [appFile, setAppFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error, setError] = useState("");
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset, watch, getValues, formState: {errors}} = useForm();

    const getData = async () => {
        let result = await getAppVersions();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading} = useQuery(
        ['appVersions'],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _updateData = async () => {
        await queryClient.refetchQueries(['appVersions']);
    }

    const _onPress = () => {
        handleSubmit((data) => {
                if (appFile === null) {
                    setError('Choose App File');
                    return;
                }
                setIsLoading2(true);
                let updateFields = {...data};
                addNewAppVersion(updateFields, appFile, setProgress).then(async res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                    } else {
                        setError("");
                        reset();
                        await _updateData();
                    }
                    setIsLoading2(false);
                });
            }
        )();
    }

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
                        {...register("appName", {
                            validate: value => (value !== "") || "AppName cannot be empty",
                        })}
                        name={"appName"}
                        placeholder={"app name"}
                        label={"appName"}
                        error={!!errors.appName}
                        helperText={errors.appName?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("version", {
                            validate: value => (value && !!value.toString().match(/^\d\d?\.\d\d?\.\d\d?$/)) || "Must match \\d\\d?\\.\\d\\d?\\.\\d\\d?",
                        })}
                        name={"version"}
                        placeholder={"app version"}
                        label={"version"}
                        error={!!errors.version}
                        helperText={errors.version?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("versionName")}
                        name={"versionName"}
                        placeholder={"version name"}
                        label={"versionName"}
                        error={!!errors.versionName}
                        helperText={errors.versionName?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("minVersion", {
                            validate: value => (value && !!value.toString().match(/^\d\d?\.\d\d?\.\d\d?$/)) || "Must match \\d\\d?\\.\\d\\d?\\.\\d\\d?",
                        })}
                        name={"minVersion"}
                        placeholder={"minVersion"}
                        label={"minVersion"}
                        error={!!errors.minVersion}
                        helperText={errors.minVersion?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div>
                    <TextField
                        css={style.textField}
                        {...register("os", {
                            validate: value => (value !== "") || "Os cannot be empty",
                        })}
                        name={"os"}
                        placeholder={"os"}
                        label={"os"}
                        error={!!errors.os}
                        helperText={errors.os?.message}
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
                        placeholder={"description"}
                        label={"description"}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                <div css={style.filePickerContainer}>
                    <input
                        accept={'application/*'}
                        name={'appFile'}
                        required
                        css={style.filePicker}
                        id="raised-button-file"
                        type="file"
                        onChange={(e) => setAppFile(e.target.files[0])}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="raised" component="span" css={style.filePickerButton}>
                            {appFile ? appFile.name : 'Choose App File'}
                        </Button>
                    </label>
                </div>

                {
                    isLoading2 && <div css={style.progressBar}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Box sx={{width: '100%', mr: 1}}>
                                <LinearProgress variant="determinate" value={progress}/>
                            </Box>
                            <Box sx={{minWidth: 35}}>
                                <Typography variant="body2" color="text.secondary">
                                    {Math.round(progress)}%
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                }

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
                            disabled={isLoading || isLoading2}
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
                        >
                            Send
                        </LoadingButton>
                    </div>
                </div>
            </form>

            <AppsData apps={data}/>

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
        maxWidth: '500px',
        color: 'red',
    }),
    filePickerContainer: css({
        marginTop: '10px',
    }), filePicker: css({
        display: "none",
    }),
    filePickerButton: css({
        backgroundColor: '#39e8e8',
    }),
    progressBar: css({
        marginTop: '10px',
        width: '510px',
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
};


export default AppVersions;
