/** @jsxImportSource @emotion/react */
import {useSelector} from "react-redux";
import {NotificationsNone, Language, Settings} from "@mui/icons-material";
import {css} from "@emotion/react";

function Topbar() {
    const profileImages = useSelector(state => state.user.profileImages);
    const profileImage = useSelector(state => state.user.profileImage);
    const username = useSelector(state => state.auth.username);

    return (
        <div css={style.topbar}>
            <div css={style.topbarWrapper}>
                <div>
                    <span css={style.logo}>Downloader Admin Panel</span>
                    <span css={style.username}>{username}</span>
                </div>
                <div css={style.topRight}>
                    <div css={style.topbarIconContainer}>
                        <NotificationsNone/>
                        <span css={style.topIconBadge}>2</span>
                    </div>
                    <div css={style.topbarIconContainer}>
                        <Language/>
                        <span css={style.topIconBadge}>2</span>
                    </div>
                    <div css={style.topbarIconContainer}>
                        <Settings/>
                    </div>
                    <img
                        css={style.topAvatar}
                        src={profileImages[0] ? profileImages[0].url : profileImage || ""}
                        alt="profile image"
                    />
                </div>
            </div>
        </div>
    );
}

const style = {
    topbar: css({
        width: '100%',
        height: '55px',
        backgroundColor: 'white',
        position: 'sticky',
        top: '0',
        zIndex: 999,
    }),
    topbarWrapper: css({
        height: '100%',
        padding: '5px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }),
    logo: css({
        fontWeight: 'bold',
        fontSize: '30px',
        color: 'darkblue',
        cursor: 'pointer',
    }),
    username: css({
        fontSize: '20px',
        color: 'darkblue',
        cursor: 'pointer',
        display: 'block',
    }),
    topRight: css({
        display: 'flex',
        alignItems: 'center',
    }),
    topbarIconContainer: css({
        position: 'relative',
        cursor: 'pointer',
        marginRight: '10px',
        color: '#555',
    }),
    topIconBadge: css({
        width: '15px',
        height: '15px',
        position: 'absolute',
        top: '-5px',
        right: '0px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
    }),
    topAvatar: css({
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        cursor: 'pointer',
    }),
};

export default Topbar;
