/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {DataGrid} from "@mui/x-data-grid";
import {getMovieData} from "../../api/moviesApi";
import * as TorrentApis from "../../api/torrentApi";
import {useState} from "react";
import MyLoadingButton from "../../Components/MyLoadingButton";
import {TORRENT_API} from "../../api";

function TorrentLinks() {
    const [downloadingLink, setDownloadingLink] = useState("");
    const location = useLocation();

    const getData = async () => {
        let result = await getMovieData(location.state?.data?._id.toString(), "dlink");
        if (result !== 'error') {
            let links = result.data.type.includes('serial')
                ? result.data.seasons.map(s => s.episodes).flat(1).map(e => e.torrentLinks).flat(1)
                : result.data.qualities.flat(1).map(e => e.torrentLinks).flat(1)
            // console.log(links[0]);
            for (let i = 0; i < links.length; i++) {
                if (links[i].localLink) {
                    links[i].localLink = TORRENT_API.getUri() + links[i].localLink
                }
            }
            return links;
        } else {
            throw new Error();
        }
    }

    const {data} = useQuery(
        ['movieLinks', location.state?.data?._id.toString()],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _download = async (row) => {
        if (location.state?.data?._id.toString()) {
            setDownloadingLink(row.link);
            await TorrentApis.downloadTorrent(location.state?.data?._id.toString(), row.link)
            setDownloadingLink("");
        }
    }

    const columns = [
        {
            field: "info",
            headerName: "Info",
            width: 400
        },
        {
            field: "link",
            headerName: "Link",
            width: 350,
        },
        // {
        //     field: "type",
        //     headerName: "Type",
        //     width: 70,
        // },
        {
            field: "size",
            headerName: "Size",
            width: 60,
        },
        {
            field: "season",
            headerName: "Season",
            width: 50,
        },
        {
            field: "episode",
            headerName: "Episode",
            width: 50,
        },
        {
            field: "sourceName",
            headerName: "SourceName",
            width: 100,
        },
        {
            field: "localLink",
            headerName: "Local Link",
            width: 100,
        },
        {
            field: "action",
            headerName: "Action",
            width: 250,
            renderCell: (params) => {
                return (
                    <MyLoadingButton
                        disabled={params.row.localLink !== "" || downloadingLink !== ""}
                        isLoading={downloadingLink === params.row.link}
                        text={"Start Torrent Download"}
                        onClick={() => _download(params.row)}
                    />
                );
            },
        },
    ];

    return (
        <div css={style.userList}>
            <DataGrid
                getRowId={(item) => item.link}
                rows={data || []}
                disableSelectionOnClick
                columns={columns}
                pageSize={20}
                checkboxSelection={false}
                rowsPerPageOptions={[10, 20, 50]}
                // loading={isLoading || isFetching}
            />
        </div>
    );
}

const style = {
    userList: css({
        flex: 4,
    }),
    filtersContainer: css({
        marginTop: '10px',
        marginBottom: '15px',
        marginRight: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }),
    listEdit: css({
        border: 'none',
        borderRadius: '10px',
        padding: '5px 10px',
        backgroundColor: '#3bb077',
        color: 'white',
        cursor: 'pointer',
        marginRight: '20px',
    }),
    listDelete: css({
        color: 'red',
        cursor: 'pointer',
        borderRadius: '10px',
        padding: '5px 10px',
        marginRight: '20px',
        fontSize: '0.8rem',
    }),
}

export default TorrentLinks;
