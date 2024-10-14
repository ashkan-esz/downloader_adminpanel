/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";
import * as TorrentApis from "../../api/torrentApi";
import {MyLoadingButton} from "../../Components";
import TimeAgo from "javascript-time-ago";
import {useQueryClient} from "@tanstack/react-query";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const LocalFile = ({data, index}) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [active, setActive] = useState(true);

    const _removeFile = async () => {
        setIsLoading(true);
        let result = await TorrentApis.removeTorrentDownload(data.name);
        if (result !== 'error') {
            setActive(false);
        }
        setIsLoading(false);
    }

    const _extendExpire = async () => {
        setIsLoading(true);
        let result = await TorrentApis.extendExpireTime(data.name);
        if (result !== 'error') {
            await queryClient.refetchQueries(['torrentStatus']);
        }
        setIsLoading(false);
    }

    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.name} ({(data.size / (1024 * 1024)).toFixed(0)}MB) ||
                Expire: {timeAgo.format(new Date(data.expireTime))} ||
                 <span css={style.warning}>
                     Total-Downloads: {data.totalDownloads} ||
                     Active-Downloads: {data.activeDownloads} ||
                     Last-Download: {data.lastDownloadTime} ||
                     <a css={style.link} href={data.downloadLink}> Download Link </a> ||
                     <a css={style.link} href={data.streamLink}> Stream Link </a>
                 </span>
            </span>

            <MyLoadingButton
                disabled={isLoading || !active}
                isLoading={isLoading}
                text={"Remove"}
                onClick={_removeFile}/>
            <MyLoadingButton
                extraStyle={style.extendButton}
                disabled={isLoading || !active}
                isLoading={isLoading}
                text={"Extend Expire"}
                onClick={_extendExpire}/>
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
    extendButton: css({
        right: "125px",
    }),
};

export default LocalFile;
