/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";
import * as TorrentApis from "../../api/torrentApi";
import {MyLoadingButton} from "../../Components";
import {TORRENT_API} from "../../api";


const LocalFile = ({data, index}) => {
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

    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.name} ({(data.size / (1024 * 1024)).toFixed(0)}MB) ||
                <a css={style.link} href={TORRENT_API.getUri() + data.downloadLink}> Download Link </a> ||
                <a css={style.link} href={TORRENT_API.getUri() + data.streamLink}> Stream Link </a>
            </span>

            <MyLoadingButton
                disabled={isLoading || !active}
                isLoading={isLoading}
                text={"Remove"}
                onClick={_removeFile}/>
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

export default LocalFile;
