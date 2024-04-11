/** @jsxImportSource @emotion/react */
import React, {useState} from "react";
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
import {searchMovies} from "../../api/moviesApi";

const Filters = ({setSearchResult}) => {
    const [dataLevel, setDateLevel] = useState('low');
    const [page, setpage] = useState(1);
    const [isLoading2, setIsLoading2] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [configs, setConfigs] = useState({
        title: "",
        types: "serial",
        years: "",
        imdbScores: "0-10",
        malScores: "0-10",
        genres: "",
        movieLang: "",
        embedStaffAndCharacter: false,
        noUserStats: true,
    });

    const _onPress = () => {
        setError("");
        setIsLoading2(true);
        let temp = {
            ...configs,
        }
        setConfigs(temp);
        searchMovies(dataLevel, page, temp).then((res) => {
            setSearchResult(res.data);
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
            <span css={style.title}> Movie Search Filters</span>

            <div css={style.fieldsContainer}>

                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >

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

                    <FormControl required disabled={isLoading2}
                                 sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label">Types</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={configs.types}
                            label="Age"
                            onChange={(value) => setConfigs(prev => ({
                                    ...prev,
                                    types: value.target.value,
                                })
                            )}
                        >
                            <MenuItem value={"serial"}>Serial</MenuItem>
                            <MenuItem value={"movie"}>Movie</MenuItem>
                            <MenuItem value={"anime_serial"}>Anime Serial</MenuItem>
                            <MenuItem value={"anime_movie"}>Anime Movie</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required disabled={isLoading2}
                                 sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-label">Data Level</InputLabel>
                        <Select
                            autoWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={dataLevel}
                            label="Age"
                            onChange={(v) => setDateLevel(v.target.value)}
                        >
                            <MenuItem value={"low"}>Low</MenuItem>
                            <MenuItem value={"medium"}>Medium</MenuItem>
                            <MenuItem value={"high"}>High</MenuItem>
                            <MenuItem value={"info"}>Info</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        name={"page"}
                        placeholder={"page"}
                        value={page}
                        onChange={(value) => setpage(value.target.value)}
                        label={"page"}
                        type={"text"}
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
                    <TextField
                        name={"years"}
                        placeholder={"years"}
                        value={configs.years}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                years: value.target.value,
                            })
                        )}
                        label={"years"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"imdbScores"}
                        placeholder={"imdbScores"}
                        value={configs.imdbScores}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                imdbScores: value.target.value,
                            })
                        )}
                        label={"imdbScores"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"malScores"}
                        placeholder={"malScores"}
                        value={configs.malScores}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                malScores: value.target.value,
                            })
                        )}
                        label={"malScores"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"genres"}
                        placeholder={"genres"}
                        value={configs.genres}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                genres: value.target.value,
                            })
                        )}
                        label={"genres"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                    <TextField
                        name={"movieLang"}
                        placeholder={"movieLang"}
                        value={configs.movieLang}
                        onChange={(value) => setConfigs(prev => ({
                                ...prev,
                                movieLang: value.target.value,
                            })
                        )}
                        label={"movieLang"}
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
                    !error && !isLoading2 && result && result.message && <div>
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
                        loading={isLoading2}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={_onPress}
                    >
                        Search
                    </LoadingButton>
                </div>
            </div>
        </div>
    )
};

const style = {
    container: css({
        flex: 1,
        marginTop: '10px',
        marginBottom: '15px',
        marginLeft: '10px',
        // display: 'flex',
        // alignItems: 'center',
        justifyContent: 'flex-end',
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

export default Filters;
