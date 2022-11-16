/** @jsxImportSource @emotion/react */
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";
import {Button, CircularProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {isUri} from "valid-url";
import {css} from "@emotion/react";
import PropsTypes from 'prop-types';
import {updateCrawlerSourceData} from "../../api/adminApis";

const CrawlerSourceUpdateForm = ({extraStyle, sourceData, onDataUpdate}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: {errors}
    } = useForm({
        defaultValues: useMemo(() => ({
            movie_url: sourceData.movie_url,
            page_count: sourceData.page_count,
            serial_url: sourceData.serial_url,
            serial_page_count: sourceData.serial_page_count,
            crawlCycle: sourceData.crawlCycle,
            disabled: sourceData.disabled,
            cookie: sourceData.cookies[0] || {},
        }), [sourceData]),
    });

    const _onPress = () => {
        handleSubmit((data) => {
                let updateFields = {...data};
                let validCookie = updateFields.cookie.name && updateFields.cookie.value;
                if (sourceData.cookies.length === 0) {
                    updateFields.cookies = validCookie ? [updateFields.cookie] : [];
                } else {
                    updateFields.cookies = [...sourceData.cookies];
                    if (validCookie) {
                        updateFields.cookies[0] = updateFields.cookie;
                    }
                }
                delete updateFields.cookie;

                setIsLoading(true);
                updateCrawlerSourceData(sourceData.sourceName, updateFields).then(res => {
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
                if (keys[i] === 'cookie') {
                    if (values.cookie.name && values.cookie.value) {
                        let cookieKeys = Object.keys(values['cookie']);
                        for (let j = 0; j < cookieKeys.length; j++) {
                            if (values['cookie'][cookieKeys[j]] !== sourceData.cookies[0]?.[cookieKeys[j]]) {
                                changed = true;
                                break;
                            }
                        }
                    }
                } else if (values[keys[i]] !== sourceData[keys[i]]) {
                    changed = true;
                    break;
                }
            }
            setIsDirty(changed);
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch, sourceData, getValues]);

    return (
        <form css={extraStyle} onSubmit={_onPress}>
            <div>
                <TextField
                    css={style.textField}
                    {...register("movie_url", {
                        required: 'This is required',
                        validate: value => (isUri(value) && !!value.toString().match(/[?/]page[/=]$/)) || "Not a url match [?/]page[/=]$",
                    })}
                    name={"movie_url"}
                    placeholder={sourceData.movie_url}
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
                    {...register("page_count", {
                        valueAsNumber: true,
                        required: 'This is required',
                        validate: value => !isNaN(value) || 'Must be a number',
                        min: {value: 0, message: "Can't be less than 0'"}
                    })}
                    name={"page_count"}
                    placeholder={sourceData.page_count.toString()}
                    label={"Movies Pages"}
                    type={"text"}
                    error={!!errors.page_count}
                    helperText={errors.page_count?.message}
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
                    placeholder={sourceData.serial_url}
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
                    {...register("serial_page_count", {
                        valueAsNumber: true,
                        required: {message: 'This is required'},
                        validate: value => !isNaN(value) || 'Must be a number',
                        min: {value: 0, message: "Can't be less than 0'"}
                    })}
                    name={"serial_page_count"}
                    placeholder={(sourceData.serial_page_count || 0).toString()}
                    label={"Serials Pages"}
                    type={"text"}
                    error={!!errors.serial_page_count}
                    helperText={errors.serial_page_count?.message}
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
                    placeholder={sourceData.crawlCycle.toString()}
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
                    placeholder={sourceData.disabled.toString()}
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
                    placeholder={sourceData.cookies[0]?.name || ""}
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
                    placeholder={sourceData.cookies[0]?.value || ""}
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
                    placeholder={(sourceData.cookies[0]?.expire || 0).toString()}
                    label={"Cookie Expire"}
                    type={"text"}
                    error={!!errors["cookie.expire"]}
                    helperText={errors["cookie.expire"]?.message}
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

CrawlerSourceUpdateForm.propTypes = {
    extraStyle: PropsTypes.object,
    sourceData: PropsTypes.object.isRequired,
    onDataUpdate: PropsTypes.func.isRequired,
}

export default CrawlerSourceUpdateForm;
