/** @jsxImportSource @emotion/react */
import {Typography} from '@mui/material';
import {css} from '@emotion/react';
import LogInForm from "./LogInForm";
import {Colors} from "../../styles";


const LogInScreen = () => {

    return (
        <div css={style.container}>
            <Typography
                variant="subtitle1"
                component="h1"
                align={"center"}
                sx={{
                    marginTop: "50px",
                }}
            >
                <Typography
                    variant="subtitle1"
                    component="h1"
                    color={"red"}
                    sx={{
                        display: "inline",
                        paddingRight: '5px',
                    }}
                >
                    Welcome!
                </Typography>
                Login with your account and enjoy
            </Typography>

            <LogInForm
                extraStyle={style.loginForm}
            />
        </div>
    );
};

const style = {
    container: css({
        width: "100%",
        height: "100%",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center",
        // backgroundColor: Colors.SECONDARY,
    }),
    loginForm: css({
        marginTop: "20px",
    })
}

// const style = StyleSheet.create({
//     logo: {
//         width: Mixins.WINDOW_WIDTH,
//         height: 300,
//         alignSelf: 'center',
//         marginTop: Mixins.getWindowHeight(12),
//     },
//     container: {
//         position: 'absolute',
//         bottom: '2%',
//         width: '85%',
//         maxWidth: 350,
//     },
//     header: {
//         color: '#b1aeae'
//     },
// })


export default LogInScreen;
