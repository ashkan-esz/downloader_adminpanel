/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {getPassedTime} from "../../utils/utils";
import {resolveServerAnalysis} from "../../api/adminApis";
import MyLoadingButton from "../MyLoadingButton";

const GoogleCacheCallItem = ({data, index, onRemove}) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const [active, setActive] = useState(true);

    const _remove = async () => {
        setIsRemoving(true);
        let result = await resolveServerAnalysis('googleCacheCalls', data.id);
        if (result !== 'error') {
            setActive(false);
        }
        setIsRemoving(false);
        onRemove();
    }

    return (
        <div css={style.container}>
            <span css={style.cacheCall}>
                {index + 1}. {data.url} ({getPassedTime(data.date)}) (counts:{data.count})
            </span>

            <MyLoadingButton
                disabled={isRemoving || !active}
                isLoading={isRemoving}
                text={"Remove"}
                onClick={_remove}/>
        </div>
    );
};

const style = {
    container: css({
        display: 'flex',
        alignItems: 'center',
    }),
    cacheCall: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
};

GoogleCacheCallItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
}


export default GoogleCacheCallItem;
