/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import Chart from '../Components/chart';
import FeaturedInfo from '../Components/Chart/FeaturedInfo'
import WidgetSm from '../Components/Chart/WidgetSm';
import WidgetLg from '../Components/Chart/WidgetLg';
import {css} from "@emotion/react";
import {getAnalysisActiveUsers} from "../api/adminApis";

function Home() {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        let start = new Date();
        start.setDate(start.getDate() - 60);
        let end = new Date();
        getAnalysisActiveUsers(start, end, 0, 120).then(res => {
            if (res !== 'error') {
                setUsersData(res);
            }
        });
    }, []);

    return (
        <div css={style.home}>
            <FeaturedInfo/>
            <Chart
                data={usersData}
                title="User Analytics - Last 60 days"
                grid
                xAxisDataKey={"date"}
                dataKey={"total"}
                dataKey2={"active"}
            />
            <div css={style.homeWidgets}>
                <WidgetSm/>
                <WidgetLg/>
            </div>
        </div>
    );
}

const style = {
    home: css({
        flex: 4,
    }),
    homeWidgets: css({
        display: 'flex',
        margin: '20px',
    }),
}

export default Home;
