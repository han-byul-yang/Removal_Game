import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import useClickOutside from 'hooks/useClickOuside'
import { setCustomSetting } from 'store/gameSettingSlice'
import { setInitCountBomb } from 'store/bombCountSlice'
import { setInitCount } from 'store/clickSlice'
import { setInitSecond } from 'store/timerSlice'
import ErrorModal from '../ErrorModal'
import ModalPortal from '../ModalPortal'

import { XIcon } from 'assets/svgs'
import styles from './levelCustomModal.module.scss'

interface LevelCustomModalProps {
  setIsOpenLevelCustomModal: Dispatch<SetStateAction<boolean>>
  setIsBombError: Dispatch<SetStateAction<boolean>>
  setStartTimer: Dispatch<SetStateAction<boolean>>
}

const LevelCustomModal = ({ setIsOpenLevelCustomModal, setIsBombError, setStartTimer }: LevelCustomModalProps) => {
  const [rowInput, setRowInput] = useState('')
  const [columnInput, setColumnInput] = useState('')
  const [bombInput, setBombInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false)
  const dispatch = useDispatch()
  const targetRef = useRef(null)

  const clickOutsideHandle = () => {
    setIsOpenLevelCustomModal(false)
  }
  const { clickOutsideEvent, removeClickOutsideEvent } = useClickOutside({ targetRef, clickOutsideHandle })

  useEffect(() => {
    clickOutsideEvent()

    return () => removeClickOutsideEvent()
  }, [clickOutsideEvent, removeClickOutsideEvent])

  const handleCustomSettingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget
    if (name === 'row') setRowInput(value)
    if (name === 'column') setColumnInput(value)
    if (name === 'bomb') setBombInput(value)
  }

  const handleCloseModalClick = () => {
    setIsOpenLevelCustomModal(false)
  }

  const customInputValidCheck = () => {
    const row = Number(rowInput)
    const column = Number(columnInput)
    const bomb = Number(bombInput)
    if (isNaN(Number(columnInput)) || isNaN(Number(rowInput)) || isNaN(Number(bombInput)))
      throw Error('SHOULD INPUT NUMBER')
    if (column * row <= bomb) throw Error('NO BOMB LENGTH MORE THAN TILES')
    if (!column || !row || !bomb) throw Error('PUT ALL INPUT')
  }

  const handleSubmitButtonClick = () => {
    try {
      customInputValidCheck()
      dispatch(setCustomSetting({ column: Number(columnInput), row: Number(rowInput), bomb: Number(bombInput) }))
      setIsOpenLevelCustomModal(false)
      setIsBombError(false)
      setStartTimer(false)
      dispatch(setInitCount())
      dispatch(setInitSecond())
      dispatch(setInitCountBomb())
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message)
        setIsOpenErrorModal(true)
      }
    }
  }

  return (
    <>
      <div className={styles.background}>
        <div className={styles.settingModal} ref={targetRef}>
          <XIcon className={styles.xIcon} onClick={handleCloseModalClick} />
          <p>Custom Game Setup</p>
          <form className={styles.settingForm}>
            <p>Game Height:</p>
            <input type='text' name='row' value={rowInput} onChange={handleCustomSettingChange} />
            <p>Game Width:</p>
            <input type='text' name='column' value={columnInput} onChange={handleCustomSettingChange} />
            <p>Number of Bombs:</p>
            <input type='text' name='bomb' value={bombInput} onChange={handleCustomSettingChange} />
            <button type='button' className={styles.submitButton} onClick={handleSubmitButtonClick}>
              set over
            </button>
          </form>
        </div>
      </div>
      {isOpenErrorModal && (
        <ModalPortal>
          <ErrorModal errorMessage={errorMessage} setIsOpenErrorModal={setIsOpenErrorModal} />
        </ModalPortal>
      )}
    </>
  )
}

export default LevelCustomModal
