/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {CircularProgress, Modal, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import * as RolePermissionApis from "../../api/rolePermissionApis";
import {useQueryClient} from "@tanstack/react-query";
import {css} from "@emotion/react";
import PropTypes from 'prop-types';

const UpdateUserRoleModal = ({userId, roles, open}) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [newRoleIds, setNewRoleIds] = useState(roles.map(r => r.id).join(', '));
    const [error, setError] = useState('');
    const [isUpdaing, setIsUpdating] = useState(false);

    useEffect(() => {
        setModalOpen(open);
    }, [open]);

    const _updateRoles = (userId) => {
        setError("");
        setIsUpdating(true);
        RolePermissionApis.editUserRoles(userId, newRoleIds.split(',').map(item => Number(item))).then(async res => {
            setIsUpdating(false);
            if (res.errorMessage) {
                setError(res.errorMessage);
            } else {
                setError("");
                setModalOpen(false);
                setNewRoleIds("");
                await queryClient.refetchQueries(['role_users']);
            }
        });
    }

    return (
        <Modal
            open={modalOpen}
            onClose={() => {
                setNewRoleIds('');
                setModalOpen(false);
            }}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <div css={style.modalContainer}>
                <span css={style.modalTitle}>
                    new role ids (userId= {userId})
                </span>

                <div style={{alignContent: "center"}}>
                    <TextField
                        css={style.textField}
                        value={newRoleIds}
                        onChange={(value) => setNewRoleIds(value.target.value)}
                        name={"roleIds"}
                        placeholder={"roleIds"}
                        label={"roleIds"}
                        type={"text"}
                        margin={"dense"}
                        variant={"standard"}
                        color={"secondary"}
                    />
                </div>

                {
                    !!error &&
                    <Typography
                        css={style.errorText}
                        variant="subtitle2"
                        component="h2"
                        color={"red"}
                    >
                        *{error}.
                    </Typography>
                }

                <div css={style.submitButtonContainer}>
                    <LoadingButton
                        variant={"outlined"}
                        size={"large"}
                        color={"secondary"}
                        loading={isUpdaing}
                        loadingIndicator={<CircularProgress color="error" size={18}/>}
                        onClick={() => _updateRoles(userId)}
                    >
                        Update
                    </LoadingButton>
                </div>
            </div>
        </Modal>
    );

}

const style = {
    modalContainer: css({
        display: "flex",
        backgroundColor: "azure",
        width: '450px',
        height: '225px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // backgroundColor: 'rgb(18, 18, 18)',
        border: '2px solid #000',
        boxShadow: 24,
        justifyContent: 'center',
    }),
    modalTitle: css({
        display: "flex",
        position: "absolute",
        width: "100%",
        justifyContent: "center",
        marginTop: "30px",
    }),
    errorText: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '300px',
        position: 'absolute',
        bottom: '35px',
    }),
    submitButtonContainer: css({
        marginTop: "10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
};

UpdateUserRoleModal.propTypes = {};

export default UpdateUserRoleModal;
