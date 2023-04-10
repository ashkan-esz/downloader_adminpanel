/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {PauseCircle, PlayCircleFilledWhite, HourglassBottom} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {pauseWebCrawler, resumeWebCrawler} from "../../api/adminApis";
import PropTypes from "prop-types";


const PauseCrawlerButton = ({isCrawling, isPaused}) => {
    const [loading, setLoading] = useState(false);

    const _onClick = async () => {
        setLoading(true);
        if (isPaused) {
            resumeWebCrawler(true).then(res => {
                setLoading(false);
            });
        } else {
            pauseWebCrawler(2).then(res => {
                setLoading(false);
            });
        }
    }

    return (
        <IconButton
            aria-label={"pausecircle"}
            color={loading ? "error" : "primary"}
            css={style.icon}
            disabled={!isCrawling || loading}
            onClick={_onClick}
        >
            {
                loading
                    ? <HourglassBottom fontSize={"large"}/>
                    : isPaused
                        ? <PlayCircleFilledWhite fontSize={"large"}/>
                        : <PauseCircle fontSize={"large"}/>
            }
        </IconButton>
    );
};

const style = {
    icon: css({
        position: 'absolute',
        right: 80,
        cursor: 'pointer',
        marginRight: 10,
        padding: 0,
    }),
};

PauseCrawlerButton.propTypes = {
    isCrawling: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
}

export default PauseCrawlerButton;
