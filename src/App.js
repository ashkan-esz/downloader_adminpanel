/** @jsxImportSource @emotion/react */
import {useEffect} from "react";
import LogInScreen from "./Components/loginScreen/LogInScreen";
import '@fontsource/roboto/400.css';
import {useDispatch, useSelector} from "react-redux";
import Sidebar from "./Components/Sidebar";
import User from "./page/User";
import Product from "./page/Product";
import UserList from "./page/UserList";
import NewUser from "./page/NewUser";
import ProductList from "./page/ProductList";
import NewProduct from "./page/NewProduct";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Topbar from "./Components/Topbar";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {profile_api} from "./redux/slices/user.slice";
import {
    AddBot,
    AddCrawlerSource, AppVersions, BadLinks, Bot, BotsList,
    Configs,
    Crawler,
    CrawlerSource,
    CrawlerSourcesList, CronJobs, SearchMovie, TorrentLinks,
    GoogleCache, Torrent,
    Home, Movies, ServerLogs,
    ServerStatus, Warnings, AllPermissions, AllUsers, AllRoles, Role, CreateRole, EditRole,
} from "./page";
import {css} from "@emotion/react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 3.2 * 60 * 1000,
            staleTime: 3.2 * 60 * 1000
        }
    }
});

const App = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(profile_api());
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(profile_api());
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <LogInScreen/>
        );
    }

    return (
        <BrowserRouter>
            <Topbar/>
            <QueryClientProvider client={queryClient}>
                <div css={style.container}>
                    <Sidebar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/crawler" element={<Crawler/>}/>
                        <Route path="/serverstatus" element={<ServerStatus/>}/>
                        <Route path="/crawlerSourcesList" element={<CrawlerSourcesList/>}/>
                        <Route path="/crawlerSource/:sourceName" element={<CrawlerSource/>}/>
                        <Route path="/addCrawlerSource" element={<AddCrawlerSource/>}/>
                        <Route path="/botsList" element={<BotsList/>}/>
                        <Route path="/bots/:botId" element={<Bot/>}/>
                        <Route path="/addBot" element={<AddBot/>}/>
                        <Route path="/users" element={<UserList/>}/>
                        <Route path="/user/:userId" element={<User/>}/>
                        <Route path="/newUser" element={<NewUser/>}/>
                        <Route path="/products" element={<ProductList/>}/>
                        <Route path="/product/:productId" element={<Product/>}/>
                        <Route path="/newproduct" element={<NewProduct/>}/>
                        <Route path="/configs" element={<Configs/>}/>
                        <Route path="/warnings" element={<Warnings/>}/>
                        <Route path="/googlecache" element={<GoogleCache/>}/>
                        <Route path="/badlinks" element={<BadLinks/>}/>
                        <Route path="/serverlogs" element={<ServerLogs/>}/>
                        <Route path="/appversions" element={<AppVersions/>}/>
                        <Route path="/cronjobs" element={<CronJobs/>}/>
                        <Route path="/searchMovie" element={<SearchMovie/>}/>
                        <Route path="/movie/torrentLinks/:id" element={<TorrentLinks/>}/>
                        <Route path="/movies" element={<Movies/>}/>
                        <Route path="/torrent" element={<Torrent/>}/>
                        <Route path="/role/all_permissions" element={<AllPermissions/>}/>
                        <Route path="/role/all_roles" element={<AllRoles/>}/>
                        <Route path="/role/:roleName" element={<Role/>}/>
                        <Route path="/role/create_role" element={<CreateRole/>}/>
                        <Route path="/role/edit_role/:roleName" element={<EditRole/>}/>
                        <Route path="/role/all_users" element={<AllUsers/>}/>
                    </Routes>
                </div>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

const style = {
    container: css({
        display: 'flex',
        marginTop: '10px',
        // width: '100vw',
        // backgroundColor: 'red',
    }),
}

export default App;
