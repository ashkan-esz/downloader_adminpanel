/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {LoadingButton} from "@mui/lab";
import {CircularProgress} from "@mui/material";
import PropTypes from 'prop-types';


const MyLoadingButton = ({extraStyle, disabled, isLoading, onClick, text}) => {
    return (
        <div css={[style.buttonContainer, extraStyle]}>
            <LoadingButton
                variant={"outlined"}
                size={"small"}
                color={"primary"}
                disabled={disabled}
                loading={isLoading}
                loadingIndicator={<CircularProgress color="error" size={18}/>}
                onClick={onClick}
            >
                {text}
            </LoadingButton>
        </div>
    );
};

const style = {
    buttonContainer: css({
        position: 'absolute',
        right: '40px',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};

MyLoadingButton.propTypes = {
    extraStyle: PropTypes.object,
    disabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}


export default MyLoadingButton;
