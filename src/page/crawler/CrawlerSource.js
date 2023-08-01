/** @jsxImportSource @emotion/react */
import {Link} from "react-router-dom";
import {CalendarToday, Grade} from "@mui/icons-material";
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {CrawlerSourceUpdateForm} from "../../Components/crawlerPage";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getCrawlerSources} from "../../api/adminApis";

function CrawlerSource() {
    const location = useLocation();
    const queryClient = useQueryClient();

    const getData = async () => {
        let result = await getCrawlerSources();
        if (result !== 'error') {
            return result.sources.find(item => item.sourceName === location.state?.data?.sourceName);
        } else {
            throw new Error();
        }
    }

    const {data} = useQuery(
        ['crawlerSource', location.state?.data?.sourceName],
        getData,
        {
            keepPreviousData: false,
            refetchInterval: 2 * 60 * 1000,
        }
    );

    const _updateSourceData = async () => {
        await Promise.allSettled([
            queryClient.refetchQueries(['crawlerSource']),
            queryClient.refetchQueries(['crawlerSourcesPage']),
        ]);
    }

    if (!data) {
        return null;
    }

    return (
        <div css={style.container}>

            <div css={style.headContainer}>
                <h1>Edit Crawler Source</h1>
                <Link to="/addCrawlerSource">
                    <button css={style.sourceCreateButton}>Create</button>
                </Link>
            </div>

            <div css={style.detailsContainer}>

                <div css={style.sourceShow}>
                    <span css={style.sourceName}>{data.sourceName}</span>

                    <div css={style.sourceShowBottom}>
                        <span css={style.sourceShowTitle}>Source Details</span>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Added: {data.addDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Last Crawl: {data.lastCrawlDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Last Domain Change: {data.lastDomainChangeDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Disabled Date: {data.disabledDate.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <CalendarToday css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Config Update Date: {data.lastConfigUpdateDate?.toString().replace(/\.\d+z$/i, '')}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <Grade css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                UserData: {JSON.stringify(data.userData)}
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <Grade css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Note: crawl cycle equal to 0 means no cycle.
                            </span>
                        </div>
                        <div css={style.fieldInfo}>
                            <Grade css={style.fieldInfoIcon}/>
                            <span css={style.fieldInfoTitle}>
                                Note: cookie expire equal to 0 means no expire.
                        </span>
                        </div>
                    </div>
                </div>

                <div css={style.editContainer}>
                    <span css={style.editTitle}>Edit</span>
                    <CrawlerSourceUpdateForm
                        extraStyle={style.updateFormContainer}
                        sourceData={data}
                        onDataUpdate={_updateSourceData}
                    />
                </div>
            </div>
        </div>
    );
}

const style = {
    container: css({
        flex: 4,
        padding: '20px',
    }),
    headContainer: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }),
    sourceCreateButton: css({
        width: '80px',
        border: 'none',
        padding: '5px',
        backgroundColor: 'teal',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
    }),
    detailsContainer: css({
        display: 'flex',
        marginTop: '20px',
    }),
    updateFormContainer: css({
        marginTop: '20px',
    }),
    sourceShow: css({
        flex: 2,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    editContainer: css({
        flex: 2,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        marginLeft: '20px',
    }),
    sourceName: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: '20px',
        fontWeight: 600,
    }),
    sourceShowBottom: css({
        marginTop: '20px',
    }),
    sourceShowTitle: css({
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(175, 170, 170)',
    }),
    fieldInfo: css({
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0px',
        color: '#444',
    }),
    fieldInfoIcon: css({
        fontSize: '16px !important',
    }),
    fieldInfoTitle: css({
        marginLeft: '10px',
    }),
    editTitle: css({
        fontSize: '24px',
        fontWeight: '600',
    }),
}

export default CrawlerSource;
