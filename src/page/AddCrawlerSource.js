/** @jsxImportSource @emotion/react */
import {Grade} from "@mui/icons-material";
import {css} from "@emotion/react";
import {useQueryClient} from "@tanstack/react-query";
import {AddCrawlerSourceForm} from "../Components/crawlerPage";

function AddCrawlerSource() {
    const queryClient = useQueryClient();

    const _updateSourceData = async () => {
        await queryClient.refetchQueries(['crawlerSourcesPage']);
    }

    return (
        <div css={style.container}>

            <div css={style.editContainer}>
                <span css={style.editTitle}>Add</span>

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

                <AddCrawlerSourceForm
                    extraStyle={style.updateFormContainer}
                    onDataUpdate={_updateSourceData}
                />
            </div>
        </div>
    );
}

const style = {
    container: css({
        flex: 4,
        padding: '20px',
        display: 'flex',
        marginTop: '20px',
    }),
    editContainer: css({
        flex: 1,
        padding: '20px',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        marginLeft: '20%',
        maxWidth: '500px',
    }),
    editTitle: css({
        fontSize: '24px',
        fontWeight: '600',
    }),
    updateFormContainer: css({
        marginTop: '-10px',
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
}

export default AddCrawlerSource;
