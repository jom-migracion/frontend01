import { createContext, useContext } from 'react'

type StepValidationContextType = {
  isValidMap: Record<number, boolean>
  setStepValid: (stepIndex: number, isValid: boolean) => void
}

export const StepValidationContext = createContext<StepValidationContextType>({
  isValidMap: {},
  setStepValid: () => {}
})

export const useStepValidation = () => useContext(StepValidationContext)
