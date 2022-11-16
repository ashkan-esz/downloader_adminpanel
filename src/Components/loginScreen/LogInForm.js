/** @jsxImportSource @emotion/react */
import React, {useRef, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {userLogin_api, resetAuthError} from "../../redux/slices/auth.slice";
import PropsTypes from 'prop-types';
import {CircularProgress, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {Person, Lock, VisibilityOff, Visibility} from "@mui/icons-material";
import {css} from "@emotion/react";

const LogInForm = ({extraStyle}) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.authError);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const _onPress = () => {
        handleSubmit((data) => {
                dispatch(userLogin_api(data));
            }
        )();
    }

    React.useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            dispatch(resetAuthError());
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <form css={extraStyle} onSubmit={_onPress}>
            <div>
                <TextField
                    css={style.textField}
                    {...register("username_email", {
                        required: {value: true, message: 'This is required'},
                        minLength: {value: 6, message: 'Too short'},
                        maxLength: {value: 50, message: 'Too long'},
                    })}
                    name={"username_email"}
                    placeholder={'Username or Email'}
                    label={"username"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person/>
                            </InputAdornment>
                        ),
                    }}
                    inputRef={emailInputRef}
                    type={"email"}
                    error={!!errors.username_email}
                    helperText={errors.username_email?.message}
                    autoFocus={true}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    {...register("password", {
                        required: {value: true, message: 'This is required'},
                        minLength: {value: 8, message: 'Too short'},
                        maxLength: {value: 50, message: 'Too long'},
                        validate: value => value !== watch("username_email") || 'Password cannot be equal with username',
                    })}
                    name={"password"}
                    placeholder={'Password'}
                    label={"password"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(prevValue => !prevValue)}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    inputRef={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    margin={"dense"}
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

            <div>
                <LoadingButton
                    css={style.loginButton}
                    variant={"outlined"}
                    size={"large"}
                    color={"error"}
                    loading={isLoading}
                    loadingIndicator={<CircularProgress color="error" size={18}/>}
                    onClick={_onPress}
                >
                    Login
                </LoadingButton>
            </div>
        </form>
    );
};

const style = {
    textField: css({
        width: "350px",
    }),
    errorText: css({
        marginTop: "5px",
    }),
    loginButton: css({
        marginTop: "5px",
        color: "red",
    }),
}

LogInForm.propTypes = {
    extraStyle: PropsTypes.object,
}

export default LogInForm;
