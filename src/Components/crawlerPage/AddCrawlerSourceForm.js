/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {CircularProgress, TextField, Typography} from "@mui/material";
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
        formState: {errors}
    } = useForm();
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
                    Update
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
