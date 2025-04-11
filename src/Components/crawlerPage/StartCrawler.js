/** @jsxImportSource @emotion/react */
import {useState} from "react";
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
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../../hooks";
import RefreshButton from "./RefreshButton";
import {getMovieSources} from "../../api";

const StartCrawler = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [castUpdateState, setCastUpdateState] = useState('none');
    const [apiUpdateState, setApiUpdateState] = useState('none');
    const [trailerUploadState, setTrailerUploadState] = useState('none');
    const [torrentState, setTorrentState] = useState('none');
    const [crawlMode, setCrawlMode] = useState(0);
    const [isLoading2, setIsLoading2] = useState(false);
    const [result, setResult] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        sourceName: "",
        handleDomainChange: true,
        handleDomainChangeOnly: false,
        dontUseRemoteBrowser: false,
        crawlerConcurrency: 0,
        axiosBlockThreshHold: 0,
        remoteBrowserBlockThreshHold: 0,
    });
    const isMounted = useIsMounted();
    const queryClient = useQueryClient();

    const getData = async () => {
        let result = await getMovieSources();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['movieSources'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 10 * 60 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['movieSources']);
        isMounted.current && setRefreshing(false);
    }

    const _onPress = () => {
        if (!selectedSource) {
            setError("Choose source");
            return;
        }
        setError("");
        setIsLoading2(true);
        let temp = {
            ...configs,
            sourceName: selectedSource,
            castUpdateState: castUpdateState,
            apiUpdateState: apiUpdateState,
            trailerUploadState: trailerUploadState,
            torrentState: torrentState,
            mode: crawlMode,
        }
        setConfigs(temp);
        startWebCrawler(temp).then((res) => {
            if (res.errorMessage || res.data.isError) {
                setError(res.errorMessage || res.data.message);
                setResult(null);
            } else {
                setResult(res.data);
            }
            setIsLoading2(false);
        });
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Start Crawler </span>
            <RefreshButton refreshing={refreshing || isFetching || isLoading || isLoading2} onClick={_onRefresh}/>

            <div css={style.fieldsContainer}>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label">Source</InputLabel>
                        <Select
                            autoWidth
                            labelId="selected-source"
                            id="selected-source"
                            value={selectedSource}
                            label="Source"
                            onChange={(v) => setSelectedSource(v.target.value)}
                        >
                            {
                                data.map(item => <MenuItem
                                    key={item.sourceName}
                                    value={item.sourceName}>
                                    {item.sourceName}
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 150}}>
                        <InputLabel id="demo-simple-select-label">Cast Update State</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={castUpdateState}
                            label="Age"
                            onChange={(v) => setCastUpdateState(v.target.value)}
                        >
                            <MenuItem value={'none'}>none</MenuItem>
                            <MenuItem value={'ignore'}>ignore</MenuItem>
                            <MenuItem value={'force'}>force</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 150}}>
                        <InputLabel id="demo-simple-select-label">Api Update State</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={apiUpdateState}
                            label="Age"
                            onChange={(v) => setApiUpdateState(v.target.value)}
                        >
                            <MenuItem value={'none'}>none</MenuItem>
                            <MenuItem value={'ignore'}>ignore</MenuItem>
                            <MenuItem value={'force'}>force</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 150}}>
                        <InputLabel id="demo-simple-select-label">Trailer Upload State</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={trailerUploadState}
                            label="Age"
                            onChange={(v) => setTrailerUploadState(v.target.value)}
                        >
                            <MenuItem value={'none'}>none</MenuItem>
                            <MenuItem value={'ignore'}>ignore</MenuItem>
                            <MenuItem value={'force'}>force</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 150}}>
                        <InputLabel id="demo-simple-select-label">Torrent sources filter</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={torrentState}
                            label="torrentState"
                            onChange={(v) => setTorrentState(v.target.value)}
                        >
                            <MenuItem value={'none'}>none</MenuItem>
                            <MenuItem value={'ignore'}>ignore</MenuItem>
                            <MenuItem value={'only'}>only</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 150}}>
                        <InputLabel id="demo-simple-select-label">Crawl Mode</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={crawlMode}
                            label="Age"
                            onChange={(v) => setCrawlMode(v.target.value)}
                        >
                            <MenuItem value={0}>First Page</MenuItem>
                            <MenuItem value={1}>Recent Pages</MenuItem>
                            <MenuItem value={2}>All pages</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                <Stack
                    css={style.checkboxContainer}
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >
                    <TextField
                        name={"crawlerConcurrency"}
                        placeholder={"Crawler Concurrency"}
                        value={configs.crawlerConcurrency}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                            crawlerConcurrency: value.target.value,
                            })
                        )}
                        label={"Crawler Concurrency"}
                        type={"number"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"axiosBlockThreshHold"}
                        placeholder={"Axios Block ThreshHold"}
                        value={configs.axiosBlockThreshHold}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                            axiosBlockThreshHold: value.target.value,
                            })
                        )}
                        label={"Axios Block ThreshHold"}
                        type={"number"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"remoteBrowserBlockThreshHold"}
                        placeholder={"RemoteBrowser Block ThreshHold"}
                        value={configs.remoteBrowserBlockThreshHold}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                            remoteBrowserBlockThreshHold: value.target.value,
                            })
                        )}
                        label={"RemoteBrowser Block ThreshHold"}
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
                                name={"dontUseRemoteBrowser"}
                                color={"secondary"}
                                checked={configs.dontUseRemoteBrowser}
                                onChange={() => setConfigs(prev => ({
                                        ...prev,
                                        dontUseRemoteBrowser: !prev.dontUseRemoteBrowser
                                    })
                                )}
                            />}
                        label="Dont Use Remote Browser"
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
                    !error && !isFetching && !isLoading && !isLoading2 && result && result.message && <div>
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
                        loading={isFetching || isLoading || isLoading2}
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
        marginTop: '20px',
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
