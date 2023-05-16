/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {getPassedTime} from "../../utils/utils";
import {resolveServerAnalysis} from "../../api/adminApis";
import MyLoadingButton from "../MyLoadingButton";

const CrawlerWarningItem = ({data, index, onResolve}) => {
    const [isResolving, setIsResolving] = useState(false);
    const [active, setActive] = useState(true);

    const _resolveWarning = async () => {
        setIsResolving(true);
        let result = await resolveServerAnalysis('warnings', data.id);
        if (result !== 'error') {
            setActive(false);
        }
        setIsResolving(false);
        onResolve();
    }

    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.message} ({getPassedTime(data.date)}) (counts:{data.count})
            </span>

            <MyLoadingButton
                disabled={isResolving || !active}
                isLoading={isResolving}
                text={"Resolve"}
                onClick={_resolveWarning}/>
        </div>
    );
};

const style = {
    container: css({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '5px',
    }),
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
};

CrawlerWarningItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onResolve: PropTypes.func.isRequired,
}


export default CrawlerWarningItem;
