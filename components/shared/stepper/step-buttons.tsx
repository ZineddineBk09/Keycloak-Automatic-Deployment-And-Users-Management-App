import { Button } from "../../ui/button"
import { useStepper } from "./use-stepper"

const StepButtons = () => {
  const { nextStep, prevStep, isLastStep, isOptionalStep, isDisabledStep } =
    useStepper()
  return (
    <div className='w-full flex gap-2 mb-4'>
      <Button
        disabled={isDisabledStep}
        onClick={prevStep}
        size='sm'
        variant='secondary'
      >
        Prev
      </Button>
      <Button size='sm' type='submit'>
        {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
      </Button>
    </div>
  )
}

export default StepButtons