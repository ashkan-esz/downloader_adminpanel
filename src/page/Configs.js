/** @jsxImportSource @emotion/react */
import React, {useEffect, useMemo, useState} from 'react';
import {css} from "@emotion/react";
import {Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {isUri} from "valid-url";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import {getConfigs, updateConfigs} from "../api/adminApis";
import {useQuery, useQueryClient} from "@tanstack/react-query";


const Configs = () => {
    const [otherDataFields, setOtherDataFields] = useState({
        disableTestUserRequests: false,
        disableCrawler: false,
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
            (data && data.disableCrawler !== otherDataFields.disableCrawler)
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
        <form css={style.container} onSubmit={_onPress}>
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
