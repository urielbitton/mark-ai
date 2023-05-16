// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import './styles/AppInputs.css'
import Select from 'react-select'

export function AppInput(props) {

  const { label, className, iconleft, iconright, title = '', subtext } = props

  return (
    <label
      className={`appInput commonInput ${className ?? ""}`}
      title={title ?? ""}
    >
      {label && <h6>{label}</h6>}
      <input {...props} />
      {iconright}
      {iconleft}
      {subtext}
    </label>
  )
}

export function AppSelect(props) {

  const { options, label, onChange, onClick, value, className,
    button, containerStyles, styles } = props

  const optionsdata = options?.map((data, i) =>
    <option
      key={i}
      selected={data.selected}
      disabled={data.disabled}
      value={data.value}
    >
      {data.name || data.label}
    </option>
  )
  return (
    <label
      className={`appSelect commonInput ${className ?? ""}`}
      onClick={(e) => onClick && onClick(e)}
      style={containerStyles}
    >
      <h6>{label}</h6>
      <select
        onChange={(e) => onChange(e)}
        value={value}
        styles={styles}
      >
        {optionsdata}
      </select>
      {button}
    </label>
  )
}

export function AppTextarea(props) {

  const { label, iconclass, className, maxLength } = props

  return (
    <label className={`appTextarea commonInput ${className ?? ""}`}>
      <h6>{label}</h6>
      <textarea
        style={{ paddingRight: iconclass ? "40px" : "10px" }}
        {...props}
        maxLength={maxLength}
      />
    </label>
  )
}

export function AppSwitch(props) {

  const { iconclass, label, onChange, checked, className, size = '',
  disabled } = props

  return (
    <div className={`appSwitch commonInput ${className ?? ""} ${size}`}>
      <h6>
        <i className={iconclass}></i>
        {label}
      </h6>
      <label className="form-switch">
        <input
          type="checkbox"
          onChange={(e) => onChange(e)}
          checked={checked}
          disabled={disabled}
        />
        <i></i>
      </label>
    </div>
  )
}

