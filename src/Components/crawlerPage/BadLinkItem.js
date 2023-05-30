/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import PropTypes from 'prop-types';
import {useState} from "react";
import {resolveServerAnalysis} from "../../api/adminApis";
import {getPassedTime} from "../../utils/utils";
import MyLoadingButton from "../MyLoadingButton";


const BadLinkItem = ({data, index, onResolve}) => {
    const [isResolving, setIsResolving] = useState(false);
    const [active, setActive] = useState(true);

    const _remove = async () => {
        setIsResolving(true);
        let result = await resolveServerAnalysis('badLinks', data.id);
        if (result !== 'error') {
            setActive(false);
        }
        setIsResolving(false);
        onResolve();
    }

    return (
        <div css={style.container}>
            <div css={style.fieldContainer}>

            <span css={style.warning}>
                {index + 1}. Address: {data.address} ({getPassedTime(data.date)}) (counts:{data.count})
            </span>

                <MyLoadingButton
                    disabled={isResolving || !active}
                    isLoading={isResolving}
                    text={"Remove"}
                    onClick={_remove}/>
            </div>

            <div css={style.titleContainer}>
                <span css={style.title}> Links: </span>
            </div>
            {
                data.links.map((item, lIndex) => (
                        <div key={item.link} css={style.link}>
                            <span css={style.linkField}>{lIndex + 1}.</span>
                            <span css={style.linkField}>Link: {item.link}</span>
                            <span css={style.linkField}>Info: {item.info}</span>
                            <span css={style.linkField}>SeasonEpisode: {item.seasonEpisode}</span>
                        </div>
                    )
                )
            }
        </div>
    );
};

const style = {
    container: css({
        alignItems: 'center',
        marginLeft: '10px',
    }),
    fieldContainer: css({
        display: 'flex',
    }),
    warning: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
    titleContainer: css({
        marginBottom: '5px',
        marginLeft: '30px',
    }),
    title: css({
        fontSize: '16px',
        fontWeight: 600,
    }),
    link: css({
        marginTop: '15px',
    }),
    linkField: css({
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px',
        marginBottom: '5px',
        marginLeft: '100px',
    }),
};

BadLinkItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onResolve: PropTypes.func.isRequired,
}


export default BadLinkItem;
