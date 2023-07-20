/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";
import {check3rdPartApisWorking} from "../../api/adminApis";
import {CircularProgress, Divider, Stack, Typography} from "@mui/material";
import CheckIcon from "./CheckIcon";
import {LoadingButton} from "@mui/lab";


const ApiKeys = () => {
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const _onPress = () => {
        setError("");
        setIsLoading(true);
        check3rdPartApisWorking().then((res) => {
            if (res.errorMessage || res.data?.isError) {
                setError(res.errorMessage || res.data?.message);
                setResult(null);
            } else {
                setResult(res);
            }
            setIsLoading(false);
        });
    }

    if (error) {
        return (
            <div css={style.container}>
                <span css={style.title}> Api Keys </span>
                --Error--
            </div>
        );
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Api Keys </span>
            <div css={style.fieldsContainer}>

                {result.map(item => (
                    <div key={item.name}>
                        <Stack
                            direction={"row"}
                            spacing={2}
                            divider={<Divider orientation="vertical" flexItem/>}
                            alignItems={"baseline"}
                        >
                            <span css={style.field}>Api Name: {item.name}</span>
                            <span css={style.field}>
                              Bad/Total: {item.badKeys.length} / {item.totalKeys}
                            </span>
                            <span css={style.field}>
                              noKeyNeed: <CheckIcon isCheck={item.noKeyNeed}/>
                            </span>
                            <span css={style.field}>Bad Keys: {item.badKeys.join('||  ')}</span>
                        </Stack>
                        <Divider css={style.divider} orientation="horizontal" flexItem/>
                    </div>
                ))}

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

                {
                    !error && !isLoading && result && result.message && <div>
                        <Typography
                            css={style.errorText}
                            variant="subtitle2"
                            component="h2"
                            color={"secondary"}
                        >
                            *{result.message}*
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
                        Check
                    </LoadingButton>
                </div>

            </div>
        </div>
    )
};

const style = {
    container: css({
        flex: 1,
        margin: '20px',
        padding: '20px',
        webkitBoxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    title: css({
        fontSize: '22px',
        fontWeight: 600,
    }),
    title2: css({
        fontSize: '18px',
        fontWeight: 600,
        display: 'block',
        marginTop: '20px',
    }),
    fieldsContainer: css({
        marginTop: '10px',
        marginLeft: '10px',
    }),
    field: css({
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
    }),
    divider: css({
        marginTop: '10px',
        marginBottom: '10px',
    }),
    buttonContainer: css({
        display: "flex",
        justifyContent: 'center',
        marginTop: '10px',
    }),
    errorText: css({
        marginTop: "20px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    submitButtonContainer: css({
        marginTop: "20px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
}


export default ApiKeys;