export const AppCoverInput = (props) => {

  const { label, value, onChange, className, iconleft, iconright,
    title, type, showInput, setShowInput, cover, name, onCheck,
    onPressEnter, onCancel, loading, linkEnterPressToOnCheck } = props
  const inputRef = useRef(null)

  const handleCheck = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCheck && onCheck(e)
  }

  const handleOnKeUp = (e) => {
    if (e.key === "Enter") {
      onPressEnter && onPressEnter(e)
      linkEnterPressToOnCheck && handleCheck(e)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCancel && onCancel(e)
  }

  useEffect(() => {
    if (showInput === name) {
      inputRef.current.focus()
      window.onclick = () => setShowInput(null)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverInput commonInput ${className ?? ""}`}
      title={title ?? ""}
    >
      {label && <h6>{label}</h6>}
      <input
        onChange={(e) => onChange(e)}
        value={value}
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => handleOnKeUp(e)}
        type={type}
        ref={inputRef}
        style={{ display: showInput === name ? "block" : "none" }}
      />
      {iconright}
      {iconleft}
      <div
        className="coverInput"
        style={{ display: showInput === name ? "none" : "block" }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowInput(name)
        }}
      >
        {cover}
      </div>
      <div
        className="input-actions"
        style={{ display: showInput === name ? "flex" : "none" }}
      >
        <div onClick={handleCheck}>
          <i className="far fa-check" />
        </div>
        <div onClick={handleCancel}>
          <i className="fal fa-times" />
        </div>
      </div>
      {
        loading &&
        <div className="loading-cover">
          <i className="fas fa-spinner fa-spin" />
        </div>
      }
    </label>
  )
}

const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--grayText)',
    boxShadow: 'none',
    border: state.isFocused ? '1px solid var(--primary)' : '1px solid var(--inputBorder)',
    zIndex: state.isFocused ? '200' : '0',
    transition: 'all 0.2s ease',
    "&:hover": {
      border: state.isFocused ? '1px solid var(--primary)' : '1px solid var(--tableBorder)',
      background: state.isFocused ? 'none' : 'var(--inputBg)'
    },
  }),
  menuPortal: base => ({ ...base, zIndex: 300 }),
  option: (base, state) => ({
    ...base,
    fontSize: '14px',
    fontWeight: '500',
    background: state.isSelected ? 'var(--inputBg)' : '#fff',
    cursor: 'pointer',
    opacity: state.isDisabled ? '0.4' : '1',
    color: 'var(--darkGrayText)',
    "&:hover": {
      background: 'var(--inputBg)'
    },
  })
}

export const AppCoverSelect = (props) => {

  const { options, label, onChange, value, className,
    containerStyles, showInput, setShowInput, cover,
    name, loading, defaultValue } = props
  const selectRef = useRef(null)

  const openSelect = (e) => {
    e.stopPropagation()
    selectRef.current.focus()
  }

  const formatOptionLabel = ({ label, icon, iconColor }) => (
    <div className="select-option">
      {
        icon &&
        <i
          className={icon}
          style={{ color: iconColor, marginRight: label ? '10px' : '0' }}
        />
      }
      {label && <span>{label}</span>}
    </div>
  )

  useEffect(() => {
    if (showInput === name) {
      window.onclick = () => setShowInput(null)
    }
    return () => window.onclick = null
  }, [showInput])

  return (
    <label
      className={`appCoverSelect appCoverInput commonInput ${className ?? ""}`}
      style={containerStyles}
    >
      {label && <h6>{label}</h6>}
      <div
        className="select-container"
        onClick={(e) => openSelect(e)}
        style={{ display: showInput === name ? "block" : "none" }}
      >
        <Select
          onChange={(value) => onChange(value)}
          value={value}
          defaultValue={defaultValue || value}
          options={options}
          formatOptionLabel={formatOptionLabel}
          openMenuOnFocus
          styles={reactSelectStyles}
          hideSelectedOptions
          menuShouldScrollIntoView
          components={{ IndicatorSeparator: () => null }}
          ref={selectRef}
          menuPortalTarget={document.body}
        />
      </div>
      <div
        className="coverInput"
        style={{ display: showInput === name ? "none" : "block" }}
        onClick={(e) => {
          e.stopPropagation()
          setShowInput(name)
        }}
      >
        {cover}
      </div>
      {
        loading &&
        <div className="loading-cover">
          <i className="fas fa-spinner fa-spin" />
        </div>
      }
    </label>
  )
}

export const AppReactSelect = (props) => {

  const { options, label, onChange, value, className,
    containerStyles, defaultValue, placeholder, subText,
    menuPlacement = "auto", hideDropdownArrow, centerOptions,
    searchable = false, disabled } = props
  const selectRef = useRef(null)

  const formatOptionLabel = ({ label, description, icon, iconColor }) => (
    <div
      className="select-option"
      style={centerOptions ? { display: 'flex', flexDirection: 'column', gap: 5 } : null}
    >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            icon &&
            <i
              className={icon}
              style={{ color: iconColor, marginRight: label ? '10px' : '0' }}
            />
          }
          {label && <span>{label}</span>}
        </div>
        {description && <small style={{color: '#555'}}>{description}</small>}
    </div>
  )

  return (
    <label
      className={`reactSelect appSelect commonInput ${className ?? ""}`}
      style={containerStyles}
    >
      {label && <h6>{label}</h6>}
      <Select
        onChange={(value) => onChange(value)}
        value={value}
        placeholder={placeholder}
        defaultValue={defaultValue || value}
        options={options}
        isDisabled={disabled}
        formatOptionLabel={formatOptionLabel}
        openMenuOnFocus
        isSearchable={searchable}
        tabSelectsValue
        menuPlacement={menuPlacement}
        styles={reactSelectStyles}
        hideSelectedOptions
        menuShouldScrollIntoView
        components={{ IndicatorSeparator: () => null, ...hideDropdownArrow && { DropdownIndicator: () => null } }}
        ref={selectRef}
        menuPortalTarget={document.body}
        className="react-select"
      />
      {subText && <small className="sub-text">{subText}</small>}
    </label>
  )
}
