/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import RowStack from "../RowStack";
import {getPassedTime} from "../../utils/utils";
import MyLoadingButton from "../MyLoadingButton";
import {useState} from "react";
import {removeAppVersion} from "../../api/adminApis";
import PropTypes from 'prop-types';


const VersionData = ({version, vIndex}) => {
    const [isResolving, setIsResolving] = useState(false);
    const [active, setActive] = useState(true);

    const _remove = async () => {
        setIsResolving(true);
        let result = await removeAppVersion(version.vid);
        if (result !== 'error') {
            setActive(false);
        }
        setIsResolving(false);
    }

    return (
        <div key={version.vid}>
            <MyLoadingButton
                disabled={isResolving || !active}
                isLoading={isResolving}
                text={"Remove"}
                onClick={_remove}/>

            <RowStack>
                <span css={style.field2}>{vIndex + 1}. Version: {version.version}</span>
                <span css={style.field2}>VersionName: {version.versionName}</span>
                {/*<span css={style.field2}>UploaderId: {version.uploaderId}</span>*/}
                <span css={style.field2}>UploaderName: {version.uploaderData.rawUsername}</span>
                <span css={style.field2}>UploaderRole: {version.uploaderRole}</span>
                <span css={style.field2}>versionId: {version.vid}</span>
            </RowStack>
            <RowStack extractStyle={style.title3} spacing={1}>
                <span css={style.field2}>Url: {version.fileData.url}</span>
                <span css={style.field2}>
                    Size: {Math.floor(version.fileData.size / 1024 / 1024) + 1}MB
                </span>
                <span css={style.field2}>
                    sha256checksum: {version.fileData.sha256checksum}
                </span>
                <span css={style.field2}>
                    addDate: {getPassedTime(version.fileData.addDate)}
                </span>
            </RowStack>
        </div>
    );
};

const style = {
    title3: css({
        fontSize: '15px',
        fontWeight: 600,
        marginTop: '5px',
        marginLeft: '20px',
        marginBottom: '20px',
    }),
    field2: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '7px',
        marginLeft: '30px',
    }),
};

VersionData.propTypes = {
    version: PropTypes.object.isRequired,
    vIndex: PropTypes.number.isRequired,
}


export default VersionData;
