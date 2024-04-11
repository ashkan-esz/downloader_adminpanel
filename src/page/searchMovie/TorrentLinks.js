/** @jsxImportSource @emotion/react */
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {DataGrid} from "@mui/x-data-grid";
import {getMovieData} from "../../api/moviesApi";

function TorrentLinks() {
    const location = useLocation();

    const getData = async () => {
        let result = await getMovieData(location.state?.data?._id.toString(), "dlink");
        if (result !== 'error') {
            let links = result.data.type.includes('serial')
                ? result.data.seasons.map(s => s.episodes).flat(1).map(e => e.torrentLinks).flat(1)
                : result.data.qualities.flat(1).map(e => e.torrentLinks).flat(1)
            // console.log(links[0]);
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

    const columns = [
        {
            field: "info",
            headerName: "Info",
            width: 400
        },
        {
            field: "link",
            headerName: "Link",
            width: 450,
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
            width: 70,
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link
                            to={"/movie/torrentLinks/" + params.row.link}
                            state={{data: params.row}}
                        >
                            <button css={style.listEdit}>Download</button>
                        </Link>
                    </>
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
