import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import {
    batchUpdateUsersPermissions,
    deleteUser,
    getPermissions,
    getUsers,
    insertUser,
    updateUserPermissions
} from '../../services/users/api'
import CustomTable from '../util/CustomTable/CustomTable'
import { Icon } from '../util/CustomIcon'
import { faUserCheck, faQuestion, faPaperPlane, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons'

const UserPermissionsTable = ({ canInviteUsers, canEditUserPermissions, canDeleteUsers, type }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const { department, user, setLoggedUserInfo } = useContext(UserContext);

    const loadUsers = useCallback(async () => {
        const res = await getUsers();

        if (res.ok) setUsers(await res.json());
    }, [])

    useEffect(() => loadUsers(), [loadUsers, department, type])

    const loadPermissions = useCallback(async () => {
        const res = await getPermissions(type);

        if (res.ok) setPermissions(await res.json());
    }, [type])

    useEffect(() => loadPermissions(), [loadPermissions, type])

    const addNewUser = useCallback(async userData => {
        const res = await insertUser(userData.email);

        if (res.ok) await loadUsers();

        return res.ok;
    }, [loadUsers])

    const getSpecificUserPermissions = (allUsers, userId, possiblePermissions) =>
        allUsers
            ?.find(u => u.id === Number(userId))
            ?.permissions
            ?.filter(p => possiblePermissions.includes(p))

    const addOrRemoveFromArray = (array, key, keyShouldBeInArray) =>
        array.includes(key)
            ? keyShouldBeInArray
                ? array
                : array.filter(k => k !== key)
            : [...array, key]

    const editUserPermissionsWithNewUserData = useCallback((userPermissions, userNewData) =>
        Object
            .entries(userNewData)
            .reduce((array, [key, value]) =>
                addOrRemoveFromArray(array, key, value),
                userPermissions
            )
        , []);

    const editUserPermissions = useCallback(async (userId, userNewData) => {
        const res = await updateUserPermissions(
            userId,
            editUserPermissionsWithNewUserData(
                getSpecificUserPermissions(users, userId, permissions),
                userNewData
            )
        );

        if (res.ok) {
            await loadUsers();
            if (user?.id === Number(userId)) setLoggedUserInfo();
        }

        return res.ok;
    }, [permissions, user, users, loadUsers, setLoggedUserInfo, editUserPermissionsWithNewUserData])

    const batchEditUsersPermissions = useCallback(async editedUserEntries => {
        const res = await batchUpdateUsersPermissions(
            Object.fromEntries(
                editedUserEntries.map(([userId, userNewData]) => [
                    userId,
                    editUserPermissionsWithNewUserData(
                        getSpecificUserPermissions(users, userId, permissions),
                        userNewData
                    )
                ]))
        );
        
        if (res.ok) {
            await loadUsers();

            if (editedUserEntries.some(([userId]) => user?.id === Number(userId)))
                setLoggedUserInfo();
        }

        return res.ok;
    }, [permissions, user, users, loadUsers, setLoggedUserInfo, editUserPermissionsWithNewUserData])

    const removeUserFromDepartment = useCallback(async userId => {
        const res = await deleteUser(userId)

        if (res.ok) {
            await loadUsers();
            if (user?.id === Number(userId)) setLoggedUserInfo();
        }

        return res.ok;
    }, [user, loadUsers, setLoggedUserInfo])

    const actions = {
        add: {
            disabled: !canInviteUsers,
            callbackFn: addNewUser,
            icon: faUserPlus,
            rowActionIcon: faPaperPlane,
        },
        batchEdit: {
            disabled: !canEditUserPermissions,
            callbackFn: batchEditUsersPermissions,
            icon: faEdit,
        },
        edit: {
            disabled: !canEditUserPermissions,
            callbackFn: editUserPermissions,
        },
        delete: {
            disabled: !canDeleteUsers,
            callbackFn: removeUserFromDepartment,
        },
        filter: {}
    }

    const columns = {
        status: {
            class: 'center',
            disguise: {
                true: <Icon
                    icon={faUserCheck}
                    tooltip={t('user.table.data.status.y.tooltip')}
                />,
                false: <Icon
                    icon={faQuestion}
                    tooltip={t('user.table.data.status.n.tooltip')}
                />
            },
            editable: false,
            filterable: true,
            header: t('user.table.headers.status'),
            type: 'boolean',
            width: '104px'
        },
        email: {
            header: t('user.table.headers.email'),
            editable: false,
            filterable: true,
            requiredOnAdd: true,
            sort: true,
            type: 'text',
            width: '240px'
        },
        fullName: {
            header: t('user.table.headers.username'),
            editable: false,
            filterable: true,
            type: 'text',
            width: '280px'
        },
        ...Object.fromEntries(
            permissions.map(perm => [perm, {
                class: 'center',
                header: t(`user.table.headers.permission.${perm.toLowerCase()}`),
                filterable: true,
                type: 'boolean'
            }])
        )
    }

    const data = users.map(user => {
        return {
            ...user,
            status: user.fullName?.trim().length > 0,
            ...Object.fromEntries(
                permissions.map(perm =>
                    [perm, user.permissions.includes(perm)]
                )
            )
        }
    })

    return (<CustomTable
        actions={actions}
        columns={columns}
        data={data}
        domain={`userPermissions`}
    />)

}

export default UserPermissionsTable;