/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import RowStack from "../RowStack";
import VersionData from "./VersionData";


const AppsData = ({apps}) => {
    return (
        <div>
            {
                apps.map((app, index) => (
                    <div key={app.appName + app.os}>
                        <RowStack extractStyle={style.appContainer}>
                            <span css={style.field}>{index + 1}. {app.appName}</span>
                            <span css={style.field}>Os: {app.os}</span>
                            <span css={style.field}>LatestVersion: {app.latestVersion}</span>
                            <span css={style.field}>LatestVersionName: {app.latestVersionName}</span>
                            <span css={style.field}>MinVersion: {app.minVersion}</span>
                            {/*{JSON.stringify(app, null, 4)}*/}
                        </RowStack>
                        <span css={style.title2}>Versions:</span>
                        {
                            app.versions.map((version, vIndex) => (
                                <VersionData key={version.vid} vIndex={vIndex} version={version}/>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};

const style = {
    container: css({}),
    appContainer: css({
        marginTop: '20px',
    }),
    title2: css({
        fontSize: '14px',
        fontWeight: 600,
        display: 'block',
        marginTop: '20px',
        marginLeft: '20px',
    }),
    field: css({
        fontSize: '17px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        marginLeft: '10px',
    }),
};

AppsData.propTypes = {
    apps: PropTypes.array.isRequired,
}


export default AppsData;
