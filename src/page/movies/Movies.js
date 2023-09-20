/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {AddRelation, RemoveRelation} from "../../Components/movies";


function Movies() {

    return (
        <div css={style.container}>
            <AddRelation/>
            <RemoveRelation/>
        </div>
    );
}

const style = {
    container: css({
        flex: 4,
        padding: '20px',
    }),
}

export default Movies;
