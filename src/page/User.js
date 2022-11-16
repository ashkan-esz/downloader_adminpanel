/** @jsxImportSource @emotion/react */
import {
    CalendarToday,
    LocationSearching,
    MailOutline,
    PermIdentity,
    PhoneAndroid,
    Publish,
} from "@mui/icons-material";

import {Link} from "react-router-dom";
import {css} from "@emotion/react";

function User() {
    return (
        <div css={style.user}>
            <div css={style.userTitleContainer}>
                <h1>Edit User</h1>
                <Link to="/newUser">
                    <button css={style.userAddButton}>Create</button>
                </Link>
            </div>
            <div css={style.userContainer}>
                <div css={style.userShow}>
                    <div css={style.userShowTop}>
                        <img
                            css={style.userShowImg}
                            src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                        />
                        <div css={style.userShowTopTitle}>
                            <span css={style.userShowUsername}>Anna Becker</span>
                            <span css={style.userShowUserTitle}>Software Engineer</span>
                        </div>
                    </div>
                    <div css={style.userShowBottom}>
                        <span css={style.userShowTitle}>Account Details</span>
                        <div css={style.userShowInfo}>
                            <PermIdentity css={style.userShowIcon}/>
                            <span css={style.userShowInfoTitle}>annabeck99</span>
                        </div>
                        <div css={style.userShowInfo}>
                            <CalendarToday css={style.userShowIcon}/>
                            <span css={style.userShowInfoTitle}>10.12.1999</span>
                        </div>
                        <span css={style.userShowTitle}>Contact Details</span>
                        <div css={style.userShowInfo}>
                            <PhoneAndroid css={style.userShowIcon}/>
                            <span css={style.userShowInfoTitle}>+1 123 456 67</span>
                        </div>
                        <div css={style.userShowInfo}>
                            <MailOutline css={style.userShowIcon}/>
                            <span css={style.userShowInfoTitle}>annabeck99@gmail.com</span>
                        </div>
                        <div css={style.userShowInfo}>
                            <LocationSearching css={style.userShowIcon}/>
                            <span css={style.userShowInfoTitle}>New York | USA</span>
                        </div>
                    </div>
                </div>
                <div css={style.userUpdate}>
                    <span css={style.userUpdateTitle}>Edit</span>
                    <form css={style.userUpdateForm}>
                        <div>
                            <div css={style.userUpdateItem}>
                                <label>Username</label>
                                <input
                                    css={style.userUpdateInput}
                                    type="text"
                                    placeholder="annabeck99"
                                />
                            </div>
                            <div css={style.userUpdateItem}>
                                <label>Full Name</label>
                                <input
                                    css={style.userUpdateInput}
                                    type="text"
                                    placeholder="Anna Becker"
                                />
                            </div>
                            <div css={style.userUpdateItem}>
                                <label>Email</label>
                                <input
                                    css={style.userUpdateInput}
                                    type="text"
                                    placeholder="annabeck99@gmail.com"
                                />
                            </div>
                            <div css={style.userUpdateItem}>
                                <label>Phone</label>
                                <input
                                    css={style.userUpdateInput}
                                    type="text"
                                    placeholder="+1 123 456 67"
                                />
                            </div>
                            <div css={style.userUpdateItem}>
                                <label>Address</label>
                                <input
                                    css={style.userUpdateInput}
                                    type="text"
                                    placeholder="New York | USA"
                                />
                            </div>
                        </div>
                        <div css={style.userUpdateRight}>
                            <div css={style.userUpdateUpload}>
                                <img
                                    css={style.userUpdateImg}
                                    src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                    alt=""
                                />
                                <label htmlFor="file">
                                    <Publish css={style.userUpdateIcon}/>
                                </label>
                                <input type="file" id="file" style={{display: "none"}}/>
                            </div>
                            <button css={style.userUpdateButton}>Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const style = {

    user: css({
        flex: 4,
        padding: '20px',
    }),
    userTitleContainer: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }),
    userAddButton: css({
        width: '80px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
    }),
    userContainer: css({
        display: 'flex',
        marginTop: '20px',
    }),
    userShow: css({
        flex: 1,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    userUpdate: css({
        flex: 2,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        marginLeft: '20px',
    }),
    userShowTop: css({
        display: 'flex',
        alignItems: 'center',
    }),
    userShowImg: css({
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
    }),
    userShowTopTitle: css({
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
    }),
    userShowUsername: css({
        fontWeight: 600,
    }),
    userShowUserTitle: css({
        fontWeight: 300,
    }),
    userShowBottom: css({
        marginTop: '20px',
    }),
    userShowTitle: css({
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(175, 170, 170)',
    }),
    userShowInfo: css({
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0px',
        color: '#444',
    }),
    userShowIcon: css({
        fontSize: '16px !important',
    }),
    userShowInfoTitle: css({
        marginLeft: '10px',
    }),
    userUpdateTitle: css({
        fontSize: '24px',
        fontWeight: '600',
    }),
    userUpdateForm: css({
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    }),
    userUpdateItem: css({
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
    }),
    'userUpdateItem>label': css({
        marginBottom: '5px',
        fontSize: '14px',
    }),
    userUpdateInput: css({
        border: 'none',
        width: '250px',
        height: '30px',
        borderBottom: '1px solid gray',
    }),
    userUpdateRight: css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }),
    userUpdateUpload: css({
        display: 'flex',
        alignItems: 'center',
    }),
    userUpdateImg: css({
        width: '100px',
        height: '100px',
        borderRadius: '10px',
        objectFit: 'cover',
        marginRight: '20px',
    }),
    userUpdateIcon: css({
        cursor: 'pointer',
    }),
    userUpdateButton: css({
        borderRadius: '5px',
        border: 'none',
        padding: '5px',
        cursor: 'pointer',
        backgroundColor: 'darkblue',
        color: 'white',
        fontWeight: 600,
    }),
}

export default User;
