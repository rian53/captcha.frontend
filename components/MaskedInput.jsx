import React, {forwardRef} from "react"
import { IMaskInput } from "react-imask"

const MaskedInput = forwardRef((props, ref) => {
  return <IMaskInput {...props} inputRef={ref} />
})

export default MaskedInput