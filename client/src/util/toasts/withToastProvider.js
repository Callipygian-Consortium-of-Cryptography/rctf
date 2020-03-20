import { useState, useCallback, createPortal } from 'preact/compat'

import ToastContext from './context'
import Toast from './Toast'

// Create a random ID
function generateUEID () {
  let first = (Math.random() * 46656) | 0
  let second = (Math.random() * 46656) | 0
  first = (`000${first.toString(36)}`).slice(-3)
  second = (`000${second.toString(36)}`).slice(-3)

  return first + second
}

function withToastProvider (Component) {
  function WithToastProvider (props) {
    const [toasts, setToasts] = useState([])
    const providerValue = useCallback({
      add: content => {
        const id = generateUEID()

        setToasts([...toasts, { id, content }])
      },
      remove: id => setToasts(toasts.filter(t => t.id !== id))
    }, [toasts])

    const toastWrapperStyle = {
      position: 'fixed',
      top: '1em',
      right: '1em',
      zIndex: 9999,
      width: '320px'
    }

    return (
      <ToastContext.Provider value={providerValue}>
        {createPortal(
          <div style={toastWrapperStyle}>
            {toasts.map(t => (
              // eslint-disable-next-line react/jsx-no-bind
              <Toast key={t.id} remove={() => providerValue.remove(t.id)}>
                {t.content}
              </Toast>
            ))}
          </div>,
          document.body
        )}

        <Component {...props} />
      </ToastContext.Provider>
    )
  }

  return WithToastProvider
}

export default withToastProvider