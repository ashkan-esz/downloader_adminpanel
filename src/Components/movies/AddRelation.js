/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useEffect, useState} from "react";
import {addRelationMovie} from "../../api/moviesApi";
import {CircularProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import PropsTypes from "prop-types";


const AddRelation = ({extraStyle}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm();

    const _onPress = () => {
        handleSubmit((data) => {
                setError("");
                setIsLoading(true);
                addRelationMovie(data.id1, data.id2, data.relation).then(async res => {
                    setIsLoading(false);
                    if (res.errorMessage) {
                        setError(res.errorMessage);
                    } else {
                        setError("");
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
        <form css={[style.form, extraStyle]} onSubmit={_onPress}>
            <p css={style.title}> Add Relation </p>
            <div>
                <TextField
                    css={style.textField}
                    {...register("id1", {
                        required: true,
                    })}
                    name={"id1"}
                    label={"id1"}
                    type={"text"}
                    error={!!errors.id1}
                    helperText={errors.id1?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("id2", {
                        required: true,
                    })}
                    name={"id2"}
                    label={"id2"}
                    type={"text"}
                    error={!!errors.id2}
                    helperText={errors.id2?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("relation", {
                        required: true,
                    })}
                    name={"relation"}
                    label={"Relation"}
                    type={"text"}
                    error={!!errors.relation}
                    helperText={errors.relation?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

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

        </form>
    );
};

const style = {
    form: css({
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
    }),
    title: css({
        width: '130px',
        color: 'green',
        paddingRight: '28px',
        display: 'flex',
        alignSelf: 'baseline',
        marginTop: '28px',
    }),
    textField: css({
        flex: 1,
        width: '300px',
        color: 'red',
        paddingRight: '40px',
    }),
    errorText: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '300px',
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};

AddRelation.propTypes = {
    extraStyle: PropsTypes.object,
}

export default AddRelation;
