/** @jsxImportSource @emotion/react */
import {Link} from "react-router-dom";
import {CalendarToday, Grade} from "@mui/icons-material";
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBots, sendMessageToBotUsers} from "../../api/adminApis";
import {BotDataUpdateForm} from "../../Components/botsPage";
import {CircularProgress, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";


function Bot() {
    const location = useLocation();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [messageUserId, setMessageUserId] = useState(0);
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);

    const getData = async () => {
        let result = await getBots(location.state?.data?.botId);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data} = useQuery(
        ['botData', location.state?.data?.botId],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _updateBotData = async () => {
        await Promise.allSettled([
            queryClient.refetchQueries(['botData']),
            queryClient.refetchQueries(['botsList']),
        ]);
    }

    const _sendMessage = () => {
        setError("");
        setIsSending(true);
        sendMessageToBotUsers(data.botId, message, messageUserId).then(async res => {
            setIsSending(false);
            if (res.errorMessage) {
                setError(res.errorMessage);
            } else {
                setError("");
            }
        });
    }

    if (!data) {
        return null;
    }

    return (
        <div css={style.container}>

            <div css={style.headContainer}>
                <h1>Edit Bot</h1>
                <Link to="/addBot">
                    <button css={style.sourceCreateButton}>Create</button>
                </Link>
            </div>

            <div css={style.detailsContainer}>
                <div css={style.sourceShow}>
                    <span css={style.sourceName}>{data.botName} - {data.botType}</span>

                    <div css={style.sourceShowBottom}>
                        <span css={style.sourceShowTitle}>Bot Details</span>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Added: {data.addDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Disabled Date: {data.disabledDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Config Update Date: {data.lastConfigUpdateDate?.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <Grade css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                UserData: {JSON.stringify(data.userData)}
                            </span>
                        </div>

                        <div css={[style.fieldInfo, {display: "block", marginTop: "50px"}]}>
                              <span css={style.fieldInfoTitle}>
                                  Send Message to Users
                              </span>

                            <div>
                                <TextField
                                    css={style.textField}
                                    value={message}
                                    onChange={(value) => setMessage(value.target.value)}
                                    name={"message"}
                                    placeholder={"message"}
                                    label={"message"}
                                    type={"text"}
                                    margin={"dense"}
                                    variant={"standard"}
                                    color={"secondary"}
                                />
                            </div>
                            <div>
                                <TextField
                                    css={style.textField}
                                    value={messageUserId}
                                    onChange={(value) => setMessageUserId(Number(value.target.value))}
                                    name={"messageUserId"}
                                    placeholder={"messageUserId"}
                                    label={"messageUserId"}
                                    type={"text"}
                                    margin={"dense"}
                                    variant={"standard"}
                                    color={"secondary"}
                                />
                            </div>

                            {
                                !!error &&
                                <Typography
                                    css={style.errorText}
                                    variant="subtitle2"
                                    component="h2"
                                    color={"red"}
                                >
                                    *{error}.
                                </Typography>
                            }

                            <div css={style.submitButtonContainer}>
                                <LoadingButton
                                    variant={"outlined"}
                                    size={"large"}
                                    color={"secondary"}
                                    loading={isSending}
                                    loadingIndicator={<CircularProgress color="error" size={18}/>}
                                    onClick={_sendMessage}
                                >
                                    Send Message
                                </LoadingButton>
                            </div>

                        </div>
                    </div>
                </div>

                <div css={style.editContainer}>
                    <span css={style.editTitle}>Edit</span>
                    <BotDataUpdateForm
                        extraStyle={style.updateFormContainer}
                        botData={data}
                        onDataUpdate={_updateBotData}
                    />
                </div>
            </div>
        </div>
    );
}

const style = {
    container: css({
        flex: 4,
        padding: '20px',
    }),
    headContainer: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }),
    sourceCreateButton: css({
        width: '80px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
    }),
    detailsContainer: css({
        display: 'flex',
        marginTop: '20px',
    }),
    updateFormContainer: css({
        marginTop: '20px',
    }),
    sourceShow: css({
        flex: 2,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    editContainer: css({
        flex: 2,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        marginLeft: '20px',
    }),
    sourceName: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: '20px',
        fontWeight: 600,
    }),
    sourceShowBottom: css({
        marginTop: '20px',
    }),
    sourceShowTitle: css({
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(175, 170, 170)',
    }),
    fieldInfo: css({
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0px',
        color: '#444',
    }),
    fieldInfoIcon: css({
        fontSize: '16px !important',
    }),
    fieldInfoTitle: css({
        marginLeft: '10px',
    }),
    editTitle: css({
        fontSize: '24px',
        fontWeight: '600',
    }),
    textField: css({
        flex: 1,
        width: '100%',
        color: 'red',
    }),
    errorText: css({
        marginTop: "65px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '300px',
        position: 'absolute',
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
}

export default Bot;
