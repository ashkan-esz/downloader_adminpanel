/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {Check, Close} from "@mui/icons-material";


const CheckIcon = ({isCheck}) => {
    if (isCheck){
        return (
            <Check css={style.fieldIcon} color={"success"}/>
        );
    }
    return (
        <Close css={style.fieldIcon} color={"error"}/>
    );
};

const style = {
    fieldIcon: css({
        marginLeft: '5px',
    }),
};

CheckIcon.propTypes = {
    isCheck: PropTypes.bool.isRequired,
}


export default CheckIcon;
