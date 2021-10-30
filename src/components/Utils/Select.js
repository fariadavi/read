import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import '../../style/utils/Select.css'

const Select = ({ className, name, label, placeholder, value, onChange, options, textProperty, idProperty }) => {
    const { t } = useTranslation();

    return (
        <div className={`custom-select ${className}`}>
            {label ? <Form.Label>{label}</Form.Label> : ''}
            <div className="select-wrapper">
                <Form.Select
                    required
                    name={name}
                    onChange={e => onChange(name, e.target.value)}
                    value={value}>
                    <option style={{ display: 'none' }}>
                        {placeholder}
                    </option>
                    {options.length
                        ? options.sort((a, b) =>
                            a[textProperty].localeCompare(b[textProperty])
                        ).map(item =>
                            <option key={item[idProperty || 'id']} value={item[idProperty || 'id']}>
                                {item[textProperty]}
                            </option>
                        )
                        : <option key={0} value={0}>{t('document.form.category.zeroOptions')}</option>
                    }
                </Form.Select>
                <input type="checkbox" className="select-has-value" checked={value && value > 0} />
                <span className="clear-input" onClick={() => onChange(name, 0)}>
                    <FontAwesomeIcon icon={faTimesCircle} />
                </span>
            </div>
        </div>
    )
}

export default Select;