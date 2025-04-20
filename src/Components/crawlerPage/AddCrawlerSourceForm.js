/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel, MenuItem, Select,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {isUri} from "valid-url";
import {css} from "@emotion/react";
import {addCrawlerSource} from "../../api/adminApis";
import PropsTypes from 'prop-types';

const AddCrawlerSourceForm = ({extraStyle, onDataUpdate}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            movie_url: "https://example.com/page/",
            serial_url: "https://example.com/series/page/",
            anime_url: "https://example.com/anime/page/",
            crawlCycle: 0,
            disabled: false,
            cookie: { name: '', value: '', expire: 0 },
            description: '',
            config: {
                isGeneric: false,
                is_censored: false,
                checkTrailers: false,
                is_half_network: false,
                dontRemoveDimensions: false,
                has_watch_online: false,
                has_summary: false,
                has_poster: false,
                has_wide_poster: false,
                has_trailer: false,
                has_subtitle: false,
                needHeadlessBrowser: false,
                isTorrent: false,
                replaceInfoOnDuplicate: false,
                removeScriptAndStyleFromHtml: false,
                sourceAuthStatus: 'ok',
                vpnStatus: {
                    poster: 'allOk',
                    trailer: 'allOk',
                    downloadLink: 'allOk',
                },
            },
        },
    });
    const navigate = useNavigate();

    const _onPress = () => {
        handleSubmit((data) => {
                let updateFields = {...data};
                let validCookie = updateFields.cookie.name && updateFields.cookie.value;
                updateFields.cookies = validCookie ? [updateFields.cookie] : [];
                delete updateFields.cookie;

                setIsLoading(true);
                addCrawlerSource(updateFields).then(async res => {
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                        setIsLoading(false);
                    } else {
                        setError("");
                        await onDataUpdate();
                        navigate("/crawlerSourcesList");
                    }
                });
            }
        )();
    }

    const vpnOptions = [
        { value: 'allOk', label: 'All OK' },
        { value: 'vpnOnly', label: 'VPN Only' },
        { value: 'noVpn', label: 'No VPN' },
    ];

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
                    {...register("sourceName", {
                        required: 'This is required',
                        min: {value: 5, message: "Can't be less than 5"},
                        max: {value: 20, message: "Can't be more than 20"},
                    })}
                    name={"sourceName"}
                    placeholder={"Source Name?"}
                    defaultValue={""}
                    label={"Source Name"}
                    type={"text"}
                    error={!!errors.sourceName}
                    helperText={errors.sourceName?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("movie_url", {
                        required: 'This is required',
                        validate: value => (isUri(value) && !!value.toString().match(/[?/]page[/=]$/)) || "Not a url match [?/]page[/=]$",
                    })}
                    name={"movie_url"}
                    placeholder={"https://example.com/page/"}
                    defaultValue={"https://example.com/page/"}
                    label={"Movies Url"}
                    type={"url"}
                    error={!!errors.movie_url}
                    helperText={errors.movie_url?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("serial_url", {
                        validate: value => (value === "" || (isUri(value) && !!value.toString().match(/[?/]page[/=]$/))) || "Not a url match [?/]page[/=]$",
                    })}
                    name={"serial_url"}
                    placeholder={"https://example.com/series/page/"}
                    defaultValue={"https://example.com/series/page/"}
                    label={"Serials Url"}
                    type={"url"}
                    error={!!errors.serial_url}
                    helperText={errors.serial_url?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("anime_url", {
                        validate: value => (value === "" || (isUri(value) && !!value.toString().match(/[?/]page[/=]$/))) || "Not a url match [?/]page[/=]$",
                    })}
                    name={"anime_url"}
                    placeholder={"https://example.com/anime/page/"}
                    defaultValue={"https://example.com/anime/page/"}
                    label={"Anime Url"}
                    type={"url"}
                    error={!!errors.anime_url}
                    helperText={errors.anime_url?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("crawlCycle", {
                        valueAsNumber: true,
                        required: 'This is required',
                        validate: value => !isNaN(value) || 'Must be a number',
                        min: {value: 0, message: "Can't be less than 0'"}
                    })}
                    name={"crawlCycle"}
                    placeholder={"Crawl Cycle"}
                    defaultValue={0}
                    label={"Crawl Cycle"}
                    type={"text"}
                    error={!!errors.crawlCycle}
                    helperText={errors.crawlCycle?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("disabled", {
                        setValueAs: v => v === 'true',
                        validate: value => (typeof value === 'boolean') || 'Can only be true|false',
                    })}
                    name={"disabled"}
                    placeholder={"Disabled?"}
                    defaultValue={false}
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
                    {...register("cookie.name")}
                    name={"cookie.name"}
                    placeholder={"Cookie Name"}
                    defaultValue={""}
                    multiline={true}
                    label={"Cookie Name"}
                    type={'text'}
                    error={!!errors["cookie.name"]}
                    helperText={errors["cookie.name"]?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("cookie.value")}
                    name={"cookie.value"}
                    placeholder={"Cookie Value"}
                    defaultValue={""}
                    multiline={true}
                    label={"Cookie Value"}
                    type={'text'}
                    error={!!errors["cookie.value"]}
                    helperText={errors["cookie.value"]?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    {...register("cookie.expire", {
                        valueAsNumber: true,
                        validate: value => !isNaN(value) || 'Must be a number',
                        min: {value: 0, message: "Can't be less than 0'"}
                    })}
                    name={"cookie.expire"}
                    placeholder={"Expire"}
                    defaultValue={0}
                    label={"Cookie Expire"}
                    type={"text"}
                    error={!!errors["cookie.expire"]}
                    helperText={errors["cookie.expire"]?.message}
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
                        color={watch('config.isGeneric') ? "primary" : "warning"}
                        checked={watch('config.isGeneric')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    isGeneric: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.isGeneric"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.is_censored') ? "primary" : "warning"}
                        checked={watch('config.is_censored')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    is_censored: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.is_censored"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.checkTrailers') ? "primary" : "warning"}
                        checked={watch('config.checkTrailers')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    checkTrailers: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.checkTrailers"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.is_half_network') ? "primary" : "warning"}
                        checked={watch('config.is_half_network')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    is_half_network: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.is_half_network"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.dontRemoveDimensions') ? "primary" : "warning"}
                        checked={watch('config.dontRemoveDimensions')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    dontRemoveDimensions: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.dontRemoveDimensions"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_watch_online') ? "primary" : "warning"}
                        checked={watch('config.has_watch_online')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_watch_online: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_watch_online"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_summary') ? "primary" : "warning"}
                        checked={watch('config.has_summary')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_summary: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_summary"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_poster') ? "primary" : "warning"}
                        checked={watch('config.has_poster')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_poster: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_poster"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_wide_poster') ? "primary" : "warning"}
                        checked={watch('config.has_wide_poster')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_wide_poster: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_wide_poster"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_trailer') ? "primary" : "warning"}
                        checked={watch('config.has_trailer')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_trailer: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_trailer"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.has_subtitle') ? "primary" : "warning"}
                        checked={watch('config.has_subtitle')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    has_subtitle: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.has_subtitle"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.needHeadlessBrowser') ? "primary" : "warning"}
                        checked={watch('config.needHeadlessBrowser')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    needHeadlessBrowser: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.needHeadlessBrowser"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.isTorrent') ? "primary" : "warning"}
                        checked={watch('config.isTorrent')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    isTorrent: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.isTorrent"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.replaceInfoOnDuplicate') ? "primary" : "warning"}
                        checked={watch('config.replaceInfoOnDuplicate')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    replaceInfoOnDuplicate: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.replaceInfoOnDuplicate"
                labelPlacement="start"
            />

            <FormControlLabel
                css={style.switch}
                value="start"
                control={
                    <Switch
                        size={"medium"}
                        color={watch('config.removeScriptAndStyleFromHtml') ? "primary" : "warning"}
                        checked={watch('config.removeScriptAndStyleFromHtml')}
                        onChange={(e) => {
                            const newValue = e.target.checked;
                            const values = getValues();
                            reset({
                                ...values,
                                config: {
                                    ...values.config,
                                    removeScriptAndStyleFromHtml: newValue
                                }
                            });
                        }}
                    />
                }
                label="config.removeScriptAndStyleFromHtml"
                labelPlacement="start"
            />

            <FormControl required
                         sx={{m: 1, minWidth: 150}}>
                <InputLabel id="demo-simple-select-label">Source Auth</InputLabel>
                <Select
                    autoWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="sourceAuthStatus"
                    value={getValues().config.sourceAuthStatus}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const values = getValues();
                        reset({
                            ...values,
                            config: {
                                ...values.config,
                                sourceAuthStatus: newValue
                            }
                        });
                    }}
                >
                    <MenuItem value={'ok'}>OK</MenuItem>
                    <MenuItem value={'login-cookie'}>Login-Cookie</MenuItem>
                </Select>
            </FormControl>

            <FormControl required
                         sx={{m: 1, minWidth: 150}}>
                <InputLabel id="demo-simple-select-label">Vpn Status Poster</InputLabel>
                <Select
                    autoWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="config.vpnStatus.poster"
                    value={getValues().config.vpnStatus.poster}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const values = getValues();
                        reset({
                            ...values,
                            config: {
                                ...values.config,
                                vpnStatus :{
                                    ...values.config.vpnStatus,
                                    poster: newValue
                                }
                            }
                        });
                    }}
                >
                    {vpnOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl required
                         sx={{m: 1, minWidth: 150}}>
                <InputLabel id="demo-simple-select-label">Vpn Status Trailer</InputLabel>
                <Select
                    autoWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="config.vpnStatus.trailer"
                    value={getValues().config.vpnStatus.trailer}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const values = getValues();
                        reset({
                            ...values,
                            config: {
                                ...values.config,
                                vpnStatus :{
                                    ...values.config.vpnStatus,
                                    trailer: newValue
                                }
                            }
                        });
                    }}
                >
                    {vpnOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl required
                         sx={{m: 1, minWidth: 150}}>
                <InputLabel id="demo-simple-select-label">Vpn Status Download Link</InputLabel>
                <Select
                    autoWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="config.vpnStatus.downloadLink"
                    value={getValues().config.vpnStatus.downloadLink}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const values = getValues();
                        reset({
                            ...values,
                            config: {
                                ...values.config,
                                vpnStatus :{
                                    ...values.config.vpnStatus,
                                    downloadLink: newValue
                                }
                            }
                        });
                    }}
                >
                    {vpnOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div>
                <TextField
                    css={style.textField}
                    {...register("config.header")}
                    name={"config.header"}
                    placeholder={''}
                    label={"Config.Header"}
                    type={"text"}
                    error={!!errors?.config?.header}
                    helperText={errors?.config?.header?.message}
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
                    Create
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

AddCrawlerSourceForm.propTypes = {
    extraStyle: PropsTypes.object,
    onDataUpdate: PropsTypes.func.isRequired,
}

export default AddCrawlerSourceForm;
