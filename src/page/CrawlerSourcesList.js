/** @jsxImportSource @emotion/react */
import {DataGrid} from '@mui/x-data-grid';
import {Check, Close, DeleteOutline} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {getCrawlerSources} from "../api/adminApis";
import {useQuery} from "@tanstack/react-query";

function CrawlerSourcesList() {
    const handleDelete = (sourceName) => {
        //todo : add
    };

    const getData = async () => {
        let result = await getCrawlerSources();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['crawlerSourcesPage'],
        getData,
        {
            placeholderData: {
                sources: [],
            },
            keepPreviousData: true,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const columns = [
        {
            field: "sourceName",
            headerName: "Source Name",
            width: 150,
        },
        {
            field: "movie_url",
            headerName: "Movie",
            width: 230
        },
        {
            field: "page_count",
            headerName: "pages",
            width: 80,
        },
        {
            field: "serial_url",
            headerName: "Serial",
            width: 230,
        },
        {
            field: "serial_page_count",
            headerName: "Pages",
            width: 80,
        },
        {
            field: "crawlCycle",
            headerName: "Cycle",
            width: 70,
        },
        {
            field: "lastCrawlDate",
            headerName: "Last Crawl",
            width: 200,
        },
        {
            field: "disabled",
            headerName: "Active",
            width: 70,
            renderCell: (params) => {
                if (!params.row.disabled) {
                    return (
                        <Check color={"success"}/>
                    );
                }
                return (
                    <Close color={"error"}/>
                );
            },
        },
        {
            field: "disabledDate",
            headerName: "Disabled Date",
            width: 200,
        },
        {
            field: "action",
            headerName: "Action",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <Link
                            to={"/CrawlerSource/" + params.row.sourceName}
                            state={{data: params.row}}
                        >
                            <button css={style.listEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            css={style.listDelete}
                            onClick={() => handleDelete(params.row.sourceName)}
                        />
                    </>
                );
            },
        },
    ];
    return (
        <div css={style.userList}>
            <div css={style.createButtonContainer}>
                <Link to="/addCrawlerSource">
                    <button css={style.sourceCreateButton}>Create</button>
                </Link>
            </div>
            <DataGrid
                getRowId={(item) => item.sourceName}
                rows={data ? data.sources : []}
                disableSelectionOnClick
                columns={columns}
                pageSize={20}
                checkboxSelection
                rowsPerPageOptions={[10, 20, 50]}
                loading={isLoading || isFetching}
            />
        </div>
    );
}

const style = {
    userList: css({
        flex: 4,
    }),
    createButtonContainer: css({
        marginTop: '10px',
        marginBottom: '15px',
        marginRight: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }),
    sourceCreateButton: css({
        width: '80px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '18px',
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
    }),
}

export default CrawlerSourcesList;
