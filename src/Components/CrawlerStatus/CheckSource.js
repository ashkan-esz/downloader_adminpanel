/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import RefreshButton from "../crawlerPage/RefreshButton";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getMovieSources} from "../../api";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {checkSourceRemoteBrowsers} from "../../api/adminApis";
import CheckIcon from "../crawlerPage/CheckIcon";


const CheckSource = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [result, setResult] = useState([]);
    const [isLoading2, setIsLoading2] = useState(false);
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
            refetchInterval: 60 * 1000,
        }
    );

    const _onRefresh = async () => {
        setResult([]);
        await queryClient.refetchQueries(['movieSources']);
    }

    const _onPress = async () => {
        setIsLoading2(true);
        setResult([]);
        let result = await checkSourceRemoteBrowsers(selectedSource, data.find(s => s.sourceName === selectedSource).url);
        if (result !== 'error') {
            setResult(result);
        }
        setIsLoading2(false);
    }

    return (
        <div css={style.container}>
            <span css={style.title}> Check Sources </span>
            <RefreshButton refreshing={isLoading || isFetching || isLoading2} onClick={_onRefresh}/>

            <div css={style.fieldsContainer}>
                <FormControl required disabled={isLoading || isFetching || isLoading2} sx={{m: 1, minWidth: 120}}>
                    <InputLabel id="demo-simple-select-label">Source</InputLabel>
                    <Select
                        autoWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSource}
                        label="Select Source"
                        onChange={(v) => setSelectedSource(v.target.value)}
                    >
                        {
                            data.map(item => <MenuItem key={item.sourceName} value={item.sourceName}>
                                {item.sourceName}
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>

                {
                    result.map((item, index) => (
                        <span key={index} css={style.field}>
                           {index + 1}. {item.sourceName} ||
                            {item.url.replace('https://', '')} ||
                            RemoteBrowser: {item.endpoint.replace('https://', '')} ||
                            Successful: <CheckIcon isCheck={!item.error}/> ||
                            Error Message: {item.errorMessage}
                        </span>
                    ))
                }

                <div css={style.submitButtonContainer}>
                    <LoadingButton
                        variant={"outlined"}
                        size={"large"}
                        color={"secondary"}
                        disabled={!selectedSource || isLoading || isFetching || isLoading2}
                        loading={isLoading || isFetching || isLoading2}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={_onPress}
                    >
                        Start
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
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
    field: css({
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        marginLeft: '10px',
    }),
    submitButtonContainer: css({
        marginTop: "20px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};


export default CheckSource;
