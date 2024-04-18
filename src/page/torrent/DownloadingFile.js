/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useState} from "react";
import * as TorrentApis from "../../api/torrentApi";
import {MyLoadingButton} from "../../Components";


const DownloadingFile = ({data, index}) => {
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
            <div css={style.warning}>
                <span>
                    {index + 1}. {data.name} ||
                    State: {data.state} ||
                    Downloaded: {(data.downloadedSize / (1024 * 1024)).toFixed(0)}/{(data.size / (1024 * 1024)).toFixed(0)}MB
                    ({((data.downloadedSize / data.size) * 100).toFixed(2)}%)

                </span>
                    <span css={style.warning}>
                    Title: {data.titleName} ||
                    Type: {data.titleType} ||
                    Id: {data.titleId} ||
                    <a css={style.link} href={data.torrentUrl}> Torrent Link </a>
                </span>
            </div>

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

export default DownloadingFile;
