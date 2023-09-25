/** @jsxImportSource @emotion/react */
import {DataGrid} from '@mui/x-data-grid';
import {Check, Close} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {getCrawlerSources, removeCrawlerSource} from "../../api/adminApis";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import {CircularProgress} from "@mui/material";

function CrawlerSourcesList() {
    const [isRemoving, setIsRemoving] = useState(false);
    const handleDelete = (sourceName) => {
        setIsRemoving(true);
        removeCrawlerSource(sourceName).then(() => {
            setIsRemoving(false);
        })
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
            field: "serial_url",
            headerName: "Serial",
            width: 230,
        },
        {
            field: "crawlCycle",
            headerName: "Cycle",
            width: 55,
        },
        {
            field: "lastCrawlDate",
            headerName: "Last Crawl",
            width: 190,
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

                        <LoadingButton
                            css={style.listDelete}
                            variant={"outlined"}
                            size={"medium"}
                            color={"secondary"}
                            disabled={isRemoving}
                            loadingIndicator={<CircularProgress color="error" size={18}/>}
                            onClick={() => handleDelete(params.row.sourceName)}
                        >
                            Remove
                        </LoadingButton>
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
        borderRadius: '10px',
        padding: '5px 10px',
        marginRight: '20px',
        fontSize: '0.8rem',
    }),
}

export default CrawlerSourcesList;
