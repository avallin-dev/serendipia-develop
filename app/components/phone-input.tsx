import { forwardRef } from 'react'
import { PhoneInput as PI } from 'react-international-phone'
import 'react-international-phone/style.css'

type Props = {
  key?: string
  value?: string
  required?: boolean
  onChange?: (value: string) => void
  country?: string
  placeholder?: string
}

const PhoneInput = forwardRef<HTMLInputElement, Props>(
  ({ key, value, required, onChange, country, placeholder }, _ref) => {
    return (
      <PI
        key={key}
        defaultCountry={country}
        value={value}
        required={required}
        countrySelectorStyleProps={{
          buttonStyle: {
            backgroundColor: '#fff',
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            padding: '8px 16px',
            fontSize: '18px',
            height: '36px',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
          },
        }}
        inputStyle={{
          width: '100%',
          fontSize: '16px',
          padding: '8px',
          borderTopRightRadius: '9999px',
          borderBottomRightRadius: '9999px',
          height: '36px',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
        }}
        onChange={onChange}
        placeholder={placeholder}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
