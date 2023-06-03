/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {Button, CircularProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import React, {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {getMessage, setMessage} from "../../api/adminApis";


const Message = () => {
    const [isLoading2, setIsLoading2] = useState(false);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset, watch, getValues, formState: {errors}} = useForm();

    const getData = async () => {
        let result = await getMessage();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading} = useQuery(
        ['message'],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _updateConfigsData = async () => {
        await queryClient.refetchQueries(['message']);
    }

    const _onPress = () => {
        handleSubmit((data) => {
                setIsLoading2(true);
                let updateFields = {...data};
                updateFields.date = new Date(updateFields.date);
                setMessage(updateFields).then(async res => {
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
                if (values[keys[i]] !== data[keys[i]]) {
                    changed = true;
                    break;
                }
            }
            setIsDirty(changed);
            setError("");
        });
        return () => subscription.unsubscribe();
    }, [watch, data, getValues]);


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
                    {...register("message", {
                        validate: value => value !== "" || "cannot be empty",
                    })}
                    name={"message"}
                    placeholder={data.message}
                    defaultValue={data.message}
                    label={"message"}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("date", {
                        validate: value => value !== "" || "cannot be empty",
                    })}
                    name={"date"}
                    placeholder={data.date}
                    defaultValue={data.date}
                    label={"date"}
                    error={!!errors.date}
                    helperText={errors.date?.message}
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
    );
};

const style = {
    container: css({
        marginTop: '20px',
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
};

export default Message;
