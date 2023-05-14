/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import CheckIcon from "./CheckIcon";
import {getPassedTime} from "../../utils/utils";
import {mutateRemoteBrowserStatus} from "../../api/adminApis";
import {MyLoadingButton} from "../index";

const RemoteBrowserItem = ({data, index}) => {
    const [isMutating, setIsMutating] = useState(false);
    const [mutateType, setMutateType] = useState((data.disabled || data.manualDisabled) ? 'enable' : 'disable');

    const _onMutate = async () => {
        setIsMutating(true);
        let result = await mutateRemoteBrowserStatus(mutateType, data.bid);
        if (result !== 'error') {
            if (mutateType === 'enable') {
                setMutateType('disable');
            } else {
                setMutateType('enable');
            }
        }
        setIsMutating(false);
    }

    return (
        <div css={style.container}>
            <div css={style.fieldContainer}>
                <span css={style.field}>
                    {index + 1}.
                    Link: {data.endpoint} ||
                    TabsCount: {data.tabsCount} ||
                    ApiCallCount: {data.apiCallCount} ||
                    Active: <CheckIcon isCheck={!data.disabled && !data.manualDisabled}/> {
                    data.disabled && <span>({getPassedTime(data.disabledTime)} ago)</span>
                }
                    {
                        data.manualDisabled && <span css={style.field2}>
                    || ManualDisabled: <CheckIcon isCheck={data.manualDisabled}/> {
                            data.manualDisabled && <span>({getPassedTime(data.manualDisabledTime)} ago)</span>
                        }
                    </span>
                    }

                </span>

                <MyLoadingButton
                    isLoading={isMutating}
                    disabled={isMutating}
                    text={mutateType === 'enable' ? 'Enable' : 'Disable'}
                    onClick={_onMutate}/>
            </div>

            {
                data.sourcesData.length > 0 && <>
                    <div css={style.titleContainer}>
                        <span css={style.title}> Sources Data: </span>
                    </div>
                    {
                        data.sourcesData.map((source, sindex) => (
                                <span key={source.sourceName} css={style.field3}>
                                    {sindex + 1}.
                                    Name: {source.sourceName} ||
                                    Error Counter: {source.errorCounter} ||
                                    lastErrorTime: {source.lastErrorTime ? getPassedTime(source.lastErrorTime) : 0} ago ||
                                    Total Error Counter: {source.totalErrorCounter} ||
                                    Active: <CheckIcon isCheck={!source.isBlocked}/>
                                </span>
                            )
                        )
                    }
                </>
            }

            {
                data.urls.length > 0 && <>
                    <div css={style.titleContainer}>
                        <span css={style.title}> Urls: </span>
                    </div>
                    {
                        data.urls.map((url, uindex) => (
                                <span key={url.url} css={style.field3}>{uindex + 1}. {url.url} ({getPassedTime(url.time)})</span>
                            )
                        )
                    }
                </>
            }

        </div>
    );
};

const style = {
    container: css({
        alignItems: 'center',
        marginTop: '5px',
    }),
    fieldContainer: css({
        display: 'flex',
    }),
    titleContainer: css({
        marginTop: '10px',
        marginBottom: '5px',
        marginLeft: '70px',
    }),
    title: css({
        fontSize: '15px',
        fontWeight: 600,
    }),
    field: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '7px',
        marginLeft: '20px',
    }),
    field2: css({
        display: 'flex',
        alignItems: 'center',
    }),
    field3: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px',
        marginBottom: '5px',
        marginLeft: '100px',
    }),
}


RemoteBrowserItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}


export default RemoteBrowserItem;
