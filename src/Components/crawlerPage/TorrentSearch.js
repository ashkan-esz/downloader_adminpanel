/** @jsxImportSource @emotion/react */
import React, {useState} from "react";
import {startTorrentCrawlerSearch} from "../../api/adminApis";
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

const TorrentSearch = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedType, setSelectedType] = useState('serial');
    const [castUpdateState, setCastUpdateState] = useState('none');
    const [apiUpdateState, setApiUpdateState] = useState('none');
    const [trailerUploadState, setTrailerUploadState] = useState('none');
    const [isLoading2, setIsLoading2] = useState(false);
    const [result, setResult] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        sourceName: "",
        title: "",
        dontUseRemoteBrowser: false,
        crawlerConcurrency: 0,
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
        if (!selectedType) {
            setError("Choose type");
            return;
        }
        setError("");
        setIsLoading2(true);
        let temp = {
            ...configs,
            sourceName: selectedSource,
            type: selectedType,
            castUpdateState: castUpdateState,
            apiUpdateState: apiUpdateState,
            trailerUploadState: trailerUploadState,
        }
        setConfigs(temp);
        startTorrentCrawlerSearch(temp).then((res) => {
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
            <span css={style.title}> Torrent Crawler Search</span>
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
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedSource}
                            label="Age"
                            onChange={(v) => setSelectedSource(v.target.value)}
                        >
                            {
                                data.filter(item => item.isTorrent).map(item => <MenuItem
                                    key={item.sourceName}
                                    value={item.sourceName}>
                                    {item.sourceName}
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>

                    <TextField
                        name={"title"}
                        placeholder={"title"}
                        value={configs.title}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                title: value.target.value,
                            })
                        )}
                        label={"title"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />

                    <FormControl required disabled={refreshing || isFetching || isLoading || isLoading2}
                                 sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedType}
                            label="Age"
                            onChange={(v) => setSelectedType(v.target.value)}
                        >
                            <MenuItem value={"serial"}>Serial</MenuItem>
                            <MenuItem value={"movie"}>Movie</MenuItem>
                            <MenuItem value={"anime_serial"}>Anime Serial</MenuItem>
                            <MenuItem value={"anime_movie"}>Anime Movie</MenuItem>
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

export default TorrentSearch;
