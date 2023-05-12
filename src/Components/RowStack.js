/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {Divider, Stack} from "@mui/material";


const RowStack = ({extractStyle, children, spacing}) => {
    return (
        <Stack
            css={extractStyle}
            direction={"row"} spacing={spacing || 1.5} alignItems={"baseline"}
            divider={<Divider orientation="vertical" flexItem/>}
        >
            {children}
        </Stack>
    );
};

const style = {
    container: css({}),
};

RowStack.propTypes = {
    extractStyle: PropTypes.object,
    spacing: PropTypes.number,
}


export default RowStack;
