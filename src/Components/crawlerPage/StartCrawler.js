/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import {startWebCrawler} from "../../api/adminApis";
import {css} from "@emotion/react";
import {
    Checkbox,
    CircularProgress,
    Divider, FormControl,
    FormControlLabel,
    InputLabel, MenuItem, Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import RefreshButton from "./RefreshButton";

const StartCrawler = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [crawlerSources, setCrawlerSources] = useState({sources: []});
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        sourceName: "",
        mode: 0,
        handleDomainChange: true,
        handleDomainChangeOnly: false,
        handleCastUpdate: true,
    });
    const isMounted = useIsMounted();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => {
            let temp = queryClient.getQueryData(['crawlerSources']);
            if (temp) {
                setCrawlerSources(temp);
            }
        }, 2000);
    }, []);

    const _onPress = () => {
        if (!selectedSource) {
            setError("Choose source");
            return;
        }
        setError("");
        setIsLoading(true);
        let temp = {
            ...configs,
            sourceName: selectedSource,
        }
        setConfigs(temp);
        startWebCrawler(temp).then((res) => {
            if (res.errorMessage || res.data.isError) {
                setError(res.errorMessage || res.data.message);
                setData(null);
            } else {
                setData(res.data);
            }
            setIsLoading(false);
        });
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['crawlerSources']);
        let temp = queryClient.getQueryData(['crawlerSources']);
        setCrawlerSources(temp);
        isMounted.current && setRefreshing(false);
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Start Crawler </span>
            <RefreshButton refreshing={refreshing || isLoading} onClick={_onRefresh}/>

            <div css={style.fieldsContainer}>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >

                    <FormControl required disabled={refreshing || isLoading} sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label">Source</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedSource}
                            label="Age"
                            onChange={(v) => setSelectedSource(v.target.value)}
                        >
                            {
                                crawlerSources.sources.map(item => <MenuItem
                                    key={item.sourceName}
                                    value={item.sourceName}>
                                    {item.sourceName}
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>

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
