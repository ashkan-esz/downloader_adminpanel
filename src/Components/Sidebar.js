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
import {Link, useLocation} from "react-router-dom";
import {css} from "@emotion/react";

function Sidebar() {
    const location = useLocation();

    return (
        <div css={style.sidebar}>
            <div css={style.sidebarWrapper}>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Dashboard</h3>
                    <ul css={style.sidebarList}>
                        <Link to="/" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname === '/' && style.activeSidebarListItem]}>
                                <LineStyle css={style.sidebarIcon}/>
                                User
                            </li>
                        </Link>
                        <Link to="/crawler" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/crawler') && style.activeSidebarListItem]}>
                                <LineStyle css={style.sidebarIcon}/>
                                Crawler
                            </li>
                        </Link>
                        <Link to="/serverstatus" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/serverstatus') && style.activeSidebarListItem]}>
                                <LineStyle css={style.sidebarIcon}/>
                                Server Status
                            </li>
                        </Link>
                        <Link to="/configs" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/configs') && style.activeSidebarListItem]}>
                                <LineStyle css={style.sidebarIcon}/>
                                Configs
                            </li>
                        </Link>
                        <Link to="/warnings" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/warnings') && style.activeSidebarListItem]}>
                                <Timeline css={style.sidebarIcon}/>
                                Warnings
                            </li>
                        </Link>
                        <Link to="/googlecache" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/googlecache') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                GoogleCacheCalls
                            </li>
                        </Link>
                        <Link to="/badlinks" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/badlinks') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                BadLinks
                            </li>
                        </Link>
                        <Link to="/serverlogs" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/serverlogs') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                ServerLogs
                            </li>
                        </Link>
                        <Link to="/appversions" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/appversions') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                AppVersions
                            </li>
                        </Link>
                        <Link to="/cronjobs" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/cronjobs') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                CronJobs
                            </li>
                        </Link>
                        <Link to="/searchMovie" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/searchMovie') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                SearchMovie
                            </li>
                        </Link>
                        <Link to="/torrent" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/torrent') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                Torrent
                            </li>
                        </Link>

                        <Link to="/role/all_permissions" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/all_permissions') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                Roles.All_Permissions
                            </li>
                        </Link>
                        <Link to="/role/all_roles" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/all_roles') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                Roles.All_Roles
                            </li>
                        </Link>
                        <Link to="/role/all_users" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/all_users') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                Roles.All_Users
                            </li>
                        </Link>
                        <Link to="/chat/services" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/chat/services') && style.activeSidebarListItem]}>
                                <TrendingUp css={style.sidebarIcon}/>
                                Chat Services
                            </li>
                        </Link>

                    </ul>
                </div>
                <div css={style.sidebarMenu}>
                    <h3 css={style.sidebarTitle}>Quick Menu</h3>
                    <ul css={style.sidebarList}>
                        <Link to="/crawlerSourcesList" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/crawlerSourcesList') && style.activeSidebarListItem]}>
                                <Source css={style.sidebarIcon}/>
                                Crawler Sources
                            </li>
                        </Link>
                        <Link to="/botsList" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/botsList') && style.activeSidebarListItem]}>
                                <Source css={style.sidebarIcon}/>
                                Bots
                            </li>
                        </Link>
                        <Link to="/movies" css={style.link}>
                            <li css={[style.sidebarListItem, location.pathname.includes('/movies') && style.activeSidebarListItem]}>
                                <Source css={style.sidebarIcon}/>
                                Movies
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
