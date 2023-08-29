import React from 'react'

import { Box, Icon, IconTypes, Text } from '@pexip/components'
import { capitalizeFirstLetter } from '../../utils'

import './LanguageIndicator.scss'

interface LanguageIndicatorProps {
  languageName: string
}

export const LanguageIndicator = (props: LanguageIndicatorProps): JSX.Element => {
  return (
    <Box className='LanguageIndicator'>
      <Icon size='medium' source={IconTypes.IconSupport} className='LanguageIcon'/>
      <Text className='LanguageText'>
        {capitalizeFirstLetter(props.languageName)}
      </Text>
    </Box>
  )
}
