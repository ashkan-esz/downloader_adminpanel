/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {useState} from "react";
import {resolveServerAnalysis} from "../../api/adminApis";
import {getPassedTime} from "../../utils/utils";
import MyLoadingButton from "../MyLoadingButton";


const CrawlerServerLogItem = ({data, index, onResolve}) => {
    const [isResolving, setIsResolving] = useState(false);
    const [active, setActive] = useState(true);

    const _removeLog = async () => {
        setIsResolving(true);
        let result = await resolveServerAnalysis('serverLogs', data.id);
        if (result !== 'error') {
            setActive(false);
        }
        setIsResolving(false);
        onResolve();
    }

    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.message} ({getPassedTime(data.date)})
            </span>

            <MyLoadingButton
                disabled={isResolving || !active}
                isLoading={isResolving}
                text={"Remove"}
                onClick={_removeLog}/>
        </div>
    );
};

const style = {
    container: css({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
    }),
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
};

CrawlerServerLogItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onResolve: PropTypes.func.isRequired,
}


export default CrawlerServerLogItem;
