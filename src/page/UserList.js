/** @jsxImportSource @emotion/react */
import {DataGrid} from '@mui/x-data-grid';
import {DeleteOutline} from "@mui/icons-material";
import {userRows} from "../DummyData";
import {Link} from "react-router-dom";
import {useState} from "react";
import {css} from "@emotion/react";

function UserList() {
    const [data, setData] = useState(userRows);
    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "user",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div css={style.userListUser}>
                        <img css={style.userListImg} src={params.row.avatar} alt=""/>
                        {params.row.username}
                    </div>
                );
            },
        },
        {
            field: "email",
            headerName: "Email",
            width: 200
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
        },
        {
            field: "transaction",
            headerName: "Transaction Volume",
            width: 160,
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row.id}>
                            <button css={style.userListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            css={style.userListDelete}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </>
                );
            },
        },
    ];
    return (
        <div css={style.userList}>
            <DataGrid
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                checkboxSelection
            />
        </div>
    );
}

const style = {
    userList: css({
        flex: 4,
    }),
    userListUser: css({
        display: 'flex',
        alignItems: 'center',
    }),
    userListImg: css({
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: '10px',
    }),
    userListEdit: css({
        border: 'none',
        borderRadius: '10px',
        padding: '5px 10px',
        backgroundColor: '#3bb077',
        color: 'white',
        cursor: 'pointer',
        marginRight: '20px',
    }),
    userListDelete: css({
        color: 'red',
        cursor: 'pointer',
    }),
}

export default UserList;
