import React from 'react'
import MobileStepper from '@material-ui/core/MobileStepper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { useTheme } from '@material-ui/core/styles'
import Title from './Title'
import hintStyles from './HintStyles'

const tutorialSteps = [
  {
    title: 'You can view your billing',
    description: 'If you click on the More Details button, you can see all the detailed information about your billing for all the projects you need. It is very important to keep track of your score.'
  },
  {
    title: 'You can view your statistics',
    description: 'It is very important to keep track of your score.'
  },
  {
    title: 'You can view your application',
    description: 'You can monitor their status, plan and other information and take actions'
  }
]

export default function TextMobileStepper () {
  const classes = hintStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const maxSteps = tutorialSteps.length

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <div className={classes.root}>
      <Title>{tutorialSteps[activeStep].title}</Title>
      <Typography>{tutorialSteps[activeStep].description}</Typography>
      <MobileStepper
        steps={maxSteps}
        position='static'
        variant='text'
        className={classes.mobileStepper}
        activeStep={activeStep}
        nextButton={
          <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  )
}
