import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { getLocalItem, setLocalItem, LANG_KEY } from '../utils/localStorageManager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCogs, faCloudDownloadAlt, faExchangeAlt, faFileAlt, faHouseUser, faLanguage, faPlusCircle, faSearch, faStream, faUserCircle, faUsersCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '../style/NavBar.css'

export default function NavBar() {
    const { t, i18n } = useTranslation();
    const { user, department, checkPermission, changeDepartment, logoutUser } = useContext(UserContext);
    const [language, setLanguage] = useState(getLocalItem(LANG_KEY));
    const languageList = Object.keys(i18n.store.data)

    useEffect(() => {
        i18n.changeLanguage(language)
        setLocalItem(LANG_KEY, language || navigator.language || navigator.userLanguage)
    }, [i18n, language])

    const handleSwitchLanguage = langCode => { if (langCode !== language) setLanguage(langCode) };

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">
                    <img height='28px' alt='' src='/unirio-ged-app-frontend/images/logo_unirio.svg' style={{ margin: '-6px 6px 0 0' }} />
                    UNIRIO GED App
                </Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                {checkPermission('ADD_DOCS', 'SEARCH_DOCS')
                    && <NavDropdown title={
                        <>
                            <FontAwesomeIcon icon={faFileAlt} />
                            <span>{t('navbar.documents')}</span>
                        </>
                    }>
                        {checkPermission('ADD_DOCS')
                            && (<>
                                <Link to="/documents/new" className="dropdown-item">
                                    <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                                    {t('navbar.documents.add')}
                                </Link>
                                <Link to="/documents/import/" className="dropdown-item">
                                    <FontAwesomeIcon className="icon" icon={faCloudDownloadAlt} />
                                    {t('navbar.documents.import')}
                                </Link>
                            </>)
                        }
                        {checkPermission('SEARCH_DOCS')
                            && <Link to="/" className="dropdown-item">
                                <FontAwesomeIcon className="icon" icon={faSearch} />
                                {t('navbar.documents.search')}
                            </Link>
                        }
                    </NavDropdown>
                }
                {checkPermission('MANAGE_CATEGORIES', 'INVITE_USERS', 'MANAGE_DEPT_PERM')
                    && <NavDropdown title={
                        <>
                            <FontAwesomeIcon icon={faHome} />
                            <span>{t('navbar.department')}</span>
                        </>
                    }>
                        {checkPermission('MANAGE_CATEGORIES')
                            && <Link to="/categories" className="dropdown-item">
                                <FontAwesomeIcon className="icon" icon={faStream} />
                                {t('navbar.department.category')}
                            </Link>
                        }
                        {checkPermission('INVITE_USERS', 'MANAGE_DEPT_PERM')
                            && <Link to="/users/department" className="dropdown-item">
                                <FontAwesomeIcon className="icon" icon={faUsersCog} />
                                {t('navbar.department.users')}
                            </Link>
                        }
                    </NavDropdown>
                }
                {checkPermission('MANAGE_DEPARTMENTS', 'MANAGE_SYSTEM_PERM')
                    && <NavDropdown title={
                        <>
                            <FontAwesomeIcon icon={faCogs} />
                            <span>{t('navbar.system')}</span>
                        </>
                    }>
                        {checkPermission('MANAGE_DEPARTMENTS')
                            && <Link to="/departments" className="dropdown-item">
                                <FontAwesomeIcon className="icon" icon={faHouseUser} />
                                {t('navbar.system.department')}
                            </Link>
                        }
                        {checkPermission('MANAGE_SYSTEM_PERM')
                            && <Link to="/users/system" className="dropdown-item">
                                <FontAwesomeIcon className="icon" icon={faUsersCog} />
                                {t('navbar.system.users')}
                            </Link>
                        }
                    </NavDropdown>
                }
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <div className="nav-link menu-user-box">
                        <span data-tip={user?.email} data-for="userTooltip">{`${user?.firstName} ${user?.surname}`}</span>
                        <ReactTooltip id="userTooltip" />
                        <FontAwesomeIcon icon={faUserCircle} />
                    </div>
                </Nav>
                <Nav>
                    <NavDropdown title={
                        <>
                            <span>{t('navbar.language')}</span>
                            <FontAwesomeIcon icon={faLanguage} />
                        </>
                    }>
                        {languageList.map((lang, index) =>
                            <NavDropdown.Item key={index} onClick={() => { handleSwitchLanguage(lang) }} className={`${language === lang ? 'active' : ''}`}>
                                <img className="icon flag" alt={t(`language.${lang}.fullName`)} src={`/unirio-ged-app-frontend/images/${lang}.svg`} />
                                <span>{t(`navbar.language.${lang}.shortName`)}</span>
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <NavDropdown title={
                        <>
                            <span>{`${t('navbar.department')}: ${department?.acronym || t('none', { context: 'male' })}`}</span>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                        </>
                    } disabled={!user?.departments.length}>
                        {(user?.departments?.sort((a, b) => a.acronym.localeCompare(b.acronym)) || []).map(dept =>
                            <NavDropdown.Item key={dept.id}
                                onClick={() => { changeDepartment(dept.id) }}
                                className={`${dept.id === user?.currentDepartment?.id ? 'active' : ''}`}
                            >
                                <span className='small-column'>{dept.acronym}</span>
                                <span>{dept.name}</span>
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link onClick={logoutUser}>
                        <span>{t('navbar.logout')}</span>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
