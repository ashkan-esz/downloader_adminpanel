/** @jsxImportSource @emotion/react */
import {
    LineStyle,
    Timeline,
    TrendingUp,
    PermIdentity,
    Storefront,
    AttachMoney,
    BarChart,
    MailOutline,
    DynamicFeed,
    ChatBubbleOutline,
    WorkOutline,
    Report, Source,
} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {css} from "@emotion/react";

function Sidebar() {
    return (
        <div css={style.sidebar}>
            <div css={style.sidebarWrapper}>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Dashboard</h3>
                    <ul css={style.sidebarList}>
                        <Link to="/" css={style.link}>
                            <li css={[style.sidebarListItem, style.activeSidebarListItem]}>
                                <LineStyle css={style.sidebarIcon}/>
                                User
                            </li>
                        </Link>
                        <Link to="/crawler" css={style.link}>
                            <li css={style.sidebarListItem}>
                                <LineStyle css={style.sidebarIcon}/>
                                Crawler
                            </li>
                        </Link>
                        <li css={style.sidebarListItem}>
                            <Timeline css={style.sidebarIcon}/>
                            Analytics
                        </li>
                        <li css={style.sidebarListItem}>
                            <TrendingUp css={style.sidebarIcon}/>
                            Sales
                        </li>
                    </ul>
                </div>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Quick Menu</h3>
                    <ul css={style.sidebarList}>
                        <Link to="/crawlerSourcesList" css={style.link}>
                            <li css={style.sidebarListItem}>
                                <Source css={style.sidebarIcon}/>
                                Crawler Sources
                            </li>
                        </Link>
                        <Link to="/users" css={style.link}>
                            <li css={style.sidebarListItem}>
                                <PermIdentity css={style.sidebarIcon}/>
                                Users
                            </li>
                        </Link>
                        <Link to="/products" css={style.link}>
                            <li css={style.sidebarListItem}>
                                <Storefront css={style.sidebarIcon}/>
                                Products
                            </li>
                        </Link>
                        <li css={style.sidebarListItem}>
                            <AttachMoney css={style.sidebarIcon}/>
                            Transactions
                        </li>
                        <li css={style.sidebarListItem}>
                            <BarChart css={style.sidebarIcon}/>
                            Reports
                        </li>
                    </ul>
                </div>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Notifications</h3>
                    <ul css={style.sidebarList}>
                        <li css={style.sidebarListItem}>
                            <MailOutline css={style.sidebarIcon}/>
                            Mail
                        </li>
                        <li css={style.sidebarListItem}>
                            <DynamicFeed css={style.sidebarIcon}/>
                            Feedback
                        </li>
                        <li css={style.sidebarListItem}>
                            <ChatBubbleOutline css={style.sidebarIcon}/>
                            Messages
                        </li>
                    </ul>
                </div>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Staff</h3>
                    <ul css={style.sidebarList}>
                        <li css={style.sidebarListItem}>
                            <WorkOutline css={style.sidebarIcon}/>
                            Manage
                        </li>
                        <li css={style.sidebarListItem}>
                            <Timeline css={style.sidebarIcon}/>
                            Analytics
                        </li>
                        <li css={style.sidebarListItem}>
                            <Report css={style.sidebarIcon}/>
                            Reports
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const style = {
    link: css({
        textDecoration: 'none',
        color: 'inherit',
    }),
    sidebar: css({
        flex: 1,
        height: 'calc(100vh - 50px)',
        backgroundColor: 'rgb(251, 251, 255)',
        position: 'sticky',
        top: '50px',
    }),
    sidebarWrapper: css({
        padding: '20px',
        color: '#555',
    }),
    sidebarMenu: css({
        marginBottom: '10px',
    }),
    sidebarTitle: css({
        fontSize: '13px',
        color: 'rgb(187, 186, 186)',
    }),
    sidebarList: css({
        listStyle: 'none',
        padding: '5px',
    }),
    sidebarListItem: css({
        padding: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        '&:hover,&:active': {
            backgroundColor: 'rgb(240, 240, 255)',
        }
    }),
    activeSidebarListItem: css({
        backgroundColor: 'rgb(240, 240, 255)',
    }),
    sidebarIcon: css({
        marginRight: '5px',
        fontSize: '20px !important',
    }),
}

export default Sidebar;
