/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {Cancel, HourglassBottom} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {stopWebCrawler} from "../../api/adminApis";
import PropTypes from "prop-types";

const StopCrawlerButton = ({isCrawling}) => {
    const [loading, setLoading] = useState(false);

    const _onClick = async () => {
        setLoading(true);
        stopWebCrawler().then(res => {
            setLoading(false);
        });
    }

    return (
        <IconButton
            aria-label={"cancel"}
            color={loading ? "error" : "primary"}
            css={style.icon}
            disabled={!isCrawling || loading}
            onClick={_onClick}
        >
            {
                loading
                    ? <HourglassBottom fontSize={"large"}/>
                    : <Cancel fontSize={"large"}/>

            }
        </IconButton>
    );
};

const style = {
    icon: css({
        position: 'absolute',
        right: 120,
        cursor: 'pointer',
        marginRight: 20,
        padding: 0,
    }),
};

StopCrawlerButton.propTypes = {
    isCrawling: PropTypes.bool.isRequired,
}

export default StopCrawlerButton;
