/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {getMovieData} from "../../api/moviesApi";
import React, {useEffect, useState} from "react";
import {CircularProgress, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {editMovieTorrentConfig} from "../../api/adminApis";
import {useForm} from "react-hook-form";

function TorrentConfigs() {
    const [torrentConfigs, setTorrentConfigs] = useState({
        disabled: false,
        newEpisodeQualities: "",
        movieQualities: "",
        torrentFilesExpireHour: 0,
        bypassIfHasDownloadLink: false,
        newEpisodeLinkLimit: 0,
        movieLinkLimit: 0,
    });
    const location = useLocation();
    const {reset, formState: {errors}} = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsLoading(true);
        getMovieData(location.state?.data?._id.toString(), "info").then(result => {
            setIsLoading(false);
            if (result !== 'error') {
                if (result.data.torrentDownloaderConfig) {
                    setTorrentConfigs(result.data.torrentDownloaderConfig);
                }
                return result.data;
            }
        });
    }, []);

    const _onPress = () => {
        setIsLoading2(true);
        let updateFields = {
            torrentDownloaderConfig: {
                ...torrentConfigs,
                disabled: torrentConfigs.disabled === "true",
                bypassIfHasDownloadLink: torrentConfigs.bypassIfHasDownloadLink === "true",
            }
        };

        editMovieTorrentConfig(location.state?.data?._id.toString(), updateFields).then(async res => {
            if (res.errorMessage) {
                setError(res.errorMessage);
            } else {
                setError("");
            }
            setIsLoading2(false);
        });
    }

    const _removeConfig = () => {
        setIsLoading2(true);
        let updateFields = {
            torrentDownloaderConfig: {},
        };

        editMovieTorrentConfig(location.state?.data?._id.toString(), updateFields).then(async res => {
            if (res.errorMessage) {
                setError(res.errorMessage);
            } else {
                setError("");
                setTorrentConfigs({
                    disabled: false,
                    newEpisodeQualities: "",
                    movieQualities: "",
                    torrentFilesExpireHour: 0,
                    bypassIfHasDownloadLink: false,
                    newEpisodeLinkLimit: 0,
                    movieLinkLimit: 0,
                });
            }
            setIsLoading2(false);
        });
    }

    if (isLoading) {
        return (
            <CircularProgress color="error" size={18}/>
        );
    }

    return (
        <div css={style.container}>

            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.disabled}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            disabled: value.target.value,
                        })
                    )}
                    name={"disabled"}
                    placeholder={torrentConfigs.disabled || ''}
                    label={"disabled"}
                    type={"text"}
                    error={!!errors.disabled}
                    helperText={errors.disabled?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.newEpisodeQualities}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            newEpisodeQualities: value.target.value,
                        })
                    )}
                    name={"newEpisodeQualities"}
                    placeholder={torrentConfigs.newEpisodeQualities || ''}
                    label={"newEpisodeQualities"}
                    type={"text"}
                    error={!!errors.newEpisodeQualities}
                    helperText={errors.newEpisodeQualities?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.movieQualities}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            movieQualities: value.target.value,
                        })
                    )}
                    name={"movieQualities"}
                    placeholder={torrentConfigs.movieQualities || ''}
                    label={"movieQualities"}
                    type={"text"}
                    error={!!errors.movieQualities}
                    helperText={errors.movieQualities?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.torrentFilesExpireHour}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            torrentFilesExpireHour: Number(value.target.value),
                        })
                    )}
                    name={"torrentFilesExpireHour"}
                    placeholder={torrentConfigs.torrentFilesExpireHour.toString() || '0'}
                    label={"torrentFilesExpireHour"}
                    type={"number"}
                    error={!!errors.torrentFilesExpireHour}
                    helperText={errors.torrentFilesExpireHour?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>
            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.newEpisodeLinkLimit}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            newEpisodeLinkLimit: Number(value.target.value),
                        })
                    )}
                    name={"newEpisodeLinkLimit"}
                    placeholder={torrentConfigs.newEpisodeLinkLimit.toString() || '0'}
                    label={"newEpisodeLinkLimit"}
                    type={"number"}
                    error={!!errors.newEpisodeLinkLimit}
                    helperText={errors.newEpisodeLinkLimit?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.movieLinkLimit}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            movieLinkLimit: Number(value.target.value),
                        })
                    )}
                    name={"movieLinkLimit"}
                    placeholder={torrentConfigs.movieLinkLimit.toString() || '0'}
                    label={"movieLinkLimit"}
                    type={"number"}
                    error={!!errors.movieLinkLimit}
                    helperText={errors.movieLinkLimit?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
                />
            </div>

            <div>
                <TextField
                    css={style.textField}
                    value={torrentConfigs.bypassIfHasDownloadLink}
                    onChange={(value) => setTorrentConfigs(prev => ({
                            ...prev,
                            bypassIfHasDownloadLink: value.target.value,
                        })
                    )}
                    name={"bypassIfHasDownloadLink"}
                    placeholder={torrentConfigs.bypassIfHasDownloadLink.toString() || ''}
                    label={"bypassIfHasDownloadLink"}
                    type={"text"}
                    error={!!errors.bypassIfHasDownloadLink}
                    helperText={errors.bypassIfHasDownloadLink?.message}
                    margin={"dense"}
                    variant={"standard"}
                    color={"secondary"}
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

            <div css={style.buttonsContainer}>
                <div css={[style.submitButtonContainer, style.resetButtonMargin]}>
                    <LoadingButton
                        variant={"outlined"}
                        size={"large"}
                        color={"primary"}
                        loading={isLoading || isLoading2}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={_removeConfig}
                    >
                        Remove Config
                    </LoadingButton>
                </div>

                <div css={style.submitButtonContainer}>
                    <LoadingButton
                        variant={"outlined"}
                        size={"large"}
                        color={"secondary"}
                        loading={isLoading || isLoading2}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={_onPress}
                    >
                        Update
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
}

const style = {
    container: css({
        flex: 4,
    }),
    textField: css({
        flex: 1,
        width: '100%',
        maxWidth: '800px',
        color: 'red',
    }),
    errorText: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    buttonsContainer: css({
        display: "flex",
        flexDirection: 'row',
    }),
    resetButtonMargin: css({
        marginRight: "10px",
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    switch: css({
        display: 'block',
    }),
}

export default TorrentConfigs;
