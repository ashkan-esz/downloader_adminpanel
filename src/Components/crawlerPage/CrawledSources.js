/** @jsxImportSource @emotion/react */
import {Divider, Stack} from "@mui/material";
import {css} from "@emotion/react";


const CrawledSources = ({crawledSources, fieldStyle}) => {
    return (
        <div css={style.container}>
            <div css={style.titleContainer}>
                <span css={style.title}> Crawled Sources </span>
            </div>

            {crawledSources.map(item => (
                <Stack
                    key={item.name}
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    alignItems={"baseline"}
                >
                    <span css={fieldStyle}>sourceName: {item.name}</span>
                    <span css={fieldStyle}>startTime: {item.startTime}</span>
                    <span css={fieldStyle}>crawlMode: {item.crawlMode}</span>
                    <span css={fieldStyle}>endTime: {item.endTime}</span>
                    <span css={fieldStyle}>time: {item.time}</span>
                    <span css={fieldStyle}>lastPage(s): {item.lastPages.join(',')}</span>
                </Stack>
            ))}
        </div>
    );
};

const style = {
    container: css({
        marginLeft: '10px',
    }),
    title: css({
        fontSize: '18px',
        fontWeight: 600,
    }),
    titleContainer: css({
        marginTop: '20px',
        marginBottom: '10px',
    }),
}


export default CrawledSources;
