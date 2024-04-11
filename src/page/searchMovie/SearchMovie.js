/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {Link} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import Filters from "./Filters";


function SearchMovie() {
    const [searchResult, setSearchResult] = useState([]);

    const columns = [
        {
            field: "rawTitle",
            headerName: "RawTitle",
            width: 400
        },
        {
            field: "alternateTitles",
            headerName: "AlternateTitles",
            width: 450,
        },
        {
            field: "type",
            headerName: "Type",
            width: 110,
        },
        {
            field: "year",
            headerName: "Year",
            width: 60,
        },
        {
            field: "action",
            headerName: "Torrent Links",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <Link
                            to={"/movie/torrentLinks/" + params.row._id}
                            state={{data: params.row}}
                        >
                            <button css={style.listEdit}>Links</button>
                        </Link>
                    </>
                );
            },
        },
    ];
    return (
        <div css={style.userList}>
            <div css={style.filtersContainer}>
                <Filters setSearchResult={setSearchResult}/>
            </div>
            <DataGrid
                getRowId={(item) => item._id.toString()}
                rows={searchResult || []}
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

export default SearchMovie;
