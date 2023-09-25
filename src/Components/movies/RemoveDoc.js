/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useEffect, useState} from "react";
import {removeDoc} from "../../api/moviesApi";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import PropsTypes from "prop-types";


const RemoveDoc = ({extraStyle}) => {
    const [removeType, setRemoveType] = useState('movie');
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
                removeDoc(removeType, data.id).then(async res => {
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
            <p css={style.title}> Remove Doc </p>

            <FormControl css={style.selector} required sx={{m: 1, minWidth: 120}}>
                <InputLabel id="demo-simple-select-label">removeType</InputLabel>
                <Select
                    autoWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={removeType}
                    label="Remove Type"
                    onChange={(v) => setRemoveType(v.target.value)}
                >
                    <MenuItem value={'movie'}>
                        movie
                    </MenuItem>
                    <MenuItem value={'staff'}>
                        staff
                    </MenuItem>
                    <MenuItem value={'character'}>
                        character
                    </MenuItem>
                    <MenuItem value={'user'}>
                        user
                    </MenuItem>
                </Select>
            </FormControl>

            <div>
                <TextField
                    css={style.textField}
                    {...register("id", {
                        required: true,
                    })}
                    name={"id"}
                    label={"id"}
                    type={"text"}
                    error={!!errors.id}
                    helperText={errors.id?.message}
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
                    Remove
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
        color: 'red',
        paddingRight: '28px',
        display: 'flex',
        alignSelf: 'baseline',
        marginTop: '28px',
    }),
    selector: css({
        paddingRight: '40px',
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

RemoveDoc.propTypes = {
    extraStyle: PropsTypes.object,
}

export default RemoveDoc;
