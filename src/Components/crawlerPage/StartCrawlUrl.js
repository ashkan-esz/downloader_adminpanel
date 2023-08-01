/** @jsxImportSource @emotion/react */
import React, {useState} from "react";
import {startCrawlUrl} from "../../api/adminApis";
import {css} from "@emotion/react";
import {
    CircularProgress,
    Divider, FormControl,
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

const StartCrawlUrl = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isLoading2, setIsLoading2] = useState(false);
    const [result, setResult] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        sourceName: "",
        url: '',
        title: '',
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
        }
        setConfigs(temp);
        startCrawlUrl(temp).then((res) => {
            if (res.errorMessage || res.data.isError) {
                setError(res.errorMessage || res.data?.message);
                setResult(null);
            } else {
                setResult(res.data);
            }
            setIsLoading2(false);
        });
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Start Crawl Url </span>
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
                                 sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label2">Type</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label2"
                            id="demo-simple-select2"
                            value={selectedType}
                            onChange={(v) => setSelectedType(v.target.value)}
                        >
                            <MenuItem key={1} value={'movie'}> movie </MenuItem>
                            <MenuItem key={2} value={'serial'}> serial </MenuItem>
                            <MenuItem key={3} value={'anime_movie'}> anime_movie </MenuItem>
                            <MenuItem key={4} value={'anime_serial'}> anime_serial </MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        name={"url"}
                        placeholder={"url"}
                        value={configs.url}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                url: value.target.value,
                            })
                        )}
                        label={"url"}
                        type={"url"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />

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

export default StartCrawlUrl;
