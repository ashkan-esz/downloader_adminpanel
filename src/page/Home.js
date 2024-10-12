/** @jsxImportSource @emotion/react */
import {useEffect, useState} from "react";
import Chart from '../Components/chart';
import FeaturedInfo from '../Components/Chart/FeaturedInfo'
import WidgetSm from '../Components/Chart/WidgetSm';
import WidgetLg from '../Components/Chart/WidgetLg';
import {css} from "@emotion/react";
import {getServerAnalysisInTimes} from "../api/adminApis";

function Home() {
    const [usersData, setUsersData] = useState([]);
    const [botUsersData, setBotUsersData] = useState([]);
    const [botNames, setBotNames] = useState([]);

    useEffect(() => {
        let start = new Date();
        start.setDate(start.getDate() - 60);
        let end = new Date();
        getServerAnalysisInTimes('userCounts', start, end, 0, 120).then(res => {
            if (res !== 'error') {
                setUsersData(res);
            }
        });
        getServerAnalysisInTimes('botUserCounts', start, end, 0, 120).then(res => {
            let botNames = [];
            res = res.map(r => {
                let bots = {};
                for (let i = 0; i < r.bots.length; i++) {
                    bots[r.bots[i].botName] = r.bots[i].count;
                    if (!botNames.includes(r.bots[i].botName)) {
                        botNames.push(r.bots[i].botName);
                    }
                }

               return {
                ...bots,
                   date: r.date,
               }
            });
            if (res !== 'error') {
                setBotUsersData(res);
                setBotNames(botNames);
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
            <Chart
                data={botUsersData}
                title="Bots User Analytics - Last 60 days"
                grid
                xAxisDataKey={"date"}
                dataKey={"bots.botName"}
                dataKeys={botNames}
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
