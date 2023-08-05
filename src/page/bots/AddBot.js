/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {useQueryClient} from "@tanstack/react-query";
import {AddBotForm} from "../../Components/botsPage";

function AddBot() {
    const queryClient = useQueryClient();

    const _updateBotData = async () => {
        await queryClient.refetchQueries(['botList']);
    }

    return (
        <div css={style.container}>

            <div css={style.editContainer}>
                <span css={style.editTitle}>Add</span>

                <AddBotForm
                    extraStyle={style.updateFormContainer}
                    onDataUpdate={_updateBotData}
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

export default AddBot;
