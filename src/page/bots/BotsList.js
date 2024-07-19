/** @jsxImportSource @emotion/react */
import {DataGrid} from '@mui/x-data-grid';
import {Check, Close, DeleteOutline} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";
import {deleteBotData, getBots} from "../../api/adminApis";
import {useQuery, useQueryClient} from "@tanstack/react-query";

function BotsList() {
    const queryClient = useQueryClient();

    const handleDelete = async (botId) => {
        await deleteBotData(botId);
        await queryClient.refetchQueries(['botsList']);
    };

    const getData = async () => {
        let result = await getBots();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['botsList'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: true,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const columns = [
        {
            field: "botName",
            headerName: "Bot Name",
            width: 150,
        },
        {
            field: "botType",
            headerName: "Bot Type",
            width: 120,
        },
        {
            field: "addDate",
            headerName: "Add Date",
            width: 200,
        },
        {
            field: "disabled",
            headerName: "Active",
            width: 60,
            renderCell: (params) => {
                return (
                    !params.row.disabled
                        ? <Check color={"success"}/>
                        : <Close color={"error"}/>
                );
            },
        },
        {
            field: "isOfficial",
            headerName: "IsOfficial",
            width: 75,
            renderCell: (params) => {
                return (
                    params.row.isOfficial
                        ? <Check color={"success"}/>
                        : <Close color={"error"}/>
                );
            },
        },
        {
            field: "permissionToLogin",
            headerName: "PermissionToLogin",
            width: 140,
            renderCell: (params) => {
                return (
                    params.row.permissionToLogin
                        ? <Check color={"success"}/>
                        : <Close color={"error"}/>
                );
            },
        },
        {
            field: "permissionToCrawl",
            headerName: "PermissionToCrawl",
            width: 140,
            renderCell: (params) => {
                return (
                    params.row.permissionToCrawl
                        ? <Check color={"success"}/>
                        : <Close color={"error"}/>
                );
            },
        },
        {
            field: "permissionToTorrentLeech",
            headerName: "PermissionToTorrentLeech",
            width: 190,
            renderCell: (params) => {
                return (
                    params.row.permissionToTorrentLeech
                        ? <Check color={"success"}/>
                        : <Close color={"error"}/>
                );
            },
        },
        {
            field: "disabledDate",
            headerName: "Disabled Date",
            width: 150,
        },
        {
            field: "action",
            headerName: "Action",
            width: 110,
            renderCell: (params) => {
                return (
                    <>
                        <Link
                            to={"/Bots/" + params.row.botId}
                            state={{data: params.row}}
                        >
                            <button css={style.listEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            css={style.listDelete}
                            onClick={() => handleDelete(params.row.botId)}
                        />
                    </>
                );
            },
        },
    ];
    return (
        <div css={style.userList}>
            <div css={style.createButtonContainer}>
                <Link to="/addBot">
                    <button css={style.sourceCreateButton}>Create</button>
                </Link>
            </div>
            <DataGrid
                getRowId={(item) => item.botId}
                rows={data || []}
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

export default BotsList;
