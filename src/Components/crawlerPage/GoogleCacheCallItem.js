/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {getPassedTime} from "../../utils/utils";
import {LoadingButton} from "@mui/lab";
import {CircularProgress} from "@mui/material";
import {removeGoogleCacheCall} from "../../api/adminApis";

const GoogleCacheCallItem = ({data, index, onRemove}) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const _remove = async () => {
        setIsRemoving(true);
        let result = await removeGoogleCacheCall(data.id);
        setIsRemoving(false);
        onRemove();
    }

    return (
        <div css={style.container}>
            <span css={style.cacheCall}>
                {index + 1}. {data.url} ({getPassedTime(data.date)}) (counts:{data.count})
            </span>

            <div css={style.removeButtonContainer}>
                <LoadingButton
                    variant={"outlined"}
                    size={"small"}
                    color={"primary"}
                    disabled={isRemoving}
                    loading={isRemoving}
                    loadingIndicator={<CircularProgress color="error" size={18}/>}
                    onClick={_remove}
                >
                    Remove
                </LoadingButton>
            </div>
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
    removeButtonContainer: css({
        position: 'absolute',
        right: '40px',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};

GoogleCacheCallItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
}


export default GoogleCacheCallItem;
