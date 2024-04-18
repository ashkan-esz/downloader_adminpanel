/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";


const ConvertingFile = ({data, index}) => {
    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.name} || Progress: {data.progress} || Size: {data.size} || Duration: {(data.duration/60).toFixed(0)}Min
            </span>
        </div>
    );
};

const style = {
    container: css({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
    }),
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
    link: css({
        textDecoration: "none",
    }),
};

export default ConvertingFile;
