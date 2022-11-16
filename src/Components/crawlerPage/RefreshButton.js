/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {Refresh} from "@mui/icons-material";
import {CircularProgress} from "@mui/material";


const RefreshButton = ({refreshing, onClick}) => {

    if (!refreshing) {
        return (
            <Refresh
                fontSize={"large"}
                color={"primary"}
                css={style.refreshIcon}
                onClick={onClick}
            />
        );
    }

    return (
        <CircularProgress
            color={"error"}
            size={35}
            css={style.refreshIcon}
        />
    );
};

const style = {
    refreshIcon: css({
        position: 'absolute',
        right: 40,
        cursor: 'pointer',
    }),
};

RefreshButton.propTypes = {
    refreshing: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}


export default RefreshButton;
