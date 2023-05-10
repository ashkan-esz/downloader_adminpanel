/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {getPassedTime} from "../../utils/utils";
import {LoadingButton} from "@mui/lab";
import {CircularProgress} from "@mui/material";
import {resolveCrawlerWarnings} from "../../api/adminApis";

const CrawlerWarningItem = ({data, index, onResolve}) => {
    const [isResolving, setIsResolving] = useState(false);

    const _resolveWarning = async () => {
        setIsResolving(true);
        let result = await resolveCrawlerWarnings(data.id);
        setIsResolving(false);
        onResolve();
    }

    return (
        <div css={style.container} key={index}>
            <span css={style.warning}>
                {index + 1}. {data.message} ({getPassedTime(data.date)}) (counts:{data.count})
            </span>

            <div css={style.resolveButtonContainer}>
                <LoadingButton
                    variant={"outlined"}
                    size={"small"}
                    color={"primary"}
                    disabled={isResolving}
                    loading={isResolving}
                    loadingIndicator={<CircularProgress color="error" size={18}/>}
                    onClick={_resolveWarning}
                >
                    Resolve
                </LoadingButton>
            </div>
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
    resolveButtonContainer: css({
        position: 'absolute',
        right: '40px',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};

CrawlerWarningItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onResolve: PropTypes.func.isRequired,
}


export default CrawlerWarningItem;
