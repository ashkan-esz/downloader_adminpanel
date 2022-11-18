/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {startWebCrawler} from "../../api/adminApis";
import {css} from "@emotion/react";
import {Checkbox, CircularProgress, Divider, FormControlLabel, Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";

const StartCrawler = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        sourceName: "",
        mode: 0,
        handleDomainChange: true,
        handleDomainChangeOnly: false,
        handleCastUpdate: true,
    });

    const _onPress = () => {
        setError("");
        setIsLoading(true);
        startWebCrawler(configs).then((res) => {
            if (res.errorMessage || res.data.isError) {
                setError(res.errorMessage || res.data.message);
                setData(null);
            } else {
                setData(res.data);
            }
            setIsLoading(false);
        });
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Start Crawler </span>

            <div css={style.fieldsContainer}>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >
                    <TextField
                        name={"sourceName"}
                        placeholder={"Source Name?"}
                        value={configs.sourceName}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                sourceName: value.target.value,
                            })
                        )}
                        label={"Source Name"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />

                    <TextField
                        name={"mode"}
                        placeholder={"Crawl Mode?"}
                        value={configs.mode}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                mode: value.target.value,
                            })
                        )}
                        label={"Crawl Mode"}
                        type={"number"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </Stack>

                <Stack
                    css={style.checkboxContainer}
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                css={style.checkbox}
                                name={"handleDomainChange"}
                                label={"handleDomainChange"}
                                color={"secondary"}
                                checked={configs.handleDomainChange}
                                onChange={() => setConfigs(prev => ({
                                        ...prev,
                                        handleDomainChange: !prev.handleDomainChange
                                    })
                                )}
                            />}
                        label="Handle Domain Change"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                css={style.checkbox}
                                name={"handleDomainChangeOnly"}
                                color={"secondary"}
                                checked={configs.handleDomainChangeOnly}
                                onChange={() => setConfigs(prev => ({
                                        ...prev,
                                        handleDomainChangeOnly: !prev.handleDomainChangeOnly
                                    })
                                )}
                            />}
                        label="Handle Domain Change Only"
                    />

                    <FormControlLabel
                        control={

                            <Checkbox
                                css={style.checkbox}
                                name={"handleCastUpdate"}
                                color={"secondary"}
                                checked={configs.handleCastUpdate}
                                onChange={() => setConfigs(prev => ({
                                        ...prev,
                                        handleCastUpdate: !prev.handleCastUpdate
                                    })
                                )}
                            />}
                        label="Handle Cast Update"
                    />
                </Stack>

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
                    !error && !isLoading && data && data.message && <div>
                        <Typography
                            css={style.errorText}
                            variant="subtitle2"
                            component="h2"
                            color={"secondary"}
                        >
                            *{data.message}*
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
                        Start
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
    fieldsContainer: css({
        marginTop: '20px',
        marginLeft: '10px',
    }),
    checkboxContainer: css({
        marginTop: '10px',
    }),
    checkbox: css({
        width: '30px',
        height: '30px',
        '& .MuiSvgIcon-root': {
            fontSize: "28px",
        },
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

export default StartCrawler;
